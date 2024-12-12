"use strict";

/*************************************************************************
      <!--  CENTRIFUGE CODE -->
 *************************************************************************/
/* insert eslint DISABLING for compiled JS here */

import { ChemController } from "./ModuleController";
import { setCheckedInput, replaceSpanText, getCheckedInput } from "../GenLib/html-dom";
import { plainWindow } from "../GenLib/windows";
import { isValidFloat } from '../GenLib/numberExtended';

type CentrifugeOption = {
	db: number;
	list: number;
	make: string;
};

const Centrifuge = {

	xmlDocument: Document,

	moduleId: "Centrifuge",

	init : function () {
		if (typeof ChemController == "object") {
			ChemController.registerModule(this.moduleId, this);
		}
	},

/*
	activate : function () {
		ChemController.activateModule(this);
   	document.getElementById("centrifuge-page")!.reset();
   	document.getElementById("centrifuge-page")!.style.display = "block";
	},
*/

	finishDocument : function (doc: Document) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const document: Document = doc;
	},

	settings: {
		radius: 0, // in cm!
		angVel: 0, // in rad/s
		RCF: 0,
		last_updated: 0, // 1=radius, 2=speed, 3=RCF
		accel: 0
	},

	clearCent : function () {
		const radius_entry = {dim:"", value:""},
				speed_entry = {dim:"", value:""},
				settings = this.settings;

		settings.radius = settings.angVel = settings.RCF = settings.accel = 0;
		radius_entry.dim = radius_entry.value = speed_entry.dim =
			speed_entry.value = "";
		document.getElementById("radius-type-header")!.style.display = "none";
		document.getElementById("selected-rotor")!.style.display = "none";
	},


	setCentFactor : function (obj: HTMLInputElement) {
		const update_radbutt: HTMLInputElement =
			(document.getElementById("centform") as HTMLFormElement)!.elements.namedItem("updatefactor") as HTMLInputElement;
		let last_entry = 0;    // 1=radius, 2=speed, 3=RCF
		if (obj.name == "rotorradius") {
			if (isValidFloat(obj.value) == false) {
				replaceSpanText("centerror",
						"Value of radius must be a positive real number", this.xmlDocument);
				document.getElementById("radiuserror")!.style.borderColor = "red";
				return;
			}
			else
				document.getElementById("radiuserror")!.style.borderColor = "";
			if (last_entry == 2) // speed
				setCheckedInput(update_radbutt, "rcf");
			else if (last_entry == 3) // rcf
				setCheckedInput(update_radbutt, "speed");
			last_entry = 1;
		} else if (obj.name == "angularvel") {
			if (isValidFloat(obj.value) == false) {
				replaceSpanText("centerror",
					"Value of rotor speed must be a positive real number", this.xmlDocument);
				document.getElementById("speederror")!.style.borderColor = "red";
				return;
			}
			else
				document.getElementById("speederror")!.style.borderColor = "";
			if (last_entry == 1) // radius
				setCheckedInput(update_radbutt, "rcf");
			last_entry = 2;
		} else if (obj.name == "RCF") {
			if (isValidFloat(obj.value) == false) {
				replaceSpanText("centerror",
						"Value of RCF must be a positive real number", this.xmlDocument);
				document.getElementById("rcferror")!.style.borderColor = "red";
				return;
			} else
				document.getElementById("rcferror")!.style.borderColor = "";
			if (last_entry == 1) // radius
				setCheckedInput(update_radbutt, "speed");
			else if (last_entry == 2) // speed
				setCheckedInput(update_radbutt, "radius");
			last_entry = 3;
		}
	},


	/* calculations:
		ang velocity = # radians per unit time
		velocity = 2 * pi * radius * ang velocity
		ang accel = velocity * velocity / radius;
		RCF = ang accel / gravity accel constant
		radius = velocity * velocity / (RCF * gravity accel constant) */

	centCalc : function () {
		const	GRAVITY_CM_PER_SQ_SEC = 981.0,  // cm/s^2
			RAD_PER_REV = 2 * Math.PI,
			SEC_PER_MIN = 60,
			CM_PER_INCH = 2.54
		let factor2update,
			//accel,
			AV,
			radius;

		const CentForm = document.getElementById("centform")! as HTMLFormElement;
		factor2update = (CentForm as HTMLFormElement).elements["updatefactor"].value;
		const RCF = CentForm.RCF.value;
		AV = CentForm.angularvel.value;
		const speedim = getCheckedInput(CentForm.speedim);
		const radiusdim = getCheckedInput(CentForm.radiusdim);
		radius = CentForm.rotorradius.value;
		if (typeof(factor2update) == "undefined") {
			if (radius.length > 0 && AV.length > 0)
				factor2update = "rcf";
			else if (radius.length > 0)
				factor2update = "speed";
			else
				factor2update = "radius";
		}
		if (speedim == "rpm")
			AV *= RAD_PER_REV / SEC_PER_MIN;
		else if (speedim == "rps")
			AV *= RAD_PER_REV;
		if (radiusdim == "in")
			radius *= CM_PER_INCH;

		if (factor2update == "rcf")
			CentForm.RCF.value = (AV * AV * radius)/ GRAVITY_CM_PER_SQ_SEC;
		else if (factor2update == "speed") {
			AV = Math.sqrt(RCF * GRAVITY_CM_PER_SQ_SEC /
						(4 * Math.PI * Math.PI * radius)); // in rad/s
			if (speedim == "rpm")
				CentForm.angularvel.value = AV * SEC_PER_MIN / RAD_PER_REV;
			else if (speedim == "rps")
				CentForm.angularvel.value = AV / RAD_PER_REV;
			else
				CentForm.angularvel.value = AV;
		} else if (factor2update == "radius") {
			radius = AV * AV * 4 * Math.PI * Math.PI / (RCF * GRAVITY_CM_PER_SQ_SEC);
			if (radiusdim == "in")
				radius /= CM_PER_INCH;
			CentForm.rotorradius.value = radius;
		}
		return;
	},

	rotorSelectWindow : {} as Window,
	selectOptions : [] as unknown[],
	selectedRotor : {} as {
		minRadius: number;
		min1Radius: number;
		min2Radius: number;
		avg2Radius: number;
		maxRadius: number;
		max1Radius: number;
		max2Radius: number;
	},

	selectRotor : function () {
		const winFeatures = "menubar=no,personalbar=no,toolbar=no," +
				"resizable=yes,scrollbars=yes,width=" + 16 * 20 +
				",height=" + 16 * 18 +
				",left=" + screen.availWidth * 0.5 + ",top=" + screen.availHeight * 0.5,
			title = "Rotor Selection",
			rotorDatabase = this.rotorDatabase;
		let i, j,

			option: CentrifugeOption,
			rotorSelectWindow = Centrifuge.rotorSelectWindow,
//			manufacturer: string,
			body = "\n<p>\n<select id=\"rotor-select\" size=\"12\" " +
				"style=\"width:15em;margin:2em auto;display:block;\" " +
				"onchange=\"opener.Centrifuge.setRotor(this);\">";
		j = 0;
		for (const rotorDbItem of rotorDatabase)
			if (rotorDbItem.name) {
				this.selectOptions.push(option = {} as CentrifugeOption);
				option["db"] = i;
				option["list"] = j;
	//			option["make"] = manufacturer;
				body += "\n  <option value=\"" + j++ + "\" style=\"padding-left:2em;\">" +
					rotorDbItem.name + "</option>";
			} else if (rotorDbItem.header) {
				body += "\n  <option style=\"font-weight:bold;\">=====" +
					rotorDbItem.header + "=====</option>";
//				manufacturer = rotorDbItem.header;
			}
		body += "\n</select>";
		if (rotorSelectWindow)
			rotorSelectWindow.focus();
		else
			rotorSelectWindow = plainWindow(
					winFeatures, // menubar, personalbar, etc
					{
						winTitle: title,
						body: body,
						closeButton: false
					}
			) as Window;
		window.addEventListener("unload", function () {
			if (Centrifuge.rotorSelectWindow)
				Centrifuge.rotorSelectWindow.close()
		}, false);
	},


	setRotor : function (selectElem: HTMLSelectElement) {
		const selectOptions = this.selectOptions,
			rotorDatabase = this.rotorDatabase,
			form = document.getElementById("centform")!,
			selectedRotorNode = document.getElementById("selected-rotor")!,
			radiusTypesNode = document.getElementById("radius-types")!,
			radiusHeaderNode = document.getElementById("radius-header")!;

		let i,
			value,
			radius;

		if ((value = selectElem.options[selectElem.selectedIndex].value).length > 0)
			for (i = 0; i < selectOptions.length; i++)
				if (value == selectOptions[i].list)
					break;
		this.selectedRotor = rotorDatabase[selectOptions[i].db];
		if (this.selectedRotor.avgRadius) {
			radius = this.selectedRotor.avgRadius;
			radiusHeaderNode.replaceChild(document.createTextNode("Average Radius"),
					radiusHeaderNode.firstChild as ChildNode);
		} else if (this.selectedRotor.avg1Radius) {
			radius = this.selectedRotor.avg1Radius;
			radiusHeaderNode.replaceChild(document.createTextNode("First Average Radius"),
					radiusHeaderNode.firstChild as ChildNode);
		}
		if (this.selectedRotor.units == "cm")
			radius *= 10;
		else if (this.selectedRotor.units == "in")
			radius *= 25.4;
		(document.getElementById("rotorradius") as HTMLInputElement)!.value = radius.toFixed();
		(form as HTMLFormElement).elements["radiusdim"].value = "mm";
		selectedRotorNode.replaceChild(document.createTextNode(
					selectOptions[i].make +	" " + this.selectedRotor.name),
					selectedRotorNode.firstChild as ChildNode);
		document.getElementById("selected-rotor")!.style.display = "table-cell";
		document.getElementById("radius-type-header")!.style.display = "table-cell";
		// first clear all nodes in radius-types DOM node (td)
		while (radiusTypesNode.firstChild)
			radiusTypesNode.removeChild(radiusTypesNode.firstChild);
		if (this.selectedRotor.minRadius)
			this.createRadioNode("minRadius", "Minimum Radius", true);
		if (this.selectedRotor.min1Radius)
		this.createRadioNode("min1Radius", "First Minimum Radius", true);
		if (this.selectedRotor.min2Radius)
		this.createRadioNode("min2Radius", "Second Minimum Radius", true);
		if (this.selectedRotor.avg2Radius)
		this.createRadioNode("avg2Radius", "Second Average Radius", true);
		if (this.selectedRotor.maxRadius)
		this.createRadioNode("maxRadius", "Maximum Radius", true);
		if (this.selectedRotor.max1Radius)
		this.createRadioNode("max1Radius", "First Maximum Radius", true);
		if (this.selectedRotor.max2Radius)
		this.createRadioNode("max2Radius", "Second Maximum Radius", true);
	},

	createRadioNode: function (
		nodeVal: string,
		text: string,
		insertBreak: boolean
	) {
		const radiusTypesElem = document.getElementById("radius-type")!;
		let inputElem: HTMLInputElement;
		if (insertBreak == true)
			radiusTypesElem.appendChild(document.createElement("br"));
		else
			insertBreak = true;
		radiusTypesElem.appendChild(inputElem = document.createElement("input"));
		inputElem.type = "radio";
		inputElem.name = "radiusType";
		inputElem.value = nodeVal;
		radiusTypesElem.appendChild(document.createTextNode(text));
		radiusTypesElem.addEventListener("change", this.changeRadius, false);
	},

	chk_box : function (obj: HTMLInputElement) {
		if (this.chk_key() == true)
			return true;
		if (obj.value.search(/< 0/) == 0 || obj.value.search(/\?{5}/) == 0) {
			obj.value = "";
			obj.style.color = "black";
		}
		return true;
	},

	showCentHelp : function (set: "show") {
		if (set == "show") {
			document.getElementById("instructions")!.style.visibility = "visible";
			window.location.href = location.protocol + location.host + "#centinstruct";
		} else { // hide
			document.getElementById("instructions")!.style.visibility = "hidden";
			window.location.href = location.protocol + location.host + "#document-title";
		}
	},

	intervalID : undefined,

	showAvgradHelp : function (set: "show") {
		if (set == "show") {
			clearInterval(this.intervalID);
			document.getElementById("avgradiushelp")!.style.visibility = "visible";
			window.location.href = location.protocol + location.host + "#radiushelp";
		} else { // hide
			document.getElementById("avgradiushelp")!.style.visibility = "hidden";
			window.location.href = location.protocol + location.host + "#document-title";
		}
	},


	defaultForm : undefined,

	write_centrifuge : function () {
		if (!this.defaultForm)
			this.defaultForm = document.getElementById("centform")!
		document.getElementById("mainmenu-page")!.style.display = "none";
		document.getElementById("centrifuge-page")!.style.display = "block";
		this.defaultForm.reset();
		this.intervalID = setInterval(this.setHeaderColor, 500);
	},

	highlight : false,
	headerSetColor : "",
	changeCount : 0,

	setHeaderColor : function () {
		const header = document.getElementById("avgradheader")!
		if (++this.changeCount == 8) {
			clearInterval(this.intervalID);
			header.style.color = this.headerSetColor;
			return;
		}
		if (this.highlight == false) {
			this.headerSetColor = header.style.color;
			header.style.color = "red";
			this.highlight = true;
			return;
		}
		header.style.color = this.headerSetColor;
		this.highlight = false;
		return;
	}
};

Centrifuge.init();

export default Centrifuge;