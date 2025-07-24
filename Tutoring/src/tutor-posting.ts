"use strict";

/*****************************************************************
 * determines capabilities of device (desktop, mobile) to format display
 * - includes functions to determine device properties
 * - includes contentBuilder() to customize content for static pages
 *****************************************************************/

import type { PostingConfigYamlFile } from "./types.d.ts";
import jsyaml from "js-yaml";

// import { jest, test } from "@jest/globals"
export interface MediaCapabilities {
	type: "file";
   video: {
   	contentType: string; // video/mp4
		width: number;
		height: number;
	};
}

interface BatteryStatus {
   charging: boolean;
   chargingTime: number;
   dischargingTime: number;
   level: number;
   onchargingchange?: () => void;
   onchargingtimechange?: () => void;
   ondischargingtimechange?: () => void;
   onlevelchange?: () => void;
}

interface DeviceProperties {
   viewportWidth: number;
   viewportHeight: number;
   screenWidth: number;
   screenHeight: number;
   screenAvailWidth: number; // Usable width (excluding OS UI)
   screenAvailHeight: number; // Usable height
   screenOrientation: "portrait" | "landscape" | "WTF!"; // "portrait-primary", "landscape-primary" etc
   aspectRatio: number;  // viewportWidth / viewportHeight
   pixelDensity: number;
   colorDepth: number;
   prefersColorScheme: "light" | "dark";
   prefersReducedMotion: boolean;
   pointer: "fine" | "coarse";
	hover: boolean;
	forcedColors: boolean;
	invertedColors: boolean;
	deviceRAM: number | -1;
	networkConnection: NetworkInformation;
	/* {
		effectiveType: "slow-2g" | "2g" | "3g" | "4g" | "5g";
		saveData: boolean; // true = reduced data usage
      type: "bluetooth" | "cellular" | "ethernet" | "none" |
	};
   TS group not implementing */
	batteryStatus: {
		level: number;
		charging: boolean;
      chargingTime: number;
      dischargingTime: number;
   };
   platform: string; // "Win32"
   product: string; // Gecko
   vendor: string; // "Google Inc."
   //mediaCapabilities: MediaCapabilities;
}

const CSSvalueRE = /(\-?\d+\.?(\d+)?)([a-z]{2})?/;

const InitialStyleRules: {[key: string]:
	{ [key: string]:
		string |
		null |
		Array<string | null>
	}
} = {};

export function contentBuilder(config: PostingConfigYamlFile, htmldoc: Document): void {
	const document = htmldoc;
   // base rate calculator for table
   for (const baseRate in config.baseRates) {
      const spanElem = document.getElementById(baseRate);
      spanElem?.replaceChild(document.createTextNode("$" + config.baseRates[baseRate].toString()),
         spanElem.firstChild as ChildNode);
   }
   // calculate group reduction rate
   const rows = document.querySelectorAll("#reduction tr");
   for (let row = 1; row < rows.length; row++) {
      const cols = rows[row].querySelectorAll("td");
      cols[2].appendChild(document.createTextNode("$" + config.DollarReduction[row - 1].toFixed(2)));
      cols[1].appendChild(document.createTextNode(
         (100 - config.DollarReduction[row - 1] / config.DollarReduction[0] * 100).toFixed(0) + "%"
      ));
   }
   document.getElementById("example-base")?.appendChild(
      document.createTextNode("$" + config.DollarReduction[0])
   );
}


function populateDevicePropertiesTable(checkedProperties: {[key: string]: string | number | boolean}): void {
   const devicePropertiesTable: HTMLTableElement | null = document.getElementById("deviceprops") as HTMLTableElement | null;
	if (devicePropertiesTable == null) 
		return;
   while (devicePropertiesTable.firstChild)
      devicePropertiesTable.removeChild(devicePropertiesTable.firstChild);
   for (const item in checkedProperties) {
      const tr = document.createElement("tr")
      devicePropertiesTable.appendChild(tr);
      const th = document.createElement("th");
      tr.appendChild(th);
      th.appendChild(document.createTextNode(item));
      const td = document.createElement("td");
      tr.appendChild(td);
      td.appendChild(document.createTextNode(
         typeof checkedProperties[item] == "string" ? checkedProperties[item] as string :
            (typeof checkedProperties[item] == "number" ? checkedProperties[item].toString() :
            (typeof checkedProperties[item] == "boolean" ? checkedProperties[item].toString() :
            (checkedProperties[item] == null ? "null" : "unknown")))
      ))
   }
}

function getCurrentDeviceProperties(): DeviceProperties {
   const currentDeviceProperties: DeviceProperties = {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      screenWidth: screen.width,
      screenHeight: screen.height,
      screenAvailWidth: screen.availWidth,
      screenAvailHeight: screen.availHeight,
      screenOrientation: window.matchMedia("(orientation:portrait)").matches == true ?
         "portrait" : window.matchMedia("(orientation:landscape)").matches == true ? "landscape" :
         "WTF!", // setting it by matching
      aspectRatio: window.innerWidth / window.innerHeight,
      pixelDensity: window.devicePixelRatio,
      colorDepth: screen.colorDepth,
      prefersColorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches == true ?
         "dark" : "light",
      prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      pointer: window.matchMedia("(pointer:fine)").matches == true ? "fine" : "coarse",
      hover: window.matchMedia("(hover:hover)").matches,
      forcedColors: window.matchMedia("(forced-colors:active)").matches,
      invertedColors: window.matchMedia("(inverted-colors:inverted)").matches,
      deviceRAM: (navigator as any).deviceMemory || -1,
      networkConnection: {
         effectiveType: navigator.connection?.effectiveType,
         saveData: navigator.connection?.saveData,
         type: navigator.connection?.type,
         downlink: navigator.connection?.downlink,
         downlinkMax: navigator.connection?.downlinkMax
      } as NetworkInformation,
      batteryStatus: {
         level: -1,
         charging: false,
         chargingTime: -1,
         dischargingTime: -1
      },
      vendor: (navigator as any).vendor,
      platform: (navigator as any).platform,
      product: (navigator as any).product
      // mediaCapabilities: navigator.mediaCapabilities.decodingInfo as MediaCapabilities,
   };
   (navigator as any).getBattery ? (navigator as any).getBattery().then(function (response: BatteryStatus) {
      currentDeviceProperties.batteryStatus = response;
   }).catch((err: unknown) => {
      console.log(err);
   }) : null;
   return currentDeviceProperties;
}

function reconfigureCssRule(cssRule: string, cssPropName: string): string {
	let reconfigRule: string = cssRule;
	let ruleMatch: RegExpMatchArray | null;
	switch (cssPropName) {
	case "font-size":
		ruleMatch = cssRule.match(/font:\s*([^\s]+)?\s+(\d+[^\s]+)\s+([^;]+);/);
		if (ruleMatch)
			reconfigRule = cssRule.replace(/font:[^;]+;/,
				(ruleMatch[1] ? `font-style: ${ruleMatch[1]};` : "") +
					`font-size: ${ruleMatch[2]}; font-family: ${ruleMatch[3]};`);
		break;
	}
   return reconfigRule;
}

function cssMath(
   cssValue1: string,
   cssValue2: string | number,
   op: "+" | "-" | "x" | "/"
): string | null {
	try {
		const cssVal1parse: RegExpMatchArray | null = cssValue1.match(CSSvalueRE);
		let cssVal2parts: {numerical: number; dimension: string | null;};
		if (cssVal1parse == null)
			return null;
		const cssVal1parts = {
			numerical: parseFloat(cssVal1parse[1]),
			dimension: cssVal1parse[3]
		};
		if (typeof cssValue2 === "string") {
			const cssVal2parse = cssValue2.match(CSSvalueRE);
			if (cssVal2parse == null || (cssVal2parse[3] && cssVal2parse[3] !== cssVal1parts.dimension))
				return null;
			cssVal2parts = {
				numerical: parseFloat(cssVal2parse[1]),
				dimension: cssVal2parse[3]
			};
		} else
			cssVal2parts = {
				numerical: cssValue2,
				dimension: null
			}

		// now the math
		let result: string;
		switch (op) {
		case "+":
			result = `${cssVal1parts.numerical + cssVal2parts.numerical}${cssVal1parts.dimension}`;
			break;
		case "-":
			result = `${cssVal1parts.numerical - cssVal2parts.numerical}${cssVal1parts.dimension}`;
			break;
		case "x":
			result = `${(cssVal1parts.numerical * cssVal2parts.numerical).toFixed(1)}${cssVal1parts.dimension}`;
			break;
		case "/":
			result = `${(cssVal1parts.numerical / cssVal2parts.numerical).toFixed(1)}${cssVal1parts.dimension}`;
			break;
		}
		if (!result)
			throw new Error ("Invalid CSS value parsing");
		return result;
	} catch (error) {
		return null;
	}
}

function mediaAdjustments(action: "initialize" | "adjust"): void {
	let propValue: string;
	for (const item in InitialStyleRules) {
		for (const sheet of document.styleSheets)
			for (let idx = 0; idx < sheet.cssRules.length; idx++)
				if (sheet.cssRules[idx].cssText.search(item) >= 0) {
					const ruleValue = sheet.cssRules[idx].cssText.match(/\{[^\}]+\}/)![0];
						for (const prop in InitialStyleRules[item]) {
							const cssPropName = prop.replace(/([a-z])([A-Z])/, (_, p1, p2) => `${p1}-${p2.toLowerCase()}`);
							const propRegex = new RegExp(cssPropName + ":([^;]+);");
							let reconfiguredCssRule = reconfigureCssRule(ruleValue, cssPropName);
							let propNameMatch = ruleValue.match(propRegex);
							// propNameMatch: 'font-size: 13pt;'
							if (propNameMatch == null) {
								// create 'font-size' value from 'font'
								if (reconfiguredCssRule) {
									propNameMatch = reconfiguredCssRule!.match(propRegex)!;
									if (propNameMatch == null) // doesn't exist: get computed value
										propValue = (window.getComputedStyle(document.querySelector(item)!) as any)[cssPropName];
									else  // exists, so actually make 'font-size:13pt;'
										propValue = propNameMatch[1].trim();
								} else  // no reconfigure from 'font' so get a computed value
								propValue = (window.getComputedStyle(document.querySelector(item)!) as any)[cssPropName];
							} else  // found, so get the value for Initial
								propValue = propNameMatch[1];
							if (action == "initialize") {
								if (Array.isArray(InitialStyleRules[item][prop]) == true && InitialStyleRules[item][prop]!.length == 2)
									(InitialStyleRules[item][prop] as Array<string | null>)[0] = propValue.trim();
								else
									InitialStyleRules[item][prop] = propValue;
								} else {
								let adjustValue: string | null | Array<string | null>;
								if (Array.isArray(InitialStyleRules[item][prop]) == true && InitialStyleRules[item][prop]!.length == 2)
									if (isDeviceSmall == true)
										adjustValue = adjustCssValue(InitialStyleRules[item][prop] as [string, string]);
									else
										adjustValue = InitialStyleRules[item][prop]![0];
								else
									adjustValue = InitialStyleRules[item][prop];
								let newRuleValue: string,
									targetProp = ruleValue.match(propRegex);
								if (targetProp == null && reconfiguredCssRule)
									targetProp = reconfiguredCssRule.match(propRegex);
								if (targetProp == null) // property was never set
									newRuleValue = item + (reconfiguredCssRule = ruleValue).replace(/\}\s*$/, `${cssPropName}: ${adjustValue};}`);
								else
									newRuleValue = `${item} ` + (reconfiguredCssRule || ruleValue).replace(
											new RegExp(cssPropName + ":\\s*" + targetProp![1]),
												cssPropName + ": " + adjustValue);
								console.log(`old rule value: '${item} ${reconfiguredCssRule}'`);
								console.log(`new rule value: '${newRuleValue}'`);
								sheet.deleteRule(idx);
								sheet.insertRule(newRuleValue, idx);
							}
						}
            }
   }
}

function adjustCssValue(adjustParam: [string, string]): string {
	// const POINTS_TO_PIXELS = 1.333;
	const parseRE = new RegExp("\\s*(\\-?(\\d+)?\\.?(\\d+)?)?(\\s\\((" +
				CSSvalueRE.toString().slice(1, -1) + ")\\))?");
	// Group 1 is the first number, Group 5 is all, Grp 6 is number, Grp 8 is dim
	const valueParse = adjustParam[1].match(parseRE);
	if ((valueParse == null || valueParse[0] == "") && adjustParam[1].search(/[ a-z]+/) >= 0)
		return adjustParam[1];
	if (valueParse) {
		if (adjustParam[0].search(/[ a-z]+/) >= 0) {
			if (valueParse[6] && valueParse[8])
				return valueParse[6] + valueParse[8];
			return valueParse[5];
		}
		let adjustment: string | null = cssMath(adjustParam[0], valueParse[1], "x");
		if (adjustment != null) {
			const adjustmentVal = adjustment.match(CSSvalueRE)!;
			if (parseFloat(adjustmentVal[1]) < parseFloat(valueParse[6]))
				adjustment = valueParse[6] + valueParse[8];
			return adjustment;
		}
	}
	return adjustParam[0];
}

let isDeviceSmall: boolean;

// this is the main entry point for the script
//  this TS file also used by 'tunescript.ts' to modify the the 'tutorial-posting.html' file
//  contains function 'contentBuilder()' to customize content for static pages using Node, so
//  the document object may not be present as it's for the browser environment
if (typeof document !== "undefined") {
	document.addEventListener("DOMContentLoaded", () => {
		const viewportWidthCutoff = window.matchMedia('(max-width: 500px)').matches ? 500 : 768;
		//const viewportWidthCutoff = 500; // px
		const checkDeviceSize = () => {
			return getCurrentDeviceProperties().viewportWidth < viewportWidthCutoff;
		};

		fetch('config.yaml')
		.then(response => response.text())
		.then((config$: string) => {
			// Use your config data
			const configFromYaml = jsyaml.load(config$);
			const { showDeviceProperties } = configFromYaml as PostingConfigYamlFile;
			mediaAdjustments("initialize");
			// Object.assign(_DeviceProperties, currentDeviceProperties);
			window.addEventListener("resize", () => {
				isDeviceSmall = checkDeviceSize();
				const deviceProperties = getCurrentDeviceProperties();
				console.log(`\nDevice resize occurred to 'viewport width' = ${deviceProperties.viewportWidth}px` +
						`\nDevice size is ${isDeviceSmall == true ? "small (mobile?)" : "normal/large" }`);
				if (showDeviceProperties == true) {
					populateDevicePropertiesTable({
						"screen height": deviceProperties.screenHeight,
						"screen avail height": deviceProperties.screenAvailHeight,
						"viewport height": deviceProperties.viewportHeight,
						"screen width": deviceProperties.screenWidth,
						"screen avail width": deviceProperties.screenAvailWidth,
						"viewport width": deviceProperties.viewportWidth,
						"aspect ratio": deviceProperties.aspectRatio.toFixed(2)
					});
				} else /*
					console.log(
						`screen height: ${deviceProperties.screenHeight}\n` +
						`screen avail height: ${deviceProperties.screenAvailHeight}\n` +
						`viewport height: ${deviceProperties.viewportHeight}\n` +
						`screen width: ${deviceProperties.screenWidth}\n` +
						`screen avail width: ${deviceProperties.screenAvailWidth}\n` +
						`viewport width: ${deviceProperties.viewportWidth}\n` +
						`aspect ratio: ${deviceProperties.aspectRatio.toFixed(2)}`
					) */
				mediaAdjustments("adjust");
			});
			window.dispatchEvent(new Event("resize"));
			const themeSwitcher = document.getElementById('theme-switcher');
			// Check and apply saved theme preference
			const savedTheme = localStorage.getItem('theme');
			if (savedTheme)
				document.documentElement.setAttribute('data-theme', savedTheme);
			else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
				document.documentElement.setAttribute('data-theme', 'dark');

			// Toggle theme and save preference
			themeSwitcher?.addEventListener('click', () => {
				const currentTheme = document.documentElement.getAttribute('data-theme');
				const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
				document.documentElement.setAttribute('data-theme', newTheme);
				document.documentElement.style.colorScheme = newTheme;
				localStorage.setItem('theme', newTheme);
			});
			contentBuilder(configFromYaml as PostingConfigYamlFile, document);
		}).catch(error => {
			console.error('Error fetching config:', error);
		});
	});
}