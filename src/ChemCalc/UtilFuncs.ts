"use strict";

/***********************************************************
      <!--  UTILITY FUNCTION  -->
 ***********************************************************/
/* insert eslint DISABLING for compiled JS here */

import { plainWindow } from "../GenLib/windows";
export {  adjustMagnitude, thispage, printable };

	/* adjustMagnitude() alters a value to fall between lowLimit and highLimit,
		moving by 3 orders of magnitude each adjustment.  The function keeps
		track of the adjustment in the units, and returns a string with the
		value and the units separated by a space character.  It returns null
		when the arguments are not what they should be. */

function adjustMagnitude(
	currentValue: string,
	currentDimension: string,
	lowLimit: number,
	highLimit: number
): string | null {
	const magnitude = [ "a", "f", "p", "n", "u", "m", "", "k", "M", "G" ],
		units = [ "G", "mol", "L", "m" , "g", "l" ];
	let i: number,
		j: number,
		format: string,
		prefix: string,
		cval: number,
		lLimit: number,
		hLimit: number,
		magAdj = 0;
	if (typeof currentDimension  != "string")
		return null;
	if (isNaN(cval = Number(currentValue)) == true ||
			isNaN((lLimit = Number(lowLimit))) == true ||
			isNaN((hLimit = Number(highLimit))) == true)
		return null;
	for (i = 0; i < units.length; i++)
		if (units[i] == currentDimension.substring(currentDimension.length - units[i].length))
			break;
	if (i == units.length)
		return null;
	magAdj = 0;
	if (lLimit > hLimit)
		return (currentValue + " " + currentDimension);
	while (cval < lLimit) {
		cval *= 1000.0;
		magAdj--;
	}
	while (cval > hLimit) {
		cval /= 1000.0;
		magAdj++;
	}
	for (j = 0; j < magnitude.length; j++)
		if (magnitude[j] == currentDimension.charAt(0) &&
						currentDimension.length > 1)
			break;
	if (j == magnitude.length) {
		prefix = magnitude[6 + magAdj];
		if (prefix == "u")
			prefix = "&micro;";
	} else
		prefix = magnitude[j + magAdj];
	prefix += units[i];
	if (cval < 10.0)
		format = `${cval.toFixed(2)} ${prefix}`;
	else if (cval < 100.0)
		format = `${cval.toFixed(1)} ${prefix}`;
	else
		format = `${cval} ${prefix}`;
	return format;
}

function thispage(): string {
	return location.href.slice(0, location.href.indexOf(location.search));
}

let printableWin : Window | undefined = undefined;

function printable (content: string) {
	const win = printableWin as unknown as Window;
	if (win && win.closed == false)
		win.focus();
	printableWin = plainWindow(
		"menubar=false,personalbar=false,toolbar=false,resizable=yes,scrollbars=yes,width=" +
			screen.availWidth * 0.7 + ",height=" + screen.availHeight * 0.9 + ",left=" +
			screen.availWidth * 0.25 + ",top=" + screen.availHeight * 0.1,
			{
				winTitle: "The Fine Print",
				headerStyle: "h1 {font-size:115%;color:blue;}",
				body: content,
				closeButton: true
			}
	) as Window;
}

/*
recalc_pressure : function (inpObj) {
	var val,
		pressure_ids = [ "conv-atm", "conv-bar", "conv-pascal", "conv-mpascal",
			"conv-psi", "conv-nm2", "conv-mmHg", "conv-torr", "conv-inHg",
			"conv-ftH2O", "conv-lbft2", "conv-dyne-cm2", "conv-kgm2" ],
		pressure_factors = [ 1.000, 1.0132, 0, 0, 14.697,
			0, 759.88, 759.88, 29.92, 33.90, 2116.7, 1.0133e6, 1.03321e4 ];
	if (isNaN(inpObj.value) == true)
		; //write_an_error;
	val = Number(inpObj.value);
},
*/

/*
reportErrors : function () {
	var w,
		body = document.getElementById("error-reporting")!.cloneNode(true);
	body.style.display = "block";
	w = plainWindow("", "Reporting Errors", "", "", "",
		body, "", true);
	w.resizeTo(400,400);
	w.moveTo(200, 200);
}
*/
