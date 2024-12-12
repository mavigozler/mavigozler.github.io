/// <reference path="./ChemModule.d.ts" />

/*************************************************************************
      <!--  DILUTION CODE -->
 *************************************************************************/
/* insert eslint DISABLING for compiled JS here */

import { ChemController } from "./ModuleController";
import { ChemModule } from "./ChemModule";
import { makeSelectList, replaceSpanText, removeChildren } from "../GenLib/html-dom";
import { plainWindow } from "../GenLib/windows";
import { getFactor, getRandom, withinFloatError } from '../GenLib/numberExtended';

const Dilutions: ChemModule = {

	xmlDocument: new Document,

	moduleId: "Dilutions",

	init : function () {
		if (typeof ChemController == "object") {
			ChemController.registerModule(this.moduleId, this);
		}
	},

	activate : function () {
		ChemController.activateModule(this);
		(document.getElementById("dilnform") as HTMLFormElement)!.reset();
		document.getElementById("dilutions-page")!.style.display = "block";
		document.getElementById("write-dilutions-help")!.style.display = "";
	},

   finishDocument :  function  () {
		const concentrationDimensionsOptionsText = [
			"mol/L",  "mmol/L", "G/L", "mG/L",
			"G/mL",  "mG/mL", "G/dL (w/v %)",
			"&micro;mol/L", "&micro;G/mL", "mG/dL",
			"&micro;G/L", "nG/mL", "nmol/L", "pG/mL",
			"pmol/L", "pG/&micro;L", "ppm"
		],

		concentrationDimsForSelectListOptionsValues = [
			"mol/L",  "mmol/L", "G/L", "mG/L",
			"G/mL",  "mG/mL", "G/dL (w/v %)",
			"umol/L", "uG/mL", "mG/dL",
			"uG/L", "nG/mL", "nmol/L", "pG/mL",
			"pmol/L", "pG/uL", "ppm"
		];

      let selNode: HTMLSelectElement,
			optVals: string[],
			optText: string[],
//			optAttribs: {[key: string]: string | (() => void)},
			selAttribs: {[key: string]: string | (() => void)};

		// stock concentration dimensions
		selAttribs = {
         class: "dimselect",
			name: "stockVolumeDimension",
         change: this.checkDilutionConcentrationDimension(this.form)
		};
      optText = concentrationDimensionsOptionsText;
		optVals = concentrationDimsForSelectListOptionsValues;
      selNode = makeSelectList(selAttribs, optVals, optText, undefined);
      document.getElementById("dilution-concentrations")!.appendChild(selNode);


      // dilution dimensions
      selAttribs = {
         class: "dimselect",
			name: "diluteVolumeDimension",
         change: this.checkDilutionConcentrationDimension(this.form)
      };
      optText = Dilutions.concentrations as string[];
      optVals = Dilutions.concentrationDims as string[];
      selNode = makeSelectList(selAttribs, optVals, optText, undefined);
      document.getElementById("diluteVolumeDimension")!.appendChild(selNode);

      // volume dimensions
      selAttribs = {
         class: "dimselect",
			name: "volumeDimension"
		};

      optText = [ "L", "mL", "&micro;L" ];
      optVals = [ "L", "mL", "uL" ];
      selNode = makeSelectList(selAttribs, optVals, optText, undefined);
      document.getElementById("volumeDim")!.appendChild(selNode);

      // practice volume dimensions
      selAttribs = {
         class: "dimselect",
			name: "practiceDimension"
		};

      selNode = makeSelectList(selAttribs, optVals, optText, undefined);
      document.getElementById("practiceDim")!.appendChild(selNode);
   },

	addXhtmlEventHandlers : function () {
		// button soln help
		this.xmlDocument.getElementById("show-example-button")!.addEventListener("click", () => {

		});
		this.xmlDocument.getElementById("dilution-instructions")!.addEventListener("click", () => {

		});
		this.xmlDocument.getElementById("dilution-example")!.addEventListener("change", () => {
			this.dilnExample()
		});
		this.xmlDocument.getElementById("dilutions-practice")!.addEventListener("change", () => {
			this.willPractice();
		});
		this.xmlDocument.getElementById("calc-diln")!.addEventListener("click", (event: Event) => {
			this.calcDiln((event.target as HTMLInputElement)!.form);
		});
	},

	// return boolean false may be needed if form resubmits occurs
	calcDiln : function (form: HTMLFormElement): boolean {
		/* composed Select lists form names:
			stockDim

		*/
		/* stockVol = dilnVol x dilnConc / stockConc */
		const dilnreport = document.getElementById("dilnreport")!,
			dilnerror = document.getElementById("dilnerror")!,
		//	getFactor = .getFactor,
			prefix = [ "", "m", "&micro;" ],
			stockdimSelectElem = form.elements["stockDim"],
			dilutedimSelectElem = form.elements.namedItem("diluteVolumeDimension") as HTMLSelectElement,
			diluteVolumeDimension = dilutedimSelectElem.options[dilutedimSelectElem.selectedIndex].value,
			dilutedimvol = diluteVolumeDimension.substring(diluteVolumeDimension.search(/\//)),
			voldimSelectElem = form.elements["volumeDim"],
			volumeDim = voldimSelectElem.options[voldimSelectElem.selectedIndex].value

			;


		let
			factor = 1.0,
			prefixIndex: number,
			stockConcentrationValue: number,
			stockVolumeDimension = stockdimSelectElem.options[stockdimSelectElem.selectedIndex].value,
			//stockVolumeDimension = stockDim.substring(stockDim.search(/\//)),
			stockVol: number,
			stockDim: string = stockdimSelectElem.options[stockdimSelectElem],

			diluteConcentrationValue: number,
			volumeValue: number,
			vfactor,
			practiceValue, // value set by user for the practice, recovered from form
			pracdimsel, // select object for the dimension for the practice value
			pracdim;  // string of the option of select option actually selected

		// stock solution dimension and value
		if (stockDim.substring(1, 5) == "micro")
			factor *= getFactor('u');
		else if (stockDim.substring(0, 3) != "mol")
			factor *= getFactor(stockDim.charAt(0));


		if (stockVolumeDimension.substring(1, 5) == "micro")
			factor *= getFactor('u');
		else
			factor *= getFactor(stockVolumeDimension.charAt(1));


		if (diluteVolumeDimension.substring(1, 5) == "micro")
			factor *= getFactor('u');
		else if (diluteVolumeDimension.substring(0, 3) != "mol")
			factor *= getFactor(diluteVolumeDimension.charAt(0));

		if (dilutedimvol.substring(1, 5) == "micro")
			factor *= getFactor('u');
		else
			factor *= getFactor(dilutedimvol.charAt(0));

		if (volumeDim.substring(1, 5) == "micro")
			vfactor = getFactor('u');
		else
			vfactor = getFactor(volumeDim.charAt(0));
		factor *= vfactor;

		diluteConcentrationValue = parseFloat(form.elements["diluteConcentrationValue"].value);
/*		if (diluteConcentrationValue.charAt(0) == ".") {
			diluteConcentrationValue = "0" + diluteConcentrationValue.toFixed(3);
			form.elements["diluteConcentrationValue"].value = diluteConcentrationValue;
		}
		diluteConcentrationValue = parseFloat(diluteConcentrationValue).toFixed(); */

		stockConcentrationValue = parseFloat(form.elements["stockConcentrationValue"].value);
	/*
		if (stockConcentrationValue.charAt(0) == ".") {
			stockConcentrationValue = "0" + stockConcentrationValue;
			form.elements["stockConcentrationValue"].value = stockConcentrationValue;
		} */

		volumeValue = form.elements["volumeValue"].value;
	/*
		if (volumeValue.charAt(0) == ".") {
			volumeValue = "0" + volumeValue;
			form.elements["volumeValue"].value = volumeValue;
		} */

		const FW = parseFloat((form.elements.namedItem("FW") as HTMLInputElement)!.value); //.toFixed();
		if (isNaN(diluteConcentrationValue) || isNaN(stockConcentrationValue) || isNaN(volumeValue) ||
				(this.FW_required != 0 && isNaN(FW))) {
			replaceSpanText("dilnerror",
				"One of the entries is either missing a value or a non-numeric value " +
				" was entered.  All entries bordered with red lines are required " +
				" to make a calculation.  " +
				"Either the entry is missing or an invalid value was entered.  " +
				"Please enter a valid value.", this.xmlDocument);
			dilnerror.style.display = "block";
			dilnreport.style.display = "none";
			return false;
		}
		const calc_as_mol = diluteVolumeDimension.search(/mol/) < 0 ? 0 : 1;
		if (this.FW_required != 0)
			if (calc_as_mol == 0)
				stockConcentrationValue *= FW;
			else
				stockConcentrationValue /= FW;
		let stockvol = factor * diluteConcentrationValue * volumeValue / stockConcentrationValue;
		if (stockvol > volumeValue * vfactor) {
			replaceSpanText("dilnerror",
					"The concentration of the dilute solution can not be greater " +
					"than the concentration of the stock solution.  " +
					"Please correct the entry so that the concentration of the dilute " +
					"solution is less than the concentration of the stock solution.", this.xmlDocument);
			dilnerror.style.display = "block";
			dilnreport.style.display = "none";
			return false;
		}
		for (prefixIndex = 0; stockvol < 1.0; prefixIndex++)
			stockvol *= 1000.0;
		let stockvolAsString = stockvol.toString();
		if (stockvolAsString.length > 4 && stockvolAsString.search(/\.\d{2,}/) >= 0)
			stockvolAsString = Number(stockvolAsString).toFixed(1);
		stockVolumeDimension = prefix[prefixIndex] + "L";
		/* write the guide */
		replaceSpanText("dilnguide",
				"To make " + volumeValue + "&nbsp;" + volumeDim + " of a " + diluteConcentrationValue + "&nbsp;" +
				diluteVolumeDimension + " solution, pour " + stockvol +
				"&nbsp;" + stockVolumeDimension + " of the " + stockConcentrationValue + "&nbsp;" + stockDim +
				" stock solution into an appropriate container, and add " +
				"distilled water until the total volume is " + volumeValue + "&nbsp;" + volumeDim + ".",
				this.xmlDocument);
		dilnerror.style.display = "none";
		dilnreport.style.display = "block";
		// is the user "practice" option checked??
		if (this.practice != 0) {
			practiceValue = parseFloat(form.elements["practiceValue"].value);
			pracdimsel = form.elements["pracdim"];
			pracdim = pracdimsel.options[pracdimsel.selectedIndex].value;
			if (pracdim.substring(1, 5) == "micro")
				factor = getFactor('u');
			else
				factor = getFactor(pracdim.charAt(0));
			practiceValue *= factor;
			if (stockVolumeDimension.substring(1, 5) == "micro")
				factor = getFactor('u');
			else
				factor = getFactor(stockVolumeDimension.charAt(0));
			stockvol *= factor;
			if (withinFloatError(stockvol, practiceValue) == true)
				replaceSpanText("pracanswer",
					"The answer you gave was correct.", this.xmlDocument);
			else
				replaceSpanText("pracanswer",
					"The answer you gave was different from the correct one.", this.xmlDocument);
		}
		if (this.inExample == true) {
			document.getElementById("example-step-2")!.style.display = "none";
			document.getElementById("example-step-3")!.style.display = "";
		}
		return false;
	},

	FW_required : false,

	checkDilutionConcentrationDimension : function (form: HTMLFormElement) {
		const stockDim = form.stockDim,
			diluteVolumeDimension = form.diluteVolumeDimension,
			s_option = stockDim.options[stockDim.selectedIndex],
			d_option = diluteVolumeDimension.options[diluteVolumeDimension.selectedIndex],
			FWrow = document.getElementById("FWrow")!;

		if (!form.guide || typeof(form.guide) == "undefined") {
			const guideDiv = document.getElementById("solnguide") as HTMLDivElement;
			while (guideDiv.firstChild)
				guideDiv.removeChild(guideDiv.firstChild);
		} else
			form.guide.value = "";
		if (((s_option.text.search(/G\//) >= 0 || s_option.text.search(/ppm/) >= 0) &&
				(d_option.text.search(/G\//) >= 0 || d_option.text.search(/ppm/) >= 0)) ||
				(s_option.text.search(/mol\//) >= 0 &&
					d_option.text.search(/mol\//) >= 0)) {
			this.FW_required = false;
			FWrow.style.visibility = "hidden";
			return 0;
		}
		this.FW_required = true;
		FWrow.style.visibility = "visible";
		return 0;
	},

	resetDilution : function (buttonObj) {
		buttonObj.form.reset();
		removeChildren(document.getElementById("dilnerror")!);
		removeChildren(document.getElementById("dilnguide")!);
		removeChildren(document.getElementById("pracanswer")!)
		document.getElementById("dilnreport")!.style.display = "none";
		(document.getElementById("show-example-button") as HTMLButtonElement)!.disabled = false;
		document.getElementById("example-step-3")!.style.display = "none";
	},

	practice : 0,

	willPractice : function (chkbox: HTMLInputElement) {
		const pracRow = document.getElementById("practicerow") as HTMLTableRowElement
			//practice
			;
		if (chkbox.checked == false) {
			//practice = 0;
			pracRow.style.visibility = "hidden";
		} else {
			//practice = 1;
			pracRow.style.visibility = "visible";
		}
		return 0;
	},

	SolnHelpWin : null, // window for help directions

	solnHelp : function (): void {
		const helpstyle =
	"   sub, sup {font-size:83%;}" +
	"\n  /* table of examples in make solution section */" +
	"\n  #examples {font:bold 83% Tahoma,Helvetica,Arial,sans-serif;clear:right;" +
	"\n    float:right;margin-left:2em;background-color:#fff0ff;margin-top:1em;}" +
	"\n  #examples TD, #examples TR {padding:0.1em 0.5em;margin:0 }" +
	"\n  #examples INPUT {color:black; background-color: #dfdfdf;}",
		winFeatures = "menubar=false,personalbar=false,toolbar=false," +
				"resizable=yes,scrollbars=yes,width=" + screen.availWidth * 0.55 +
				",height=" + screen.availHeight * 0.9 + "," + screen.availWidth * 0.1 +
				screen.availWidth * 0.4 + "," + screen.availHeight * 0.1;
		if (this.SolnHelpWin instanceof Window && this.SolnHelpWin.closed == false)
			this.SolnHelpWin.focus();
		else {
			this.SolnHelpWin = plainWindow(
				winFeatures,
				{
					winTitle: "Using The Solution Calculator",
					headerStyle: helpstyle,
					otherHeader: document.getElementById("solnhelp")!.innerHTML,
					closeButton: true
				}
			);
			this.SolnHelpWin.document.close();
		}
	},

	inExample : false,

	dilnExample : function (buttonObj: HTMLButtonElement) {
		const form: HTMLFormElement = buttonObj.form!;
		let // dilnval: string,
			stockConcentrationValue: string;

		form.stockConcentrationValue.value = stockConcentrationValue = (Math.random() * 10).toFixed(1);
		form.diluteConcentrationValue.value = /* dilnval = */ (parseFloat(stockConcentrationValue) / ((Math.random() * 10))).toFixed(1);
		form.volumeValue.value = getRandom(0.05, 1.5).toFixed(2);
		buttonObj.disabled = true;
		document.getElementById("example-step-2")!.style.display = "";
		this.inExample = true;
		return this.calcDiln(form);
	}

};

Dilutions.init();

export default Dilutions;