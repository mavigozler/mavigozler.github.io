"use strict";

// for function list, go to bottom of file

import fs from "fs";
import pathMod from "path";
import JSON5 from "json5";
import gulpCJS from "gulp";
const { dest } = gulpCJS;

import gulpts from "gulp-typescript";
import gulpsrcmaps from "gulp-sourcemaps";
import { gulpFileListMem } from "./gulp-filelistexmem.js";
import { globSync} from "glob";
import { exec } from "child_process";

import type { GulpCallback, PlatformBuildConfig, TsConfigJsonElements } from "./gulpfiledecls.d.ts";
import { SelectedGulpfileConfig, GulpDict, verifyPath, glog } from "./gulpfile.js";
import { resolveImports, projectRoles } from "./resolveImports.js";
import { NodeFsMulticopy } from "./fsystem.js";
		// from "../../../src/GenLib/fsystem.js";
import { longestCommonPath, fwdSlash, showRelativePath } from "./stringsExtended.js";
		// from "../../../src/GenLib/stringsExtended.js";

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
//import { mkdirp } from 'mkdirp';

export { determineAllProjectFiles, tsCompile, scriptFileCopyOperations, determineTsConfigFilePath };

function determineAllProjectFiles(done: GulpCallback): void {

// ======================================================================================
	const tsconfigpath = determineTsConfigFilePath(SelectedGulpfileConfig);
	fs.readFile(tsconfigpath, "utf8", (err, content) => {
		if (err) {
			glog(`ERROR: reading tsconfig.json file for building script files`);
		} else {
			let tsConfigJson: TsConfigJsonElements;
			try {
				tsConfigJson = JSON5.parse(content);
			} catch {
				glog(`ERROR: could not parse tsconfig.json file as JSON`);
				return done();
			}
			if (!SelectedGulpfileConfig.tsconfig.tsconfigJson)
				SelectedGulpfileConfig.tsconfig.tsconfigJson = {} as TsConfigJsonElements;
			Object.assign(SelectedGulpfileConfig.tsconfig.tsconfigJson, tsConfigJson);
			resolveImports({
				projectPath: fwdSlash(GulpDict.resolveString(SelectedGulpfileConfig.base.ProjectRootPath)),
				configInfo: SelectedGulpfileConfig,
				reportingFunction: glog
			}).then((dependencyReport) => {
				SelectedGulpfileConfig.tsconfig.files.base = dependencyReport.filter(elem => elem.projectRole == "base");
				SelectedGulpfileConfig.tsconfig.files.dependencies = dependencyReport.filter(elem => elem.projectRole != "base");
				done();
			}).catch((err: unknown) => {
				glog("ERROR: scriptFileBuilding.ts::determineAllProjectFiles()->determineAllProjectFiles()->resolveImports()" +
						"\n  ${ERR}", {err: err});
				done();
			});
		}
	});
}

function determineTsConfigFilePath(configInfo: PlatformBuildConfig): string {
	for (const prop in configInfo)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(configInfo as any)[prop] = GulpDict.resolveString((configInfo as any)[prop]);
	let tsConfigPath = GulpDict.resolveString(configInfo.tsconfig.configFilePath || "${ProjectRootPath}/tsconfig.json");
	if (fs.existsSync(tsConfigPath) == false) {
		glog(`WARN: tsCompile():: tsConfigPath not found!\n  tsconfigPath = '${tsConfigPath}'` +
			`\ncurrent working directory: '${process.cwd()}'`);
		const newPath = pathMod.join(GulpDict.resolveString("${ProjectRootPath}"),
					pathMod.basename(tsConfigPath));
		if (newPath !== tsConfigPath && fs.existsSync(newPath) == true) {
			tsConfigPath = newPath;
			glog(`scriptFileBuilding.ts::determineAllProjectFiles():: tsConfigPath found that works: '${tsConfigPath}'`);
		}
	}
	return (configInfo.tsconfig.configFilePath = tsConfigPath);
}

/*
function determineTsConfigFilePath(gulpfileTSconfig: PlatformBuildConfig): string {
	let tempPath: string = "";
	if (!gulpfileTSconfig.tsconfig.configFilePath || (fs.existsSync(gulpfileTSconfig.tsconfig.configFilePath) == false &&
			pathMod.isAbsolute(gulpfileTSconfig.tsconfig.configFilePath) == false)) {
				tempPath = fwdSlash(SelectedGulpfileConfig.base.ProjectRootPath + "/" +
						gulpfileTSconfig.tsconfig.configFilePath);
		if (fs.existsSync(tempPath) == false) {
			tempPath = fwdSlash(SelectedGulpfileConfig.base.ProjectRootPath + "/tsconfig.json");
			if (fs.existsSync(tempPath) == false)
				throw "unable to find tsconfig.json file to use"
		}
		gulpfileTSconfig.tsconfig.configFilePath = tempPath;
	}
	return tempPath;
} */

function tsCompile() {
	/*
	the gulp-typescript Node module unlike the TSC compiler does NOT resolve dependencies
	during compilation.

	Functions were added to try to resolve dependencies in all files, and then adding
	them to a modified 'tsconfig.json' file that puts the dependencies in the 'files'
	property of the JSON file
	*/
	const gulpfileTSconfig = SelectedGulpfileConfig.tsconfig;
	const TSProject = gulpts.createProject(gulpfileTSconfig.configFilePath, {}); // options?
	glog(`JSON.stringify(TSProject.config):\n${JSON.stringify(TSProject.config, null, "  ")}`);

	// here is where the dependencies that were determined are added to the config project
	if (gulpfileTSconfig.files.dependencies) {
		const finalDependencyList = gulpfileTSconfig.files.dependencies
			.filter(elem => elem.projectRole != "base").map(elem => elem.resolvedPath);
		glog("Here are the list of dependencies added to the TSProject object\n" +
				finalDependencyList.join("\n"));
		if (TSProject.config.files)
			TSProject.config.files.concat(finalDependencyList);
		else
			TSProject.config.files = finalDependencyList;
	}
	//
	const gulpTSmoduleConfig = {
		files: TSProject.config.files,
		include: TSProject.config.include,
		exclude: TSProject.config.exclude,
		compilerOptions: TSProject.config.compilerOptions,
		projectDirectory: fwdSlash(TSProject.projectDirectory)
	};
	// this is saved for later
	//gulpTSmoduleConfig.compilerOptions.baseUrl ? gulpTSmoduleConfig.compilerOptions.baseUrl : undefined;
	//gulpTSmoduleConfig.compilerOptions.paths ? gulpTSmoduleConfig.compilerOptions.paths : undefined;
	{
		let collectedFiles: string[] = [],
			includeFiles: string[],
			excludeFiles: string[];
		if (gulpTSmoduleConfig.include) {
			includeFiles = globSync(
				(gulpTSmoduleConfig.include as string[]).map(elem =>
					fwdSlash(pathMod.resolve(gulpTSmoduleConfig.projectDirectory, elem)))
			);
			if (gulpTSmoduleConfig.exclude) {
				excludeFiles = globSync(
					(gulpTSmoduleConfig.exclude as string[]).map(elem =>
						fwdSlash(pathMod.resolve(gulpTSmoduleConfig.projectDirectory, elem)))
				);
				excludeFiles.forEach(element => {
					includeFiles = includeFiles.filter(item => item !== element);
				});
			}
			collectedFiles = includeFiles;
		}
		if (gulpTSmoduleConfig.files)
			collectedFiles =  collectedFiles.concat(gulpTSmoduleConfig.files);
		SelectedGulpfileConfig.tsconfig.files.allInputFiles = collectedFiles;
	}
//	const compilerOptions = gulpfileTSconfig.compilerOptions;
	// post-modification of overriding options
	// https://www.npmjs.com/package/gulp-typescript
	const tscJsonOutDir = TSProject.config.compilerOptions.outDir;
	const gulpfileJsonOutDir = SelectedGulpfileConfig.tsconfig.compilerOptionsOverrides?.outDir;
	const thisUndefinedOutDirOverrides = SelectedGulpfileConfig?.tsconfig.compilerOptionsOverrides?.thisUndefinedOutDirOverrides;

	let outDir = tscJsonOutDir && pathMod.isAbsolute(tscJsonOutDir) == true ?
			pathMod.join(TSProject.projectDirectory, tscJsonOutDir) : tscJsonOutDir;
	if (!outDir) {
		if (gulpfileJsonOutDir) {
			if (pathMod.isAbsolute(gulpfileJsonOutDir) == true)
				outDir = gulpfileJsonOutDir;
			else
				outDir = pathMod.join(TSProject.projectDirectory, gulpfileJsonOutDir);
		} else if (thisUndefinedOutDirOverrides == true)
			outDir = gulpfileJsonOutDir;
	} else if (thisUndefinedOutDirOverrides == true)
		outDir = gulpfileJsonOutDir;
	const sourceMap = gulpTSmoduleConfig.compilerOptions.sourceMap || gulpfileTSconfig.compilerOptionsOverrides.sourceMap;
	glog("running TScompile()\n  Overriding options--" +
		`\n  gulpconfig-outdir undefined overrides: '${thisUndefinedOutDirOverrides}'` +
		`\n  tsconfig-outDir   = '${tscJsonOutDir}'` +
		`\n  gulpconfig-outDir = '${gulpfileJsonOutDir || 'not defined' }'` +
		`\n  final-outDir = '${outDir}'` +
		`\n  tsconfig-sourceMap   = '${TSProject.config.compilerOptions?.sourceMap}'` +
		`\n  gulpconfig-soureMap = '${gulpfileTSconfig.compilerOptionsOverrides?.sourceMap}'` +
		`\n  final-sourceMap = '${sourceMap}'`
	);
	glog("files to be compiled:");
	if (gulpfileTSconfig.files.dependencies)
		for (const role of projectRoles ) {
			glog(`  project role: ${role}`);
			for (const file of gulpfileTSconfig.files.dependencies)
				if (file.projectRole == role)
					glog(`  -- ${file.resolvedPath.replace(gulpfileTSconfig.projectDirectory, "")}`);
		}
	if (!outDir) {
		return new Promise<void>((resolve, reject) => {

			const cmdline = `tsc -p ${GulpDict.resolveString('${ProjectRootPath}/tsconfig.nooutdir.json')} --listFiles` +
					((sourceMap && sourceMap == true) ? " --sourceMap" : "");
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			exec(cmdline, (err, stdout, stderr) => {
				if (err)
					reject(glog(`ERROR: tsCompile()::exec('${cmdline}')` +
						"\nerr: ${ERR}", {err: err}));
				else {
					SelectedGulpfileConfig.tsconfig.files.list =
							stdout.split(/\r?\n/).filter(line => !line.includes('node_modules'));
					resolve(glog(`COMPLETED using tsCompile()::exec('${cmdline}')`));
				}
			});
		});
	} else {
		if (outDir.search(/\/build\/|\/Gulp\//) >= 0)
			outDir = fwdSlash(GulpDict.resolveString(pathMod.join("${ProjectRootPath}", pathMod.basename(outDir))));
		if (pathMod.isAbsolute(outDir) == false)
			outDir = fwdSlash(GulpDict.resolveString(pathMod.join("${ProjectRootPath}", outDir)));
//		mkdirp(outDir).then(() => {
//			glog(`tsCompile()::mkdirp('${outDir}') SUCCESS:`);
			SelectedGulpfileConfig.tsconfig.files.xpiledPath = outDir;
			SelectedGulpfileConfig.tsconfig.files.tsclist = {
				memlist: [],
				filename: null,
				options: { absolute: true }
			};
			glog(`JSON.stringify(TSProject.config):\n${JSON.stringify(TSProject.config, null, "  ")}`);
			const reporter = gulpts.reporter.fullReporter(true);
			if (sourceMap && sourceMap == true)
				return TSProject.src()
					.pipe(gulpsrcmaps.init())
					.pipe(TSProject(reporter)).js
					.pipe(gulpsrcmaps.write(".", {includeContent: false, sourceRoot: "./"}))
					.pipe(gulpFileListMem(SelectedGulpfileConfig.tsconfig.files.tsclist))
	//				.pipe(require("gulp-filelist")("filelist.json"))
					.pipe(dest(outDir));
			else
				return TSProject.src()
					.pipe(TSProject(reporter)).js
					.pipe(gulpFileListMem(SelectedGulpfileConfig.tsconfig.files.tsclist))
					.pipe(dest(outDir));
//		}).catch((err: unknown) => {
//			glog(`ERROR: tsCompile()::mkdirp('${outDir}')` + "\n  ${ERR}", err);
//		});
	}
}

/**
 * @function scriptFileCopyOperations
 * 	1. move JS files from TSC output dir tree to subdir for use (release or test)
 *    2. if sourcemaps, move JSMAP + TS to subdir, copying TS from original location
 *    3. if using webpack, move files to location for use by webpack
 *    4. After copy, call JSMAP editing function and make sure it can find JSMAP files
 *       even if JSMAP files are not copied, their location must be indicated for this function
 * @returns {Promise<void>}
 */
function scriptFileCopyOperations(): Promise<void> {
   return new Promise((resolve, reject) => {
      const ProjectRootPath = SelectedGulpfileConfig.base.ProjectRootPath,
			tsSrcs = SelectedGulpfileConfig.tsconfig.files.allInputFiles.map(elem => fwdSlash(elem)),
         copyList: (string | {src:string;dest:string})[] = [],
         flatten = SelectedGulpfileConfig.tsconfig.files.flatten,
         projectSrcsPathPart = SelectedGulpfileConfig.base.ProjectSourcesPath.replace(ProjectRootPath, ""),
         libsSrcsPathPart = SelectedGulpfileConfig.base.LibsSourcesPath.replace(ProjectRootPath, ""),
			useWebpack = SelectedGulpfileConfig.webpack ? SelectedGulpfileConfig.webpack.useWebpack : false,
         jsMapPaths: string[] = [];
// the file JSON has been read in, so some fixups to the 'tsconfig' property of the
// config are necessary

      let scriptFilesDest = SelectedGulpfileConfig.tsconfig.files.filesCopyToDir,
			xpiledPath = SelectedGulpfileConfig.tsconfig.files.xpiledPath;
		if (!scriptFilesDest || scriptFilesDest == null) {
			let filesCopyToDir: string | undefined;
			if (useWebpack == true)
				filesCopyToDir = SelectedGulpfileConfig.html?.scripts?.module.tsconfigPathMaps[0].filesCopyTo;
			else
				filesCopyToDir = SelectedGulpfileConfig.html?.scripts?.module.tsconfigPathMaps[0].filesCopyTo;
			if (!filesCopyToDir)
				glog("WARNING: A 'filesCopyToDir' property was not set in the 'html/scripts/modules'" +
					" section of the 'gulpfile.config.json' file. Script files will remain in 'tsconfig.json' `outDir` folder");
			else
				scriptFilesDest = filesCopyToDir;
			/*
			return reject(glog("ERROR: A 'filesCopyTo' property was not set in the 'html/scripts/modules'" +
					" section of the 'gulpfile.config.json' file")); */
		}
		if (pathMod.isAbsolute(scriptFilesDest) == false || scriptFilesDest.search(/\.\.?/) > 1)
			scriptFilesDest = fwdSlash(pathMod.resolve(SelectedGulpfileConfig.base.ProjectRootPath, scriptFilesDest));
		SelectedGulpfileConfig.tsconfig.files.filesCopyToDir = scriptFilesDest;
		if (!xpiledPath || xpiledPath == null)
			xpiledPath = scriptFilesDest;
		glog("scriptFileBuilding.ts::scriptFileCopyOperations():: copying of JS, JSMAP, TS file settings" +
			`\n  use webpack             : ${useWebpack}` +
			`\n  flatten                 : ${flatten}` +
         `\n  project sources path    : ${ProjectRootPath + projectSrcsPathPart}` +
			`\n  library sources path    : ${ProjectRootPath + libsSrcsPathPart}` +
			`\n  transpiled path         : ${xpiledPath}` +
			`\n  script files destination: ${scriptFilesDest}`);
		// find the .js.map files and generate a copy list
		/*
			const jsMapFiles = SelectedGulpfileConfig.tsconfig.files.dependencies.map(
			elem => elem.resolvedPath.replace(ProjectRootPath, xpiledPath).replace(/\.ts$/, ".js.map"))
				.filter(elem => elem.search(/\.d\.js\.map/) < 0); */
		const jsMapFiles = SelectedGulpfileConfig.tsconfig.files.tsclist.memlist!.filter(elem => elem.search(/\.js\.map/) > 0);
		if (useWebpack == true)  // all files to transpiled subdirectory
			for (const file of jsMapFiles) {
				if (flatten == true)
					copyList.push(tsSrcs.find(elem => elem.search(pathMod.basename(file)
								.replace(/\.js\.map/, ".ts")) >= 0)!); // copy ts file
				else	// add the JS.MAP with dest not flattened
					copyList.push({
						src: tsSrcs.find(elem => elem.search(pathMod.basename(file).replace(/\.js\.map/, ".ts")) >= 0)!, // copy ts file
						dest: `${xpiledPath}/${file.substring(xpiledPath.length + 1).replace(/\.js\.map/, ".ts")}`
					});
				jsMapPaths.push(`${xpiledPath}/${pathMod.basename(file)}`); // set up JSMAP for editing
			}
		else // normal script building
			for (const file of jsMapFiles)
				if (flatten == true) {
					copyList.push(pathMod.join(xpiledPath, pathMod.basename(file)));  // flatten the JSMAP file and set for copy
					// for flat, get the sources for PROJECT and LIBS folders, then flatten
					copyList.push(tsSrcs.find(elem => elem.search(pathMod.basename(file)
								.replace(/\.js\.map/, ".ts")) >= 0)!); // copy ts file
					jsMapPaths.push(`${scriptFilesDest}/${pathMod.basename(file)}`); // set up JSMAP for editing
				} else {
					// add the JS.MAP with dest not flattened
					copyList.push({
						src: file,
						dest: file.replace(xpiledPath, scriptFilesDest)
					});  // copy JSMAP file
					copyList.push({
						src: tsSrcs.find(elem => elem.search(pathMod.basename(file).replace(/\.js\.map/, ".ts")) >= 0)!, // copy ts file
						dest: `${scriptFilesDest}/${file.substring(xpiledPath.length + 1).replace(/\.js\.map/, ".ts")}`
					});
					jsMapPaths.push(`${scriptFilesDest}/${file.substring(xpiledPath.length + 1)}`);
				}
		if (copyList.length > 0)
			glog(`copyList[] of ${copyList.length} JSMAP and TS files created`);
		else
			glog("no JS.MAP / .TS files in the copy list");
      let neededPaths: string[] = [];
		const jsFiles = jsMapFiles.map(elem => elem.replace(/\.js\.map$/, ".js"));
		// now find the JS files
		if (useWebpack == true)
			neededPaths = [];
		else {
			if (flatten == true)
				neededPaths.push(scriptFilesDest);
			for (const file of jsFiles)
				if (flatten == true)
					copyList.push(file.replace(xpiledPath, scriptFilesDest));
				else {
					copyList.push({
						src: file,
						dest: `${scriptFilesDest}/${file.substring(xpiledPath.length + 1)}`
					});
					neededPaths.push(pathMod.dirname(`${scriptFilesDest}/${file.substring(xpiledPath.length + 1)}`));
				}
			neededPaths = Array.from(new Set(neededPaths));
			glog(`with JS files added, copy list is now ${copyList.length} files total\n` +
				(neededPaths.length > 0 ? `${neededPaths.length} paths were needed for adding files` :
				"No paths created for files"));
		}
		// verify paths that need to exist
		const pathsCheck: Promise<void>[] = [];
		for (const neededPath of neededPaths)
			pathsCheck.push(new Promise<void>((resolve, reject) => {
				verifyPath(neededPath)
				.then(() => {
					resolve();
						//glog(`copyOperations()::verifying needed path '${neededPath}'`));
				}).catch((err: unknown) => {
					reject(err);
						//glog(`ERROR copyOperations()::verifying needed path '${neededPath}\n  ${err.message}'`))
				});
			}));
      Promise.all(pathsCheck).then(() => {
			// file copying starts here
         glog(`scriptFileBuilding.ts::scriptFileCopyOperations()::all needed paths verified`);
         NodeFsMulticopy(
            copyList,
            flatten == true ? scriptFilesDest : undefined
         ).then((response: string[]) => {
				let jsMapFileTargetDir: string;
            glog(response.join("\n"));
				// placed files should be copied files
				if (useWebpack == true) {
//					if (flatten == true)
//						jsMapFileTargetDir = xpiledPath;
//					else
						jsMapFileTargetDir = xpiledPath;
				} else {
//					if (flatten == true)
//						jsMapFileTargetDir = SelectedGulpfileConfig.tsconfig.files.filesCopyToDir;
//					else
						jsMapFileTargetDir = SelectedGulpfileConfig.tsconfig.files.filesCopyToDir;
				}
				const placedJsMapFiles =
					jsMapFiles.map(elem => flatten == true ?
							fwdSlash(pathMod.join(jsMapFileTargetDir, pathMod.basename(elem))) :
							elem.replace(xpiledPath, jsMapFileTargetDir)
					);
				const placedTsFiles = placedJsMapFiles.map(elem => elem.replace(/\.js\.map/, ".ts"));
            SelectedGulpfileConfig.tsconfig.files.placedFiles = {
               jsFiles: flatten == true ?
							jsFiles.map(elem => fwdSlash(pathMod.join(jsMapFileTargetDir, pathMod.basename(elem)))) :
							jsFiles.map(elem => elem.replace(xpiledPath, jsMapFileTargetDir)),
               jsMapFiles: placedJsMapFiles,
					tsFiles: placedTsFiles
            };
				// call for editing the JS MAP files just moved
            jsMapEdits().then(() => {
		// should be the end point for script file copy operations
               glog(` jsMapEdits() completes successfully`);
					tsFileEdits(placedTsFiles).then(() => {
						resolve(glog(` tsFileEdits() completes successfully`));
					}).catch((err) => {
						reject(err);
					});
            }).catch((err: unknown) => {
               reject(err);
            });
         }).catch((err: unknown) => {
            reject(err);
         });
      });
   });
}

/**
 * @function jsMapEdits -- edit the JS.MAP files to point to sources
 * @param jsMapFilePaths
 * @returns
 */
function jsMapEdits(): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		//const filesCopyToDir = SelectedGulpfileConfig?.tsconfig.files.filesCopyToDir + "/";
		const placedJsMapFiles = SelectedGulpfileConfig.tsconfig.files.placedFiles.jsMapFiles;
		const placedTsFiles = SelectedGulpfileConfig.tsconfig.files.placedFiles.tsFiles;
		const jsMapFilesEdits: Promise<void>[] = [];
		for (const mapFile of placedJsMapFiles)
			jsMapFilesEdits.push(new Promise<void>((resolve, reject) => {
				fs.readFile(mapFile, "utf8", (err, content) => {
					if (err)
						reject(glog(`ERROR: scriptFileBuilding.ts::jsMapEdits('${mapFile}')` +
							"\n  errmsg:${ERR}", {err: err}));
					else {
						const matchingTsFile = placedTsFiles.find(elem => elem.search(pathMod.basename(mapFile)
								.replace(/\.js\.map/, ".ts")) >= 0)!;
						const relPath = showRelativePath(mapFile, matchingTsFile)!;
						content = content.replace(/"sources":\["[^"]+"\]/, `"sources":["${relPath}"]`);
						fs.writeFile(mapFile, content, (err) => {
							if (err)
								reject(glog(`ERROR: scriptFileBuilding.ts::jsMapEdits('${mapFile}')` +
									"\n  errmsg:${ERR}", {err: err}));
							else
								resolve(glog(`edit completed: scriptFileBuilding.ts::jsMapEdits('${mapFile}')`));
						});
					}
				});
			}));
		Promise.all(jsMapFilesEdits).then(() => {
			resolve(glog("scriptFileBuilding.ts::jsMapEdit()::Promise.all() succeeded" +
					`edits of ${jsMapFilesEdits.length} files processed`
			));
		}).catch((err: unknown) => {
			reject(glog("ERROR: scriptFileBuilding.ts::jsMapEdit()::Promise.all()" +
					"\n  errmsg:${ERR}", {err: err}));
		});
	});
}

/**
 * @function tsFileEdits -- edit the TS files to point to sources
 * @param tsFilePaths
 * @returns
 */
function tsFileEdits(tsFilePaths: string[]): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		// the base directory must be where the browser directory is
		const serverRoot = SelectedGulpfileConfig.base.browserScriptsPath;
		if (!serverRoot)
			glog("FATAL: The 'gulpfile.config.json' did not have base setting 'browserScriptsPath', which must be\n" +
				"set for certain script file work making use of source maps")
					//			(glog("The `paths` property in 'tsconfig.json' was set but not `baseUrl'. The default is to\n" +
//					`set \`baseUrl\` to directory where 'tsconfig.json' is located:\n'baseUrl' = ${baseUrl}`
//			));

//		let baseUrl = SelectedGulpfileConfig.tsconfig.tsconfigJson.compilerOptions.baseUrl as string;
		const { paths } = SelectedGulpfileConfig.tsconfig.tsconfigJson.compilerOptions;
//		if (paths && !serverRoot) {
//			baseUrl = SelectedGulpfileConfig.tsconfig.projectDirectory;
//			(glog("The `paths` property in 'tsconfig.json' was set but not `baseUrl'. The default is to\n" +
//					`set \`baseUrl\` to directory where 'tsconfig.json' is located:\n'baseUrl' = ${baseUrl}`
//			));
//		}
//		const fullBaseUrl = pathMod.resolve(SelectedGulpfileConfig.tsconfig.projectDirectory, baseUrl);
		let index = -1;
		const fullPaths = (() => {
			const fullPathSets: {pathKey: string; fullFoundPath: string; relativeFoundPath:string}[] = [];
			for (const pathKey in paths) {
				for (const path of paths[pathKey]) {
					const pathKeyMod = pathKey.substring(0, pathKey.lastIndexOf("/*"));
					const testPath = fwdSlash(pathMod.resolve(serverRoot, path.substring(0, path.lastIndexOf("/*"))));
//					const testPath = pathMod.resolve(fullBaseUrl, path);
					if (fs.existsSync(testPath) == true) {
						index = fullPathSets.push({pathKey: pathKeyMod + "/", fullFoundPath: testPath + "/",
								relativeFoundPath: testPath.replace(serverRoot, "..") + "/"});
						break;
					} else
						index = -1;
				}
				if (index < 0)
					glog(`WARNING: \`paths\` property key '${pathKey}' in 'tsconfig.json' did not resolve to ` +
						"existing directory. If code does not key on it, there will be no error.")
			}
			return fullPathSets;
		})();
		const tsFilesToBeEdited: Promise<void>[] = [];
		for (const file of tsFilePaths)
			tsFilesToBeEdited.push(new Promise<void>((resolve, reject) => {
				fs.readFile(file, "utf8", (err, content) => {
					if (err)
						reject(glog(`ERROR: scriptFileBuilding.ts::tsFileEdits('${file}')` +
							"\n  errmsg:${ERR}", {err: err}));
					else {

						glog(`file: ${file}`)


						let modified = false;
					/* edits to be done:  `paths` must be made relative in all `import` statements */
						const importRE = /import\s+\{[^}]+\}\s+from\s+"([^./]+)\//mg;
						const importMatches = content.match(importRE);
						if (importMatches) {
							// need to do inner match now
							const innerMatches = [];
							for (const importMatch of importMatches)
								innerMatches.push(importMatch.match(/from "([^/]+\/)/)![1]);
							const uniqueMatches = Array.from(new Set(innerMatches)); // ret
							for (const fullPath of fullPaths) {
								for (const item of uniqueMatches)
									if (item == fullPath.pathKey) {
										const pathKeyRE = new RegExp(fullPath.pathKey, "g");
										// find the common path between open *.ts file and the 'import' statement
										let commonpath = longestCommonPath(file, fullPath.fullFoundPath);
										if (!commonpath)
											commonpath = ".";
										glog(`   pathKeyRE = ${pathKeyRE}` +
											`\n   fullFoundPath = ${fullPath.fullFoundPath}` +
											`\n   commonpath = ${commonpath}` +
											`\n   fullPath.fullFoundPath.replace(commonpath, ".."): ` +
												`${fullPath.fullFoundPath.replace(commonpath, "..")}`);

										content = content.replace(pathKeyRE, fullPath.fullFoundPath.replace(commonpath, ".."));
										modified = true;
									}
							}
							if (modified == true)
								fs.writeFile(file, content, (err) => {
									if (err)
										reject(glog(`ERROR: scriptFileBuilding.ts::tsFileEdits('${file}')` +
											"\n  errmsg:${ERR}", {err: err}));
									else
										// import matches changed
										resolve(glog(`edit completed: scriptFileBuilding.ts::tsFileEdits('${file}')`));
								});
						} else
						// no import matches. just resolve
							resolve(glog(`scriptFileBuilding.ts::tsFileEdits no modification of '${pathMod.basename(file)}' needed`));
					}
				});
			}));
		Promise.all(tsFilesToBeEdited).then(() => {
			// we need to add *.d.ts files too
			glog("scriptFileBuilding.ts::tsFileEdits()::Promise.all() succeeded" +
					`edits of ${tsFilesToBeEdited.length} files processed`);
			const copyList: {src: string; dest: string;}[] =
					SelectedGulpfileConfig.tsconfig.files.dependencies.filter(elem =>
						elem.projectRole == "declaration").map(elem => {
							return {
								src: elem.resolvedPath,
								dest: elem.resolvedPath.replace(
									SelectedGulpfileConfig.base.ProjectRootPath,
									SelectedGulpfileConfig.tsconfig.files.filesCopyToDir
							)};
						}).concat(
							SelectedGulpfileConfig.tsconfig.files.base.filter(elem =>
								elem.resolvedPath.search(/\.d\.ts$/) >= 0).map(elem => {
									return {
										src: elem.resolvedPath,
										dest: elem.resolvedPath.replace(
											SelectedGulpfileConfig.base.ProjectRootPath,
											SelectedGulpfileConfig.tsconfig.files.filesCopyToDir
									)};
								})
						);
			if (copyList && copyList.length > 0) {
				glog("Following declaration files were found for placement:\n   " +
						`${copyList.map(elem => elem.src || elem).join("\n   ")}`);
				NodeFsMulticopy(copyList).then((report: string[]) => {
					glog(report.join("\n"));
					resolve();
				}).catch((err) => {
					glog("ERROR: Declaration files copying ");
					reject(err);
				});
			} else
				resolve();
		}).catch((err: unknown) => {
			reject(glog("ERROR: scriptFileBuilding.ts::tsFileEdits()::Promise.all()" +
					"\n  errmsg:${ERR}", {err: err}));
		});
	});
}

/*
function determineAllProjectFiles(done: GulpCallback): void

function determineTsConfigFilePath(configInfo: PlatformBuildConfig): string
	attempts to find the tsconfig.json file in the project root directory
	if not found, it will look for 'tsconfig.json' in the project root directory

function tsCompile(): void
	this function uses the 'gulp-typescript' module to compile the TypeScript files
	- it will resolve dependencies and add them to the 'files' property of the 'tsconfig.json' file
	- it will compile the TypeScript files and generate JavaScript files
	- it will generate a list of files that were compiled

function scriptFileCopyOperations(): void	// returns Promise<void>
	1. move JS files from TSC output dir tree to subdir for use (release or test)
	2. if sourcemaps, move JSMAP + TS to subdir, copying TS from original location
	3. if using webpack, move files to location for use by webpack
	4. After copy, call JSMAP editing function and make sure it can find JSMAP files
		even if JSMAP files are not copied, their location must be indicated for this function

function jsMapEdits(): void	// returns Promise<void>	
	edit the JS.MAP files to point to sources

function tsFileEdits(): void	// returns Promise<void>	
	edit the TS files to point to sources
*/