
/* insert eslint DISABLING for compiled JS here */

/**** <!--  SDS-PAGE-related code --->  ***/

import { ChemController, ChemCalcPageProperties } from "./ModuleController";
import { getCheckedInput, } from "../GenLib/html-dom";

const SDSPAGE = {
	init : function () {
      // name of HTML file with module markup for middle panel
		const xhtmlText = `${this.xhtmlFilePath}/SDSPAGE.xhtml`;
		if (typeof ChemController == "object")
			ChemController.registerModule(xhtmlText, this);
      (this.xmlDocument.getElementById("LogMWvRM")! as HTMLFormElement).reset();
	},

	addXhtmlEventHandlers: function () {
		this.xmlDocument.getElementById("sds-detailed-help")?.addEventListener("click", () => {
			this.xmlDocument.getElementById('SDS-PAGE-detailed-help')!.style.display='block';
		});
		this.xmlDocument.getElementById("sds-detailed-help")?.addEventListener("mouseover", (evt: Event) => {
			const elem = (evt.currentTarget as HTMLSpanElement);
			elem.style.textDecoration = "underline";
			elem.style.fontWeight = "bold";
		});
		this.xmlDocument.getElementById("sds-detailed-help")?.addEventListener("mouseout", (evt: Event) => {
			const elem = (evt.currentTarget as HTMLSpanElement);
			elem.style.textDecoration = "";
			elem.style.fontWeight = "";
		});
		this.xmlDocument.getElementById("gelvol-given-option-input")?.addEventListener("click", (evt: Event) => {
			this.SDSPAGE.setSDSvoloption(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("gelvol-given-calcd-input")?.addEventListener("click", (evt: Event) => {
			this.SDSPAGE.setSDSvoloption(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("SDScalcButton")?.addEventListener("click", (evt: Event) => {
			this.SDSPAGE.recalcSDS((evt.currentTarget as HTMLFormElement).form);
		});
		this.xmlDocument.getElementById("showSDSexample")?.addEventListener("click", (evt: Event) => {
			this.SDSPAGE.showSDSexample((evt.currentTarget as HTMLFormElement).form);
		});
		this.xmlDocument.getElementById("closeSDSPageDetailedHelp")?.addEventListener("click", (evt: Event) => {
			this.xmlDocument.getElementById('SDS-PAGE-detailed-help')!.style.display = "none";
		});

		this.xmlDocument.getElementById("M1MW")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M1Rm")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M2MW")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M2Rm")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M3MW")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M3Rm")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M4MW")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M4Rm")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M5MW")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M5Rm")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M6MW")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M6Rm")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M7MW")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M7Rm")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M8MW")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M8Rm")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M9MW")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("M9Rm")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("FrontRm")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("updateSDSParams")?.addEventListener("change", (evt: Event) => {
			this.updateSDSParams(evt.currentTarget as HTMLInputElement);
		});
		this.xmlDocument.getElementById("exampleSDSPlot")?.addEventListener("click", (evt: Event) => {
			this.SDSPAGE.exampleSDSplot(evt.currentTarget as HTMLButtonElement);
		});
	},

	activate : function () {
		ChemController.activateModule(this);
		this.xmlDocument.getElementById("sds-page")!.style.display = "";
	},

	write_SDSPAGE : function () {
		(this.xmlDocument.getElementById("sds-page-form")! as HTMLFormElement).reset();
		this.xmlDocument.getElementById("sds-page")!.style.display = "block";
		this.xmlDocument.getElementById("mainmenu-page")!.style.display = "none";
	},

	SDSerror : function (txt: string) {
		const node = this.xmlDocument.getElementById("SDS-error-info")!;
		txt = "<ul>" + txt + "<\/ul>";
		if (node.hasChildNodes() == true)
			node.replaceChild(document.createTextNode(txt), node.firstChild as ChildNode);
		else
			node.appendChild(document.createTextNode(txt));
	},

	SDSfirstcalc : false,

	recalcSDS : function (form) {
		let i,
			node,
			sepgelvol,
			stackgelvol,
			sepgelerr = 0,
			stackgelerr = 0,
			sepgelbuff,
			stackgelbuff,
			sepgelconc,
			stackgelconc,
			SDSconc,
			APSconc,
			acrylamide,
			errorInfo = "",
			ErrNum = 1,
			nodeValues,
			nodeVal,
			stackVol = 0.0,
			sepVol = 0.0,
			APSvol = 0.0,
			stackgelWaterVol,
			sepgelWaterVol,
			APSinstructions;
		const nodeList = this.xmlDocument.getElementById("SDS-error-info")!.childNodes,
			factors = [ "sepgelheight", "stackgelheight", "gelwidth", "geldepth" ],
			descrip = [ "Resolving gel height", "Stacking gel height",
						"Gel width", "Gel depth" ],
			nodeIDs = [ "sepgelbuffvol", "stackgelbuffvol",
				"sepgelSDSvol", "stackgelSDSvol",
				"sepgelAPSvol", "sepgelTEMEDvol",
				"stackgelAPSvol", "stackgelTEMEDvol",
				"sepgelAcrylVol", "stackgelAcrylVol"
			];

		for (i = 0; i < nodeList.length; i++)
			nodeList[i].parentNode!.removeChild(nodeList[i]);
		if (getCheckedInput(form.gelvolumes) == "volumegiven") {
			sepgelvol = parseFloat(form.elements["sepgelvol"].value);
			stackgelvol = parseFloat(form.elements["stackgelvol"].value);
		} else { // gel dimensions, not volume
			let selObj,
				adjust,
				node,
				entry,
				count;
			sepgelvol = stackgelvol = 1.0;
			for (i = 0; i < factors.length; i++) {
				if (form.elements[factors[i]].
								value.search(/^\d+\.?\d*$|^\d*\.?\d+$/) < 0) {
					errorInfo += "<li>Error " + ErrNum++ + ":  " +
						descrip[i] + " is not a valid number.	Enter a valid number.";
					if (i == 0)
						sepgelerr = 1;
					else if (i == 1)
						stackgelerr = 1;
					else
						stackgelerr = sepgelerr = 1;
					continue;
				} else {
					adjust = 1.0;
					entry = parseFloat(form.elements[factors[i]].value);
					selObj = form.elements[factors[i] + "dim"];
					if (i == factors.length - 1 || (selObj &&
								selObj.options[selObj.selectedIndex].value == "mm"))
						adjust = 10.0;
					if (i == 0)
						sepgelvol *= entry / adjust;
					else if (i == 1)
						stackgelvol *= entry / adjust;
					else {
						sepgelvol *= entry / adjust;
						stackgelvol *= entry / adjust;
					}
				}
			}
			count = parseFloat(form.gelcount.value);
			if (parseInt(count) != count)
				form.gelcount.value = count = 1;
			sepgelvol *= count;
			stackgelvol *= count;
			if (form.volerrorcalc.checked == true) {
				sepgelvol *= 1.0 + parseFloat(form.volerrorval.value) / 100.0;
				stackgelvol *= 1.0 + parseFloat(form.volerrorval.value) / 100.0;
			}
			sepgelvol = Math.ceil(sepgelvol);
			stackgelvol = Math.ceil(stackgelvol);
			node = this.xmlDocument.getElementById("calcdsepgelvol")! as HTMLSpanElement;
			node.replaceChild(document.createTextNode(sepgelvol), node.firstChild);
			node = this.xmlDocument.getElementById("calcdstackgelvol")! as HTMLSpanElement;
			node.replaceChild(document.createTextNode(stackgelvol), node.firstChild);
			this.xmlDocument.getElementById("calcdgeltr")!.style.display = ChemCalcPageProperties.tableRowPropertyValue;
			this.xmlDocument.getElementById("finalvolhdr")!.setAttribute(ChemCalcPageProperties.rowspanProperty, "4");
			this.xmlDocument.getElementById("finalvolradios")!.setAttribute(ChemCalcPageProperties.rowspanProperty, "4");
		}


/*  Laemmli APS and TEMED are 0.025% by weight and volume originally
    Bio-Rad mentions using 0.5% APS and 0.05% TEMED (10% of APS)
    GE Life Sciences uses 0.1% APS and
       TEMED is function of acrylamide percentage:
    %TEMED (ml/100 ml) = 0.8 (%acrylamide)^2 - 0.3133 (%acrylamide) + 0.0405

*/
		sepgelbuff = parseFloat(form.elements["sepgelbuff"].value);
		stackgelbuff = parseFloat(form.elements["stackgelbuff"].value);
		sepgelconc = parseFloat(form.elements["sepgelconc"].value);
		stackgelconc = parseFloat(form.elements["stackgelconc"].value);
		SDSconc = parseFloat(form.elements["SDSconc"].value);
		APSconc = parseFloat(form.elements["APSconc"].value);
		acrylamide = form.elements["acrylamide"];
		if (acrylamide.selectedIndex < 0) {
			errorInfo += "<li>Error " + ErrNum++ + ": Concentration of the " +
				"stock acrylamide/bisacrylamide was not selected.";
			sepgelerr = stackgelerr = 1;
		} else
			acrylamide = parseFloat(acrylamide.options[acrylamide.selectedIndex].value);
		if (isNaN(sepgelbuff) == true || sepgelbuff <= 0) {
			errorInfo += "<li>Error " + ErrNum++ + ": Separating gel buffer " +
				"concentration was not a valid number.  Default = 1.5 M entered.";
			form.elements["sepgelbuff"].value = sepgelbuff = 1.5;
		}
		if (isNaN(stackgelbuff) == true || stackgelbuff <= 0) {
			errorInfo += "<li>Error " + ErrNum++ + ": Stacking gel buffer " +
				"concentration was not a valid number.  Default = 0.5 M entered.";
			form.elements["stackgelbuff"].value = stackgelbuff = 0.5;
		}
		if (isNaN(SDSconc) == true || SDSconc <= 0) {
			errorInfo += "<li>Error " + ErrNum++ + ": SDS concentration " +
				"was not a valid number.  Default = 10% entered.";
			form.elements["SDSconc"].value = SDSconc = 10;
		}
		if (isNaN(APSconc) == true || APSconc <= 0) {
			errorInfo += "<li>Error " + ErrNum++ + ": Ammonium persulfate concentration " +
				"was not a valid number.  Default = 10% entered.";
			form.elements["APSconc"].value = APSconc = 10;
		}
		if (isNaN(sepgelconc) == true || sepgelconc <= 0) {
			errorInfo += "<li>Error " + ErrNum++ + ": Separating gel concentration " +
				"was not a valid number.  A default = 10% was entered.";
			form.elements["sepgelconc"].value = sepgelconc = 10;
		}
		if (sepgelconc >= acrylamide) {
			errorInfo += "<li>Error " + ErrNum++ + ": The separating gel acrylamide " +
				"concentration exceeds the acrylamide stock concentration.";
			sepgelerr = 1;
		}
		if (isNaN(stackgelconc) == true || stackgelconc <= 0) {
			errorInfo += "<li>Error " + ErrNum++ + ": Stacking gel concentration " +
				"was not a valid number.  A default = 4% was entered.";
			form.elements["stackgelconc"].value = stackgelconc = 4;
		}
		if (stackgelconc >= acrylamide) {
			errorInfo += "<li>Error " + ErrNum++ + ": The stacking gel acrylamide " +
				"concentration exceeds the acrylamide stock concentration.";
			stackgelerr = 1;
		}
		if (isNaN(sepgelvol) == true || sepgelvol <= 0) {
			errorInfo += "<li>Error " + ErrNum++ + ":  Separating gel volume " +
				"is not a valid number.  Enter a valid number.";
			sepgelerr = 1;
		}
		if (isNaN(stackgelvol) == true || stackgelvol <= 0) {
			errorInfo += "<li>Error " + ErrNum++ + ":  Stacking gel volume " +
				"is not a valid number.  Enter a valid number.";
			stackgelerr = 1;
		}
		nodeValues = [
			0.375 * sepgelvol / sepgelbuff,
			0.125 * stackgelvol / stackgelbuff,
			0.1 * sepgelvol / SDSconc, 0.1 * stackgelvol / SDSconc,
			0.05 * sepgelvol / APSconc, 0.05 * sepgelvol / 100,
			0.05 * stackgelvol / APSconc, 0.1 * stackgelvol / 100,
			sepgelvol * sepgelconc / acrylamide,
			stackgelvol * stackgelconc / acrylamide
		];
		for (i = 0; i < nodeIDs.length; i++) {
			node = this.xmlDocument.getElementById(nodeIDs[i]);
			nodeVal = Math.round(nodeValues[i] * 1000) / 1000;
			if (nodeIDs[i].search(/stack/) >= 0) {
				if (stackgelerr != 0)
					continue;
				stackVol += nodeVal;
			}
			else if (sepgelerr != 0)
				continue;
			else
				sepVol += nodeVal;
			if (nodeIDs[i].search(/sepgelAPSvol|stackgelAPSvol/) >= 0)
				APSvol += nodeVal;
			if (nodeVal < 1.0)
				nodeVal = (nodeVal * 1000.0) + " \u00b5l";
			else
				nodeVal = nodeVal + " ml";
			node.replaceChild(document.createTextNode(nodeVal), node.firstChild);
		}

		stackgelWaterVol = stackgelvol - stackVol;
		stackgelWaterVol = Math.round(stackgelWaterVol * 1000) / 1000;
		sepgelWaterVol = sepgelvol - sepVol;
		sepgelWaterVol = Math.round(sepgelWaterVol * 1000) / 1000;
		if ((stackVol > stackgelvol || stackgelvol < 0.0) && stackgelerr == 0) {
			errorInfo += "<li>Error " + ErrNum++ +
				":The stacking gel cannot be made because " +
				"the sum of the volumes of the concentrated stocks necessary to make " +
				"the gel exceeds the total volume of the gel specified.  One or more " +
				"of your stock solutions should have a higher concentration."
			stackgelerr = 1;
		}
		if ((sepVol > sepgelvol || sepgelvol < 0.0) && sepgelerr == 0) {
			errorInfo += "<li>Error " + ErrNum++ +
				":The separating gel cannot be made because " +
				"the sum of the volumes of the concentrated stocks necessary to make " +
				"the gel exceeds the total volume of the gel specified.  One or more " +
				"of your stock solutions should have a higher concentration.";
			sepgelerr = 1;
		}
		// <!-- CALCULATE THE SEP GEL WATER VOLUME -->

		if (sepgelerr == 0) {
			node = this.xmlDocument.getElementById("sepgelWaterVol")!;
			if (sepgelWaterVol < 1.0)
				nodeVal = (sepgelWaterVol * 1000.0) + " \u00b5l";
			else
				nodeVal = sepgelWaterVol + " ml";
			node.replaceChild(document.createTextNode(nodeVal), node.firstChild);
		} else
			for (i = 0; i < nodeIDs.length; i++)
				if (nodeIDs[i].search(/stack/) < 0) {
					node = this.xmlDocument.getElementById(nodeIDs[i]);
					node.replaceChild(document.createTextNode(""), node.firstChild);
				}

		if (stackgelerr == 0) {
			node = this.xmlDocument.getElementById("stackgelWaterVol")!;
			if (stackgelWaterVol < 1.0)
				nodeVal = (stackgelWaterVol * 1000.0) + " \u00b5l";
			else
				nodeVal = stackgelWaterVol + " ml";
			node.replaceChild(document.createTextNode(nodeVal), node.firstChild);
		} else
			for (i = 0; i < nodeIDs.length; i++)
				if (nodeIDs[i].search(/stack/) >= 0) {
					node = this.xmlDocument.getElementById(nodeIDs[i]);
					node.replaceChild(document.createTextNode(""), node.firstChild);
				}

		if (errorInfo.length > 0)
			this.SDSerror(errorInfo);
		this.SDSfirstcalc = true;

		node = this.xmlDocument.getElementById("totalAPSvol")!;
		APSvol = Math.ceil((APSvol * 1000 * 1.15) / 10) * 10;
		APSinstructions = "It is recommended that you prepare " +
				(APSvol / 10).toFixed(0) + "&nbsp;mg of APS in " + APSvol.toFixed(0) +
				"&nbsp;&micro;l of ultrapure water for all your APS needs";
		form.elements["APSvol"].value = APSvol;
		form.elements["APSmass"].value = (APSvol / 10).toFixed(0);
	//	replaceAllChildren(node, document.createTextNode(APSinstructions));
		node = this.xmlDocument.getElementById("SDScalcButton")! as HTMLButtonElement;
		node.replaceChild(document.createTextNode("Update"), node.firstChild);
		this.xmlDocument.getElementById("SDS-Table-Print-Button")!.style.display = "";
		return;
	},


};
