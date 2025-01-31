"use strict";

/********************************************************
 * Reads in HTML and CSS files, makes changes to HEAD section 
 * to produce static page with no javascript, and leave 
 * 
 * 
 *******************************************************/

import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import {deleteSync} from "del";
import util from "util";

import delImportExportStmts from "./importExportStmtEdit.js";
import contentBuilder from "./content-builder.js";

//const projectDirectory = "D:/dev/GitHub Pages Repo/mavigozler.github.io";

// ========================================
const HtmlReadFile = "src/base.html",
	HtmlWriteIndexFile = "gh-pages/index.html",
	HtmlWriteStaticFile = "gh-pages/static.html",
	TsConfigJSCompiledFilesPath = "build/compiledset";

const CSSfiles = [
	{ src: "src/css/elements.css", dest: "gh-pages/elements.css" },
	{ src: "src/css/id-class.css", dest: "gh-pages/id-class.css" },
];
// ==========================================
const CopyFiles = [
	{ src: `${TsConfigJSCompiledFilesPath}/content-builder.js`, dest: "./gh-pages/content-builder.js" },
	{ src: `${TsConfigJSCompiledFilesPath}/tutor-posting.js`, dest: "./gh-pages/tutor-posting.js" },
	{ src: "./src/config.json", dest: "./gh-pages/config.json" }
];

const copyOp = util.promisify(fs.copyFile);

deleteSync("gh-pages/*");

function main() {
	processHtml();
	processCss();
	copyFiles();
}

function processHtml(): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.readFile(HtmlReadFile, "utf8", (err, content) => {
			if (err)
				reject(console.log(`Failed to create file '${HtmlReadFile}'` +
						`\nErr: ${JSON.stringify(err, null, "  ")}`));
			else {
				console.log(`File '${HtmlReadFile}' opened successfully for reading`);
				const dom = new JSDOM(content);
				// Execute JavaScript to modify the DOM
				const window = dom.window;
				const document = window.document;
				const noScriptDiv = document.getElementById("noscript-sect");
				noScriptDiv?.parentNode?.removeChild(noScriptDiv);
				contentBuilder(document);
				// Save final HTML
				fs.writeFile(HtmlWriteStaticFile, dom.serialize(), (err) => {
					if (err)
						reject(console.log(`Failed to create file '${HtmlWriteStaticFile}'` +
						`\nErr: ${JSON.stringify(err, null, "  ")}`));
					else {
						console.log(`File '${HtmlWriteStaticFile}' written successfully`);
						fs.readFile(HtmlReadFile, "utf8", (err, content) => {
							console.log(`File '${HtmlReadFile}' opened successfully for reading`);
							const dom = new JSDOM(content);
							// Execute JavaScript to modify the DOM
							const window = dom.window;
							const document = window.document;

							const headElem = document.getElementsByTagName("head")![0];
							let scriptElem = document.createElement("script");
							headElem.appendChild(scriptElem);
							headElem.appendChild(document.createTextNode("\n"));
							scriptElem.src = "content-builder.js";
							scriptElem = document.createElement("script");
							headElem.appendChild(scriptElem);
							headElem.appendChild(document.createTextNode("\n"));
							scriptElem.src = "tutor-posting.js";

							const bodyElem = document.getElementsByTagName("body")![0];
							const switchThemeButton = document.createElement("button");
							bodyElem.insertBefore(switchThemeButton, bodyElem.firstChild || null);
							bodyElem.insertBefore(document.createTextNode("\n"), bodyElem.firstChild || null);
							switchThemeButton.id = "theme-switcher";
							switchThemeButton.appendChild(document.createTextNode("Switch Theme"));
							const devicePropsTable = document.createElement("table");
							bodyElem.insertBefore(devicePropsTable, bodyElem.firstChild || null);
							bodyElem.insertBefore(document.createTextNode("\n"), bodyElem.firstChild || null);
							devicePropsTable.id = "deviceprops";
							fs.writeFile(HtmlWriteIndexFile, dom.serialize(), (err) => {
								if (err)
									reject(console.log(`Failed to create file '${HtmlWriteIndexFile}'` +
										`\nErr: ${JSON.stringify(err, null, "  ")}`));
								else {
									console.log(`File '${HtmlWriteIndexFile}' written successfully`);
									resolve();
								}
							});
						});

					}
				});
			}
		});
	})
}

function processCss(): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const processOp: Promise<string>[] = [];
		for (const cssFile of CSSfiles)
			processOp.push(new Promise<string>((resolve, reject) => {
				fs.readFile(cssFile.src, "utf8", (err, content) => {
					if (err)
						console.log(err);
					else {
						console.log(`File '${cssFile.src}' opened successfully for reading`);
						postcss([autoprefixer, cssnano])
						.process(content, { from: undefined })
						.then(result => {
							fs.writeFile(cssFile.dest, result.css, (err) => {
								if (err)
									reject(err);
								else {
									resolve(`File '${cssFile.dest}' written successfully`);
								}
							});
						});
					}
				});
			}));
		Promise.all(processOp).then((responses: string[]) => {
			console.log(responses.join("\n"));
			resolve();
		}).catch((err) => {
			reject(console.log(`Failed promise caught: ${err}`));
		});
	});
}

function copyFiles(): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const processOp: Promise<string>[] = [];
		for (const copyFile of CopyFiles)
			processOp.push(new Promise<string>((resolve, reject) => {
				copyOp(copyFile.src, copyFile.dest)
				.then((response) => {
					resolve(`File '${path.basename(copyFile.src)}' copied`);
				}).catch((err) => {
					reject(`File '${path.basename(copyFile.src)}' copied\nErr: ${JSON.stringify(err, null, "  ")}`);
				});
			}));
		Promise.all(processOp).then((responses: string[]) => {
			console.log(responses.join("\n"));
			delImportExportStmts(CopyFiles.map(elem => elem.dest), true);
			resolve();
		}).catch((err) => {
			reject(console.log(`Failed promise caught: ${err}`));
		});

	});
}

main();