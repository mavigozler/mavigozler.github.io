
/*************************************************************************
      CONVERSIONS CODE
 *************************************************************************/
/* insert eslint DISABLING for compiled JS here */
import { ChemController } from "./ModuleController";
import { makeSelectList, removeChildren } from "../GenLib/html-dom";

type DimensionInfo = {
	optionValue: string; // value of the option
	other: string; // another name for optionValue
	dimenValues: {
		value: number;
		selectElemOptValueUnits: string;
		htmlDocUnits: string;
	}[];
}

const Conversions = {

	init : function () {
      const xhtmlText = `${this.xhtmlFilePath}/Conversions.xhtml`;
		if (typeof ChemController === "object") {
			ChemController.registerModule(xhtmlText, this);
		}

		document.getElementById("conversionHelp")?.addEventListener("click", (evt: Event) => {
			this.conversionHelp();
		});
		document.getElementById("conversionHelp")?.addEventListener("mouseover", (evt: Event) => {
			(evt.currentTarget as HTMLButtonElement).style.color = "red";
		});
		document.getElementById("conversionHelp")?.addEventListener("mouseout", (evt: Event) => {
			(evt.currentTarget as HTMLButtonElement).style.color = "";
		});
	},

	activate : function () {
		ChemController.activateModule(this);
		document.getElementById("conversions-page")!.style.display = "";
	},

   finishDocument : () => {
      let selNode,
			selAttribs,
			optAttribs,
			optVals,
			optTexts;
		const DimensionsCategories = Conversions.DimensionsCategories,
         DimensionsInfo = Conversions.DimensionsInfo;

      selAttribs = [
         "id=catselect",
         "style=font-size:125%",
         "onchange=Conversions.reconfigUnits(this);",
         "size=" +
            ((DimensionsCategories.length <= 4) ? DimensionsCategories.length : 4)
      ];
      optAttribs = [
         "style=color:green;font:normal 150% Helvetica,Arial,sans-serif;"
      ];
      optVals = [
         "",
      ];
      optTexts = [
         "select a category",
      ];
   	for (var i = 0; i < DimensionsCategories.length; i++)
         optTexts.push(
               DimensionsCategories[i] + DimensionsInfo[i].other ? " / " +
   			   DimensionsInfo[i].other : "");
      selNode = makeSelectList(selAttribs, optVals, optTexts, optAttribs);
      document.getElementById("dimension-select")!.appendChild(selNode);
   },

	DimensionsCategories : [ "Concentration" ],

	DimensionsInfo : [
		{ optionValue: "conc",
			other: "Solution Density",
			dimenValues: [
				{ value:1, selectElemOptValueUnits: "g_L", htmlDocUnits: "G/L" },
				{ value:1000, selectElemOptValueUnits: "mg_L", htmlDocUnits: "mG/L"},
				{ value:1000000, selectElemOptValueUnits: "ug_L", htmlDocUnits: "\u00b5G/L"},
				{ value:1000000000, selectElemOptValueUnits: "ng_L", htmlDocUnits: "nG/L"},
				{ value:1000000000000, selectElemOptValueUnits: "pg_L", htmlDocUnits: "pG/L"},
				{ value:0.001, selectElemOptValueUnits: "g_ml", htmlDocUnits: "G/mL"},
				{ value:1, selectElemOptValueUnits: "mg_ml", htmlDocUnits: "mG/mL"},
				{ value:1000, selectElemOptValueUnits: "ug_ml", htmlDocUnits: "\u00b5G/mL"},
				{ value:1000000, selectElemOptValueUnits: "ng_ml", htmlDocUnits: "nG/mL"},
				{ value:1000000000, selectElemOptValueUnits: "pg_ml", htmlDocUnits: "pG/mL"},
				{ value:0.001, selectElemOptValueUnits: "mg_ul", htmlDocUnits: "mG/\u00b5L"},
				{ value:1, selectElemOptValueUnits: "ug_ul", htmlDocUnits: "\u00b5G/\u00b5L"},
				{ value:1000, selectElemOptValueUnits: "ng_ul", htmlDocUnits: "nG/\u00b5L"},
				{ value:1000000, selectElemOptValueUnits: "pg_ul", htmlDocUnits: "pG/\u00b5L"},
				{ value:0.1, selectElemOptValueUnits: "pph", htmlDocUnits: "%"},
				{ value:1, selectElemOptValueUnits: "ppt", htmlDocUnits: "\u2030 (ppt)"},
				{ value:1000, selectElemOptValueUnits: "ppm", htmlDocUnits: "ppm"},
				{ value:1000000, selectElemOptValueUnits: "ppb", htmlDocUnits: "ppb"},
			]
		}
	]  as DimensionInfo[],

   PhysProperties:  {
      length :
         { units : [ "m", "ft", "km", "mile", "in", "yd" ],
            factor : [ 1.0, 39.37/12, 0.001, 39.37 * 5280 / 12, 39.37, 39.37 / 3 ] },
      temp :
         { units: [ "C", "K", "F"],
            factor: [ "$ * 1.0", "$ - 273", "9 * $ / 5 + 32" ] },
      current :
         { units: [ "A" ] }
   },

	selectedCategory : undefined as (DimensionInfo | undefined),

	reconfigUnits : function (catSelectObj) {
		let i,
			j,
			a,
			x,
			selectObj,
			node,
			nextNode,
			selectedCategory = Conversions.selectedCategory;
		const
			DimensionsInfo = Conversions.DimensionsInfo,
			inputdim = document.getElementById("inputdim")!,
			outputdim = document.getElementById("outputdim")!,
			catselect = document.getElementById("catselect")! as HTMLSelectElement,
			selectObjArray = [ inputdim, outputdim ],
			optionValue = catselect.options[catselect.selectedIndex].value;

		if (optionValue.length === 0) {
			for (a = 0; a < selectObjArray.length; a++) {
				selectObj = selectObjArray[a];
				node = selectObj.options[0];
				while (node !== null) {
					removeChildren(node);
					nextNode = node.nextSibling;
					node.parentNode.removeChild(node);
					node = nextNode;
				}
			}
			return true;
		}
		for (i = 0; i < DimensionsInfo.length; i++)
			if (optionValue == DimensionsInfo[i].optionValue)
				break;
		if (typeof i == "undefined")
			return true;
		for (a = 0; a < selectObjArray.length; a++) {
			selectObj = selectObjArray[a];

			for (j = 0; j < selectObj.options.length; j++)
				removeChildren(selectObj.options[j]);
				for (const dimenInfo of DimensionsInfo)
					if (selectObj.options.length < dimenInfo.dimenValues.length)
						for (let k = selectObj.options.length; k < dimenInfo.dimenValues.length; k++)
							selectObj.appendChild(document.createElement("option"));
					else if (selectObj.option.length > dimenInfo.dimenValues.length) {
						const diff = selectObj.options.length - dimenInfo.dimenValues.length;
						for (let idx = 0, node = selectObj.options[0]; idx < diff; idx++, node = nextNode) {
							nextNode = node.nextSibling;
							node.parentNode.removeChild(node);
						}
					}
			for (const dimenInfo of DimensionsInfo)
				for (const dimenVal of dimenInfo.dimenValues) {
					selectObj.options[j].value = dimenVal.selectElemOptValueUnits;
					selectObj.options[j].appendChild(document.createTextNode(dimenVal.htmlDocUnits));
				}
		}
		if (selectObj.options.length === 0)
			selectedCategory = undefined;
		else
			selectedCategory = DimensionsInfo[i];
		Conversions.selectedCategory = selectedCategory;
		if ((document.getElementById("inputval")! as HTMLInputElement).value.length > 0)
			Conversions.recalcUnits(catSelectObj);
		return true;
	},

	recalcUnits : function (control) {
		let errElem,
			selectedCategory = Conversions.selectedCategory,
			precision,
			answer,
			error,
			elem;
		const	inputval = document.getElementById("inputval")! as HTMLInputElement,
				inputdim = document.getElementById("inputdim")! as HTMLSelectElement,
				outputdim = document.getElementById("outputdim")! as HTMLSelectElement,
				node = document.getElementById("outputval")!;

		// error checking
		if (inputval.value.length === 0) {
			node.replaceChild(document.createTextNode("\u0020"), node.firstChild as ChildNode);
			return true;
		}
		if (selectedCategory === null ||
					inputval.value.search(/^\+?\d+[\.,]?\d*$|^\+?\d*[\.,]?\d+$/) !== 0) {
			errElem = document.createElement("span");
			errElem.setAttribute("style", "color:red;font:normal 50% Helvetica,sans-serif;");
			if (selectedCategory === null)
				errElem.appendChild(document.createTextNode("Must select a " +
					"category to convert input value"));
			else
				errElem.appendChild(document.createTextNode("Entered text must " +
					"be a\u00a0number\u00a0\u003e\u00a00"));
			node.replaceChild(errElem, node.firstChild as ChildNode);
			return false;
		}
		let inputDimIndex,
			outputDimIndex;
		for (inputDimIndex = 0; inputDimIndex < selectedCategory!.dimenValues.length; inputDimIndex++)
			if (selectedCategory?.dimenValues[inputDimIndex].selectElemOptValueUnits ===
							inputdim.options[inputdim.selectedIndex].value)
				break;
		for (outputDimIndex = 0; outputDimIndex < selectedCategory!.dimenValues.length; outputDimIndex++)
			if (selectedCategory?.dimenValues[outputDimIndex].selectElemOptValueUnits ===
							outputdim.options[outputdim.selectedIndex].value)
				break;
		precision = inputval.value.match(/[\.,](\d*)$/);
		if (precision !== null && typeof precision[1] !== "undefined")
			precision = precision[1].length;
		else if ((precision = inputval.value.match(/([1-9]+)0*$/)) !== null)
			precision = precision[1].length - 1;
		else
			precision = 0;
		answer = parseFloat(inputval.value) * selectedCategory!.dimenValues[outputDimIndex].value /
					selectedCategory!.dimenValues[outputDimIndex].value;
		let x: number;
		if (answer.toString().length > 6) {
			if (answer > 1.0)
				x = Math.round(answer);
			else {
				x = answer.log10() - Math.round(answer.log10());
				x = Math.pow(10, Math.round(x) - Math.round(answer.log10()));
			}
			error = Math.pow(10, Math.log10(x) - 7);
			if (x + error > answer || x - error < answer)
				answer = x;
		}
		if (Math.abs(answer.log10()) > 6)
			answer = answer.toExponential(precision);
		if ((x = answer.toString().match(/(\d+)[eE]{1}([\-\+]\d{1,3})/)) !== null) {
			elem = document.createElement("sup");
			elem.appendChild(document.createTextNode(x[2]));
			answer = document.createElement("span");
			answer.appendChild(document.createTextNode(x[1] + " \u00d7 10"));
			answer.appendChild(elem);
		}
		else
			answer = document.createTextNode(answer);
		node.replaceChild(answer, node.firstChild as ChildNode);
		return true;
	},

	createConversionSelectFormControl : function (nodeId) {
		let i;
		const DimensionsCategories = Conversions.DimensionsCategories,
			DimensionsInfo = Conversions.DimensionsInfo,
		//	reconfigureUnits = Conversions.reconfigureUnits,
			select = document.createElement("select");
		select.style.fontSize = "125%";
		select.size = (DimensionsCategories.length <= 4) ? DimensionsCategories.length : 4;
//		select.addEventListener("change", reconfigureUnits, false);
		let option = document.createElement("option");
		option.appendChild(document.createTextNode("--select a category--"));
		option.selected = true;
		select.appendChild(option);
		for (i = 0; i < DimensionsCategories.length; i++) {
			option = document.createElement("option");
			option.style.color = "green";
			option.style.fontSize = "150%";
			option.style.fontFamily = "Helvetica,Arial,sans-serif";
			option.value = DimensionsInfo[i].optionValue;
			option.appendChild(document.createTextNode(
				DimensionsCategories[i] +
					DimensionsInfo[i].other ? (" / " +	DimensionsInfo[i].other) : "" ));
			select.appendChild(option);
		}
	},

	write_conversions : () => {
		document.getElementById("conversions-page")!.style.display = "block";
		document.getElementById("mainmenu-page")!.style.display = "none";
		(document.getElementById("inputval")! as HTMLInputElement).value = "";
		const selElem = document.getElementById("inputdim")! as HTMLSelectElement;
		selElem.options[0].selected =
				(document.getElementById("outputdim")! as HTMLSelectElement).options[0].selected =
				(document.getElementById("catselect")! as HTMLSelectElement).options[0].selected = true;
		const node = document.getElementById("outputval")! as HTMLInputElement;
		node.replaceChild(document.createTextNode("\u0020"), node.firstChild as ChildNode);
	},


	/**** <!--  Unit Conversin Related Code --->  ***/
	write_unit_conversions : () => {
		document.getElementById("unit-conversion-page")!.style.display = "block";
		document.getElementById("mainmenu-page")!.style.display = "none";
	}
};

Conversions.init();

export default Conversions;