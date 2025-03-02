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
$buildingJsonPath = "./building.json"
$buildSysInfo = Get-Content -Path $buildingJsonPath -Raw | ConvertFrom-Json


Remove-Item -Path "./gh-pages/*" -Recurse
$baseCopySet = @(
   @{ Src = @{ Path = "src"; File = "config.json" };
      Dest = @{ Path = "gh-pages"; File = "config.json" } };
   @{ Src = @{ Path = "src"; File = "base.html" };
      Dest = @{ Path = "gh-pages"; File = "index.html" } };
   @{ Src = @{ Path = "src"; File = "base.css" };
      Dest = @{ Path = "gh-pages"; File = "posting.css" } };
#   "tutor-posting.ts"
)
if ($noscript -eq $true) {
   $finalCopySet = $baseCopySet
} else {
   $finalCopySet = $baseCopySet + @{
      Src = @{ Path = 'withscriptset'; File = 'tutor-posting.js'}
      Dest = @{ Path = 'gh-pages'; File = 'tutor-posting.js' }
   }
}
foreach ($item in $finalCopySet) {
   foreach ($subitem in $item) {
      $srcInfo = Get-ChildItem -Path "$($subitem.Src.Path)/$($subitem.Src.File)"
      $destItem = "$($subitem.Dest.Path)/$($subitem.Dest.File)"
      if (Test-Path -Path $destItem) {
         $destInfo = Get-ChildItem -Path $destItem
      } else {
         $destInfo = $null
      }
      if ($null -eq $destInfo -or $srcInfo.LastWriteTime.Equals($destInfo.LastWriteTime) -eq $False) {
         Copy-Item -Path "$($subitem.Src.Path)/$($subitem.Src.File)" -Destination "$($subitem.Dest.Path)/$($subitem.Dest.File)"
      }
   }
}
