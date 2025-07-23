"use strict";

export { resolveImports, projectRoles, DependencyInfo };

import pathMod from "path";
import * as fs from "fs";
import {glob} from "glob";
import type { PlatformBuildConfig } from "./gulpfiledecls.d.ts";
import { importREflagged, glog } from "./gulpfile.js";
import { removeFromArrayOneElementsInArrayTwo } from "./arraysExtended";
		// from "../../../src/GenLib/arraysExtended.js";
import { fwdSlash } from "./stringsExtended.js";
		//from "../../../src/GenLib/stringsExtended.js";

const projectRoles = [ "base", "dependency", "declaration"] as const;

type ProjectRole = (typeof projectRoles)[number];

type DependencyInfo = {
	importRef: string;
	resolvedPath: string;
	projectRole: ProjectRole;
};

let ProjectRoot: string;

let ReportingFunction: (...args: string[]) => void;

/**
 * @function resolveImports
 * @description Resolves all imports in a TypeScript project.
 * @param params 
 * @param params.projectPath The root path of the project.
 * @param params.configInfo The configuration object for the project.
 * @param params.filePatterns An array of file patterns to include in the search.
 * @param params.reportingFunction A function to report progress.
 * @returns Promise<DependencyInfo[]>
 */
function resolveImports(params: {
	projectPath: string,
	configInfo: PlatformBuildConfig,
	filePatterns?: string[],
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	reportingFunction?: (...args: any[]) => void
}): Promise<DependencyInfo[]> {
	if (params.reportingFunction)
		ReportingFunction = params.reportingFunction;
	ProjectRoot = params.projectPath;
	const { tsconfigJson } = params.configInfo.tsconfig;
	return new Promise<DependencyInfo[]>((resolve, reject) => {

// look for patterns 
		const resolvePatterns = params.filePatterns ?
		Promise.all(params.filePatterns.map(filePattern => glob(fwdSlash(filePattern)))) :
		Promise.resolve([]);
// get all 'include' paths
	const resolveInputs = tsconfigJson.include ?
		getInputFiles(tsconfigJson.include) :
		Promise.resolve([]);

	const resolveExcludes = tsconfigJson.exclude ?
		getExcludes(tsconfigJson.exclude) :
		Promise.resolve([]);

	Promise.all([resolvePatterns, resolveInputs, resolveExcludes])
		.then(([patterns, includes, excludes]) => {
			const importPaths: string[] = [];
			if (tsconfigJson.files)
				for (const file of tsconfigJson.files) {
					const testPath = fwdSlash(pathMod.join(ProjectRoot, file));
					if (!fs.existsSync(testPath))
						throw new Error("A path item in `files` property of the 'tsconfig.json' file does not exist.");
					importPaths.push(testPath);
				}
			const allPaths = [...patterns.flat(), ...includes, ...importPaths].map(elem => fwdSlash(elem));
			const excludeSet = new Set(excludes.flat().map(elem => fwdSlash(pathMod.resolve(elem))));
			const finalSet = allPaths.filter(path => !excludeSet.has(path));
			const dependencySetup: DependencyInfo[] = [];
			finalSet.forEach(elem => dependencySetup.push({
				resolvedPath: fwdSlash(pathMod.resolve(elem)),
				importRef: "",
				projectRole: /* elem.search(/\.d\.ts$/) > 0 ? "dependency" : */ "base"
			}));
				resolveMore(
					dependencySetup,
					dependencySetup,
					params.configInfo
				).then((fileSet) => {
					resolve(fileSet);
				}).catch((err: unknown) => {
					reject(err);
				});
		});
	});
}

/**
 * @function resolveMore
 * @description Resolves more dependencies.
 * @param analysisSet
 * @param collectedDependencies
 * @param paramsConfigJson
 * @returns Promise<DependencyInfo[]>
 * @private
 */

function resolveMore(
	analysisSet: DependencyInfo[],
	collectedDependencies: DependencyInfo[],
	paramsConfigJson: PlatformBuildConfig
): Promise<DependencyInfo[]> {
	return new Promise<DependencyInfo[]>((resolve, reject) => {
		// algorithm: 1) analyze dependencies 2. Filter results from collectedSet 3. Add results to collection go to 1
		resolveFileDependencies(
			analysisSet,
			paramsConfigJson
		).then((fileSet) => {
			// filter results from collection.
			const foundDependencies =
				removeFromArrayOneElementsInArrayTwo(fileSet, collectedDependencies, "resolvedPath");
			if (paramsConfigJson.html?.scripts?.module.verbosity == true)
				ReportingFunction(
					`==='newDependencies': count=${fileSet.length}\n   ${fileSet.map(elem => elem.resolvedPath).join('\n   ')}`
					/* +
					`\n   ==='queuedPaths': count=${queuedPaths.length}\n   ${queuedPaths.map(elem => elem.resolvedPath).join('\n   ')}`*/
				);
			collectedDependencies = collectedDependencies.concat(foundDependencies);
			if (foundDependencies.length > 0) {
				resolveMore(foundDependencies, collectedDependencies, paramsConfigJson).then((fileSet) => {
					resolve(fileSet);
				}).catch((err) => {
					reject(err);
				});  // Recursion to repeat the promise
			} else
				resolve(collectedDependencies);
		}).catch((err) => {
			reject(err);
		});
	});
}

/**
 * @function resolveFileDependencies
 * @description Resolves the dependencies of a file.
 * @param queuedPaths
 * @param configInfo
 * @returns Promise<DependencyInfo[]>
 * @private
 * @remarks This function is called recursively.
 */
function resolveFileDependencies(
	queuedPaths: DependencyInfo[],
	configInfo: PlatformBuildConfig
): Promise<DependencyInfo[]> {
	const tsconfigPaths = configInfo.tsconfig.tsconfigJson.compilerOptions.paths as {[key: string]: string[]};
	const tsconfigPathsKeys = Object.keys(tsconfigPaths);
	const tsconfigBaseUrl = configInfo.tsconfig.tsconfigJson.compilerOptions.baseUrl as string;
	return new Promise<DependencyInfo[]>((resolve, reject) => {
		const configPathsText = (() => {
			let str = `"tsconfigPaths": {`;
			for (const path in tsconfigPaths)
				str += `"${path}":["${tsconfigPaths[path].join("\", \"")}"],`;
			str = str.substring(0, str.length - 1);
			str += "}";
			return str;
		})();
	//	const configInfo = configInfo.tsconfig.json.compilerOptions;
		const fileReads: Promise<DependencyInfo[]>[] = [];
		const unresolvedImportMatches: {file: string; import: string; resolvedTry: string}[] = [];
		for (const queuedPath of queuedPaths) {
			fileReads.push(new Promise<DependencyInfo[]>((resolve, reject) => {
	//			ReportingFunction("ERROR: resolveFileDependencies()::files.shift() => undefined");
				fs.readFile(fwdSlash(queuedPath.resolvedPath), "utf8", (err, content) => {
				//	ReportingFunction(`  resolveFileDependencies()::fs.readFile(\n      '${file.resolvedPath}'\n    );`);
					const readinFile = pathMod.basename(queuedPath.resolvedPath);
					if (err)
						reject(ReportingFunction(`ERROR::>${err.message || err}`));
					else {
						const resolvedDependencies: DependencyInfo[] = [];
						const formattedContent = content.replace(/\/\*[\s\S]*?\*\//mg, "").replace(/\/\/.*$/, "");
						const importMatches = formattedContent.match(importREflagged);
						if (importMatches) {
							ReportingFunction(`${readinFile}: 'import' matches = ${importMatches.length}` +
								(configInfo.html?.scripts?.module.verbosity == false ? "" :
								(() => {
									let str = "";
									const importRE = /(import[^{]+)[^}]+}?( from(?= ).*$)/;
									for (let i = 0; i < importMatches.length; i++) {
										const shortImport = importMatches[i].match(importRE);
										str += `\n   [${i + 1}] \`${shortImport![1]} { ... } ${shortImport![2]}\``;
									}
									return str;
								})() as string
							));
							for (let strMatch of importMatches) {
								strMatch = strMatch.trim();
								if (strMatch.search(/^\s*\/\//) >= 0)
									continue;
								let nameMatch: string;
								if (strMatch.search(/import/) >= 0)
									nameMatch = strMatch.match(/['"]([^'"]+)['"]/)![1];
								else
									nameMatch = strMatch;
								// old method dependencies will have no file extension; new ones may have it
								nameMatch = (nameMatch.search(/\.ts$/) > 0) ? nameMatch : ((nameMatch.search(/\.js$/) > 0) ?
										nameMatch.replace(/\.js/, ".ts") : nameMatch);
								if (nameMatch.search(/\.ts$/) < 0) { // some import statements omit the extension!
									if (nameMatch.search(/\.d$/) >= 0)
										nameMatch += ".ts";
									else if (strMatch.search(/import\s+type/) >= 0)
										nameMatch += ".d.ts";
									else
										nameMatch += ".ts";
								}
// process baseUrl, tsconfigPaths matches first
								if (tsconfigPathsKeys && tsconfigPathsKeys.find(elem =>
									elem.substring(0, elem.lastIndexOf("/*")) == nameMatch.substring(0, nameMatch.indexOf("/"))
								)) {
									let resolvedPath;
									// if fully resolves path does not exist,
									const basePath = fwdSlash(pathMod.resolve(ProjectRoot, tsconfigBaseUrl));
									foundIt:
									for (const pathEnd in tsconfigPaths) {
										if (pathEnd == "*" || new RegExp(pathEnd).test(nameMatch) == true) {
											// eslint-disable-next-line @typescript-eslint/no-explicit-any
											for (const selectedEnd of (tsconfigPaths as any)[pathEnd]) {
												const re = fwdSlash(pathMod.join(basePath, selectedEnd));
												resolvedPath = fwdSlash(pathMod.join(basePath, selectedEnd,
															pathMod.basename(nameMatch))).replace(/\/\*/, "");
												if (new RegExp(re).test(resolvedPath) == true)
													break foundIt;
											}
										}
									}
									if (resolvedPath)
										if (fs.existsSync(resolvedPath) == true)
											resolvedDependencies.push({resolvedPath: resolvedPath, importRef: nameMatch,
											projectRole: resolvedPath.search(/\.d\.ts/) > 0 ? "declaration" : "dependency"});
										else if (fs.existsSync(resolvedPath.replace(/\.ts$/, ".d.ts")) == false)
											ReportingFunction(`Dependency '${nameMatch}' could not be found using \`baseUrl\` = ` +
											`'${tsconfigBaseUrl}'\n  and ${configPathsText}`);
								} else {
									const resolvedPath = fwdSlash(pathMod.resolve(pathMod.dirname(queuedPath.resolvedPath), nameMatch));
									// get the fully resolved path to an import and check for its existence
									if (fs.existsSync(resolvedPath) == true
									// &&
									//	completedPaths.findIndex(elem => elem.resolvedPath.search(resolvedPath) >= 0) &&
									//	queuedPaths.findIndex(elem => elem.resolvedPath.search(resolvedPath) >= 0)
									)
										resolvedDependencies.push({resolvedPath: resolvedPath, importRef: nameMatch,
											projectRole: resolvedPath.search(/\.d\.ts/) > 0 ? "declaration" : "dependency"});
									else
										unresolvedImportMatches.push({file: readinFile, import: strMatch, resolvedTry: resolvedPath});
								}
							}
						} else
							ReportingFunction(`${readinFile}:  zero 'import' matches`);
						resolve(resolvedDependencies);
					}
				});
			}));
		}
		Promise.all(fileReads).then((fileSets: DependencyInfo[][]) => {
			// filter out undefined
			if (unresolvedImportMatches.length > 0) {
				let report = "";
				let currFile = "";
				for (const match of unresolvedImportMatches) {
					if (match.file != currFile) {
						currFile = match.file;
						report += "\n file: " + currFile;
					}
					report += "\n    `" + match.import + "`\n       resolved try: '" + match.resolvedTry + "'";
				}
				glog(`WARNING: there were unresolved matches for the following 'import' statements and ` +
					"resolved path tested for existence and no tsconfig.json property 'baseUrl' " +
					"property was found.\nThese might be Node modules. Verify the code\n" + report.substring(1));
			}
			const files = fileSets.flat().filter(elem => elem);
			const seen = new Set();
			let newDependencies = files.filter(item => {
				const isDuplicate = seen.has(item.resolvedPath);
				seen.add(item.resolvedPath);
				return !isDuplicate;
			});
			// Create a Set of 'resolvedPath' values from 'completedPaths'
			const completedPathsResolvedPathSet = new Set(queuedPaths.map(item => item.resolvedPath));
			// Filter deduplicatedArray to remove elements present in array2
			newDependencies = newDependencies.filter(item => !completedPathsResolvedPathSet.has(item.resolvedPath));
			/*	if (newDependencies.length > 0)
				resolveFileDependencies(newDependencies, configInfo)
				.then((moreDependencies: DependencyInfo[]) => {
					//ReportingFunction(thisReport;
					resolve([...moreDependencies, ...queuedPaths]);
				}).catch((err: unknown) => {
					reject(err);
				});
			else */
			resolve(newDependencies);
		}).catch((err: unknown) => {
			reject(err);
		});
	});
}

/**
 * @function getInputFiles
 * @description Gets the input files for the project.
 * @param includes
 * @returns Promise<string[]>
 * @private
 * @remarks This function is called by `resolveImports()`.
 */

function getInputFiles(includes: string[]): Promise<string[]> {
	return new Promise((resolve, reject) => {
		const importPaths: string[] = [];
		const includeReqs: Promise<string[]>[] = [];
		for (const includePath of includes)
			includeReqs.push(new Promise<string[]>((resolve, reject) => {
				glob(fwdSlash(pathMod.join(ProjectRoot, includePath))).then((fileSet: string[]) => {
					resolve(fileSet);
				}).catch((err: unknown) => {
					reject(err);
				});
			}));
		Promise.all(includeReqs).then((foundIncludes: string[][]) => {
			resolve(importPaths.concat(foundIncludes.flat()));
		}).catch((err: unknown) => {
			reject(err);
		});
	});
}

/**
 * @function getExcludes
 * @description Gets the exclude paths for the project.
 * @param excludes
 * @returns Promise<string[]>
 * @private
 * @remarks This function is called by `resolveImports()`.
 */
function getExcludes(excludes: string[]): Promise<string[]> {
	return new Promise((resolve, reject) => {
		const exlcudeRequests: Promise<string[]>[] = [];
		for (const item of excludes) {
			exlcudeRequests.push(new Promise<string[]>((resolve, reject) => {
				glob(pathMod.join(ProjectRoot, item)).then((tsconfigPaths) => {
					resolve(tsconfigPaths);
				}).catch((err: unknown) => {
					reject(err);
				});
			}));
		}
		Promise.all(exlcudeRequests).then((tsconfigPaths) => {
			let pathsSet: string[] = [];
			for (const pathSet of tsconfigPaths)
				pathsSet = pathsSet.concat(pathSet);
			resolve(pathsSet);
		}).catch((err: unknown) => {
			reject(err);
		});
	});
}

/*
function testMod() {
	fs.readFile(tsconfigFile, "utf8", (err, content) => {
		if (err)
			console.log(`ERROR: ${err}`);
		else {
			let json: TsConfigJson;
			try {
				json = JSON.parse(content);
				resolveImports({
					projectPath: process.cwd(),
					filePatterns: [
						"D:/dev/GenLib/src/CSVFiles.ts",
						"D:/dev/GenLib/src/html*.ts",
						"D:/dev/GenLib/src/date*.ts"
					],
					configInfo: json
				}).then((response) => {
					console.log(response.join("\n"));
				}).catch((err: unknown) => {
					console.log(`ERROR: ${ERR}`);
				});
			} catch (err) {
				console.log(`Error parsing JSON: ${ERR}`);
			}
		}
	});
}

testMod();
*/