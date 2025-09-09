<?php

	$followSubfolders = false;
	$inclusionStatus = false;
	$exclusionStatus = false;
	$currentSection = NULL;
	if (file_exists("DirectoryListing.ini") == true && 
					($dirListIniFile = fopen("DirectoryListing.ini", "r")) != false) {
		echo "DirectoryListing.ini found", "<br>";
		while (($dirListIniLine = fgets($dirListIniFile)) != false) {
			echo "dirListIniLine ==&gt; ", $dirListIniLine, "<br>";
			if (($matchCount = preg_match("/(\w+)=(\w+)|\[(\w+)\]/", 
						$dirListIniLine, $matches)) > 0) {
				echo "matchCount ==&gt; ", $matchCount, "<br>";
				echo "matches[0] ==&gt; ", $matches[0], "<br>";
				if ($matchCount == 2) {
					echo "match count = 2, ", "matches[1] ==&gt; ", $matches[1], "matches[1] ==&gt; ", $matches[2], "<br>";
					if ($matches[1] == "FollowSubfolders" && $matches[2] == true)
						$followSubfolders = true;
				} else { // assumes $matchCount == 1
					echo "matches[1] ==&gt; ", $matches[1], "<br>";
					if ($dirListIniLine[0] == "[") { // Section
						$currentSection = $matches[1];
						if (is_array($matches[1]) == true)
							var_dump($matches[1]);
						if ($matches[1] == "DirEntryExclusions") {
							$dirEntryExclusions = new iArray();
							$dirEntryInclusions = NULL;
						} else if ($matches[1] == "DirEntryInclusions") {
							$dirEntryInclusions = new iArray();
							$dirEntryExclusions = NULL;
						}
					}
				}
			} else if (strlen($dirListIniLine) > 0) {
				echo "no matches:  matchCount ==&gt; ", $matchCount, "<br>";
				if ($currentSection == "DirEntryExclusions")
					$dirEntryExclusions->push($dirListIniLine);
				else if ($currentSection == "DirEntryInclusions")
					$dirEntryInclusions->push($dirListIniLine);
			}
		}
		fclose($dirListIniFile);
	}
// echo "realpath of \"/\" is ", realpath("/");
//	echo "realpath of \"/PHPClasses\" is ", realpath("/PHPClasses");
//  require_once 'globalsLib.php';
/******************************************************************************
    HTML begins 
 ******************************************************************************/
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
            "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
<title>Directory Listing</title>
<style>
	#dir-listing-header {font-size:12pt;padding:0.1em 0.3em;
				border:4px groove red;background-color:#fff0ff;}
 	#dirname {font:bold 120% Helvetica,Arial,sans-serif;color:green;}
  table#dir-listing {background-color:#bbb;}
  table#dir-listing th {background-color:black;color:yellow;border:1px solid black;}
	table#dir-listing td {background-color:#f0fff0;padding:0.1em 0.3em;}
	.fname {font-size:14pt;}
	.fsize {font: bold 110% Arial,Helvetica,sans-serif;text-align:right;}
	.fdate {font: normal 90% 'Courier New','Courier',monospace;text-align:right;}
</style>
</head>
<body>

<!-- hostsite top logo here -->

<!-- logo here -->

<p id="dir-listing-header">
Listing of directory
<span id="dirname">
<?php
	echo "http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
	$thisDirectoryName = realpath(dirname($_SERVER['SCRIPT_FILENAME']));
?>
</span>
<hr>
<?php
/*
	echo "path being listed ===&gt;", $thisDirectoryName, "<br>";
	echo '$_SERVER[\'SCRIPT_FILENAME\'] ==&gt;', $_SERVER['SCRIPT_FILENAME'], "<br>";
	echo 'dirname($_SERVER[\'SCRIPT_FILENAME\']) ==&gt;', dirname($_SERVER['SCRIPT_FILENAME']), "<br>";
	echo 'realpath(dirname($_SERVER[\'SCRIPT_FILENAME\'])) ==&gt;', 
			realpath(dirname($_SERVER['SCRIPT_FILENAME'])), "<br>";
*/
?>

<table id="dir-listing">
<tr>
 <th>Filename
 <th>Size
 <th>Last Modified
<?php
	date_default_timezone_set("Asia/Istanbul");
  $dateFormat = "j M Y h:i:s a";
	$dirObj = dir($thisDirectoryName);
	while (false !== ($dirEntry = $dirObj->read())) {
		if ((is_file($dirEntry) == true || $followSubfolders == true) && 
					$dirEntry != "." && $dirEntry != ".." && $dirEntry && 
					$dirEntry != "DirectoryListing.php" && $dirEntry != "DirectoryListing.ini")	{
			echo "\n<tr>";
	   	echo "\n <td class=\"fname\"><a href=\"", rawurlencode($dirEntry), "\">", $dirEntry, "</a>";
			$fInfo = stat($dirEntry);
			$fSize = $fInfo['size'];
			echo "\n <td class=\"fsize\">";
			$mbSize = $fSize / 1048576;
			if ($mbSize < 1.0) {
				$kbSize = $fSize / 1024;
				if ($kbSize < 1.0)
					echo $fSize, "&nbsp;bytes";
				else
					echo round($kbSize), "&nbsp;KB";
			}	else
				echo round($mbSize), "&nbsp;MB";
			echo "\n <td class=\"fdate\">", date($dateFormat, $fInfo['mtime']);
		}
	}
	$dirObj->close();
?>
</table>

</body>
</html>
