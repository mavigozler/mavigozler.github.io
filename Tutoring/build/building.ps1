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
   param (
      [string]$Ref
   )
   $Ref -match "%#([^\)]+)#%"  | Out-Null
   if ($Matches.Count -gt 0) {
      foreach ($index in $Matches) {
         if ($index.GetType() -eq [System.Collections.Hashtable]) {
            if ($buildSysInfo.Aliases.$($index[1]).GetType().Name -eq "String") {
               $Ref = $Ref -replace $index[0], $buildSysInfo.Aliases.$($index[1])
            } else {
               $Ref = $Ref -replace $index[0], $buildSysInfo.Aliases.$($index[1]).path
            }
            $Ref = $Ref -replace $index[0], $buildSysInfo.Aliases.$($index[1]).path
         } else {
         $Ref = $Ref -replace $index[0], $buildSysInfo.Aliases.$($index[1])
         }
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
         Write-Host "Root directory not found"
         return
      }
   }
   return Get-Location
}

Write-Host "PSModulePath = $($env:PSModulePath)"
Import-Module -Name Library
Write-Host "Directory set to '$(Set-LocationRootDirectory)'"
$configJson = "./src/config.json"
$buildSysInfo = Get-Content -Path $configJson -Raw | ConvertFrom-Json

foreach ($task in $buildSysInfo.PowerShellTasks) {  # an array of tasks
   Write-Host "Processing task: '$($task.title)'"
   switch ($task.action) {
		"delete" {   # Perform delete action
         if ($task.skip -eq $true) {
            Write-Host "Skipping task: $($task.title)"
            continue
         }
			# if the path exists, remove it
			if (!$task.target) {
				Write-Host "Property 'target' not specified: " `
				"`na target must be specified for the delete action"
			}
         if ($task.target.GetType() -eq [System.String]) {
            $targets = [System.Object]$task.target
         } else {
            $targets = $task.target
         }
         foreach ($target in $targets) {
            $target -match "%#([^\\]+)#%" | Out-Null
            $aliasName = $Matches[1]
            $targetObj = $buildSysInfo.Aliases.($aliasName)
            if ($null -eq $targetObj) {
               Write-Host "FATAL: attempt to reference a non-existing alias '$($aliasName)'"
               exit 1
            }
            if ($targetObj.GetType().Name -eq "String") {
               $modifiedTargetObj = $target -replace "%#([^\\]+)#%", $targetObj
               $targetactual = Get-StringSubsitution -Ref $modifiedTargetObj
            } else { 
               $modifiedTargetObj = $target -replace "%#([^\\]+)#%", $targetObj.path
               $targetactual = Get-StringSubsitution -Ref $modifiedTargetObj
            }
            $psCommand = [System.Management.Automation.PSCommand]::new()
            $psCommand.AddCommand("Remove-Item").AddParameter("Force").AddParameter("ErrorAction", "Stop").
                  AddParameter("ErrorVariable", "err") | Out-Null
            $psCommand.AddParameter("Path", $targetactual) | Out-Null
            if ($task.dryrun -eq $true) {
               $psCommand.AddParameter("WhatIf") | Out-Null
            }
            if ($targetactual.Substring($targetactual.Length - 2, 2) -eq "**" -or `
                  (Test-Path -Path $targetactual -PathType Container) -eq $true) {
               # specifies recursive delete of all items, but not the directory itself
               $psCommand.AddParameter("Recurse") | Out-Null
            } elseif ($targetactual.Substring($targetactual.Length - 1, 1) -eq "*") {
               # specifies only non-directory items are deleted
            } 
            if ((Test-Path -Path $targetactual) -eq $false) {
               Write-Host "Cannot delete '$($targetactual)'. Path does not exist"
               continue
            }
            # constructed command Write-Host "command is $($psCommand.Commands[0])"
            $psSess = [powershell]::Create()
            $psSess.Commands = $psCommand
            $psSess.Invoke()
            $psSess.Dispose()
            Write-Host "Successfully deleted: $($targetactual)"
         }
      }
      "copy" {
# see building-system-spac.md document for details about how to specify JSON file for copying
         if ($task.skip -eq $true) {
            Write-Host "Skipping task: $($task.title)"
            continue
         }
         if ($task.copydef.GetType().Name -eq "String") {
            $copyDef = $buildSysInfo.Paths_Sets.($task.copydef)
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
                  Write-Host "Copied from $($srcInfo) to $($destPath)"
               } catch {
                  if ($_ -like "*part*path*" -or $_ -like "*directory name is invalid*") {
                     New-Item -Path $destDir -ItemType Directory
                     Copy-Item -Path $srcPath -Destination $destPath
                  } else {
                     Write-Host "Error copying from $($srcInfo) to $($destPath)"
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
            Write-Host "Executed: $($task.executable) with arguments: $($task.arguments)"
         } else {
            Write-Host "Executable not found: $($task.executable)"
         }
      }
      default {
			Write-Host "Unknown action: $($task.action)"
      }
   }
}