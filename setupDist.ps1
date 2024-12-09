$sourceFiles = @(
   "index.html",
   "posting.css"
#   "tutor-posting.ts"
)
$sourcePath = "src"
$destPath = "gh-pages"
foreach ($item in $sourceFiles) {
   $srcInfo = Get-ChildItem -Path "${sourcePath}/${item}"
   if (Test-Path -Path "${destPath}/${item}") {
      $destInfo = Get-ChildItem -Path "${destPath}/${item}"
   } else {
      $destInfo = $null
   }
   if ($null -eq $destInfo -or $srcInfo.LastWriteTime.Equals($destInfo.LastWriteTime) -eq $False) {
      Copy-Item -Path "${sourcePath}/${item}" -Destination "${destPath}/${item}"
   }
}
