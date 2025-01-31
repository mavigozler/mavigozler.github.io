"use strict";
/*****************************************************************
 * determines capabilities of device (desktop, mobile) to format display
 * - includes functions to determine device properties
 * - includes contentBuilder() to customize content for static pages
 *****************************************************************/

const CSSvalueRE = /(\-?\d+\.?(\d+)?)([a-z]{2})?/;
const InitialStyleRules = {
    "h1": {
        "fontSize": [null, "0.33 (14pt)"] // format "number, (min-value)?"
    },
    "h2": {
        "fontSize": [null, "0.33 (11pt)"]
    },
    "h3": {
        "fontSize": [null, "0.33 (9pt)"]
    },
    "h4": {
        "fontSize": [null, "0.33 (8pt)"]
    },
    "#container": {
        "width": [null, "auto"]
    },
    "body": {
        "fontSize": [null, "0.33 (11pt)"]
    },
    "table#rates": {
        "width": [null, "auto"]
    }
};
function populateDevicePropertiesTable(checkedProperties) {
    const devicePropertiesTable = document.getElementById("deviceprops");
    while (devicePropertiesTable.firstChild)
        devicePropertiesTable.removeChild(devicePropertiesTable.firstChild);
    for (const item in checkedProperties) {
        const tr = document.createElement("tr");
        devicePropertiesTable.appendChild(tr);
        const th = document.createElement("th");
        tr.appendChild(th);
        th.appendChild(document.createTextNode(item));
        const td = document.createElement("td");
        tr.appendChild(td);
        td.appendChild(document.createTextNode(typeof checkedProperties[item] == "string" ? checkedProperties[item] :
            (typeof checkedProperties[item] == "number" ? checkedProperties[item].toString() :
                (typeof checkedProperties[item] == "boolean" ? checkedProperties[item].toString() :
                    (checkedProperties[item] == null ? "null" : "unknown")))));
    }
}
function getCurrentDeviceProperties() {
    const currentDeviceProperties = {
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
        deviceRAM: navigator.deviceMemory || -1,
        networkConnection: {
            effectiveType: navigator.connection?.effectiveType,
            saveData: navigator.connection?.saveData,
            type: navigator.connection?.type,
            downlink: navigator.connection?.downlink,
            downlinkMax: navigator.connection?.downlinkMax
        },
        batteryStatus: {
            level: -1,
            charging: false,
            chargingTime: -1,
            dischargingTime: -1
        },
        vendor: navigator.vendor,
        platform: navigator.platform,
        product: navigator.product
        // mediaCapabilities: navigator.mediaCapabilities.decodingInfo as MediaCapabilities,
    };
    navigator.getBattery ? navigator.getBattery().then(function (response) {
        currentDeviceProperties.batteryStatus = response;
    }).catch((err) => {
        console.log(err);
    }) : null;
    return currentDeviceProperties;
}
function reconfigureCssRule(cssRule, cssPropName) {
    let reconfigRule = cssRule;
    let ruleMatch;
    switch (cssPropName) {
        case "font-size":
            ruleMatch = cssRule.match(/font:\s*([^\s]+)?\s+(\d+[^\s]+)\s+([^;]+);/);
            if (ruleMatch)
                reconfigRule = cssRule.replace(/font:[^;]+;/, (ruleMatch[1] ? `font-style: ${ruleMatch[1]};` : "") +
                    `font-size: ${ruleMatch[2]}; font-family: ${ruleMatch[3]};`);
            break;
    }
    return reconfigRule;
}
function cssMath(cssValue1, cssValue2, op) {
    try {
        const cssVal1parse = cssValue1.match(CSSvalueRE);
        let cssVal2parts;
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
        }
        else
            cssVal2parts = {
                numerical: cssValue2,
                dimension: null
            };
        // now the math
        let result;
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
            throw new Error("Invalid CSS value parsing");
        return result;
    }
    catch (error) {
        return null;
    }
}
function mediaAdjustments(action) {
    let propValue;
    for (const item in InitialStyleRules) {
        for (const sheet of document.styleSheets)
            for (let idx = 0; idx < sheet.cssRules.length; idx++)
                if (sheet.cssRules[idx].cssText.search(item) >= 0) {
                    const ruleValue = sheet.cssRules[idx].cssText.match(/\{[^\}]+\}/)[0];
                    for (const prop in InitialStyleRules[item]) {
                        const cssPropName = prop.replace(/([a-z])([A-Z])/, (_, p1, p2) => `${p1}-${p2.toLowerCase()}`);
                        const propRegex = new RegExp(cssPropName + ":([^;]+);");
                        let reconfiguredCssRule = reconfigureCssRule(ruleValue, cssPropName);
                        let propNameMatch = ruleValue.match(propRegex);
                        // propNameMatch: 'font-size: 13pt;'
                        if (propNameMatch == null) {
                            // create 'font-size' value from 'font'
                            if (reconfiguredCssRule) {
                                propNameMatch = reconfiguredCssRule.match(propRegex);
                                if (propNameMatch == null) // doesn't exist: get computed value
                                    propValue = window.getComputedStyle(document.querySelector(item))[cssPropName];
                                else // exists, so actually make 'font-size:13pt;'
                                    propValue = propNameMatch[1].trim();
                            }
                            else // no reconfigure from 'font' so get a computed value
                                propValue = window.getComputedStyle(document.querySelector(item))[cssPropName];
                        }
                        else // found, so get the value for Initial
                            propValue = propNameMatch[1];
                        if (action == "initialize") {
                            if (Array.isArray(InitialStyleRules[item][prop]) == true && InitialStyleRules[item][prop].length == 2)
                                InitialStyleRules[item][prop][0] = propValue.trim();
                            else
                                InitialStyleRules[item][prop] = propValue;
                        }
                        else {
                            let adjustValue;
                            if (Array.isArray(InitialStyleRules[item][prop]) == true && InitialStyleRules[item][prop].length == 2)
                                if (isDeviceSmall == true)
                                    adjustValue = adjustCssValue(InitialStyleRules[item][prop]);
                                else
                                    adjustValue = InitialStyleRules[item][prop][0];
                            else
                                adjustValue = InitialStyleRules[item][prop];
                            let newRuleValue, targetProp = ruleValue.match(propRegex);
                            if (targetProp == null && reconfiguredCssRule)
                                targetProp = reconfiguredCssRule.match(propRegex);
                            if (targetProp == null) // property was never set
                                newRuleValue = item + (reconfiguredCssRule = ruleValue).replace(/\}\s*$/, `${cssPropName}: ${adjustValue};}`);
                            else
                                newRuleValue = `${item} ` + (reconfiguredCssRule || ruleValue).replace(new RegExp(cssPropName + ":\\s*" + targetProp[1]), cssPropName + ": " + adjustValue);
                            console.log(`old rule value: '${item} ${reconfiguredCssRule}'`);
                            console.log(`new rule value: '${newRuleValue}'`);
                            sheet.deleteRule(idx);
                            sheet.insertRule(newRuleValue, idx);
                        }
                    }
                }
    }
}
function adjustCssValue(adjustParam) {
    const POINTS_TO_PIXELS = 1.333;
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
        let adjustment = cssMath(adjustParam[0], valueParse[1], "x");
        if (adjustment != null) {
            const adjustmentVal = adjustment.match(CSSvalueRE);
            if (parseFloat(adjustmentVal[1]) < parseFloat(valueParse[6]))
                adjustment = valueParse[6] + valueParse[8];
            return adjustment;
        }
    }
    return adjustParam[0];
}
let isDeviceSmall;
document.addEventListener("DOMContentLoaded", () => {
    const viewportWidthCutoff = window.matchMedia('(max-width: 500px)').matches ? 500 : 768;
    //const viewportWidthCutoff = 500; // px
    const checkDeviceSize = () => {
        return getCurrentDeviceProperties().viewportWidth < viewportWidthCutoff;
    };
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
        // Use your config data
        const showDeviceProperties = config;
        mediaAdjustments("initialize");
        // Object.assign(_DeviceProperties, currentDeviceProperties);
        window.addEventListener("resize", () => {
            isDeviceSmall = checkDeviceSize();
            const deviceProperties = getCurrentDeviceProperties();
            console.log(`\nDevice resize occurred to 'viewport width' = ${deviceProperties.viewportWidth}px` +
                `\nDevice size is ${isDeviceSmall == true ? "small (mobile?)" : "normal/large"}`);
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
            }
            else /*
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
        contentBuilder(document);
    }).catch(error => {
        console.error('Error fetching config:', error);
    });
});
//# sourceMappingURL=tutor-posting.js.map