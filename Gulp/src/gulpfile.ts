"use strict";

// informaotion on usage and setup in GulpSystem.md

export { glog, SelectedGulpfileConfig,
	GulpDict, verifyPath, //performCopyAction,
	systemSetup, preclean, determineAllProjectFiles, tsCompile, // output to lib
	processHtml, scriptFileCopyOperations, otherCopyOperations, moveRename,
	editOperations, importREflagged,	finish };

import type { TsConfigInfo, TmoveRename, TmoveRenameForGlob, PlatformBuildConfig,
	GulpCallback, HTMLdef, tsconfigPathMaps, EditInfo, strTuple, ConfigNameInfo, WholeYAML,
	deleteAsyncOptions, LinkScriptItem, GulpYAML, strTupleBool, GulpConfigBaseDefs, 
	HtmlScripts, HtmlModule
//	ConfigNamebuildInfo, SelectedConfig, YAMLArray, 
	/*, YAMLObject, GulpfileConfigsInfo */ } from "./gulpfiledecls.d.ts";

//import "module-alias/register.js";
import { Glogger, GulpDict, GulpfileConfigs} from "./gulpfileGlobals.js";
import { determineAllProjectFiles, tsCompile, scriptFileCopyOperations, determineTsConfigFilePath } from "./scriptFileBuilding.js";
// import { translateTsConfigFilePathsProperty } from "./tsconfigPathsOp.js"
//import 'tsconfig-paths/register.js';
import { importREstring, importExportEdits } from "./jsFileEditing.js";
import { fwdSlash } from "./stringsExtended.js";
		//from "../../../src/GenLib/stringsExtended.js";
const importREflagged = new RegExp(importREstring, "mg");
import { NodeFsMulticopy }
		from "./fsystem.js";
		//from "../../../src/GenLib/fsystem.js";

import * as fs from "fs";
//import * as readline from "node:readline/promises";
import { mkdirp } from "mkdirp";
import parseArgs from "minimist";
import * as pathMod from "path";
import { exec, spawn } from "child_process";
import { deleteAsync } from "del";
import * as winston from "winston";
import "winston-daily-rotate-file";
import "winston-color";
//import { fileURLToPath } from 'url';
// gulp and gulp plugins
import * as gulpCJS from "gulp";
const {
	series,
//	src,
//	dest
} = gulpCJS;

// import JSON5 from "json5";
import yaml from "js-yaml";
//import webpack from "webpack";
//import webpackStream from "webpack-stream";
// import browserSync from "browser-sync";

import * as globpkg from "glob";
const { glob } = globpkg;
// import ts from "typescript";
import {select } from "@inquirer/prompts";

//import { createRequire } from "module";
//const require = createRequire(import.meta.url);

/**************************************/
process.on('uncaughtException', (err) => {
	glog(`FATAL: uncaught error ${err}` +
		`\nStack trace:, ${err.stack}`);
	process.exit(1); // Exit after logging
});

process.on('unhandledRejection', (reason, promise) => {
	glog(`FATAL: unhandled Rejection at: ${promise}, 'reason:', ${reason}` +
		"\nStack trace:", {err: (reason as {stack:unknown}).stack || reason});
	process.exit(1); // Exit after logging
});
/**************************************/

//const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
// const __dirname = pathMod.dirname(__filename);

// import { promisify } from 'util';
/*
const readFileAsync = promisify(fs.readFile); */

// import { safe as jsonc } from 'jsonc';
/*
translateTsConfigFilePathsProperty(determineTsConfigFilePath());
*/
function loggerSetup(): void {
	// log rotation
	const logsDirectory = GulpDict.resolveString(GulpfileConfigs.base.LogsPath);
	const { format, transports, createLogger } = winston;
	const loggingFormat = format.printf(({timestamp, level, message}): string => {
		return `${format.colorize({
			all: true,
			colors: { info: 'blue', warn: 'yellow', error: 'red' }
		})}[${timestamp}] ${level}: ${message}`;
	});

//		format.timestamp({format: "YYYY-MM-DD HH:mm:ss"})
		// winston.format.cli();
	/* combine(
		timestamp({format: "dd-MMM-YYYY HH:mm:ss"}),
		label({ label: 'gulpfile-logger'}),
		printf(({level, message, timestamp}) => {
			return `${colorize({
				all: true,
				colors: { info: 'blue', warn: 'yellow', error: 'red' }
			})} [${timestamp}]\n${message}`;
		})
	) */
	const fileRotateTransport = new transports.DailyRotateFile({
		filename: 'combined-%DATE%.log',
		// dirname: default="."  directory to save to
		// stream: write to custom stream, bypass rotation
		datePattern: 'YYYY-MM-DD', // controls frequency of rotation 'moment.js' date format
		zippedArchive: true, // gzipping
		// frequency: timed rotations, #m '5m' or #h '3h' if null->datePattern
		maxSize: '20m',
		maxFiles: '7d'  // when to delete aged log files
		// options: see NodeJS/API/fs.html#fs_fs_createwritestream_path_options
		// auditFile: string for audit file name
		// utc: use the UTC time for date in filename
		// extension to use for filename (default="")
	});
	/*   can set event handlers related with log rotation
	fired when a log file is created
		fileRotateTransport.on('new', (filename) => {});
	fired when a log file is rotated
		fileRotateTransport.on('rotate', (oldFilename, newFilename) => {});
	fired when a log file is archived
		fileRotateTransport.on('archive', (zipFilename) => {});
	fired when a log file is deleted
		fileRotateTransport.on('logRemoved', (removedFilename) => {});
	*/
	winstlog.logger = createLogger({
		// or try winston.config.syslog.levels:
		//   https://datatracker.ietf.org/doc/html/rfc5424#page-10
		levels: winston.config.npm.levels,
		// winston reference: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/#configuring-transports-in-winston
		level: process.env.LOG_LEVEL || "info",
		//https://www.npmjs.com/package//winston#formats
		// defaultMeta: { service: 'user-service' },
		transports: [
			//
			// - Write all logs with importance level of `error` or less to `error.log`
			// - Write all logs with importance level of `info` or less to `combined.log`
			//
			fileRotateTransport,
			new transports.Console({
				format: winston.format.combine(
					winston.format.colorize(),
					winston.format.cli()
				)
			}),
			new transports.File({
				filename: pathMod.join(logsDirectory, "error.log"),
				level: "error",
				format: loggingFormat
			}),
			new transports.File({
				filename: pathMod.join(logsDirectory, "combined.log"),
				format: loggingFormat
			}),
		],
	exceptionHandlers: [
		new winston.transports.File({
			filename: pathMod.join(logsDirectory, 'exception.log')
		}),
	],
	rejectionHandlers: [
		new winston.transports.File({
			filename: pathMod.join(logsDirectory, 'rejections.log')
		}),
	],
	});
}
/*
function help(cb: GulpCallback) {
`   flags/options:
       --configFilePath=</path/to/tsconfig.json>
           specifies relative (from gulpfile.js) or absolute path to a
          \`tsconfig.json\` file to be run by 'tsc' platform function if used
       -c
           cleanup any built files before new files are built as specified
           in a \`tsconfig.json\` file used. Only works if 'tsc' platform function used
       --preclean=<JSON.parse()able string of array of path patterns for
           cleaning (deleting) files before any build process occurs.
           This flag is ignored if '-c' flag is specified and there a \`tsconfig.json\`
           file is found and utilized
`
}
*/

function readGulpfileConfigYaml(argList: parseArgs.ParsedArgs): Promise<WholeYAML> {
	/*if (!argList.s) {
		console.error("Gulpfile execution requires specification of two items in\n" +
				"a special argument format: 'gulp -t <platform-name> -s <build-name>'\n" +
				" (1) a platform name like 'default' or 'buildSpecificProject'\n" +
				"   if a platform name not specified, 'default' is assumed\n" +
				" (2) an development build indicator: 'test' or 'release' are allowed\n" +
				"   a build is required to be specified\n\n" +
				"Both platform and build names can be specified as one argument with colon-separated 'platform:build' or\n" +
				" two arguments which is a space-separated 'platform build' format.\n\n" +
				"Exiting with code '1'");
		process.exit(1);
	} else { */

	//}

	/* argv[0]  "C:\\Program Files\\nodejs\\node.exe"
			[1]  "D:\\dev\\GenLib\\node_modules\\gulp\\bin\\gulp.js"
			[2]  <platform-name> e.g. 'default'
			[3]  config: 'buildJSONex'  <--- 'config=buildJSONex'
	// Load plugins*/
	// ...

	// the -c argument for running this gulpfile points to the path of a configuration YAML file for specifying
	//   useful parameters to direct the processing by Gulp. If missing, the path will be assumed to be
	//   the file 'gulpfile.config.json' in the directory where gulpfile.js is located
	return new Promise<WholeYAML>((resolve) => {
		const GULPFILE_CONFIG_JSON_PATH = argList.c ? fwdSlash(argList.c) :
					"../config/gulpfile.config.yaml";
		fs.readFile(GULPFILE_CONFIG_JSON_PATH, "utf8", (err, content) => {
			if (err) {
				glog("ERROR reading 'gulpfile.config.yaml'\nerr: ${ERR}", {err: err});
				process.exit(1);
			} else
				resolve(yaml.load(content, {json: true}) as WholeYAML);
		})
	});
}

let SelectedGulpfileConfig: PlatformBuildConfig,
	gloggerInstance: Glogger,
	glog: typeof gloggerInstance.glog,
	winstlog: typeof gloggerInstance.winstlog;

function systemSetup(done: GulpCallback) {
	gloggerInstance = new Glogger({verbosity: "high"});
	glog = gloggerInstance.glog;
	winstlog = gloggerInstance.winstlog;
	glog("\nplatform: ----   system setup");
	const argList: parseArgs.ParsedArgs = parseArgs(process.argv.slice(2));
	readGulpfileConfigYaml(argList).then((fileContent: WholeYAML) => {
		/* get the Gulp Config YAML content and put it in memory */
		GulpfileConfigs.fileYAML = fileContent;
		GulpfileConfigs.base = GulpfileConfigs.fileYAML.base as unknown as GulpConfigBaseDefs;
		loggerSetup();
		const fileYamlAsConfig: GulpYAML = fileContent as unknown as GulpYAML;
		if (fileYamlAsConfig.default) // may force its definition
			GulpfileConfigs.defaultConfig = {
				platform: fileYamlAsConfig.default.platform as string,
				build: fileYamlAsConfig.default.build as string
			}
		GulpfileConfigs.gulpfileJSdirectory = pathMod.dirname(process.argv[1]);
		// property 'configNames' specifies the config names which may have one or more builds
		// we get from the file YAML the keys of config 'platforms' and in each platform we get any builds
		GulpfileConfigs.configs = [];
		for (const config of fileYamlAsConfig.configNameInfo) {
			const platformYaml = fileYamlAsConfig.platform.find(elem => elem.build.platform == config.name);
			for (const buildConfigKey in platformYaml) {
				const newplatformbuildConfig: PlatformBuildConfig = {
					platform: config.name,
					build: buildConfigKey
				} as PlatformBuildConfig;
				newplatformbuildConfig.disabled = fileYamlAsConfig.configNameInfo.find(
					elem => elem.name == config.name)?.disabled as boolean;
				//Object.assign(newplatformbuildConfig, buildYaml);
				newplatformbuildConfig.base = fileYamlAsConfig.base as GulpConfigBaseDefs;
				newplatformbuildConfig.tsconfig.projectDirectory = GulpfileConfigs.base.ProjectRootPath;
				GulpfileConfigs.configs.push(newplatformbuildConfig);
			}
		}
		for (const key in GulpfileConfigs.base)
			GulpDict.set(key, GulpfileConfigs.base[key]);
		if (!argList.t) {
			argList.t = GulpfileConfigs.defaultConfig;
			glog(`option -t specified in arguments: default configuration is selected`);
		}
		// get user input about configuration here
		let version: string;
		exec("npm list gulp --json", { cwd: GulpDict.get("ProjectRootPath") }, (err, stdout /*, stderr*/) => {
			if (err)
				glog("ERROR: systemSetup()::exec(<for gulp version>)" +
					"\n  errmsg: ${ERR}", {err: err});
			else {
				version = JSON.parse(stdout).dependencies.gulp.version;

				let setPlatform: string | undefined, setBuild: string | undefined;
				const defaultAnswers = {
						platform: "", //GulpfileConfigs.defaultConfig,  // Replace with the default platform name
						build: "test"   // Replace with the default build name
					},
					systemDetail = (selectedConfig: PlatformBuildConfig) => {
						return "\n  ====== System Detail ======" +
						`\n  Current working directory: ${GulpfileConfigs.gulpfileJSdirectory}` +
						`\n  Gulp version: ${version}` +
						`\n  Gulp args:  '${process.argv.join("', '")}'` +
						`\n  Selected Gulp config:\n     platform = '${selectedConfig.platform}'` +
						`\n    build = '${selectedConfig.build}'\n` +
						"\n  ===========================";
					};
				if (process.env) {
					if (process.env.NODE_ENV)
						glog(`\`process.env.NODE_ENV\` is defined: ${process.env.NODE_ENV}`);
					else
						glog("`process.env.NODE_ENV` is not defined");
				} else
					glog("Object `process.env` is not defined");

				if (argList.t && argList.s) {
					setPlatform = argList.t;
					setBuild = argList.s;
				} else if (process.env?.NODE_ENV === "development") {
					setPlatform = defaultAnswers.platform;
					setBuild = defaultAnswers.build;
				}
				SelectedGulpfileConfig = GulpfileConfigs.configs.find((elem: PlatformBuildConfig) =>
						elem.platform == setPlatform && elem.build == setBuild)!;
				if (setPlatform && setBuild) {
					SelectedGulpfileConfig = initializeSelectedConfigBuild(SelectedGulpfileConfig);
					determineTsConfigFilePath(SelectedGulpfileConfig);
					glog(systemDetail(SelectedGulpfileConfig));
					done();
				} else
					select({
						message: "Select the platform:",
						choices: GulpfileConfigs.configNameInfo,
						default: defaultAnswers.platform,
					}).then((answer: unknown) => {
						const allbuilds = GulpfileConfigs.configs.filter((elem: PlatformBuildConfig) => elem.platform == answer);
						const buildChoices: ConfigNameInfo[] = [];
						for (const choice of allbuilds) {
							buildChoices.push({
								value: choice.build,
								name: choice.build,
								description: choice.buildDescription,
								disabled: choice.disabled
							});
						}
						select({
							message: `platform is: ${answer}   Select the build of platform `,
							choices: buildChoices
						}).then((answer: string) => {
							SelectedGulpfileConfig = allbuilds.find((elem: PlatformBuildConfig) => elem.build == answer)!;
							SelectedGulpfileConfig = initializeSelectedConfigBuild(SelectedGulpfileConfig);
							determineTsConfigFilePath(SelectedGulpfileConfig);
							glog(systemDetail(SelectedGulpfileConfig));
							done();
						}).catch((err: unknown) => {
							glog("ERROR gulpfile.js::inquirer/select() on 'platform' type" +
								"\n  errmsg: ${ERR}", {err: err});
							glog(systemDetail(SelectedGulpfileConfig));
							done();
						});
					}).catch((err: unknown) => {
						glog("ERROR gulpfile.js::inquirer/select() on 'build' type"+
							"\n  errmsg: ${ERR}", {err: err});
						glog(systemDetail(SelectedGulpfileConfig));
						done();
					});
			}
		});

		const initializeSelectedConfigBuild = (selConfig: PlatformBuildConfig): PlatformBuildConfig => {
//			selConfig.platformStateConfig = GulpfileConfigs.configs.find(elem => {
//				elem.platformName == selConfig.platform && elem.buildName == selConfig.build
//			});
//			selConfig.platformStateConfig!.base = GulpfileConfigs.base;
			selConfig.fileYAML = fileYamlAsConfig;
			const platformFileYaml: { build: PlatformBuildConfig }[] = 
					selConfig.fileYAML[selConfig.platform as keyof GulpYAML] as { build: PlatformBuildConfig }[];
			platformFileYaml.forEach((spec) => {
				const tsconfigFileYaml = spec.build.tsconfig;
				selConfig.tsconfig = {
					projectDirectory: selConfig.fileYAML.base.ProjectRootPath,
					configFilePath: tsconfigFileYaml.configFilePath,
					compilerOptionsOverrides: {
						sourceMap: tsconfigFileYaml.compilerOptionsOverrides.sourceMap,
						outDir: tsconfigFileYaml.compilerOptionsOverrides.outDir,
						thisUndefinedOutDirOverrides: tsconfigFileYaml.compilerOptionsOverrides.thisUndefinedOutDirOverrides,
						rootDir: tsconfigFileYaml.compilerOptionsOverrides.rootDir,
					},
					files: {
						tsclist: [] as string[]
					} as unknown
				} as TsConfigInfo;
			});
			const subfolderPaths = selConfig.html?.subfolderPaths;
			for (const path in subfolderPaths)
				GulpDict.set(path, subfolderPaths[path]);
			selConfig = resolveAllSubstitutions(selConfig, GulpDict.resolveString) as PlatformBuildConfig;
			return selConfig;
		}

		/**
		 * 
		 * @param input 
		 * @param stringFunction 
		 * @returns a copy of the changed input
		 */
		const resolveAllSubstitutions = (
			input: string | object | null, 
			stringFunction: (str: string) => string
		): string | Array<unknown> | object | null => {
			if (typeof input === 'string')
				// Apply the function if it's a string
				return stringFunction(input);
			else if (Array.isArray(input))
				// If it's an array, recursively process each element
				return input.map<unknown>(item => resolveAllSubstitutions(item, stringFunction));
			else if (typeof input === 'object' && input !== null) {
				// If it's an object, recursively process each property
				return Object.entries(input).reduce((acc, [key, value]) => {
					acc[key] = resolveAllSubstitutions(value, stringFunction) as string | object;
					return acc;
				}, {} as Record<string, string | object>);
			}
			// If it's a primitive (number, boolean, null, etc.), return as is
			return input;
		}
	});
}

/**
 * @function preclean -- private platform better used to delete one or more files
 *     set up as an array of string patterns to paths in same way as glob
 * @param done {pre-clean callback}
 */
function preclean(): Promise<void> {
	if (!SelectedGulpfileConfig.preclean)
		return Promise.resolve(glog("No preclean specified in config YAML"));
	else if (SelectedGulpfileConfig.preclean == null)
		return Promise.resolve(glog("preclean set to 'null': no preclean action"));
	else if (!SelectedGulpfileConfig.preclean.patterns)
		return Promise.reject(glog("ERROR: 'GulpfileConfig.preclean must specify a 'patterns' property if used"));
	else if (Array.isArray(SelectedGulpfileConfig.preclean.patterns) == false)
		return Promise.reject(glog("ERROR: 'GulpfileConfig.preclean.patterns' not specified as array in 'gulpfile.config.yaml'"));
	else
		return new Promise<void>((resolve, reject) => {
			const options = SelectedGulpfileConfig.preclean.options ?? {} as deleteAsyncOptions;
			if (options?.preview)
				options.dryRun = options.preview;
			if (typeof options.dryRun == "undefined") {
				glog(
"\n   In using Node 'deleteAsync' module, the default is that 'dryRun' is set 'true' for 'gulpfile.js' use." +
"\n   Actual deletions require that the 'preclean' property of 'gulpfile.config.yaml'" +
"\n   have `\"options\":{\"dryRun\":false}` or `\"options\":{\"preview\":false}` be set.");
				options.dryRun = true;
			}
			const patternsToDelete = GulpDict.resolveArrayOfStrings(SelectedGulpfileConfig.preclean.patterns);
			const patternReport: string[] = [];
			let nonExistentPattern = false;
			patternsToDelete.forEach(elem => {
				if (fs.existsSync(elem.match(/([^*]+)/)![1]) == false) {
					patternReport.push(`**  ${elem}`);
					nonExistentPattern = true;
				} else
					patternReport.push(`    ${elem}`);
			})
			glog((nonExistentPattern ? "ERROR:" : "")
				+ " Patterns to delete:\n     " + patternReport.join("\n     ") +
					(nonExistentPattern ? "\n  ** pattern not found!" : ""));
			if (options.dryRun == true)
				glog("preclean has been set in 'dryRun'/'preview' mode");
			deleteAsync(
				patternsToDelete,
				options
			).then((whatDone: string[]) => {
				if (options.dryRun == false)
					glog( "preclean: all items actually irretrievably deleted" );
				resolve(glog(JSON.stringify(whatDone, null, "  ")));
			}).catch((whatNotDone: unknown) => {
				reject(glog(JSON.stringify(whatNotDone, null, "  ")));
			});
		});
}

function processHtml(): Promise<void> {

	const setUpLinkScriptInput = (
		templateInfo: {from:string;to:string;ref:number},
		linkScriptInfo: LinkScriptItem[]
	): (string | {name:string;value:string}[])[] => {
		const theSetup: (string | {name:string;value:string}[])[] = [];
		for (const item of linkScriptInfo)
			if (typeof item == "string")
				theSetup.push(GulpDict.resolveString(item));
			else {  // form of object {href/src: value, more attribs}
				// an optional format for the YAML file where template HTML files with a 'ref' number
				//   that add 'link' or 'script' references to an HTML file where they are wanted
				if (templateInfo.ref &&
						(!item.refs || item.refs.findIndex(elem => elem == templateInfo.ref) < 0))
					continue;
				if (item.href && item.href.search(/\.css$/) > 0 && !item.rel)
					item.rel = "stylesheet";
				const objItem: {name:string;value:string;}[] = [];
				for (const prop in item)
					if (prop.length > 0 && prop != "refs")
						objItem.push({
							name: prop,
							value: GulpDict.resolveString(item[prop as keyof LinkScriptItem])
						});
				theSetup.push(objItem);
			}
		glog("processHtml()::setUpLinkScriptInput()")
		for (const item of theSetup)
			glog(`  item: ${JSON.stringify(item)}`);
		return theSetup;
	};

	const buildTag = (
		elemInfo: {
			elemName: string;
			attributes: {name:string;value:string}[];
			etago: boolean;
		}
	): string => {
		const tagLineLength = 70, halfWindow = 5;
		let tag: string = `\n    <${elemInfo.elemName} `;
		for (const attribute of elemInfo.attributes)
			if (attribute.name.length > 0)
				tag += ` ${attribute.name}="${attribute.value}"`;
		tag += ">";
		if (elemInfo.etago == true)
			tag += `</${elemInfo.elemName}>`;
		// breaking up line length:
		//  1) start with a position of the current position, add tagLineLength
		//  2) if position > tag.length, go to 7
		//  3) subtract to the halfWindow looking for SPACE char, go to #4
		//  4) if halfWindow reached, re-position to #1, start increasing position to find space, go to #5
		//  5) if #2 condition met, follow it; otherwise insert '\n' character at space
		//  6) loop back to #1
		//  7) end loop
		const tagChars = tag.split("");
		for (let segStart = 0, segEnd = tagLineLength, segPosn = segEnd - halfWindow;
				segEnd < tag.length;
				segPosn++ ) {
					if (tagChars[segStart + segPosn] == " ") {
						tagChars[segStart + segPosn] = "\n";
						segStart += segPosn;
						segEnd = segStart + tagLineLength;
						segPosn = segEnd - halfWindow;
					} else if (segStart + segPosn >= tag.length)
						break;
			}
		return tagChars.join("");
	}; // end of function

	const buildSection = (
		sectionInfo: {
			secName: string;
			marker: string;
			element: {
				name: string;
				etago: boolean;
				attrib: string;
				other?: {name:string;value:string};
			};
		},
		items: (string | {name:string;value:string}[])[]
	): string => {
		// works on links and scripts.special and scripts.module.tsconfigPathMaps
		let sectionContent = "",
			attributes: {name: string; value: string}[];

		for (const item of items) { // should be iterable, item will be string or object as an element
			// if only a string, then attributes must be built
			if (typeof item === "string")
				attributes = [
					{
						name:sectionInfo.element.attrib,
						value: item
					},
					sectionInfo.element.other || {name:"", value:""}
				];
			else // if an object, the attributes are already built
				attributes = item ;

			sectionContent += buildTag({
				elemName: sectionInfo.element.name,
				attributes: attributes,
				etago: sectionInfo.element.etago
			});
		}
		glog(`--- HTML Section build: ${sectionInfo.secName}\n` +
				`${sectionContent.split("\n    ")}`);
		return sectionContent;
	};

	glog("=== processHtml() start ===");
	return new Promise((resolve, reject) => {
//		gulpfileConfig.tsconfig.files.list = gulpfileConfig.tsconfig.files.list.map(elem => elem.replace(/"/g, ""));
//		const filesList: string[] = gulpfileConfig.tsconfig.files.emitted.jsFiles;
		const jsFiles = SelectedGulpfileConfig.tsconfig.files.tsclist.memlist!.filter(elem => elem.search(/\.js$/) > 0);
//		const subfolderPaths =  SelectedGulpfileConfig.html?.subfolderPaths ??  null
		const	htmlConfig: HTMLdef | null = SelectedGulpfileConfig.html;
		if (!htmlConfig || !htmlConfig.templateTransform || htmlConfig.templateTransform.length == 0 || htmlConfig == null)
			resolve();
		else {
			const htmlTemplateRequests: Promise<void>[] = [];
			for (const htmlTemplate of htmlConfig.templateTransform) {
			//	const transformRefNum = htmlTemplate.ref;
				htmlTemplateRequests.push(new Promise<void>((resolve, reject) => {
					const htmlPath = GulpDict.resolveString(htmlTemplate.from);
					fs.readFile(GulpDict.resolveString(htmlPath), "utf8", (err, content) => {
						if (err) {
							reject(glog(`ERROR reading the HTML file: ${htmlPath}` + "ERR: ${ERR}", {err: err}));
						} else {
							let gulpfileItems: ({name:string;value:string}[] | string)[] = [];
							// replace links and scripts sections
							const sectiondefs: {
								secName: string;
								marker: string;
								element: {
									name: string;
									etago: boolean;
									attrib: string;
									other?: {name:string;value:string};
								};
							}[] = [ {secName: "links", marker: "<!-- %%%LINK ELEMENTS%%% -->",
									element:  {name: "link", etago: false, attrib: "href", other:{name:"rel",value:"stylesheet"}} },
								/* 'links': (string | { rel: "stylesheet" | string; href: string; secName: string' })[];
										  "href": "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css", */
								{secName: "scripts", marker: "<!-- %%%SCRIPT ELEMENTS%%% -->",
									element: {name: "script", etago: true, attrib: "src"}}
							];
							let subsection;
							if (SelectedGulpfileConfig.html)
								for (const sectiondef of sectiondefs) { // as defined above
									for (const gulpconfigSection in SelectedGulpfileConfig?.html)
										if (gulpconfigSection == sectiondef.secName) {
											if (sectiondef.secName == "links")
		// LINK PROCESSING SECTION
												gulpfileItems = gulpfileItems.concat(setUpLinkScriptInput(
													htmlTemplate,
													SelectedGulpfileConfig.html[gulpconfigSection as keyof HTMLdef] as LinkScriptItem[]
												));
											else if (sectiondef.secName == "scripts") {
		// SCRIPT PROCESSING SECTION
												for (const subsectionProp in SelectedGulpfileConfig?.html.scripts) {
													subsection = SelectedGulpfileConfig.html.scripts[subsectionProp as keyof HtmlScripts];
													if (subsectionProp == "special" && (subsection as LinkScriptItem[]).length > 0)
														gulpfileItems = gulpfileItems.concat(setUpLinkScriptInput(
															htmlTemplate, subsection as LinkScriptItem[]));
													else if (subsectionProp == "module") {
														const moduleItems: typeof gulpfileItems = [];
														if ((subsection as HtmlModule).tsconfigPathMaps)
															for (const pathMap of (subsection as HtmlModule).tsconfigPathMaps as tsconfigPathMaps[]) {
																if (pathMap.ref && pathMap.ref.findIndex(elem => elem == htmlTemplate.ref) < 0)
																	continue;
																if (pathMap.from) {
																	const fromPattern = pathMap.from.match(/%%([^%]+)%%/);
																	SelectedGulpfileConfig.tsconfig.files.flatten =
																			pathMap.flatten || false;
															//		SelectedGulpfileConfig.tsconfig.files.scriptFilesToDir =
															//					GulpDict.resolveString(pathMap.to);
																	SelectedGulpfileConfig.tsconfig.files.filesCopyToDir =
																				GulpDict.resolveString(pathMap.filesCopyTo);
																	if (fromPattern) {
																		let toTarget: string;
																		const toTargets: string[] = [],
																			basePath = fwdSlash(`${GulpDict.get("ProjectRootPath")}/${fromPattern[1]}`);
																		SelectedGulpfileConfig.tsconfig.files.xpiledPath = basePath;
																		// const globs = globSync(`${basePath}/** /*.js`);
																		const excepts = pathMap.except;
			// setting JS files for <script>
																		for (const xpiledFile of jsFiles) {
																			if (pathMap.flatten == true)
																				toTarget = fwdSlash(GulpDict.resolveString(
																						`${pathMap.to}/${pathMod.basename(xpiledFile)}`));
																			else // pathMap.flatten == false
																				toTarget = fwdSlash(GulpDict.resolveString(
																						`${pathMap.to}/${xpiledFile.substring(basePath.length + 1)}`));
																			toTargets.push(toTarget);
																			if (excepts &&
																					excepts.findIndex(elem => xpiledFile.search(elem) >= 0) >= 0)
																				continue;
																			if (pathMap.typemodule  === true)
																				moduleItems.push([{name:"src",value:toTarget},{name:"type",value:"module"}]);
																			else
																				moduleItems.push(toTarget);
																		}
																	}
																	if (pathMap.order) {
																		let sortedItems: typeof moduleItems = [];
																		let idx: number;
																		for (const item of pathMap.order)
																			if ((idx = moduleItems.findIndex(elem => {
																				if (typeof elem  == "string")
																					return elem.search(item) >= 0;
																			})) >= 0) {
																				sortedItems.push(moduleItems[idx]);
																				moduleItems.splice(idx, 1);
																			}
																		if (moduleItems.length > 0)
																			sortedItems = sortedItems.concat(moduleItems);
																		gulpfileItems = gulpfileItems.concat(sortedItems);
																	} else // no pathMap.order specified
																		gulpfileItems = gulpfileItems.concat(moduleItems);
																}
															}
													}
												}
											}
											if (gulpfileItems.length > 0) {
												content = content.replace(new RegExp(`\\r?\\n\\s*${sectiondef.marker}`),
														buildSection(sectiondef, gulpfileItems));
												gulpfileItems = [];
											}
										}
									}
							// perform replace, add, deletion
							/*
							const ops = [ "replace", "add", "del" ];
							let items: /* del * / string[] & /* replace * / {fromPattern: string; toText: string;}[] &
									/* add * / {insertionPoint: string; insertionText: string}[];
							let sectionContent = content;
							for (const op of ops) {
								const htmlConfigOp = htmlConfig[op as keyof HTMLdef];
								if ((items = htmlConfigOp).length > 0)
									for (const item of items)
										switch (op) {
										case "replace":
											sectionContent = sectionContent.replace(item.fromPattern, item.toText);
											break;
										case "add":
											sectionContent = sectionContent.replace(item.insertionPoint, item.insertionPoint + item.toText);
											break;
										case "del":
											sectionContent = sectionContent.replace(item, "");
											break;
										}
							}
							content = sectionContent;
							const htmlWritePath = GulpDict.resolveString(htmlTemplate.to);
							fs.writeFile(htmlWritePath, content, (err) => {
								if (err)
									reject(glog(`ERROR writing the HTML file: '${htmlWritePath}'\nerror:` + "${ERR}", {err: err}));
								else
									resolve(glog(`processHtml()::fs.writeFile('${htmlWritePath}')`));
							}); */
						}
					});
				}));
			}
			Promise.all(htmlTemplateRequests).then(() => {
				glog("=== processHtml()::resolve() ===");
				resolve();
			}).catch((err: unknown) => {
				glog("=== processHtml()::reject('${ERR}') ===", {err: err});
				reject(err);
			});
		}
	});
}
/**
 * The function `getSpecialFiles` retrieves special files based on the provided special tag from a Gulpfile configuration
 * in TypeScript.
 * @param {"$" | "$"} specialTag - The `specialTag` parameter in the `getSpecialFiles`
 * function can have two possible values: `$` or `$`.
 * @returns The `getSpecialFiles` function returns a Promise that resolves to an array of tuples, where each tuple contains
 * two strings. The strings represent file paths related to the special tag provided as an argument to the function.
 */

function getSpecialFiles(
	specialTag: "$$TSCONFIGFILES" | "$$TSCONFIGINCLUDE"
): Promise<[string, string][]> {
	const list: [string, string][] = [];

	return new Promise<[string, string][]>((resolve, reject) => {
		if (specialTag == "$$TSCONFIGFILES") {
			if (SelectedGulpfileConfig.tsconfig.tsconfigJson.files) {
				for (const file of SelectedGulpfileConfig.tsconfig.tsconfigJson.files)
					list.push([fwdSlash(SelectedGulpfileConfig.tsconfig.projectDirectory),	file]);
			}
			resolve(list);
		} else if (specialTag == "$$TSCONFIGINCLUDE" && SelectedGulpfileConfig.tsconfig.tsconfigJson.include) {
			const globRequests: Promise<string[]>[] = [];
			for (const pattern of SelectedGulpfileConfig.tsconfig.tsconfigJson.include)
				globRequests.push(new Promise<string[]>((resolve, reject) => {
					glob(pattern).then((files: string[]) => {
						resolve(files);
					}).catch((err: Error) => {
						glog(`ERROR: getSpecialFiles()::glob('${pattern}')` +
							"\nerr: ${ERR}", {err: err});
						reject(err);
					});
				}));
			Promise.all(globRequests).then((files: string[][]) => {
				let joinedPatterns: string[] = [];
				for (const filesSet of files)
					joinedPatterns = joinedPatterns.concat(filesSet);
				for (const item of joinedPatterns)
					list.push([fwdSlash(SelectedGulpfileConfig.tsconfig.projectDirectory), item]);
				resolve(list);
			}).catch((err: unknown) => {
				reject(glog(`ERROR: getSpecialFiles()::glob().Promise.all(requests)` +
					"\nerr: ${ERR}", {err: err}));
			});
		}
	});
}

/**
 * @function copyOperations -- copy source files to destinations platform
 *   useful gulp plugins: gulp-rename, gulp-if, guil
 * @returns
 *   YAML guidelines "copy" property has 3 properties "js", "css", "img"
 *      each of these will have
 * 		"fromN": string[] (N = 1, 2,..) -- globbed use gulp.src()
 * 		"toN": string  (N = 1, 2, ...)   use gulp.dest()
 */

function otherCopyOperations(): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (!SelectedGulpfileConfig.copy ||
			SelectedGulpfileConfig.copy.find(elem => elem.bypass)?.bypass == true)
			return resolve(glog(
				"otherCopyOperations():: bypass was specified"
			));
		if (!SelectedGulpfileConfig.copy)
			resolve(glog(`otherCopyOperations(): `));
		else if (SelectedGulpfileConfig.copy.length == 0)
			resolve(glog(`otherCopyOperations(): 'Copy' property 'gulpfile.config.yaml' but has no items`));
		else {
			const eachCopyAction: Promise<void>[] = [];
			let copyActionCount: number = 0;
			glog(`otherCopyOperations::gulpCopyOperation ${SelectedGulpfileConfig.copy.length} copy items`);
			for (const copyAction of SelectedGulpfileConfig.copy) {
				if (("bypass" in copyAction) == true ||
						(SelectedGulpfileConfig.webpack?.useWebpack == true &&
									("webpackExcept" in copyAction) == true))
					continue;
				eachCopyAction.push(new Promise<void>((resolve, reject) => {
					copyActionCount++;
					const eachGlob: Promise<boolean>[] = [];
					const assertCopyAction: {from: string[]; to: string;flatten?:boolean} = copyAction;
					glog(`${assertCopyAction.from.length} assertCopyAction.from elements`);
					let globsCount: number = 0;
					for (const fromItem of assertCopyAction.from) {
						eachGlob.push(new Promise<boolean>((resolve, reject) => {
							globsCount++;
							glog(`#${globsCount} item: ${fromItem}`);
							const resolvedPattern = GulpDict.resolveString(fromItem);
							if (resolvedPattern.search(/TSCONFIGFILES|TSCONFIGINCLUDE/) > 0)
								getSpecialFiles(resolvedPattern as "$$TSCONFIGFILES" | "$$TSCONFIGINCLUDE")
								.then((filesSet: [string, string][]) => {
									// an array of a 3-string array which are all the TS files
									// 1. the effective project root path, 2. relative file path
									let fromPaths: string[] = [];
									for (const fileSet of filesSet)
										if (fileSet[1].search(/\.d\.ts$/) < 0)
											fromPaths.push(fwdSlash(pathMod.join(SelectedGulpfileConfig.tsconfig.projectDirectory, fileSet[1])));
									fromPaths = fromPaths.concat(
										SelectedGulpfileConfig.tsconfig.files.list.map(elem => elem.replace(/"/g, ""))
									);
									// only need first element with target path
									assertCopyAction.to = GulpDict.resolveString(assertCopyAction.to);
									verifyPath(assertCopyAction.to)
									.then(() => {
										//glog(`copyOperations::gulpCopyOperation::verifyPath success:}`);
										NodeFsMulticopy(fromPaths, assertCopyAction.to).then(() => {
											resolve(true);
										}).catch((err: unknown) => {
											reject(glog(`ERROR copyOperations(): performCopyAction()\n` +
												"  errmsg: '${ERR}'", {err: err}));
										});
									}); /*.catch((message) => {
										glog(`ERROR: copyOperations::gulpCopyOperation::verifyPath failure: ${message}`);
									}); */
								}).catch((err: unknown) => {
									reject(glog(`ERROR otherCopyOperations(): getSpecialFiles()\n` +
									"  errmsg: '${ERR}'", {err: err}));
								});
							else
							// all other files not TS or JS
								glob(resolvedPattern).then((matches) => {
									glog(`otherCopyOperations() -->\n      glob('${fromItem}')`);
									if (matches.length == 0) {
										glog("otherCopyOperations()::glob(): no matches to specified pattern" +
											"\n   check 'gulpfile.config.yaml' 'copy' specification to see if should be present.");
										resolve(true);
									} else {
										const toPath = GulpDict.resolveString(assertCopyAction.to);
										verifyPath(toPath).then(() => {
											NodeFsMulticopy(fwdSlash(matches), toPath).then(() => {
												resolve(true);
											}).catch((err: unknown) => {
												reject(glog(`ERROR otherCopyOperations(): performCopyAction(${toPath.length} files)` +
												"\n  errmsg: '${ERR}'", {err: err}));
											});
										});
									}
								}).catch((err: unknown) => {
									reject(glog(`ERROR otherCopyOperations()::gulpCopyOperations()::glob('${GulpDict.resolveString(fromItem)}')` +
									"\n  msg: '${ERR}'", {err: err}));
								});
						}));
						Promise.all(eachGlob).then((responses) => {
							resolve(glog(`otherCopyOperations(): Promise.all(GLOB) responses = ${responses.length}) globs count: ${globsCount}`));
						}).catch((err: unknown) => {
							reject(glog(`ERROR otherCopyOperations(): copyAction::Promise.all(GLOB): called counts = ${globsCount}` +
								"\n  errmsg: '${ERR}'", {err: err}));
						});
					}
				}));
			}
			Promise.all(eachCopyAction).then((responses) => {
				resolve(glog(`otherCopyOperations()::Promise.all(COPY ACTION): returned counts = ${responses.length}`));
			}).catch((err: unknown) => {
				reject(glog(`ERROR otherCopyOperations()::Promise.all(COPY ACTION): called counts = ${copyActionCount}` +
				"\n  errmsg: '${ERR}'", {err: err}));
			});
		}
	});
}


/* NodeJS fs.copyFile() requires both src and dest have file name
	This function does multiple file copying to ONE destination folder
	The path basename on the destination will be appended to the destination folder!!
*/
/*
function performCopyAction(
	copyItemSet: (string | { src: string; dest: string })[],
	dest?: string    // this value should be path to directory
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		let msg: string = "";
		if (typeof copyItemSet[0] == "string" &&
				typeof (copyItemSet[0] as unknown as {src:string;dest:string}).src == "undefined") {
			msg += "\tArg 'copyItemSet' is `string[]` type";
			if (typeof dest == "undefined")
				msg += "\tArg 'dest?' is undefined:" +
					"\nERROR arg 'dest' cannot be undefined if 'copyItemSet' is `string[]` type ";
			else
				msg += `\tArg 'dest?' is defined: '${dest}'`;
		} else if (typeof (copyItemSet[0] as unknown as {src:string;dest:string}).src == "undefined") {
			msg += "\tArg 'copyItemSet' is not of type `string[]` so should be type `{src:string;dest:string}[]";
		}
		glog(`copyOperations()::performCopyAction() variable analysis\n${msg}`);
		const eachCopyAction: Promise<boolean>[] = [];
		let copyActionCount: number = 1;
		glog(`${copyItemSet.length} copy actions to do\n${msg}`);
		for (const item of copyItemSet)
			eachCopyAction.push(new Promise((resolve, reject) => {
				let from: string, to: string;
				if (dest) {
					from = item as string;
					to = `${dest}/${pathMod.basename(item as string)}`;
				} else {
					const itemObj = item as {src:string;dest:string};
					from = itemObj.src
					to = itemObj.dest;
				}
				glog(`${copyActionCount++} copy:\n     '${from}'\n      -> ${to}`);
				fs.copyFile(from, to, (err) => {
					if (err)
						reject(glog(`ERROR performCopyAction(): request fs.copyFile(` +
							`\n   '${from}' ->` +
							`\n            '${to}')` +
							"\n  errmsg: '${ERR}'", err));
					else {
						glog(`copied: '${from}' -->\n           '${to}'`);
						resolve(true);
					}
				});
			}));
		Promise.all(eachCopyAction).then((responses) => {
			glog(`copyOperations(): performCopyAction::Promise.all() responses = ${responses.length})` +
				`\n          copyActionCount = ${copyActionCount}`);
			resolve(true);
		}).catch((err: unknown) => {
			reject(glog(`ERROR copyOperations(): performCopyAction():: Promise.all(), copyActionCount = ${copyActionCount}` +
			"\n  errmsg: '${ERR}'", err));
		});
	});
} */

function verifyPath(path: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (fs.existsSync(path) == false)
			mkdirp(path).then(() => {
				resolve(glog(`path '${path}' created`));
			}).catch((err: {message?: string}) => {
				reject(glog(`ERROR: verifyPath('${path}')\n err: ${err.message || err}`));
			});
		else
			resolve(glog(`path '${path}' already exists`));
	});
}

/**
 * @function moveRename --
 * 	reads array of tuples which can be type
 * 		1. [string, string] -- each string an absolute path, nothing relative, where left side is
 * 			current file name, right name is target name (name to change to). ${} substitutions allowed
 *				to be resolved by dictionary
 *			2. [string, TmoveRename] - left side is any globbed path as string, right side will have the TmoveRename type
 *				{dir?: string; ext?: string}.  dir is optional and will replace the dirname part of left side.
 * 			ext is optional and will replace the extension.
 * Example:  ["d:/project/part1/process.html", "d:/project/release/process.aspx"]
 *              will move process.html from its path and place is in a 'release' path with an 'aspx' extentions
 * 			["${release}/modules/*.xhtml", { "dir":".", "ext":"aspx"}]
 * 				will rename all 'xhtml' files in the resolved path to 'aspx' files
 * 				Note that 'dir' can be omitted if using '.' but the effect should be same
 *
 * @returns {Promise<void>}
 */
function moveRename(): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (SelectedGulpfileConfig.moveRename.find(elem => elem.bypass)?.bypass == true)
			return resolve(glog(
				"moveRename()::  bypass specifed"
			));
		const moves:  TmoveRename[] = SelectedGulpfileConfig.moveRename;
// first process globs
		const getFilesRequests: Promise<TmoveRename[]>[] = [];
		for (const move of moves) {
			if (SelectedGulpfileConfig.webpack && (SelectedGulpfileConfig.webpack.useWebpack == true) &&
					move.length == 3 && ((move as strTupleBool)[2] == true || (move as TmoveRenameForGlob)[2] == true))
				continue;
			getFilesRequests.push(new Promise<TmoveRename[]>((resolve, reject) => {
				if ((move as strTuple)[0] == "$$TSCONFIGFILES" || (move as strTuple)[0] == "$$TSCONFIGINCLUDE")
					getSpecialFiles((move[0] as ("$$TSCONFIGFILES" | "$$TSCONFIGINCLUDE"))).then((gottenfiles: [string, string][]) => {
					// an array of a 3-string array is returned:
					// 1. the effective project root path, 2. relative file path, 3. destination path
						resolve(gottenfiles as TmoveRename[]);
					}).catch((err: unknown) => {
						reject(glog(`ERROR: moveRename()::getSpecialFiles('${move[0]}', '${move[1]}')` +
								"\nerrmsg: ${ERR}", {err: err}));
					});
				else
					resolve([move as TmoveRename]);
			}));
		}
		Promise.all(getFilesRequests).then((collection:  TmoveRename[][]) => {
			const globbingRequests: Promise<strTuple[]>[] = [];
			for (const item of collection.flat()) {
				// item[0] should be left side part to be changed
				const item0 = fwdSlash(GulpDict.resolveString(item[0]));
				globbingRequests.push(new Promise<strTuple[]>((resolve, reject) => {
					const tupled: strTuple[] = [];
					if (item0.search(/[{[?*]/) < 0) { // no globbing characters, so this is straight up
						tupled.push([item0, fwdSlash(GulpDict.resolveString(item[1] as string))]);
						resolve(tupled);
					} else {  // item[1] is either strTuple or TmoveRenameForGlob
						if (typeof item[1] == "string" || typeof item[1] !== "object")
							glog("ERROR: gulpfile.ts::moveRename(): target of move/rename must be string or dir/ext object");
						let targetDir = ((item as TmoveRenameForGlob)[1].dir || pathMod.dirname((item as strTuple)[1])) as string;
						if (targetDir.search(/^\.|^\.\//) >= 0)
							targetDir = targetDir.substring(0, 1).replace(".", pathMod.dirname(item0)) +
										targetDir.substring(1);
						const targetExt = ((item as TmoveRenameForGlob)[1].ext || pathMod.extname((item as strTuple)[1])) as string;
						glob(item0).then((files) => {
							for (const file of files) {
								const fwdSlashfile = fwdSlash(file);
								const targetPath = fwdSlash(pathMod.resolve(
									`${targetDir}/${pathMod.basename(fwdSlashfile, pathMod.extname(fwdSlashfile))}.${targetExt}`
								));
								tupled.push([fwdSlash(file), targetPath]);
							}
							resolve(tupled);
						}).catch((err: unknown) => {
							reject(err);
						});
					}
				}));
			}
			Promise.all(globbingRequests).then((results: strTuple[][]) => {
				const fullTuple = results.flat();
				const moveOps: Promise<void>[] = [];
				for (const unitMove of fullTuple)
					moveOps.push(new Promise<void>((resolve) => {
						fs.rename(
							GulpDict.resolveString(unitMove[0]),
							GulpDict.resolveString(unitMove[1]),
							(err) => {
							if (err) {
								glog("ERROR: moveRename()--fs.rename()\n${ERR}", {err: err});
								resolve();
							} else {
								glog(`moved/rename: ${unitMove[1]}`);
								resolve();
							}
						});
					}));
				Promise.all(moveOps).then(() => {
					resolve(glog(`COMPLETE moveRename()::moveOps[total = ${moveOps.length}]`));
				}).catch((err: unknown) => {
					reject(glog("ERROR: moveRename()::globbingRequests[]\nerrmsg: ${ERR}", {err: err}));
				});
			}).catch((err: unknown) => {
				reject(glog("ERROR: moveRename()::globbingRequests[]\nerrmsg: ${ERR}", {err: err}));
			});
		}).catch((err: unknown) => {
			reject(glog("ERROR: moveRename()::getFilequests[]\nerrmsg: ${ERR}", {err: err}));
		});
	});
}


/**
 * @function importExportEditsSetup -- remove `import` and `export` statements from JS files for use in browser
 * @param gulpfileConfig
 */
function importExportEditsSetup(gulpfileConfig: PlatformBuildConfig): Promise<void> {
//	const webpackPrefix = "__";
//	const webpackExtension = ".wpack-copy";
	return new Promise<void>((resolve, reject) => {
		if (gulpfileConfig.platform == "browser") {
//			const flist = gulpfileConfig.tsconfig.files.list;
			const elist = gulpfileConfig.tsconfig.files.placedFiles.jsFiles;
			importExportEdits(
				elist, //, 
				gulpfileConfig.base.ProjectRootPath, // gulpfileConfig.tsconfig.projectDirectory,
				"" // copyToDir 
	//			{prefix: webpackPrefix, extension: webpackExtension}
			) .then(() => {
				resolve();
			}).catch((err: unknown) => {
				reject(err);
			});
		} else
			resolve();
	});
}



function editOperations(): Promise<void> {
	return new Promise<void>((resolve, reject) => {
// edits to all *.js files to remove 'import/export' for browser runtimes
		importExportEditsSetup(SelectedGulpfileConfig).then(() => {
			// now check for config.yaml edit specifications
			if (!SelectedGulpfileConfig.edits)
				resolve(glog("editOperations()::  gulpfile.config.yaml specifies no 'edits' property"));
			else if (SelectedGulpfileConfig.edits.find(elem => elem.bypass)?.bypass == true)
				resolve(glog("editOperations()::  bypass specified"));
			else {
				const edits: EditInfo[] = SelectedGulpfileConfig.edits.filter(elem =>  typeof elem.filepath == "string");
				const editActionRequests: Promise<void>[] = [];
				for (const editInfo of edits) {
					const fPath = GulpDict.resolveString(editInfo.filepath);
					glog(`editOperations()::glob('${fPath}')`);
					editActionRequests.push(new Promise((resolve, reject) => {
						glob(fPath).then((files) => {
							if (files.length == 0)
								resolve(glog(`No files found for path '${fPath}'`));
							else {
								let fileNum = 0;
								glog(`editOps()::glob('${fPath}') returns ${files.length} file(s)`);
								for (const file of files)
									fs.readFile(file, "utf8", (err, content) => {
										fileNum++;
										if (err)
											glog(`ERROR: editOperations()::fs.readFile('${file}')` +
												"\n  ${ERR}", {err: err});
										else if (Array.isArray(editInfo.fixes) == false)
												glog("ERROR: editOperations()::the Gulp config yaml" +
													" for 'edits.fixes must be an array of objects. Fix the YAML");
											else {
												for (const fix of editInfo.fixes) {
													if (fix.target && !fix.replace)
														glog("ERROR: gulpfile.ts::editOperations() has a 'target' without a 'replace'")
													const re = new RegExp(GulpDict.resolveString(fix.target), fix.flags || "");
													if (Array.isArray(fix.replace) == true)
														fix.replace = (fix.replace as string[]).join("");
													fix.replace = GulpDict.resolveString(fix.replace as string);
													const contentMatches = content.match(re);
													if (contentMatches == null)
														glog(`Target pattern '${fix.target}' has no matches in content`);
													else
														glog(`  Target pattern '${fix.target}' has ${contentMatches.length}` +
														" matches to content");
													content = content.replace(re, GulpDict.resolveString(fix.replace as string));
												}
												fs.writeFile(file, content, (err) => {
													if (err) {
														if (fileNum == files.length)
															reject(glog("ERROR: editOperations()--writeFile()\n${ERR}", {err: err}));
														else
															reject(glog("ERROR: editOperations()--writeFile()\n${ERR}", {err: err}));
													} else if (fileNum == files.length)
														resolve(glog(`editOperations('${file}') completed with no error`));
													else
														resolve(glog(`editOperations('${file}') completed with no error`));
												});
											}
									});
							}
						}).catch((err: unknown) => {
							reject(glog(`ERROR: editOperations()::glob(${fPath})` + "\n  ${ERR}", {err: err}));
						});
					}));
				}
				Promise.all(editActionRequests).then((response) => {
					resolve(glog(`All ${response.length} edit operations completed `));
				}).catch((err: unknown) => {
					reject(glog("ERROR: editOperations():: editActionRequests[]: ${ERR}", {err: err}));
				});
			}
		}).catch((err: unknown) => {
			glog(`ERROR: editOperations():: importExportEdits()\n  ${err}`);
		});
	});
}

/*
function webpackBundle() {
	const webpackInfo = SelectedGulpfileConfig.webpack;
	if (!webpackInfo || (!webpackInfo.useWebpack || webpackInfo.useWebpack != true)) {
		glog("webpack element not found or 'useWebpack' not set 'true'");
		return Promise.resolve();
	}
	const webpackConfigFilePath = GulpDict.resolveString(webpackInfo.GulpRelated.configJSpath);
	const srcFilesPath = GulpDict.resolveString(webpackInfo.GulpRelated.src);
	const destPath = GulpDict.resolveString(webpackInfo.GulpRelated.dest);
	const propMaxlen: number = 0;
	//(Object.keys(SelectedGulpfileConfig.base)).map(elem => {
	//	elem.length > propMaxlen ? propMaxlen = elem.length : null;
	//});
	const baseConfigSetup = (Object.keys(SelectedGulpfileConfig.base)).map(elem => {
		return `   "${elem}":${" ".repeat(propMaxlen - elem.length)}  ` +
			`'${(SelectedGulpfileConfig.base as any)[elem]}'`
	}).join("\n");
	glog("\nbase config setup --\n" + baseConfigSetup +
		"\nwebpack setup --" +
		`\n   config file path:       '${webpackConfigFilePath}'` +
		`\n   source files path:      '${srcFilesPath}'` +
		`\n   destination files path: '${destPath}'` +
		`\n   JS file entry point:    '${GulpDict.resolveString(webpackInfo.entryJS)}'` +
		`\n   bundle file name:       '${GulpDict.resolveString(webpackInfo.wpOutputSettings.filename)}'`
	);
	import(webpackConfigFilePath).then((configFile) => {
		const webpackConfig = configFile.webpackConfig || configFile;
		glog("imported config file --" + JSON.stringify(configFile, null, "  "));
	return src(srcFilesPath) // Replace 'src/entry.js' with the path to your entry file
		.pipe(webpackStream(webpackConfig))
		.pipe(dest(destPath)); // Replace 'dist/' with the desired output directory
	}).catch((err: unknown) => {
		glog("ERROR: ${ERR}", {err: err});
	});
} */
/* finish contains array of configuration objects to specify
	one or more actions to cleanup processeing. Each configuation will use the following parameters (only 'id' and 'path' required)
	id: string or number to identify a config (user can designate)
	path: sets the path where operations will be done during deletion.
		the current directory will be set to path to prevent possible wanted unanticipated deletions
	filter: this if a file mask pattern. If not set, default pattern = "*" to delete ALL files
	recursive: boolean that will include deletion of the masked pattern files in subdirectories
	deleteTree: boolean that will delete all subdirectories of the tree
	preview: instead of doing the deletion, this will create a report of all files/folders to be deleted

	del/delAsync options (Node module)
		Files and Directories Patterns: glob or regular expressions for matching file/dirs for deleteion
				deleteAsync(['dist/** /*.js']); // delete all *.js files under 'dist' tree
		Force: override any permissions
				deleteAsync(['temp'], { force: true });  // forced delete of all
		Dry Run: testing what would be deleted
				deleteAsync(['logs/** /*.log'], { dryRun: true }) // will return list of files to be deleted
		Concurrency: max number of deletion operations at one time.
				del(['cache'], { concurrency: 5 });
		Ignore: Specify exclusions from inclusion pattern
				del(['dist/**', '!dist/main.js']);  // dont delete main.js from this
		Dotfiles: exclude/include files starting with '.'
				del(['.*'], { dot: true })
		Match Base: match either basename or full path
				del(['** /test*.js'], { matchBase: true });
		Follow Symlinks: You can specify whether to follow symbolic links and delete the target files or directories.
				del(['dist/** /*'], { followSymlinks: true }); */
function finish(done: GulpCallback) {
	new Promise<void>((resolve, reject) => {
		const finishConfigs = SelectedGulpfileConfig.finish;
		// set the path specifier as cwd; if no path, already done
		if (!finishConfigs)
			resolve(glog("No cleanup config specifed or no 'path' specified for cleanup"));
		else {
			if (finishConfigs.markReadOnly)
				glob(GulpDict.resolveArrayOfStrings(finishConfigs.markReadOnly, true)).then((files) => {
					const fileReads: Promise<boolean>[] = [];
					for (const file of files)
						fileReads.push(new Promise<boolean>((resolve, reject) => {
							fs.stat(file, (err, testedFile) => {
								if (err) {
									glog("fs.stat(file) issue: ${ERR}", {err: err});
									reject(false);
								} else if (testedFile.isFile() == true) {
									fs.chmod(file, 0o444, chmodCallback);
									resolve(true);
								}
							});
						}))
					Promise.all(fileReads).then(() => {
						glog(`Completed marking `)
						resolve();
					}).catch((err: unknown) => {
						reject(err);
					});
				}).catch((err: unknown) => {
					glog("finish()::markupReadonly: ${ERR}", {err: err});
				});
			if (finishConfigs.delete) {
				const deleteAction: Promise<void>[] = [];
				for (const deleteConfig of finishConfigs.delete) {
					deleteAction.push(new Promise<void>((resolve, reject) => {
						const {id } = deleteConfig;
						if (!id)
							reject("Cleanup config requires an 'id' specifier (can be number or string)");
						else if (typeof id !== "number" && typeof id !== "string")
							reject("Cleanup config requires an 'id' of either type \"number\" or \"string\"");
						if (!deleteConfig.path)
							reject("Cleanup config requires an 'path' specified");
						const path = GulpDict.resolveString(deleteConfig.path);
						if (fs.existsSync(path) == false)
							reject(`The specified cleanup config 'path': '${path}' does not exist`);
						else { // all clear
							const options: deleteAsyncOptions = {
								dryRun: false,
								followSymlinks: true,
		//						force: false,
								dot: true
							};
							let pattern = `${path}/` +
								(deleteConfig.recursive == true ? "**" : "") +
								(deleteConfig.filter || "");
							if (deleteConfig.preview == true)
								options.dryRun = true;
							if (deleteConfig.deleteTree)
								pattern = `${path}/*`;
							deleteAsync(GulpDict.resolveString(pattern), options).then((result) => {
								glog(`deleteAsync() report:\n${result}`);
								resolve(glog(`Cleanup configuration ${deleteConfig.id} successful`));
							}).catch((err: unknown) => {
								reject(`ERROR: cleanUp()::deleteAsync('${pattern}', ${JSON.stringify(options)})\n ${err}`);
							});
						}
					}));
				}
				Promise.all(deleteAction).then(() => {
					resolve(glog(``));
				}).catch((err: unknown) => {
					reject(glog(`${err}`));
				});
			} else if (!(finishConfigs.markReadOnly || finishConfigs.delete))
				resolve(glog("This line should not log if 'finish' configured correctly" +
					"\nCheck that `markReadOnly` is an array, `delete` is array of delete objects"));
		}
	}).then(() => {
		glog(`finish() platform succeeded`);
		done();
	}).catch((err: unknown) => {
		glog("ERROR finish() platform--see log\n${ERR}", {err: err});
		done();
	});

	const chmodCallback = (err: unknown) => {
		if (err)
			glog("ERROR: chmod() issue: ${ERR}", {err: err});
	}
}

/*
const BrowserSetup = () => {
	browserSync.init({
		server: "./", // Serve files from the current directory
	});

	/// Watch HTML, CSS, JS files and reload on changes
	watch(["*.html", "css/*.css", "js/*.js"]).on("change", browserSync.reload);
};
*/


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function packaging(): Promise<boolean> {
	if (SelectedGulpfileConfig.build !== "release") {
		glog("platform 'packaging' can only be utilized for 'release' build");
		return Promise.reject();
	}
	const releaseDir = "release";
	return new Promise((resolve, reject) => {
		const copyOps: Promise<boolean>[] = [];
		const copies: string[] = [];
		const packageRoot = GulpDict.get("ProjectRootPath");

		const packageFiles: string[] = SelectedGulpfileConfig.package;

		copyOps.push(new Promise<boolean>((resolve, reject) => {
			for (const file of packageFiles) {
				const componentPath = `${packageRoot}/${releaseDir}/${file}`;
				if (fs.existsSync(componentPath) == false) {
					glog(`ABORT packaging(): all specified files in 'package' Config YAML property ` +
						`must exist for this operation: file '${componentPath}' not found`);
					reject();
				}
				copies.push(`${packageRoot}/${file}`);
				fs.copyFile(componentPath, packageRoot, (err) => {
					if (err) {
						glog(`ERROR packaging() - copyFile()\n${err.message || err}`);
						reject(false);
					} else {
						glog("file copy succeeded");
						resolve(true);
					}
				});
			}
		}));
		Promise.all(copyOps).then(() => {
			// now do the npm pack
			spawn("npm", ["pack"])
			.stdout.on("data", (data) => {
				console.log(data.toString());
			})
			.on("close", (code: number) => {
				if (code !== 0)
					glog(`ERROR: packaging() -- npm pack\ncode = ${code}`);
				else {
					const deleteOps: Promise<unknown>[] = [];
					for (const copy of copies)
						deleteOps.push(new Promise<unknown>((resolve, reject) => {
							deleteAsync(copy).then((response) => {
								resolve(response);
							}).catch((err: unknown) => {
								reject(err);
							});
						}));
					Promise.all(deleteOps).then(() => {
						resolve(true);
					}).catch((err: unknown) => {
						reject(err);
					});
				}
			});
		}).catch((err: unknown) => {
			glog(`ERROR: packaging()\n${err}`)
		});
	});
}

/**********************************
 * EXPORTED FUNCTIONS, VARIABLES
 *********************************/
export default
series(
	systemSetup,
	preclean,
	determineAllProjectFiles,
	tsCompile, // output to lib
	processHtml,
	scriptFileCopyOperations,
	otherCopyOperations,
	moveRename,
	editOperations,
//	packaging,
//	webpackBundle,
	finish
);
