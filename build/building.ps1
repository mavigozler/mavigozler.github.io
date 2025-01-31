<#
This section
### read in noscript arg or config.json
if (($args.Count -eq 1 -and $args[0] -eq "noscript") -or
      (Get-Content -Raw 'src/config.json' | ConvertFrom-Json -AsHashtable).createStaticContent -eq $true) {
   $noscript = $true
} else {
   $noscript = $false
}
#>
$ErrorActionPreference = "Stop"
Function Get-StringSubsitution {
   [CmdletBinding()]
   [OutputType([string])]
   param (
      [string]$Ref
   )
   $Ref -match "%#([^\)]+)#%"  | Out-Null
   if ($matches.Count -gt 0) {
      foreach ($match in $matches) {
         $Ref = $Ref -replace $match[0], $buildSysInfo.Definitions.$($match[1])
      }
   }
   return $Ref
}

Function Remove-StringEndChars {
   param (
       [string]$TargetString,
       [int]$TrimType = 0,  # 0 = left, 1 = right, 2 = both (default)
       [string]$CharactersToTrim = " "  # Default is whitespace
   )
   switch ($TrimType) {
      0 { return $TargetString.TrimStart($CharactersToTrim) }
      1 { return $TargetString.TrimEnd($CharactersToTrim) }
      2 { return $TargetString.Trim($CharactersToTrim) }
   }  
}


Function Set-LocationRootDirectory {
   while ((Test-Path -Path ".\tsconfig.json") -eq $false -and (Test-Path -Path ".\node_modules") -eq $false) {
      Set-Location -Path ".."
      if ($(Get-Location) -eq  "\") {
         Write-Output "Root directory not found"
         return
      }
   }
   return Get-Location
}

Write-Host "PSModulePath = $($env:PSModulePath)"
Import-Module -Name Library
Write-Host "Directory set to '$(Set-LocationRootDirectory)'"
$buildingJsonPath = "./build/building.json"
$buildSysInfo = Get-Content -Path $buildingJsonPath -Raw | ConvertFrom-Json

foreach ($task in $buildSysInfo.Tasks) {  # an array of tasks
   Write-Host "Processing task: '$($task.title)'"
   switch ($task.action) {
		"delete" {   # Perform delete action
         if ($task.skip -eq $true) {
            Write-Host "Skipping task: $($task.title)"
            continue
         }
			# if the path exists, remove it
			if (!$task.target) {
				Write-Output "Property 'target' not specified: " `
				"`na target must be specified for the delete action"
			}
         if ($task.target.GetType -contains [string]) {
            $targets = [System.Object]$task.target
         } else {
            $targets = $task.target
         }
         foreach ($target in $targets) {
            $targetactual = Get-StringSubsitution -Ref $target
            $psCommand = [System.Management.Automation.PSCommand]::new()
            $psCommand.AddCommand("Remove-Item").AddParameter("Force").AddParameter("ErrorAction", "Stop").
                  AddParameter("ErrorVariable", "err")
            $psCommand.AddParameter("Path", $targetactual);
            if ($task.dryrun -eq $true) {
               $psCommand.AddParameter("WhatIf")
            }
            if ($targetactual.Substring($targetactual.Length - 2, 2) -eq "`*`*") {
               # specifies recursive delete of all items, but not the directory itself
               $psCommand.AddParameter("Recurse")
            } elseif ($targetactual.Substring($targetactual.Length - 1, 1) -eq "`*") {
               # specifies only non-directory items are deleted
            } elseif ((Test-Path -Path $targetactual -PathType Container) -eq $true) {
               # path is a 'container' (directory)
               $psCommand.AddParameter("Recurse")
            } # else  should be file, possibly with wildcards
            # constructed command Write-Host "command is $($psCommand.Commands[0])"
            $psSess = [powershell]::Create()
            $psSess.Commands = $psCommand
            $psSess.Dispose()
         }
      }
      "copy" {
# see building-system-spac.md document for details about how to specify JSON file for copying
         if ($task.skip -eq $true) {
            Write-Host "Skipping task: $($task.title)"
            continue
         }
         if ($task.copydef.GetType().Name -eq "String") {
            $copyDef = $buildSysInfo.Definitions.($task.copydef)
         } else {
            $copyDef = $task.copydef
         }
         if ($task.options) { 
            $isUpdateOption = $false
            $options = New-JSArray($task.options)
            if ($null -ne $options.find('updateonly')) {
               $isUpdateOption = $true
            }
         }
         foreach ($item in $copyDef) { 
            $item.source.dirpath = Remove-StringEndChars -TargetString $item.source.dirpath `
               -CharactersToTrim "\\/" -TrimType 1
            $item.destination.dirpath = Remove-StringEndChars -TargetString $item.destination.dirpath `
               -CharactersToTrim "\\/" -TrimType 1
            $item.source.file = Remove-StringEndChars -TargetString $item.source.file `
               -CharactersToTrim "\\/" -TrimType 0
            $item.destination.file = Remove-StringEndChars -TargetString $item.destination.file `
               -CharactersToTrim "\\/" -TrimType 0 
            if ($item.source.file -eq $item.destination.file) {
               $item.destination.file = ""
            }

            $srcPath = (Get-StringSubsitution -Ref $item.source.dirpath) + "\" + 
                  (Get-StringSubsitution -Ref $item.source.file)
            $destDir = (Get-StringSubsitution -Ref $item.destination.dirpath)
            $destPath = $destDir + "\" + (Get-StringSubsitution -Ref $item.destination.file)
            if ($isUpdateOption -eq $true -and (Test-Path -Path $destPath) -eq $true) {
               $destInfo = Get-Item -Path $destPath
               $srcInfo = Get-Item -Path $srcPath
               # if the destination for the file does not exist OR the source file is newer than the destination file, copy it
               if ($srcInfo.GetType() -is [System.IO.FileInfo] -and $srcInfo.LastWriteTime.CompareTo($destInfo.LastWriteTime) -eq 0) {
                  Write-Host "Skipping copying '$($srcInfo.FullName)'`n   to '$($destPath)'" `
                     "`n   because the source and destination files have the same last write time"
                  continue
               }            
            }
            # copy the file
            if ($task.dryrun -eq $true) {
               Copy-Item -Path $srcPath -Destination $destPath -WhatIf
            } else {
               try {
                  Copy-Item -Path $srcPath -Destination $destPath
                  Write-Output "Copied from $($srcInfo) to $($destPath)"
               } catch {
                  if ($_ -like "*part*path*") {
                     New-Item -Path $destDir -ItemType Directory
                     Copy-Item -Path $srcPath -Destination $destPath
                  } else {
                     Write-Output "Error copying from $($srcInfo) to $($destPath)"
                  }
               }
            }
         }
      }
      "run" {		# Perform run action
         if ($task.skip -eq $true) {
            Write-Host "Skipping task: $($task.title)"
            continue
         }
         if (
            Get-Command $task.executable -ErrorAction SilentlyContinue) {
            $argsArray = @($task.arguments)
            & $task.executable @argsArray
            Write-Output "Executed: $($task.executable) with arguments: $($task.arguments)"
         } else {
            Write-Output "Executable not found: $($task.executable)"
         }
      }
      default {
			Write-Output "Unknown action: $($task.action)"
      }
   }
}