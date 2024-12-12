/* eslint-disable eqeqeq */

/*************************************************************************
      <!--  Ammonium Sulfate Calculator -->
 *************************************************************************/
// The label information for this source code is at end of file
/* insert eslint DISABLING for compiled JS here */

import { ChemController } from "./ModuleController";
import { getCheckedInput, replaceSpanText } from "../GenLib/html-dom";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AmmoniumSulfate = {

	xmlDocument: {} as Document,

	moduleId: "AmmSulf",

	init : function () {
		if (typeof ChemController === "object")
			ChemController.registerModule(this.moduleId, this);
	},

	addXhtmlEventHandlers : function () {

	},

	activate : function () {
		ChemController.activateModule(this);
		document.getElementById("ammsulfate-page")!.style.display = "";
	},

	finishDocument : function (doc: Document) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const document: Document = doc;
	},

	/*******************************************************************
		weight (g) = Gsat (S2 - S1) / (1 - P * S2)
		where Gsat is grams/liter of the satd soln, P = sp vol * Gsat / 1000,
		and S2 and S1 are final and initial saturations of solution, resp.
		==================================================================================
		Temperature (°C)                            0        10         20        25
		grams added to 1 liter of water to give
			saturated solutio                       706.8     730.5     755.8      766.8
		grams per liter saturated solution        515.35    524.60    536.49     541.80
		Molarity of saturated solution              3.90      3.97      4.06       4.10
		Density (g/ml)                              1.2428    1.2436    1.2447     1.2450
		Sp vol in saturated solution (ml/g)         0.5281    0.5357    0.5414     0.5435
		==================================================================================
	*******************************************************************/

	calcammsulfate : function (formObj: HTMLFormElement) {
		const AmmSulfConstants = [
				{ T: 0, Gsat: 515.35, P: 0.5281 * 515.35 / 1000 },
				{ T: 10, Gsat: 524.60, P: 0.5357 * 524.60 / 1000 },
				{ T: 20, Gsat: 536.49, P: 0.5414 * 536.49 / 1000 },
				{ T: 25, Gsat: 541.80, P: 0.5435 * 541.80 / 1000 }
			],
			f = formObj.form,
			salttype = getCheckedInput(f.salttype),
			temp = getCheckedInput(f.solntemp);

		let
			i,
			reportText,

			solnVolVal = f.solnVolVal.value,
			satnvol,
			//solnvolselect = f.volunits,
			initsatn = f.initsat.value,
			finalsatn = f.finalsat.value,
			weight;

		if (typeof(salttype) == "undefined" || salttype == null) {
			replaceSpanText("ammsulfate-error",
				"Select a form of the salt", this.xmlDocument);
			document.getElementById("saltformerror")!.style.borderColor = "red";
			return false;
		} else
			document.getElementById("saltformerror")!.style.borderColor = "";
		if (temp == null) {
			replaceSpanText("ammsulfate-error",
				"A temperature selection is required", this.xmlDocument);
			document.getElementById("tempformerror")!.style.borderColor = "red";
			return false;
		}
		else
			document.getElementById("tempformerror")!.style.borderColor = "";
		//temp = Number(temp);
		if (solnVolVal.length == 0 || isNaN(solnVolVal) == true || solnVolVal < 0) {
			replaceSpanText("ammsulfate-error",
				"A positive real number value is required for the solution volume",
				this.xmlDocument);
			document.getElementById("solnvolerror")!.style.borderColor = "red";
			return false;
		} else
			document.getElementById("solnvolerror")!.style.borderColor = "";
		if (initsatn.length == 0 || isNaN(initsatn) == true || initsatn < 0 ||
				initsatn >= 100.0) {
			replaceSpanText("ammsulfate-error",
				"A positive real number value greater than or equal to 0 " +
				"(zero) and less than 100.0 is required for the initial " +
				"saturation", this.xmlDocument);
			document.getElementById("initsaterror")!.style.borderColor = "red";
			return false;
		}
		else
			document.getElementById("initsaterror")!.style.borderColor = "";
		initsatn /= 100.0;
		if (finalsatn.length == 0 || isNaN(finalsatn) == true || finalsatn < 0 ||
				finalsatn > 100.0) {
			replaceSpanText("ammsulfate-error",
				"A positive real number value greater than or equal to 0 " +
				"(zero) and less than or equal to 100.0 is required for the final " +
				"saturation", this.xmlDocument);
			document.getElementById("finalsaterror")!.style.borderColor = "red";
			return false;
		} else
			document.getElementById("finalsaterror")!.style.borderColor = "";
		finalsatn /= 100.0;
		if (finalsatn < initsatn) {
			replaceSpanText("ammsulfate-error",
				"The final saturation cannot be less than the initial saturation",
				this.xmlDocument);
			document.getElementById("initsaterror")!.style.borderColor = "red";
			document.getElementById("finalsaterror")!.style.borderColor = "red";
			return false;
		}
		const solnvolunit = f.volunits.options[f.volunits.selectedIndex].value;
		if (solnvolunit == "micro")
			solnVolVal /= 1000000;
		else if (solnvolunit == "milli")
			solnVolVal /= 1000;
		if (salttype == "satd") {
			satnvol = solnVolVal * (finalsatn - initsatn) / (1.0 - finalsatn);
			reportText = satnvol + " ml of saturated ammonium sulfate";
		} else { // salttype == solid
			weight = 0; // TODO this may be wrong
			for (i = 0; i < AmmSulfConstants.length; i++)
				if (parseFloat(temp as string) == AmmSulfConstants[i].T)
					weight = AmmSulfConstants[i].Gsat * (finalsatn - initsatn) /
							(1.0 - AmmSulfConstants[i].P * finalsatn) * solnVolVal;
			if (weight < 1.0)
				reportText = (weight * 1000).toFixed(4) + " mg ammonium sulfate";
			else
				reportText = weight.toFixed(4) + " g ammonium sulfate";
		}
		const cellReport = document.getElementById("ammsulfate-report")!;
		cellReport.replaceChild(document.createTextNode("Slowly add " + reportText +
			" to your solution"), cellReport.firstChild as ChildNode);
		replaceSpanText("ammsulfate-error", "&nbsp;", this.xmlDocument);
		return false;
	},

	resetAmmSulfCalculator : function (buttonObj: HTMLInputElement) {
		const formErrors = [
			"saltformerror", "tempformerror", "solnvolerror", "initsaterror", "finalsaterror"
		];
		let i;
		buttonObj.form!.reset();
		replaceSpanText("ammsulfate-error",
			"&nbsp;", this.xmlDocument);
		for (i = 0; i < formErrors.length; i++)
			document.getElementById(formErrors[i])!.style.borderColor = "";
	},

	showHelp : function () {
		document.getElementById("")!.style.display = "";
	}
};

AmmoniumSulfate.init();

export default AmmoniumSulfate;

/*
 * File: AmmSulf.ts
 * Author: SMH
 * Creation Date: unknown
 * Last Modified: <LMDate>
 * Description: A component of the Chemistry Reference Calculator
 * License: MIT License
 * Module: Ammonium Sulfate Calculations fo the Reference Calculator
 *   Description: This module provides utilities for XYZ functionality.
 *   Dependencies: lodash, axios
 *   Exports: { exampleFunction, ExampleClass }
 * Usage:
 *    const result = exampleFunction(param1, param2);
 *    const instance = new ExampleClass();
 *    instance.method();
 * Notes:
 * - This function has a side effect and mutates its input.
 * - Make sure to handle errors returned by the API calls.
 */