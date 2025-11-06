@echo off
cls
echo. 
echo.
echo.
echo Please wait as the installation process is being done.
echo.
echo This may take a minute to a few minutes, the time required
echo depending upon if you have an older, slower computer or
echo if you are using the faster 80486 machines.

c:
if errorlevel 1 goto d_drive
md \temp1
copy a:plantbio.exe c:\temp1 >nul
if errorlevel 1 goto d_drive
goto expand

:d_drive
d:
if errorlevel 1 goto f_drive
md \temp1
copy a:plantbio.exe c:\temp1 >nul
if errorlevel 1 goto f_drive
goto expand

:f_drive
f:
if errorlevel 1 goto no_copy
md \temp1
copy a:plantbio.exe f:\temp1 >nul
if errorlevel 1 goto no_copy

:expand
cd\temp1
plantbio.exe >nul
erase plantbio.exe
if exist chklist.ms erase chklist.ms
cls
echo.
echo Your document files:
echo          PLNTBIO1.DOC
echo          PLNTBIO2.DOC
echo          PHOTOSYN.DOC
echo are now installed in the current directory.
echo.
echo You should use Word for Windows 2 for opening and reading them.
echo.
echo.
echo When you are done with these files for the day, enter the command:
echo            REMOVE
echo after you select the A drive.
echo.
echo The next time you want to see the documents again, just go
echo to the A drive and INSTALL the files when you want them.
echo When you are finished with the files for the day, again go
echo to the A drive, then enter the REMOVE command to erase the
echo documents from their temporary storage place.
echo.
echo Note if you want to edit your files and save the changes,
echo please come and talk to me and I will show you what to do.
echo.
echo.
echo.
goto end

:no_copy
cls
echo.
echo It was not possible to install the document files in an empty
echo directory on the hard disk.  Please make sure of the following:
echo   1. The disk to which you will install the files has at least 
echo        3 MB free space
echo   2. The disk you will install them to is not write-protected
echo             (e.g., it is a network drive on a file server)
echo   3. The file PLANTBIO.EXE exists on your floppy disk (A: drive)
echo.
echo.
echo.
:end
