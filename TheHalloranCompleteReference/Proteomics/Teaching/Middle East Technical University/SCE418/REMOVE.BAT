@echo off
cls
echo.
echo.
echo.
echo.
echo Wait for a minute while the document files are removed (erased)
echo from their temporary storage place.
c:
cd\temp1
if exist plantbio.exe erase plantbio.exe
if exist plntbio1.doc erase plntbio1.doc
if exist plntbio2.doc erase plntbio2.doc
if exist photosyn.doc erase photosyn.doc
cd..
rd \temp1
goto end

:search_d
d:
cd\temp1
if exist plantbio.exe erase plantbio.exe
if exist plntbio1.doc erase plntbio1.doc
if exist plntbio2.doc erase plntbio2.doc
if exist photosyn.doc erase photosyn.doc
cd..
rd \temp1
goto end

f:
cd\temp1
if exist plantbio.exe erase plantbio.exe
if exist plntbio1.doc erase plntbio1.doc
if exist plntbio2.doc erase plntbio2.doc
if exist photosyn.doc erase photosyn.doc
cd..
rd \temp1

:end
if errorlevel 1 goto bad_end

cls
echo.
echo.
echo.
echo.
echo.
echo If your files had been stored in the directory \temp1
echo they have been removed and the directory also removed.
echo.
echo You can re-install them the next time you use the computer
echo by entering INSTALL at the A: prompt.
echo.
echo Have a nice day.
echo.
echo.
echo.
echo.
echo.
goto good_end

:bad_end
cls
echo.
echo.
echo.
echo.
echo Something went wrong perhaps with the removal process.  You may
echo have to do it manually by checking to see if the files are still on the
echo hard disk.
echo.
echo Please see me if you think there is a problem with the removal process.
echo.
echo.
echo.
echo.
echo.
:good_end
