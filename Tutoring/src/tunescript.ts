"use strict";

/********************************************************
 * Reads in HTML and CSS files, makes changes to HEAD section 
 * to produce static page with no javascript, and leave 
 * 
 * 
 *******************************************************/
import type { PostingConfigYamlFile, PATH_literal, DomElem } from "./types.d.ts";
import type { NodeFsMulticopyElem, SrcDestCopy } from "./GenLib/fsystemTypes.d.ts";
import { NodeFsMulticopy /*, FileSystemItem*/ } from "./GenLib/fsystem.js";
import { string2RE } from "./GenLib/stringsExtended.js";

import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import { glob } from "glob";
import jsyaml from "js-yaml";
//import {deleteSync} from "del";
// import util from "util";

import delImportExportStmts from "./importExportStmtEdit.js";
import { contentBuilder } from "./tutor-posting.js";
// import { createDeflate } from "zlib";
import { deleteSync } from "del";
//import { get } from "http";

//const projectDirectory = "D:/dev/GitHub Pages Repo/mavigozler.github.io";

// const copyOp = util.promisify(fs.copyFile);

//deleteSync("gh-pages/*");

function norepeatslash(inpath: string): string {
	return inpath.replace(/[\/]+/mg, "/");
}

function fwdSlash(files: string | string[]): string | string[] {
	if (typeof files === "string")
		return norepeatslash(files.replace(/\\/g, "/"));
	return files.map((file) => norepeatslash(file.replace(/\\/g, "/")));
}

function main() {
	readConfigFile().then((config: PostingConfigYamlFile) => {
// verify that paths exist that are defined in config.Aliases and key ending in "_PATH"
		for (const key in config.Aliases)
			if (key.endsWith("_PATH")) { // will be object not string
				const pathInfo = config.Aliases as PATH_literal;
				const pathKey = key as keyof PATH_literal;
				const pathlitobj = pathInfo[pathKey];
				if (!fs.existsSync(pathlitobj.path)) {
					if (pathlitobj.missing === "create")
						fs.mkdirSync(pathlitobj.path, { recursive: true });
					else if (pathlitobj.missing === "error") {
						console.log(`Path '${pathlitobj.path}' does not exist and is required` +
							`\nPlease update config.yaml file with correct path` +
							`\nExiting program`);
						process.exit(1);
					}
				}
			}
		processHtml(config).then(() => {
			console.log("HTML file processing completed successfully");
			processCss(config).then(() => {
				console.log("CSS file processing completed successfully");
				const importExportEditPaths = stringSubstitutions(config.Paths_Sets.ImportExportEditFiles, config);
				delImportExportStmts(importExportEditPaths as string[], true).then(() => {
					copyFiles(config).then(() => {
						setupTesting(config).then(() => {
							console.log("All processing completed successfully");
						}).catch((err: unknown) => {
							console.log(`Error setting up testing folder\nError ${err}`);
						});
					}).catch((err: unknown) => {
						console.log(`Error processing JS files for import/export statements\nError ${err}`);
					});
					console.log("All processing completed successfully");
				}).catch((err: unknown) => {
					console.log(`copyFiles()::Failed promise caught:` +
						`\nError: ${err}`);
					});
			}).catch((err: unknown) => {
				console.log(`processCss()::Failed promise caught:` +
					`\nError: ${err}`);
			});
		}).catch((err: unknown) => {
			console.log(`processHtml()::Failed promise caught: ` + 
				`\nError: ${err}`);
		});
	}).catch((err: unknown) => {
		console.log(`main()::Failed promise caught:` +
			`\nError: ${err}`);
	});
}

function readConfigFile(): Promise<PostingConfigYamlFile> {
	return new Promise<PostingConfigYamlFile>((resolve, reject) => {
		fs.readFile("./src/config.yaml", "utf8", (err, content) => {
			if (err)
				reject(`Failed to read config file` +
					`\nErr: ${JSON.stringify(err, null, "  ")}`);
			else
				resolve(jsyaml.load(content) as PostingConfigYamlFile);
		});
	});
}

function stringSubstitutions(
	targets: {[key: string]: string} | string[], 
	config: PostingConfigYamlFile
): {[key: string]: string} | string[] {
	if (Array.isArray(targets)) {
		const modifiedTargets = [];
		for (const target of targets)
			modifiedTargets?.push(getStringSubsitution(config, target));
		return modifiedTargets;
	}
	const modifiedTargets = { ...targets };
	for (const target in targets)
		modifiedTargets[target] = getStringSubsitution(config, targets[target]);
	return modifiedTargets;
}

function getStringSubsitution(config: PostingConfigYamlFile, ref: string): string {
   const matches = [...ref.matchAll(/%#([^#%]+)#%/g)]; // Find all matches of %#[^#]+#%
	if (matches)
   	for (const match of matches) {
			if (typeof config.Aliases[match[1]] == "string")
				ref = ref.replace(match[0], config.Aliases[match[1]]);
			else if (match[1].endsWith("_PATH")) {
				const pathInfo = config.Aliases as PATH_literal;
				const pathlitobj = pathInfo[match[1] as keyof PATH_literal];
				ref = ref.replace(match[0], pathlitobj.path);
			}
		}
   return ref;
}

/*
readConfigFile().then((config: PostingConfigYamlFile) => {	
	stringSubstitutions(config.Paths_Sets.HTMLfiles, config);
}).catch((err: unknown) => {
	console.log(`Failed promise caught:` +
		`\nError: ${err}`);
});
*/

function getSourceFiles(pathPatterns: string | string[]): Promise<string[]>	 {
	return new Promise<string[]>((resolve, reject) => {
		if (typeof pathPatterns === "string")
			pathPatterns = [pathPatterns];
		const globCalls: Promise<string[]>[] = [];
		for (const pathPattern of pathPatterns) {
			globCalls.push(new Promise((resolve, reject) => {
				// path seperator is / for all OS !
				const modPathPattern = pathPattern.replace(/\\/g, "/");
				glob(modPathPattern).then((result: string[]) => {
					resolve(result);
				}).catch((err: unknown) => {
					reject(err);
				});
			}));
		}
		Promise.all(globCalls).then((results: string[][]) => {
			resolve(results.flat());
		}).catch((err: unknown) => {
			reject(err);
		});
	});
}

function processHtml(config: PostingConfigYamlFile): Promise<void> {
	const htmlFiles = stringSubstitutions(
		config.Paths_Sets.HTMLConfigData.Files, 
		config
	) as {[key: string]: string;};
	return new Promise<void>((resolve, reject) => {
		console.log(`Reading file '${htmlFiles.HtmlReadFile}'`);
		fs.readFile(htmlFiles.HtmlReadFile, "utf8", (err, content) => {
			if (err)
				reject(console.log(`Failed to open for reading file '${htmlFiles.HtmlReadFile}'` +
						`\nErr: ${JSON.stringify(err, null, "  ")}`));
			else {
				console.log(`File '${htmlFiles.HtmlReadFile}' opened successfully for reading`);
				let dom: JSDOM | null = new JSDOM(content);
				// Execute JavaScript to modify the DOM
				const { window } = dom;
				const { document } = window;
				const noScriptDiv = document.getElementById("noscript-sect");
				noScriptDiv?.parentNode?.removeChild(noScriptDiv);
				contentBuilder(config, document);
				content = dom.serialize();
				content = expandHtmlScriptsLinksTags(content, config, "links");
				// Save final HTML
				if (!fs.existsSync(path.dirname(htmlFiles.HtmlWriteStaticFile)))
					fs.mkdirSync(path.dirname(htmlFiles.HtmlWriteStaticFile), { recursive: true });
				fs.writeFile(htmlFiles.HtmlWriteStaticFile, content, (err) => {
					if (err)
						reject(console.log(`Failed to create file '${htmlFiles.HtmlWriteStaticFile}'` +
						`\nErr: ${JSON.stringify(err, null, "  ")}`));
					else {
						console.log(`Static HTML file '${htmlFiles.HtmlWriteStaticFile}' written successfully`);
						fs.readFile(htmlFiles.HtmlReadFile, "utf8", (err, content) => {
							if (err)
								reject(console.log(`Failed to open '${htmlFiles.HtmlReadFile}' for processing` +
									`\nErr: ${JSON.stringify(err, null, "  ")}`));
							else {
								console.log(`JavaScript-based file '${htmlFiles.HtmlReadFile}' opened successfully for reading`);

								// delete any HTML comments to mark placing LINKS and SCRIPT elements
								content = expandHtmlScriptsLinksTags(content, config);
								/*
								const devicePropsTable = document.createElement("table");
								bodyElem.insertBefore(devicePropsTable, bodyElem.firstChild || null);
								bodyElem.insertBefore(document.createTextNode("\n"), bodyElem.firstChild || null);
								devicePropsTable.id = "deviceprops";
								*/
								// console.log("HTML content\n" + dom.serialize());
								if (!fs.existsSync(path.dirname(htmlFiles.HtmlWriteIndexFile)))
									fs.mkdirSync(path.dirname(htmlFiles.HtmlWriteIndexFile), { recursive: true });
								fs.writeFile(htmlFiles.HtmlWriteIndexFile, content, (err) => {
									if (err)
										reject(console.log(`Failed to create file '${htmlFiles.HtmlWriteIndexFile}'` +
											`\nErr: ${JSON.stringify(err, null, "  ")}`));
									else {
										console.log(`Javascript-based file '${htmlFiles.HtmlWriteIndexFile}' written successfully`);
										resolve();
									}
								});
							}
						});
					}
				});
			}
		});
	});
}

function expandHtmlScriptsLinksTags(
	content: string, 
	config: PostingConfigYamlFile,
	option?: "links" | "scripts" | "both"
): string {
	const headTags = config.Paths_Sets.HTMLConfigData.HeadTags,
		composeElement = (
			headElem: HTMLHeadElement,
			whichElem: string,
			elemInfo: DomElem[],
		) => {
			for (const elem of elemInfo) {
				const headElemChild = document.createElement(whichElem);
				headElem.appendChild(headElemChild);
				for (const attrib of  elem.elemAttribs)
					headElemChild.setAttribute(attrib.name, attrib.value);
				headElem.appendChild(document.createTextNode("\n"));
			}
		};
	if (option == undefined)
		option = "both";
	if (headTags && headTags.scriptsSection)
		content = content.replace(new RegExp(headTags.scriptsSection.marker), "");
	if (headTags && headTags.linksSection)
		content = content.replace(new RegExp(headTags.linksSection.marker), "");
	const dom = new JSDOM(content);
	const { window } = dom;
	const { document } = window;
	const headElem = document.getElementsByTagName("head")![0];
	if ((option == "scripts" || option == "both") && headTags && headTags.scriptsSection)
		composeElement(headElem, "script", headTags.scriptsSection.dom);
	if ((option == "links" || option === "both") && headTags && headTags.linksSection)
		composeElement(headElem, "link", headTags.linksSection.dom);
	const bodyElem = document.getElementsByTagName("body")![0];
	const switchThemeButton = document.createElement("button");
	bodyElem.insertBefore(switchThemeButton, bodyElem.firstChild || null);
	bodyElem.insertBefore(document.createTextNode("\n"), bodyElem.firstChild || null);
	switchThemeButton.id = "theme-switcher";
	switchThemeButton.appendChild(document.createTextNode("Switch Theme"));
	return dom.serialize();
}

function processCss(config: PostingConfigYamlFile): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const processOp: Promise<string>[] = [];
		for (const cssFile of config.Paths_Sets.CSSfiles) {
			if (typeof cssFile.src === "string")
				cssFile.src = [cssFile.src];
			for (const cssSrc of cssFile.src)
				getSourceFiles(getStringSubsitution(config, cssSrc)).then((files: string[]) => {
					files = fwdSlash(files as string[]) as string[];
					for (const file of files) 
						processOp.push(new Promise<string>((resolve, reject) => {
							fs.readFile(file, "utf8", (err, content) => {
								if (err)
									console.log(`CSS read file fail: ${err}`);
								else {
									console.log(`CSS source file '${file}' opened successfully for reading`);
									postcss([autoprefixer, cssnano])
									.process(content, { from: undefined })
									.then(result => {
										console.log(`CSS file '${file}' processed successfully`);
										const cssFileDest = `${fwdSlash(getStringSubsitution(config, cssFile.dest))}/${file.split("/").pop()}`;
										if (!fs.existsSync(path.dirname(cssFileDest)))
											fs.mkdirSync(path.dirname(cssFileDest), { recursive: true });
										fs.writeFile(cssFileDest, result.css, (err) => {
											if (err)
												reject(`CSS file write fail: ${err}`);
											else
												resolve(`Destination file '${cssFileDest}' written successfully`);
										});
									}).catch((err) => {
										reject(`CSS postcss processing fail: ${err}`);
									});
								}
							});
						}));
				}).catch((err: unknown) => {
					reject(`getSourceFiles() failed: ${err}`);
				});
		}
		Promise.all(processOp).then((responses: string[]) => {
			console.log(responses.join("\n"));
			resolve();
		}).catch(err => {
			reject(console.log(`processCss-Promise.all::Failed promise caught:` + 
				`\nError: ${err}`));
		});
	});
}

function copyFiles(config: PostingConfigYamlFile): Promise<void> {
	return new Promise<void>((resolve) => {
		const copyList: NodeFsMulticopyElem[] = [];
		for (const copyFile of config.Paths_Sets.baseCopySet as unknown as any[]) {
			const srcFile = fwdSlash(getStringSubsitution(config, `${copyFile.source.dirpath}/${copyFile.source.file}`)) as string;
			let dest = fwdSlash(getStringSubsitution(config, `${copyFile.destination.dirpath}/${copyFile.destination.file}`)) as string;
			let destIsDir = false;
			const destFile = copyFile.destination.file;
			if ((!destFile || destFile == "") && fs.existsSync(copyFile.destination.dirpath) == false) {
				fs.mkdirSync(dest, { recursive: true });
				destIsDir = true;
				//dest = fwdSlash(`${dest}/${path.basename(srcFile)}`) as string;
			}
			copyList.push({src: srcFile, dest: dest, destIsDir: destIsDir} as SrcDestCopy);
		}
		NodeFsMulticopy(copyList).then(() => {
			resolve();
		});
	});
} 

/*type testingSpecItem = {
	name: string;
	edits: string[];
}*/

function setupTesting(config: PostingConfigYamlFile): Promise<void> {
	console.log("\n\nPromise: set up testing environment");
	return new Promise<void>((resolve, reject) => {
		const rootDestPath = getStringSubsitution(config, config.Testing.Dest);
		if (fs.existsSync(rootDestPath)) {
			const destPathInfo = fs.lstatSync(rootDestPath);
			if (destPathInfo && destPathInfo.isDirectory() == false)
				fs.unlinkSync(rootDestPath);
			fs.mkdirSync(rootDestPath, { recursive: true});
		} else if (typeof fs.mkdirSync(rootDestPath, { recursive: true}) != "string") {
			console.log("Promise reject: Failed to create the 'test' subdirectory");
			reject();
		}
		let srcFile: string, destFile: string, destPath: string;
		const copyOp: Promise<void>[] = [];
		for (const file of config.Testing.Files) {
			copyOp.push(new Promise<void>((resolve, reject) => {
				if (typeof file == "string") {
					destFile = fwdSlash(`${rootDestPath}/${file.split("#%")[1]}`) as string;
					srcFile = fwdSlash(getStringSubsitution(config, file)) as string;
				} else { // the item is an object with 'name' and 'edits' properties
					// the 'edits' property is handled in the next step
					destFile = fwdSlash(`${rootDestPath}/${file.name.split("#%")[1]}`) as string;
					srcFile = fwdSlash(getStringSubsitution(config, file.name)) as string;
				}
				const currentSrcFile = srcFile;
				destPath = path.dirname(destFile);
				const currentDestPath = destPath;
				if (fs.existsSync(destPath) == false)
					fs.mkdirSync(destPath);
				deleteSync(destFile);  // remove any existing file
				fs.copyFile(srcFile, destFile, (err) => {
					if (err) 
							reject(`Failed copy operation for '${currentSrcFile}'\n    to '${currentDestPath}'\nError: ${err}`);
					else { // edits part
						console.log(`Success copying '${currentSrcFile}' to '${currentDestPath}'`);
						resolve();
					}
				});
			}))
		}
		Promise.all(copyOp).then(() => {
			console.log("setupTesting() copying successful for all files");
			// now the file edits
			const editOp: Promise<void>[] = [];
			for (const file of config.Testing.Files)
				editOp.push(new Promise<void>((resolve, reject) => {
					if (typeof file != "string") {
						const fileName = `${rootDestPath}/${path.basename(file.name)}`;
						fs.readFile(fileName, "utf-8", (err, content) => {
							if (err)
								reject(console.log(`Error reading '${path.basename(file.name)}'\nError: ${err}`));
							else {
								// file.edits will be reference to string or DomElem[]
								if (typeof file.edits[1] == "string")
									if (content.search(string2RE(file.edits[1])) >= 0)
										console.log(`String "${file.edits[1]}" already present`);
									else 
										content = content.replace(file.edits[0], file.edits[1]);
								else 
									content = expandHtmlScriptsLinksTags(content, config);
								fs.writeFile(fileName, content, "utf-8", (err) => {
									if (err)
										reject(console.log(`Error reading '${path.basename(file.name)}'\nError: ${err}`));
									else
										resolve();
								});
							}
						});
					}
				}));
			Promise.all(editOp).then(() => {
				console.log("Operations to set up testing environment are successful.")
				resolve();
			}).catch((err: unknown) => {
				reject(err);
			});
		}).catch((err: unknown) => {
			reject(err);
		});
	});
}

main();