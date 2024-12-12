/****************************************************************
   SOLUTIONS CHEMISTRY Interface
****************************************************************/
/* insert eslint DISABLING for compiled JS here */

import { SolnChemSepItem, SolnChemData, ChemModule } from "./ChemModule";
import { LibraryData } from "./LibraryData";
import { adjustMagnitude, printable  } from "./UtilFuncs";
import { getCheckedInput, quickMarkupToDocObjects, replaceSpanText,
	removeChildren } from "../GenLib/html-dom";
import { getRandom, isValidFloat, getFactor,  } from "../GenLib/numberExtended";
import { ChemController, ModuleControllerEmitter } from "./ModuleController";

/*
import { sharedEmitter } from "./ModuleController";

const emitter = sharedEmitter;
emitter.emit("init", {message: "Event triggered"});
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SolutionChemistry: ChemModule = {

	xmlDocument: {} as Document,

	moduleId: "SolnChem",

	init:	function () {
		if (ChemController)
			ChemController.registerModule(this.moduleId, this);
		else {
			ModuleControllerEmitter.addListener("init", () => {
				ChemController.registerModule(this.moduleId, this);
			});
			ModuleControllerEmitter.emit("controllerNotify");
		}
	},

	handleError: function (event: ErrorEvent) {
		console.log("SolnChem.ts::handleError() executed");
		replaceSpanText("solnerror",
			`Unhandled Exception:<br>message: ${event.message}<br>source: ${event.filename}<br>` +
			`lineno: ${event.lineno}<br>colno: ${event.colno}<br>error: ${event.error}`, this.xmlDocument
		);
	},
	handlePromiseRejection: function (reason: string) {
		console.log("SolnChem.ts::handlePromiseRejection() executed");
		replaceSpanText("solnerror", `Rejected promise:<br>reason: ${reason}`, this.xmlDocument);
	},

//	activate : function () {
//		ChemController.activateModule(this);
//		this.xmlDocument.getElementById("solutions-page")!.style.display = "";
//	},

   finishDocument : function ()  {
		const SolnChemLib = LibraryData.SolnChemLib,
			document: Document = this.xmlDocument,
			cols = 2;
      let i, j,
			trNode: HTMLTableRowElement,
			tdNode: HTMLTableCellElement;

		const listTblNode = this.xmlDocument.getElementById("chemlist-table") as HTMLTableElement;
		for (i = j = 0; i < SolnChemLib.length; i++) {
			const chemItem = SolnChemLib[i] as SolnChemData;
			const chemsep = (SolnChemLib[i] as SolnChemSepItem).sep;
         if (typeof (chemItem as unknown as SolnChemSepItem).sep === "undefined") {  // process a symbol
				if ((j % cols) == 0) {  // create a new row
					trNode = document.createElement("tr");
					listTblNode!.appendChild(trNode);
					j = 0;
				}
				tdNode = document.createElement("td");
				trNode!.appendChild(tdNode); // TODO  report a coding issue if trNode not already defined!
            tdNode.className = "chemitem";
				tdNode.style.width = (100 / cols).toString() + "%";
				tdNode.setAttribute("data-chemsym", `[${i}]${chemItem.sym}`);
				tdNode.addEventListener("click", (event: Event) => {
					const chemsymData = (event.target as HTMLTableCellElement).getAttribute("data-chemsym") as string;
					this.lastUserSpec.listIndex = parseInt(chemsymData.match(/\[(\d+)\]/)![1]);
					this.calculateWeights({
						name: "",
						value: chemsymData,
						checkmark: false
					});
					// clear all Other inputs
					(this.xmlDocument.getElementById("calcFW-radio") as HTMLInputElement).checked = false;
					(this.xmlDocument.getElementById("other-textbox-calcFW") as HTMLInputElement).value = "";
					this.other_checked = false;
					(this.xmlDocument.getElementById("selected-compound") as HTMLInputElement).value = this.lastUserSpec.listIndex;
				}, false);
				if (chemItem.htmlsym)
					tdNode.appendChild(quickMarkupToDocObjects(
                  chemItem.htmlsym!.replace(/ /g, "&nbsp;"), document) as Node);
				j++;
         } else { // here is the meat of the data put in a table cell
					// looks for an object with sep property (as a separator) defined
				trNode = document.createElement("tr");
				listTblNode!.appendChild(trNode);
				tdNode = document.createElement("td");
				trNode.appendChild(tdNode);
				tdNode.style.verticalAlign = "top";
				tdNode.colSpan = cols;
				tdNode.className = "tblrowhdr";
				if (chemsep!.length > 0)  // a market should exist.
//					const elemTblNode = document.createElement("table");
//					elemTblNode.className = "element-table";
//					tdNode.appendChild(elemTblNode);
//					trNode = document.createElement("tr");
//					elemTblNode.appendChild(trNode);
//					tdNode = document.createElement("td");
					tdNode.appendChild(document.createTextNode(chemsep!));
				else  // creates a horizontal rule as a default
				//	tdNode = document.createElement("td");
					tdNode!.appendChild(document.createElement("hr"));
				trNode = document.createElement("tr");
				listTblNode!.appendChild(trNode);
				j = 0;
         }
		}
   },

	// EVENT HANDLERS IN XHTML document
	addXhtmlEventHandlers: function () {
		// button soln help
		this.xmlDocument.getElementById("soln-help-button")!.addEventListener("click", () => {
			this.xmlDocument.getElementById("solnhelp")!.style.display = "block";
		});
		// another-soln-help
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.xmlDocument.getElementById("another-soln-help")!.addEventListener("click", () => {
// TODO   in Dilutions
		});

		// radio select
		this.xmlDocument.getElementById("calcFW-radio")!.addEventListener("change", (event: Event) => {
			this.calculateWeights({
				name: "",
				value: "other",
				checkmark: (event.target as HTMLInputElement).checked
			});
		});
		// text change
		this.xmlDocument.getElementById("other-textbox-calcFW")!.addEventListener("change", (event: Event) => {
			this.calculateWeights({
				name: "custom",
				value: (event.target as HTMLInputElement).value,
				checkmark: true
			});
		});
		// printable version
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.xmlDocument.getElementById("printable-version-click")!.addEventListener("click", () => {
			printable(this.xmlDocument.getElementById('solnguide')!.innerHTML);
			this.xmlDocument.getElementById("print-button-span")!.style.display = "inline-block"
		});
		// show examples
		//  TODO fix this
				this.xmlDocument.getElementById("show-examples")!.addEventListener("click", (event: Event) => {
			this.solutionExamples((event.target as HTMLButtonElement).form as HTMLFormElement);
		});
		// detail the result
		this.xmlDocument.getElementById("calcsoln-report")!.addEventListener("click", (event: Event) => {
			this.calcsoln((event.target as HTMLButtonElement).form as HTMLFormElement);
		});
		// detail the result
		this.xmlDocument.getElementById("other-textbox-calcFW")!.addEventListener("input", (event: Event) => {
			if (this.other_checked == false) // Other radio value not checked
				return;
			if (this.otherInput == false) {
				const otherHdrRuleTD = (this.xmlDocument.getElementById("other-header-rule") as HTMLTableCellElement);
				otherHdrRuleTD.replaceChild(this.xmlDocument.createTextNode(
					"\u00a0"), otherHdrRuleTD.firstChild as ChildNode);
				otherHdrRuleTD.setAttribute("style", this.stdHeaderCellStyle)
				this.otherInput = true;
			} else {
				const formula = (event.target as HTMLInputElement).value;
				this.displaySelectedMolecule(formula);
				const notRecognized = this.xmlDocument.getElementById("not-recognized") as HTMLSpanElement;
				const FWdisplay = this.xmlDocument.getElementById("FWdisplay") as HTMLInputElement;

				let FW: number;
				if ((FW = this.calcFW(formula)) < 0) {
					// if not recognized continue to show that
					FWdisplay.value = "";
					notRecognized.style.display = "inline-block";
				} else {
					// update the formula and calculate the weight
					FWdisplay.value = FW.toString();
					(this.xmlDocument.getElementById("FWdisplay") as HTMLInputElement).value = FW.toString();
					notRecognized.style.display = "none";
				}
			}
		});
	},

	lastUserSpec : {
		spec: "",
		sym: "" ,
		name: "",
		MW: -1.0,
		listIndex: -1
	},

	/*
	solnchem : function (formObj: HTMLFormElement) {
		formObj.action = .thispage();
	},
	*/
	nonsenseElement : HTMLElement, // what is this?

	// states of parsing formula
	READING_COEFFICIENT : 1,
	READING_ELEMENT	  : 2, // in middle of reading element
	READING_SUBSCRIPT   : 3, // in middle of reading subscript
	HOLDING_ELEMENT	  : 4, // an element recognized, not yet processed
	EXPECT_ELEMENT 	  : 5, // valid read is for an element
	END_GROUPING        : 6, // in middle of ending grouping

	GRAMS 				  : 1,
	MOLES 				  : 2,

	calcFW : function (molecFormula: string): number  {
		if (this.lastUserSpec.spec === molecFormula)
			return this.lastUserSpec.MW;
			const info = this.MW_info(molecFormula);
			return info !== null ? info.MW : -1;
		},

	getElementWeight : function (elemsym: string): number | null {
		const elem = LibraryData.Elements.find(obj => obj.sym == elemsym);
		return elem ? elem.AW : null ;
	},

	/**********************************************************************
	<!--  Molecular Weight and Formula Presentation Interface

	  Use calcFW(molecFormula) to get molecular weights of a formula called as
	  string.  The examples of creating a plain ASCII text string are given
	  in the web page.

	  Use moleculeAsHtml(molecFormula) to take the plain ASCII string and
	  return a string formatted for presentation on HTML.  -->

	 **********************************************************************/
	displaySelectedMolecule(formulaInHtml: string): void { // chemical formula as string
		const molDisplay = this.xmlDocument.getElementById("MolDisplay") as HTMLTableCellElement;
		while (molDisplay.firstChild)
			molDisplay.removeChild(molDisplay.firstChild);
		molDisplay.appendChild(
			quickMarkupToDocObjects(
				formulaInHtml,
				this.xmlDocument
			)  as Node
		);
	},

	moleculeAsHtml : function (molecFormula: string): string | null {
		if (this.lastUserSpec.spec === molecFormula)
			return this.lastUserSpec.sym;
		const info = this.MW_info(molecFormula);
		return info !== null ? info.htmlText : null;
	},


	/* MW_info() is the engine for the interface functions
		`calcFW(molecFormula)` and `moleculeAsHtml(molecFormula)`,
	   where `molecFormula' must be a string describing the formula of a molecule
	   as shown in the examples on the web page.

	   You are discouraged from calling MW_info directly.  Use the interface
	  functions!
	*/

	/************************************************/

	MW_info : function (
		molecFormula: string
	): { MW: number; htmlText: string; plainMolecule: string } | null {
		const noSpaceCharSpan: HTMLSpanElement = this.xmlDocument.getElementById("no-space-char") as HTMLSpanElement,
			unknownChar: HTMLSpanElement = this.xmlDocument.getElementById("unknown-char") as HTMLSpanElement;

		let i: number,
			//j,
			ch: string,
			state: number = this.EXPECT_ELEMENT,
			factor: number = 1,
			coeff: number = 1,
			elem: string = "",
			sMW: number = 0.0, // ungrouped sum of MW
			tMW: number = 0.0, // total MW
			eMW: number = 0.0, // element MW
			gMW: number = 0.0,  // grouped element
			open_paren: boolean = false,
			plainMolecule: string = "",
			html_text: string = "";

		// parse char by char
		for (i = 0; i < molecFormula.length; i++) {
			noSpaceCharSpan.style.display = "none";
			unknownChar.style.display = "none";
			if ((ch = molecFormula.charAt(i)) >= 'A' && ch <= 'Z') {
				// encountered a character (capital)
				switch (state) {
				case this.HOLDING_ELEMENT:
				case this.READING_ELEMENT:
					// capital char means a prior element is complete
					if ((eMW = this.getElementWeight(elem!)!) < 0)
						return null;
					if (open_paren == true)
						gMW += eMW; // work on group element weight
					else
						sMW += eMW;
					elem = ch;
					plainMolecule += ch;
					html_text += ch;
					break;
				case this.EXPECT_ELEMENT: // waiting to id element
				// adding chars for expected element
					elem = ch;
					plainMolecule += ch;
					html_text += ch;
					break;
				case this.READING_SUBSCRIPT: // working on subscript
					elem = ch;
					html_text += "</sub>" + ch; // finish sub
					plainMolecule += ch;
					if (gMW > 0.0) { // working on group?
						sMW += factor * gMW;
						gMW = 0.0;
					} else  // or ungrouped?
						sMW += factor * eMW;
					break;
				default:  // this would be a faulty state
					return null;
				} // READING ELEMENT set b/c of upper case char
				state = this.READING_ELEMENT; /* first letter of element */
			} else if (ch >= 'a' && ch <= 'z') {
				// lower case char, so state must be READING ELEMENT
				if (state != this.READING_ELEMENT)
					return null;
				elem += ch;
				plainMolecule += ch;
				html_text += ch;
				// now holding an element
				state = this.HOLDING_ELEMENT;
			} else if (ch >= '0' && ch <= '9') {
				switch (state) {
					// start of coefficient if no element yet
				case this.EXPECT_ELEMENT:
					// convert this number to a multiplier basically
					factor = ch.charCodeAt(0) - '0'.charCodeAt(0);
					state = this.READING_COEFFICIENT; // start readomg coefficient
					if (html_text != "") // put NBSP between element & coefficient
						html_text += "&nbsp;";
					plainMolecule += ch;
					html_text += ch;
					break;
				case this.HOLDING_ELEMENT:
				case this.READING_ELEMENT:
					// we were holding or reading an element with numeric, so evaluate
					if ((eMW = this.getElementWeight(elem!)!) < 0)
						return null;
					state = this.READING_SUBSCRIPT
					plainMolecule += ch;
					html_text += "<sub>" + ch;
					factor = ch.charCodeAt(0) - '0'.charCodeAt(0);
					break;
				case this.END_GROUPING:
					// a close paren is in status, so digit start of a factor
					html_text += "<sub>" + ch;
					factor = ch.charCodeAt(0) - '0'.charCodeAt(0);
					// now reading subscript
					state = this.READING_SUBSCRIPT; /* evaluating subscript */
					break;
				case this.READING_SUBSCRIPT:
				case this.READING_COEFFICIENT:
					// whether subscript or coeffience, continuing
					html_text += ch;
					plainMolecule += ch;
					factor = (factor * 10) + (ch.charCodeAt(0) - '0'.charCodeAt(0));
					break;
				default:
					// this should not happen
					return null;
				}
			} else if (ch == ',') {
				// if there is working group or currently in coefficient
				if (open_paren == true || state == this.READING_COEFFICIENT)
					return null;
				// try to get an element weight
				if (state == this.READING_ELEMENT || state == this.HOLDING_ELEMENT) {
					if ((eMW = this.getElementWeight(elem!)!) < 0)
						return null;
				// if in subscript make a calculation
				} else if (state == this.READING_SUBSCRIPT) {
					eMW *= factor;
					html_text += "</sub>";
				}
				sMW += eMW;
				tMW += sMW;
				sMW = 0.0;
				coeff = 1;
				plainMolecule += ch;
				html_text += "&nbsp;";
				// look for element now
				state = this.EXPECT_ELEMENT;
			} else if (ch == '*') {
				// this is an error if not already getting coefficient
				if (state != this.READING_COEFFICIENT)
					return null;
				// must expect an element next
				state = this.EXPECT_ELEMENT;
				coeff = factor;
				plainMolecule += ch;
				html_text += "&nbsp;";
			} else if (ch == '(') {
				// indicates start of group, so can be in group already
				if (open_paren == true)
					return null;
				// severa; possibilities here
				switch (state) {
				case this.HOLDING_ELEMENT:
				case this.READING_ELEMENT:
					// if in element, calculate wieght
					if ((eMW = this.getElementWeight(elem) as number) < 0)
						return null;
					sMW += eMW;
					break;
				case this.EXPECT_ELEMENT:
				case this.READING_SUBSCRIPT:
					html_text += "</sub>";
					if (gMW > 0.0) {
						sMW += factor * gMW;
						gMW = 0.0;
					}
					else
						sMW += factor * eMW!;
					break;
				default:
					return null;
				}
				open_paren = true;
				gMW = 0.0;
				plainMolecule += ch;
				html_text += ch;
				state = this.EXPECT_ELEMENT;
			} else if (ch == ')') {
				// close a group
				if (open_paren == false)
					return null;
				// this should be a case
				if (state == this.READING_SUBSCRIPT)	{
					gMW += factor * eMW;
					html_text += "</sub>";
				} else {
					if ((eMW = this.getElementWeight(elem) as number) < 0)
						return null;
					gMW += eMW;
				}
				open_paren = false;
				html_text += ch;
				state = this.END_GROUPING;
			} else if (ch == ' ') {
				noSpaceCharSpan.style.display = "inline";
			} else {
				unknownChar.style.display = "inline";
			}
		}
		/* the final cleanup */
		switch (state) {
		case this.READING_ELEMENT:
		case this.HOLDING_ELEMENT:
			if (open_paren == true ||
					(eMW = this.getElementWeight(elem) as number) < 0)
				return null;
			sMW += eMW;
			break;
		case this.READING_SUBSCRIPT: /* currently evaluating multi-digit number */
			if (gMW > 0.0)
				sMW += factor * gMW;
			else
				sMW += factor * eMW;
			html_text += "</sub>";
			break;
		case this.EXPECT_ELEMENT:
			return null;  // this should be a mistake
		}
		sMW *= coeff;
		tMW += sMW;
		sMW = 0;
		this.lastUserSpec.spec = molecFormula;
		this.lastUserSpec.sym = html_text;
		this.lastUserSpec.MW = tMW;
		return {
			MW: tMW,
			plainMolecule: plainMolecule,
			htmlText: html_text
		};
	},

	/* makes a <SELECT> list where the options are strings
		composed of EITHER elements of a single array (arr1) passed
		to it, OR elements from two arrays of strings in
		a "numerator/denominator" style format
		to generate the attributes that will be part of the SELECT
		tag (they must be in Javascript style strings),
		`sepchar' is a string representing the character which
		separates the two elemecomposed of text and special designators
		of form "%n" representing substitutable parameters from which all
		permutations for an options list will
		be generated using arrays whose string elements will be used
		for composing the select list.

		'valarr' is an optional array in which the value attribute of
		the option elements can be specified, if the value is not the option
		content itself.
	*/

	cmassDim : undefined,
	cvolDim : undefined,
	svolDim : undefined,

	/************************************************/

	solutionExamples : function (formObj: HTMLFormElement) {
		const SolnChemLib = LibraryData.SolnChemLib;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		let ver,
			idx: number;
		do {
			idx = Math.floor(getRandom(0, SolnChemLib.length - 1));
		} while (!(SolnChemLib[idx] as SolnChemData).htmlsym);
		// set one of list chems randomly
		// set one of list chems randomly
		const selectedCompound = SolnChemLib[idx] as SolnChemData;
		(this.xmlDocument.getElementById("selected-compound") as HTMLInputElement)!.value = idx.toString();
		this.displaySelectedMolecule(selectedCompound.htmlsym as string);
		(this.xmlDocument.getElementById("FWdisplay") as HTMLInputElement)!.value =
			selectedCompound.MW?.toString() as string;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const testnum = Math.floor(getRandom(0, 10));
		//formObj.concVal.value = Number.isInteger(testnum) ? testnum.toFixed(0) : testnum.toFixed(1);
		formObj.concVal.value = (1.5).toString();

		//if (!this.cmassDim)
		//	this.cmassDim = (formObj.cmassDim, [ 0.01, 0.05, 0.10, 0.01, 0.01, 0.25, 1-0.25-0.01*3-0.15 ]);
		//formObj.cmassDim[this.cmassDim!.getIndex()].checked = true;
		formObj.cmassDim.checked = "_mol";
		// if (typeof this.cvolDim == "undefined")
		//	this.cvolDim = new WeightedArrayElementSelector(formObj.cvolDim, [ 0.01, 0.40, 1-0.4-0.01 ]);
		// formObj.cvolDim[this.cvolDim!.getIndex()].checked = true;
		formObj.cvolDim.value = "_L";
		//if (typeof this.svolDim == "undefined")
		//	this.svolDim = new WeightedArrayElementSelector(formObj.svolDim, [ 0.01, 0.40, 1-0.4-0.01 ]);
		//formObj.svolDim[this.svolDim!.getIndex()].checked = true;
		formObj.svolDim.value = "_L";
		// formObj.solnVolVal.value = (getRandom(0, 5) as number)!.toFixed(1);
		formObj.solnVolVal.value = (2).toString();
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		formObj.version[ver = Math.floor(getRandom(0, 1))].checked = true;
		return this.calcsoln(formObj);
	/***
	  MORE CODE MORE CODE!!
	***/
	},

	/************************************************/

	calculateWeights : function (selectedMolecule: {name:string;value:string;checkmark:boolean}) {
		const document = this.xmlDocument,
			SolnChemLib = LibraryData.SolnChemLib,
			FWdisplay = this.xmlDocument.getElementById("FWdisplay")! as HTMLInputElement,
			MolecDisplay = this.xmlDocument.getElementById("MolDisplay")!;
		let MW: number;

		FWdisplay.value = "";

		this.xmlDocument.getElementById("solnerror")!.style.display = "none";
		const otherText = this.xmlDocument.getElementById("other-textbox-calcFW") as HTMLInputElement;
		if (selectedMolecule.name == "custom") {
			// event is a change in text
			if (this.other_checked == true) {
				FWdisplay.value = this.calcFW(selectedMolecule.value).toString(); // sprintf("%6.2f",
				MolecDisplay.innerHTML = this.moleculeAsHtml((otherText as HTMLInputElement).value) as string;
			}
		} else if (selectedMolecule.value == "other") {
			// event is from a click of "Other" radio control
			if (selectedMolecule.checkmark == true)
				this.other_checked = true;
			else
				this.other_checked = false;
			if (this.other_checked == true) {
				if (otherText.value == "") {
					const otherHdrRuleTD = (this.xmlDocument.getElementById("other-header-rule") as HTMLTableCellElement);
					otherHdrRuleTD.replaceChild(document.createTextNode(
						"Molecular formula required in text box"), otherHdrRuleTD.firstChild as ChildNode);
					otherHdrRuleTD.setAttribute("style", this.specialOtherHeaderCellStyle);
				} else {
					MW = this.calcFW(otherText.value);
					if (MW > 0) {
						FWdisplay.value = MW.toString(); // sprintf("%6.2f",);
						MolecDisplay.innerHTML = this.moleculeAsHtml(otherText.value) as string;
					} else {
						replaceSpanText("solnerror",
				"The entry in \"Other\" has no recognizable chemical formula." +
				" Please check your entry again.", this.xmlDocument);
						this.xmlDocument.getElementById("solnerror")!.style.display = "block";
					}
				}
			}
		} else {
			// this data from the custom list box
			const idx: number = parseInt(selectedMolecule.value.match(/\d+/)![0]);
			MW = (SolnChemLib[idx] as SolnChemData).MW;
			FWdisplay.value = MW!.toString(); // sprintf("%6.2f", MW);
			while (MolecDisplay.firstChild)
				MolecDisplay.removeChild(MolecDisplay.firstChild);
			MolecDisplay.appendChild(quickMarkupToDocObjects(
					(SolnChemLib[idx] as SolnChemData).htmlsym!.replace(/ /g, "&nbsp;"), document) as Node);
		}
	},

	calcsoln : function (formObj: HTMLFormElement) {
		const document = this.xmlDocument,
			FWval: string = (this.xmlDocument.getElementById("FWdisplay") as HTMLInputElement)!.value,
			MolecFormula: string = (this.xmlDocument.getElementById("MolDisplay") as HTMLTableCellElement)!.textContent as string,
			otherSetting: boolean = (this.xmlDocument.getElementById("calcFW-radio") as HTMLInputElement)!.checked,
			SolnChemLib = LibraryData.SolnChemLib,
			solnError = this.xmlDocument.getElementById("solnerror")!,
			MOLES = this.MOLES, GRAMS = this.GRAMS,
			StdEquip = LibraryData.StdEquip;
		let // ch,
			i,
			MW: number | undefined,
			cmass_unit: string,
			solid_mass: number,
			mass_units: number,
	//		this.lastUserSpec.name: string | null,
	//		this.lastUserSpec.sym: string,
			idx: number,
		//	selected_chemical: string,
			cmass_prefix: string,
			concVal: number,
			cvolUnitChoice: string,
			conc_factor: number,
			// finalVol: number,
			fvolUnitChoice: string,
			solid_mass_units: string,
			chem_idx: number = -1;

		const chem_idx_val = (this.xmlDocument.getElementById("selected-compound") as HTMLInputElement).value;
		if (chem_idx_val.length > 0)
			chem_idx = parseInt(chem_idx_val);
		const selectedChemItem = SolnChemLib[chem_idx as number] as SolnChemData;
			cmass_unit = getCheckedInput(formObj.cmassDim) as string;
		//this.lastUserSpec.name = null;
		if (cmass_unit.charAt(1) == 'G')
			mass_units = GRAMS;
		else
			mass_units = MOLES;
		/* get the chem from the Molec Display and FW display */

		//if ((selected_chemical = getCheckedInput(formObj.chemslct) as string) == null) {
		if (FWval.length == 0 || MolecFormula.length == 0) {
			replaceSpanText("solnerror",
					"There was no chemical substance or salt selected in the list nor " +
					"specified as user-defined for the entry marked \"Other.\"  Please " +
					"select a chemical from the list or define one in the box using the " +
					"examples provided.", this.xmlDocument);
			solnError.style.display = "block";
			return -1;
		}
//		if (selected_chemical == "other") {
		if (otherSetting == true) {
			const otherMolecFormula = formObj["other-textbox-calcFW"].value;
			MW = this.calcFW(otherMolecFormula);
			if (typeof MW === "undefined" /* || isNaN(MW) == true */) {
				if (this.nonsenseElement != null)
					replaceSpanText("solnerror",
							"It was not possible to calculate a molecular weight " +
							"for the specified chemical \"" + formObj["other-textbox-calcFW"].value +
							"\" because the element symbol " + this.nonsenseElement +
							"was not recognized.  Please make any corrections to the formula," +
							"following the examples given if necessary.", this.xmlDocument);
				else
					replaceSpanText("solnerror",
						"There was an unknown error in the molecular weight determination.  " +
						"Please check your entry for the molecular formula and re-try.", this.xmlDocument);
				solnError.style.display = "block";
				return -1;
			}
			this.lastUserSpec.sym = this.moleculeAsHtml(formObj["other-textbox-calcFW"].value) as string;
		} else {
			// get from the chemical list
			// TODO  might not need this actually
			/*
			if (isNaN(chem_idx = parseInt(selectedChemItem.match(/\d+/)![0])) == true) {
				replaceSpanText("solnerror",
						"There was no chemical substance or salt selected in the list nor " +
						"specified as user-defined for the entry marked \"Other\".  Please " +
						"select a chemical from the list or define one in the box using the " +
						"examples provided", this.xmlDocument);
				solnError.style.display = "block";
				return -1;
			} */
			MW = selectedChemItem.MW;
			this.lastUserSpec.sym = selectedChemItem.htmlsym;
			this.lastUserSpec.name = selectedChemItem.nam;
			if (typeof selectedChemItem.comname !== "undefined")
				this.lastUserSpec.name = selectedChemItem.comname;

		}
		const concvalInput: string = formObj.concVal.value;
		if (concvalInput.length == 0) {
			replaceSpanText("solnerror",
					"There was no value entered for specifying the density (concentration) " +
					"of the solution.  This information is required to make the determination.", this.xmlDocument);
			solnError.style.display = "block";
			return -1;
		} else if (isValidFloat(concvalInput) == false || (concVal = parseFloat(concvalInput)) < 0) {
			replaceSpanText("solnerror",
					"The value entered for the concentration must be a real positive number.", this.xmlDocument);
			solnError.style.display = "block";
			return -1;
		}
		const finalVolValue: string = formObj.solnVolVal.value;
		if (finalVolValue.length == 0) {
			replaceSpanText("solnerror",
					"There was no value entered for specifying the final volume of the solution " +
					"to be prepared.  This information is required to make the determination.", this.xmlDocument);
			solnError.style.display = "block";
			return -1;
		} else if (parseFloat(finalVolValue) <= 0 ||
						finalVolValue.search(/^\d+|\d+.\d+|\.\d+$/) < 0) {
			replaceSpanText("solnerror",
					"The value entered for the volume must be a real positive number.", this.xmlDocument);
			solnError.style.display = "block";
			return -1;
		}
		if ((cmass_prefix = cmass_unit.charAt(0)) == '_')
			cmass_unit = cmass_unit.substring(1);
		cvolUnitChoice = getCheckedInput(formObj.cvolDim) as string;
		conc_factor = getFactor(cmass_prefix);
		conc_factor /= getFactor(cvolUnitChoice.charAt(0));
		fvolUnitChoice = getCheckedInput(formObj.svolDim) as string;
		if (fvolUnitChoice.charAt(0) == '_')
			fvolUnitChoice = fvolUnitChoice.substring(1);
		if (cvolUnitChoice.charAt(0) == '_')
			cvolUnitChoice = cvolUnitChoice.substring(1);
		const final_vol_factor = getFactor(fvolUnitChoice.charAt(0));
		const final_mL_vol = parseFloat(finalVolValue) * final_vol_factor * 1000.0;
		if (mass_units == GRAMS)
			solid_mass = concVal;
		else if (mass_units == MOLES)
			solid_mass = concVal * MW!;
		solid_mass! *= parseFloat(finalVolValue) * final_vol_factor * conc_factor;
		solid_mass_units = " G (grams)";
		if (solid_mass! > 1000) {
			solid_mass! /= 1000;
			solid_mass_units = " kG (kilograms)";
		} else if (solid_mass! < 0.000001) {
			solid_mass! *= 1e6;
			solid_mass_units = " &micro;G (micrograms)";
		} else if (solid_mass! < 0.001) {
			solid_mass! *= 1000;
			solid_mass_units = " mG (milligrams)";
		}
		/* calculate the signficance digits on the weighing balance */
		i = 2;
		if (solid_mass! > 1.0)
			i = 3;
		const sig_balance = Math.pow(10, Math.floor(Math.log10(solid_mass!) - i));
		i = String(sig_balance);
		if ((idx = i.indexOf(".")) >= 0) {
			const precision = i.length - idx - 1;
			solid_mass = Math.round(solid_mass! * Math.pow(10, precision)) /
							Math.pow(10, precision);
		}
		for (i = 0; i < StdEquip.GradCyls.length; i++)
			if (Math.abs(StdEquip.GradCyls[i]) >= final_mL_vol)
				break;
		let gradcyl_vol: string = Math.abs(StdEquip.GradCyls[i]).toString();
		if (StdEquip.GradCyls[i] < 0)
			gradcyl_vol += " or " + Math.abs(StdEquip.GradCyls[i + 1]).toString() + " mL";
		else
			gradcyl_vol += " mL";
		for (i = 0; i < StdEquip.Beakers.length; i++)
			if (Math.abs(StdEquip.Beakers[i]) >= final_mL_vol)
				break;
		let beaker_vol: string = Math.abs(StdEquip.Beakers[i]).toString();
		if (StdEquip.Beakers[i] < 0)
			beaker_vol += " or " + Math.abs(StdEquip.Beakers[i + 1]).toString() + " mL";
		else
			beaker_vol += " mL";
		const volume_units: string = fvolUnitChoice;

		let step1: string;

		if (chem_idx < 0 || !(selectedChemItem.stdgpl && selectedChemItem.spgr))
			step1 =
			"   If possible, weigh out the chemical in the container (beaker or " +
			"   graduated cylinder) which will be used for dissolution; alternatively " +
			"   a glassine weigh paper or standard weighing boat is entirely proper.  ";
		else {
			step1 =
			"   " + this.lastUserSpec.name!.charAt(0).toUpperCase() + this.lastUserSpec.name!.substring(1) +
			" comes as a standard concentrate reagent. " +
			"   You can choose from the following concentrates to prepare the solution: " +
			"<ul>";

			for (let i = 0; i < selectedChemItem.stdgpl.length; i++)	{
				const wgtpcnt = selectedChemItem.stdgpl[i] / (10 * selectedChemItem.spgr[i]);
				const wgt = solid_mass! * 1000 * selectedChemItem.spgr[i] / selectedChemItem.stdgpl[i];
				const vol = solid_mass! * 1000 / selectedChemItem.stdgpl[i];

				step1 += `<li> ${selectedChemItem.stdgpl[i]} G/L ` +
				`(${wgtpcnt.toFixed(1)}% w/w, ${selectedChemItem.stdgpl[i] / 10}% w/v) concentrate:  ` +
				`pour or use ${adjustMagnitude(wgt.toFixed(1), "G", 1.0, 1000.0)} ` +
				`(${adjustMagnitude(vol.toFixed(0), "mL", 1.0, 1000.0)})</li>`
			}
			step1 += "</ul>";
		}

		/* write the guide */
		const version = getCheckedInput(formObj.version);

		const instructBlock: HTMLDivElement = this.xmlDocument.getElementById("solninstruct")! as HTMLDivElement;
		instructBlock.style.display = "block";
		const solnguide: HTMLSpanElement = this.xmlDocument.getElementById("solnguide") as HTMLSpanElement;
		if (otherSetting == true && formObj["other-textbox-calcFW"].value == "H2O")
			replaceSpanText("solnguide",
					"It is not possible to specify the molarity of water in an aqueous solution, " +
					"since the solute and solvent are identical.  " +
					"<p>Since pure water has a density of 1000 G/L, and the specific molar mass " +
					"of water is 1 mole/18.02 G, the product of these two factors " +
					"is 55.5 moles/L (molar), its effective concentration.", this.xmlDocument);
		else if (version == "short") {
			solnguide.classList.add("short-version");
			if (this.lastUserSpec.listIndex < 0 ||
						typeof((SolnChemLib[this.lastUserSpec.listIndex] as SolnChemData).stdgpl) != "undefined")
				solnguide.appendChild(quickMarkupToDocObjects(
					step1 + "<span>and qs to the final volume with water</span>",
					this.xmlDocument
				) as Node);
			else
				replaceSpanText("solnguide",
						" Required mass:  " + solid_mass! + solid_mass_units + " of " +
						this.lastUserSpec.sym + (this.lastUserSpec.name == "" ? " " :
						(" (" + this.lastUserSpec.name + ") ")) +
						"in a final volume of  " + finalVolValue + " " + volume_units, this.xmlDocument);
			this.xmlDocument.getElementById("solnprintable")!.style.display = "none";
		} else { /* long version by default */
			solnguide.classList.remove("short-version");
			removeChildren(solnguide);
			const spans = [
				["nearest",
						sig_balance + (solid_mass_units.substring(0,
						solid_mass_units.indexOf("G") + 1))
				],
				["exactmass", solid_mass! + solid_mass_units],
				["substname", (this.lastUserSpec.name == null ? ". " : (" ("
						+ this.lastUserSpec.name + "). ")) + step1],
				["cylvol", gradcyl_vol],
				["beakervol", beaker_vol],
				["substsym", this.lastUserSpec.sym, 4],
				["firstfill", 0.80 * parseFloat(finalVolValue)],
				["volunits", volume_units ]
			];

			for (const span of spans)
				if (span.length == 3)
					replaceSpanText(span[0], span[1], this.xmlDocument, span[2]);
				else
					replaceSpanText(span[0], span[1], this.xmlDocument);

			const longver = this.xmlDocument.getElementById("longversion")!
			solnguide.appendChild(longver);
			longver.style.display = "block";
			this.xmlDocument.getElementById("solnprintable")!.style.display = "inline";
		}
		solnError.style.display = "none";
	},

	other_checked : false,  // indicates whether other radio node is checked
	otherInput: false, // indicates whether other text box is being input
	stdHeaderCellStyle : "padding:0.1em 1em;font: bold 90% Helvetica,Arial,Tahoma,sans-serif;" +
			"color:#fafafa; background-color:#509050",
	specialOtherHeaderCellStyle : "color:yellow;font:bold 110% Arial,sans-serif;" +
		"text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px  1px 0 black, 1px  1px 0 black;" +
		"background-color: rgb(176, 123, 32);",

	/************************************************/

	/*
	writeMakeSoln : function () {
		this.xmlDocument.getElementById("solnForm")!.reset();
		this.xmlDocument.getElementById("solutions-page")!.style.display = "block";
		this.xmlDocument.getElementById("mainmenu-page")!.style.display = "none";
	}
	*/

};

SolutionChemistry.init();

export default SolutionChemistry;