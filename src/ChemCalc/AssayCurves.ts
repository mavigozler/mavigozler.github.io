
/*************************************************************************
      <!--  Assay Code -->
 *************************************************************************/
/* insert eslint DISABLING for compiled JS here */

/*jslint devel: true, bitwise: false, browser: true, continue: true,
		sloppy: true, eqeq: true, windows: true, white: true, plusplus: true,
		maxerr: 200, indent: 4 */
/* global ChemController: false, Parametrics: false, TableTypeObject: false,
		Table: false, Libgen: false,  ChemCalcPageProperties: false */

import { ChemController } from "./ModuleController";
import { makeSelectList } from "../GenLib/html-dom";

const AssayCurveFit = {

	moduleId: "AssayCurves",

	init : function () {
		if (typeof ChemController === "object")
			ChemController.registerModule(this.moduleId, this);
      (document.getElementById("assay-form") as HTMLFormElement)!.reset();
	},

	activate : function () {
		document.getElementById("assay-page")!.style.display = "block";
	},

	finishDocument :  function() {
      const selAttribs = [
         "id=unkown-select",
         "onchange=AssayCurveFit.interfaceAssayTable(this);",
      ];
      const optAttribs = null;
      const optVals = [
         "0",
      ];
      const optTexts = [
         "Select...",
      ];
		for (let i = 1; i <= AssayCurveFit.MAX_COUNT_DATASET_VALUES; i++) {
         optTexts.push(i.toString());
         optVals.push(i.toString());
		}
		const selNode = makeSelectList(selAttribs, optVals, optTexts, optAttribs);
      document.getElementById("unknown-select-inline")!.appendChild(selNode!);
   },

	fitLineOnData : function (
		x_values: number[],
		y_values: number[],
		polynomial: number
	) {
		const
			x_params = new Parametrics(x_values),
			y_params = new Parametrics(y_values),
			fitdata = {};
		let i,
			fit_y,
			covar = 0.0,
			sum_xy = 0.0,
			diff;

		for (i = 0; i < x_values.length; i++) {
			sum_xy += x_values[i] * y_values[i];
			covar += (x_values[i] - x_params.mean) * (y_values[i] - y_params.mean);
		}
		covar /= (x_params.count - 1);
		fitdata.pearson = covar / (x_params.stdev * y_params.stdev);
		if (fitdata.pearson > 1.0 || fitdata.pearson + 1e-7 >= 1.0)
			fitdata.pearson = 1.000000000;
		else if (fitdata.pearson < -1.0 || fitdata.pearson - 1e-7 <= -1.0)
			fitdata.pearson = -1.000000000;
		fitdata.correl = fitdata.pearson;
		fitdata.slope = (sum_xy - x_params.sum * y_params.sum / x_params.count) /
				(x_params.sum_squares - x_params.sum * x_params.sum / x_params.count);
		fitdata.intercept = y_params.mean - fitdata.slope * x_params.mean;
		fitdata.fitted_y_values = [];
		fitdata.sumsq_residuals = 0.0;
		for (i = 0; i < x_params.count; i++) {
			fit_y = fitdata.slope * x_values[i] + fitdata.intercept;
			diff = fit_y - y_values[i];
			fitdata.fitted_y_values.push(fit_y);
			fitdata.sumsq_residuals += diff * diff;
		}
		fitdata.sumsq_regression = y_params.sum_squares - fitdata.sumsq_residuals;
		fitdata.r2 = fitdata.sumsq_regression / y_params.sum_squares;
		if (polynomial == 2) {
			// need to do something about this

		}
		return fitdata;
	},

	MAX_COUNT_DATASET_VALUES : 25,
	xData : undefined,
	yData : undefined,
	currentDatasetCount : 0,

	setTableRows : function (tableObj, count) {
		/* nonstandard attributes of the table node used:
		   row=current count of table rows
			col=current count of datasets
			startEntryTD=<row>,<col>  row and col of the first entry TD */
		const  classAttributeName = ChemCalcPageProperties.classAttributeName,
			StdCurveTableObj = AssayCurveFit.StdCurveTableObj,
			UnknownsTableObj = AssayCurveFit.UnknownsTableObj,
			tBody = tableObj.tbody;

		let i,
			node,
			node2,
			rowNumber,
			cellNumber,
			inputCol1,
			inputCol2,
			idPrefix1,
			idPrefix2;

		if (typeof(tableObj) == "undefined" || typeof(tableObj.type) == "undefined" ||
					tableObj.type != "tableObject")
			return false;
		if (tableObj.getNode("tbody") == null)
			tableObj.addTableSection("tbody");
		// if the current count of rows is < current table rows
		if (count < tBody.rowCount)
			for (i = count; i < tBody.rowCount; i++)
				tableObj.deleteRow(tBody, tBody.rowNodes[i]);
		else { // rows need to be added
			node = document.createElement("input");
			node.setAttribute("type", "text");
			node.setAttribute("size", "12");
			node.setAttribute("maxlength", "12");
			node.setAttribute("onchange", "AssayCurveFit.interfaceAssayTable(this);");
			if (tableObj == StdCurveTableObj) {
				inputCol1 = [ classAttributeName + "=X-DataVal" ];
				inputCol2 = [ classAttributeName + "=Y-DataVal" ];
				idPrefix1 = "std-x-";
				idPrefix2 = "std-y-";
			} else if (tableObj == UnknownsTableObj) {
				inputCol1 = [ classAttributeName + "=Y-Unknown" ];
				idPrefix1 = "unknown-y-";
				idPrefix2 = "unknown-x-";
			}
			for (i = tBody.rowCount; i < count; i++) {
				// add serial number row
				rowNumber = tableObj.appendRow(
						[ classAttributeName + "=entryrow" ], tBody);
				cellNumber = tableObj.appendCell(rowNumber, TableTypeObject.CELL_TYPE.TD,
								[ classAttributeName + "=entrynum" ], tBody);
				tableObj.setCellContent(rowNumber, cellNumber,
								document.createTextNode(String(i + 1)), false, tBody);
		// 1st column
				node = node.cloneNode(true);
				node.setAttribute("id", idPrefix1 + (String(i).length < 2 ? "0" : "") +
						(i + 1));
				cellNumber = tableObj.appendCell(rowNumber, TableTypeObject.CELL_TYPE.TD,
									inputCol1, tBody);
				tableObj.setCellContent(rowNumber, cellNumber, node, false, tBody);
		// 2nd column
				if (tableObj == StdCurveTableObj) {
					node = node.cloneNode(true);
					node.setAttribute("id", idPrefix2 + (String(i).length < 2 ? "0" : "") +
							(i + 1));
					cellNumber = tableObj.appendCell(rowNumber, TableTypeObject.CELL_TYPE.TD,
							inputCol2, tBody);
					tableObj.setCellContent(rowNumber, cellNumber, node, false, tBody);
				} else {
					cellNumber = tableObj.appendCell(rowNumber, TableTypeObject.CELL_TYPE.TD,
							null, tBody);
					node2 = tableObj.getCellDOMNode(tBody, rowNumber, cellNumber);
					node2.setAttribute("id", idPrefix2 + (String(i).length < 2 ? "0" : "") +
							(i + 1));
					node2.setAttribute(classAttributeName, "X-Unknown");
				}
			}
		}
		return true;
	},

	StdCurveTableObj : undefined,
	UnknownsTableObj : undefined,

	interfaceAssayTable : function (obj) {
		let i,
			tdElem, trElem,
			node,
			set,
			tableDOMnode,
			newDatasetCount,
			DatasetValues,
			tableRows,
			slope,
			intercept,
			xRange, yRange,
			xData = AssayCurveFit.xData,
			yData = AssayCurveFit.yData,
			xVal, yVal, idx,
			X, Y, Yseed,
			exp,
			step,
			Example_xData = [
				/* array1 */ [ 0, 1, 2, 3, 4, 5, 6 ],
				/* array2 */ [ 0, 250, 500, 750, 1000 ],
				/* array3 */ [ 250, 500, 750, 1000 ]
			],
			Example_yData = [
				/* array1 */ [ 0, 2, 4, 6, 8, 10, 12 ],
				/* array2 */ [ 0.000, 0.397, 0.633, 0.787, 1.021 ],
				/* array3 */ [ 0.397, 0.633, 0.787, 1.021 ]
			],
			setString,
			lineFitInfo,
			fittedY,
			lowExp,
			highExp,
			thead, tbody, docFrag,
			cellNumber,
			displayVal,
			boxVal,
			selVal,
			currentTableDataRows,
			tablePropertyValue = ChemCalcPageProperties.tablePropertyValue,
			currentDatasetCount = AssayCurveFit.currentDatasetCount,
			StdCurveTableObj = AssayCurveFit.StdCurveTableObj,
			UnknownsTableObj = AssayCurveFit.UnknownsTableObj,
			getRandom = Libgen.getRandom,
			getCheckedInput = Libgen.getCheckedInput,
			setSigDigits = Libgen.setSigDigits,
			delimFPREglob = /[\-\+]?([0-9]*\.)?[0-9]+([eE][\-\+]?[0-9]+)?[\s,]+/g;

		if (typeof StdCurveTableObj == "undefined")
			StdCurveTableObj = new Table("stdcurve-table");
		tableRows = StdCurveTableObj.getRowCount(StdCurveTableObj.tbody);
		tableDOMnode = StdCurveTableObj.getDOMnode();
		if (typeof UnknownsTableObj == "undefined")
			UnknownsTableObj = new Table("unknown-table");
		if (obj.id == "paircounts-select" || obj.id == "paircounts") {
			if (obj.id == "paircounts-select") {
				if (obj.options[obj.selectedIndex].value.search(/^More/) >= 0) {
					obj.style.display = "none";
					document.getElementById("paircounts-text")!.style.display = "inline";
					return;
				}
				newDatasetCount = Number(obj.options[obj.selectedIndex].value);
			}
			else if (obj.value.search(/^\d+$/) < 0)
				throw("an integer less than 50 is required");
			else
				newDatasetCount = Number(obj.value);
			if (newDatasetCount < (currentTableDataRows = StdCurveTableObj.getRowCount()))
				if (window.confirm("This dataset currently makes " +
						currentTableDataRows + " entries available, and will be reduced " +
						"to " + newDatasetCount + " entries.  Any data entered beyond " +
						"entry #" + newDatasetCount + " will be lost.  OK to proceed?") == false)
					for (i = 1; i < AssayCurveFit.MAXIMUM_DATASET_VALUE_COUNT; i++)
						if (obj.options[i].value == currentTableDataRows) {
						// reset the select object to the previous count
							obj.selectedIndex = i;
							return;
						}
			AssayCurveFit.setTableRows(StdCurveTableObj, newDatasetCount);
			if (currentDatasetCount == 0) // not initialized
				DatasetValues = [];
			document.getElementById("stdcurve-table-entry-help")!.style.display = "";
			document.getElementById("stdcurve-table-box")!.style.display = "";
			tableDOMnode.style.display = tablePropertyValue;
		} else if (obj.nodeName.toLowerCase() == "button") {
			if (obj.firstChild.data == "Enter Values") {
				if (getCheckedInput(obj.form.elements["entry-mode"]) == "manual") {
					document.getElementById("prompt-datapairs")!.style.display = "";
					document.getElementById("import-boxes")!.style.display = "none";
				} else { // imported entry by cut/copy & paste [not manual entry]
					document.getElementById("prompt-datapairs")!.style.display = "none";
					document.getElementById("import-boxes")!.style.display = "";
				}
				document.getElementById("assay-entry-prompt")!.style.display = "none";
			} else if (obj.firstChild.data == "Example Fill") { // when table is showing
				// seed values
				slope = getRandom([-1, 1]) * getRandom(0.3, 5.0);
				intercept = getRandom([-1, 1]) * getRandom(0, 20.0);
				xRange = getRandom(1, 500);
				yRange = getRandom(1, 500);
				X = getRandom([-1, 1]) * getRandom(0, xRange / 2);
				Y = getRandom([-1, 1]) * getRandom(0, yRange / 2);
				step = 1 / tableRows;
				for (i = 0; i < tableRows; i++) {
					X += xRange * getRandom(step * 0.95, step * 1.05);
					exp = getRandom(0, 1);
					if (exp >= 0.3 && exp <= 0.4)
						X = X.toExponential(4);
					Yseed = X * slope + intercept;
					Y = getRandom(Yseed * 0.9, Yseed * 1.1);
					exp = getRandom(0, 1);
					if (exp >= 0.3 && exp <= 0.4)
						Y = Y.toExponential(4);
					idx = (String(i).length < 2 ? "0" : "") + (i + 1);
					document.getElementById("std-x-" + idx).value = X;
					document.getElementById("std-y-" + idx).value = Y;
				}
			} else if (obj.firstChild.data == "Example Entries") { // for import boxes
			  // enter X,Y pairs for examples in separate arrays
				set = getRandom([0, 1, 2]);
				setString = "";
				for (i = 0; i < Example_xData[set].length; i++)
					setString += Example_xData[set][i] + "\n";
				obj.form.elements["xval-entry"].value = setString;
				setString = "";
				for (i = 0; i < Example_yData[set].length; i++)
					setString += Example_yData[set][i] + "\n";
				obj.form.elements["yval-entry"].value = setString;
			} else if (obj.firstChild.data == "Process Values") { // for import boxes
				document.getElementById("import-boxes")!.style.display = "none";
				document.getElementById("stdcurve-table-entry-help")!.style.display = "none";
				if (obj.name == "mantable-process") {
					xData = [];
					yData = [];
					currentDatasetCount = 0;
					for (i = 0; i < tableRows; i++) {
						idx = (String(i).length < 2 ? "0" : "") + (i + 1);
						xVal = document.getElementById("std-x-" + idx).value;
						yVal = document.getElementById("std-y-" + idx).value;
						if ((xVal.length > 0 && isNaN(xVal) == true) ||
								(yVal.length > 0 && isNaN(yVal) == true))
							throw("One or both values of coordinate pair #" + (i + 1) +
								" is an invalid number. No evaluation possible");
						if (xVal.length > 0 && yVal.length > 0) {
							xData.push(Number(xVal));
							yData.push(Number(yVal));
							currentDatasetCount++;
						}
					}
					if (tableRows > currentDatasetCount)
						for (i = currentDatasetCount; i < tableRows; i++)
							StdCurveTableObj.deleteRow(StdCurveTableObj.tbody, i + 1);
				} else { // import boxes
					xData = obj.form.elements["xval-entry"].value.match(delimFPREglob);
					yData = obj.form.elements["yval-entry"].value.match(delimFPREglob);
					if ((xData.length > 0 || yData.length > 0) &&
									xData.length != yData.length)
						throw("There is a mismatch in the count of coordinate pairs." +
								"One or more of your entries is probably not a valid number.");
					AssayCurveFit.setTableRows(StdCurveTableObj, xData.length);
					for (i = 0; i < StdCurveTableObj.getRowCount(); i++) {
						trElem = StdCurveTableObj.getRowDOMNode(StdCurveTableObj.tbody, i + 1);
						if (trElem.getAttribute(ChemCalcPageProperties.classAttributeName) == "entryrow")
							break;
					}
					for (i = 0; i < xData.length; i++) {
						tdElem = trElem.firstChild.nextSibling;
						tdElem.firstChild.value = xData[i] = xData[i].replace(/\s/g, "");
						tdElem.nextSibling.firstChild.value = yData[i] =
									yData[i].replace(/\s/g, "");
						trElem = trElem.nextSibling;
					}
					currentDatasetCount = xData.length;
				}
				lineFitInfo = AssayCurveFit.fitLineOnData(xData, yData, 1);
				fittedY = lineFitInfo.fitted_y_values;
				for (i = 0; i < fittedY.length; i++) {
					if (fittedY[i] == 0.0)
						continue;
					exp = Math.abs(fittedY[i]).log10().toInteger();
					lowExp = lowExp < exp ? lowExp : exp;
					highExp = highExp > exp ? highExp : exp;
				}
				thead = StdCurveTableObj.thead;
				tbody = StdCurveTableObj.tbody;
				StdCurveTableObj.getNode().style.display = ChemCalcPageProperties.tablePropertyValue;
				tdElem = StdCurveTableObj.getCellDOMNode(thead, 1, 3);
				docFrag = StdCurveTableObj.getCellContent(1, 3, true, thead);
				docFrag.insertBefore(document.createElement("br"), docFrag.firstChild);
				docFrag.insertBefore(document.createTextNode("measured"), docFrag.firstChild);
				StdCurveTableObj.setCellContent(1, 3, docFrag, false, thead);
				StdCurveTableObj.appendCell(1, TableTypeObject.CELL_TYPE.TH,
							[ "style=width:6em;" ], thead);
				StdCurveTableObj.setCellContent(1, 4, "fitted<br /><i>y<\/i>", true, thead);
				for (i = 0; i < currentDatasetCount; i++) {
					idx = (String(i).length < 2) ? "0" : "" + (i + 1);
					cellNumber = StdCurveTableObj.appendCell(i + 1, TableTypeObject.CELL_TYPE.TD,
							[ "id=fitted-y-" + idx,
								ChemCalcPageProperties.classAttributeName + "=Fitted-Y-Value" ], tbody);
					if (lowExp > -5 && highExp < 8)
						if (lowExp < 0)
							displayVal = fittedY[i].toFixed(4);
						else if (lowExp > 1)
							displayVal = fittedY[i].toFixed();
						else
							displayVal = fittedY[i].toFixed(1);
					else
						displayVal = fittedY[i].toExponential(4);
					StdCurveTableObj.setCellContent(i + 1, cellNumber, displayVal,
								true, tbody);
				}
				node = document.getElementById("slope")!.
				node.replaceChild(document.createTextNode(
					setSigDigits(lineFitInfo.slope, 6)), node.firstChild);
				StdCurveTableObj.slope = lineFitInfo.slope;
				node = document.getElementById("intercept")!.
				node.replaceChild(document.createTextNode(
					setSigDigits(lineFitInfo.intercept, 6)), node.firstChild);
				StdCurveTableObj.intercept = lineFitInfo.intercept;
				node = document.getElementById("pearson")!.
				node.replaceChild(document.createTextNode(
							lineFitInfo.pearson.toFixed(4)), node.firstChild);
				node = document.getElementById("residual-sum-square")!.
				node.replaceChild(document.createTextNode(setSigDigits(
							lineFitInfo.sumsq_residuals, 4)), node.firstChild);
				node = document.getElementById("regress-sum-square")!.
	         /*	node.replaceChild(document.createTextNode(setSigDigits(
							lineFitInfo.sumsq_regression, 4)), node.firstChild); */
				node.replaceChild(document.createTextNode(setSigDigits(
							lineFitInfo.sumsq_regression, 6)), node.firstChild);
				node = document.getElementById("r2")!.
				node.replaceChild(document.createTextNode(
							lineFitInfo.r2.toFixed(4)), node.firstChild);
				document.getElementById("stdcurve-table-box")!.style.display = "block";
				document.getElementById("stdcurve-report")!.style.display = tablePropertyValue;
				document.getElementById("stdcurve-chart")!.style.display = "";
				document.getElementById("prompt-unknowns")!.style.display = "block";
				document.getElementById("unknowncounts-select")!.style.display = "";
				document.getElementById("unknown-table")!.style.display = tablePropertyValue;
				AssayCurveFit.xData = xData;
				AssayCurveFit.yData = yData;
			}
		} else if (obj.id == "unknowncounts-select") {
			// if user selects 'Select...' then error notice
			// if user selects 'More...', then textbox entry
			if ((selVal = obj.options[obj.selectedIndex].value) == "More...") {
				document.getElementById("unknowncounts-select")!.style.display = "none";
				document.getElementById("unknowncounts-tbox")!.style.display = "";
			}
			else if (selVal == "Select...")
				throw("A number representing the count of places to be created for " +
						"the evaluation of unknowns must be entered");
			else // a number was selected
				AssayCurveFit.setTableRows(UnknownsTableObj, Number(selVal));
		} else if (obj.id == "unknowncounts-tbox") {
			boxVal = obj.options[obj.selectedIndex].value;
			if (boxVal.search(/^\d+$/) < 0 || boxVal.toNumber() <= 0)
				throw("A positively-valued integer representing the count of places " +
						"to be created for the evaluation of unknowns must be entered");
			else
				AssayCurveFit.setTableRows(UnknownsTableObj, Number(boxVal));
		} else if (obj.id.search(/unknown\-y\-/) == 0) { // calculate unknown Y
			node = document.getElementById("unknown-x-" + obj.id.match(/\d+/)[0]);
			removeChildren(node);
			node.appendChild(document.createTextNode(setSigDigits((obj.value -
					StdCurveTableObj.intercept) / StdCurveTableObj.slope, 5)));
		}
		AssayCurveFit.StdCurveTableObj = StdCurveTableObj;
		AssayCurveFit.UnknownsTableObj = UnknownsTableObj;
		AssayCurveFit.currentDatasetCount = currentDatasetCount;
	},

	drawPlot : function () {
		let graphDiv = document.getElementById("assay-graph")!.
			graphObj = document.createElement("object"),
			embedObj = document.createElement("embed");
		graphDiv.appendChild(graphObj);
		graphObj.setAttribute("type", "image/svg+xml");
		graphObj.setAttribute("width", width);
		graphObj.setAttribute("height", height);
		graphObj.setAttribute("data", "filedata");
		embedObj.setAttribute("type", "image/svg+xml");
		embedObj.setAttribute("width", width);
		embedObj.setAttribute("height", height);
		embedObj.setAttribute("src", "sourcefile");
	}

};