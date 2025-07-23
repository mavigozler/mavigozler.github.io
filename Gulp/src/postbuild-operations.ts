"use strict";

// postbuild-operations.ts

type ConfigJsonPaths = {
	[key: string]: string[];
};

type ContentChangeEdits = {
	title: string;
   from: string | RegExp;
   to: string;
}

interface FileChangeRequest {
	opTitle: string; // used in logging
	opId: number; // used to track and in logging
	contentChange: {
		filePattern: string;
		edits: ContentChangeEdits[];
	};
	done: boolean;
	dependsOn?: number[]; // this should be a contentChange ID
	copyFile?: {from: string; to: string;};
	moveRenameFile?: {from: string; to: string; };
	callbacks?: ((...args: FileChangeRequest[]) => Promise<void>)[];
}

import * as fs from "fs";
import * as globPkg from "glob";
const { glob } = globPkg;
import process from "process";
import path from "path";
import { fileURLToPath } from "url";
import processConfig from "./postbuild-operations-config.json" with {type: "json"};

export { isFileLocked, copyError };

function fwdSlash(str: string): string {
	return str.replace(/\\/g, "/");
}

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const dirname = fwdSlash(__dirname);
// next line has to make exception for working with the Gulp templates themselves
const ProjectRootPath = dirname.search(/Gulp Template/) > 0 ? dirname :
		dirname.substring(0, dirname.search(/build\/Gulp/) - 1);
const excludePattern = fwdSlash(`${dirname}/postbuild-operations.js`);
const targetJsPath = processConfig.targetJsPath || process.argv[1];
const fileChangeRequestList: FileChangeRequest[] = processConfig.fileChangeRequestList;

/**
 * Run the sequence of file change operations specified in the configuration file.
 */
export default function runSequence() {
	const fileChangeRequests = processConfig.fileChangeRequestList;
	for (const request of fileChangeRequests)
		request.contentChange.filePattern = eval(request.contentChange.filePattern);
	const startingExecutionDirectory = process.cwd();
	console.clear();
	console.log("=======================================" +
		`\nPOSTBUILD OPERATIONS START` +
		`\nscript argument 'argv[1]': ${process.argv[1]}` +
		`\nproject root: ${ProjectRootPath}` +
		`\nexclude pattern: ${excludePattern}` +
		"\n=======================================" +
		`\ncwd:   ${startingExecutionDirectory}` +
		`\nsetting working directory to:\n    ${__dirname}`
	);
	process.chdir(__dirname);
	if (processConfig.paths) {
		const pathKeyRE = /@([^/]+)\/\*/;
		const paths: ContentChangeEdits[] = [];
		
		// this code not necessary now with baseUrlPathsEditing.js file 
		for (const path in processConfig.paths) {
			if (path.search(pathKeyRE) == 0) {
				const pathKey = path.match(pathKeyRE);
				if (pathKey) {
               const pathElems: string[] = [];
               for (const pathElem of (processConfig.paths as ConfigJsonPaths)[path]) {
                  const idx = pathElem.search(/\/\*$/);
                  pathElems.push(idx > 0 ? pathElem.substring(0, idx) : pathElem)
               }
					paths.push({
						title: "Special task: resolving `baseUrl/paths` shorthand",
						from: new RegExp(` from\\s+"@${pathKey[1]}/\\w\\w*"`),
						to: pathElems[0] // only take first element
					});
            }
			}
		}
		
		fileChangeRequestList.unshift({
			opTitle: "Content change: replace 'paths' abbreviations in tsconfig.json",
			opId: fileChangeRequestList.length + 1,
			contentChange: {
				filePattern: `${fwdSlash(targetJsPath)}/**` + `/*.js`,
				edits: paths
			},
			done: false,
			dependsOn: [],
			copyFile: { from: "", to: ""},
			moveRenameFile: { from: "", to: ""},
			callbacks: []
		});
	}
	fileChangeTasks(fileChangeRequestList).then(() => {
		process.chdir(startingExecutionDirectory);
		console.log("=======================================" +
			"\nPOSTBUILD OPERATIONS FINISH:  SUCCESS" +
			"\n=======================================");
	}).catch((err) => {
		console.log("=======================================" +
			"\nPOSTBUILD OPERATIONS FINISH" +
			`\n    ERROR: ${err.message || err}` +
			"\n=======================================");
	});
}
//copyJSON();

function fileChangeTasks(
	fileChangesSpec: FileChangeRequest[],
): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		for (const item of fileChangesSpec) {
			console.log(`\n    >> File change task: ${item.opTitle} <<`)
			if (item.dependsOn && item.dependsOn.length > 0)
				// the dependency gets an entry in a callback list with opId
				for (const dependOnTask of item.dependsOn) {
					const request = fileChangesSpec.find(spec => spec.opId == dependOnTask);
					if (request) {
						if (!request.callbacks)
							request.callbacks = [];
						request.callbacks.push(taskProcess.bind(null, item));
					}
				}
			else
				taskProcess(item).then(() => {
					if (item.callbacks) // contains opId of req wanting callback
						for (const cb of item.callbacks)
							cb();
					resolve();
				}).catch((err) => {
					if (Array.isArray(err) == true)
						for (const item of err)
							console.log(item);
					else
						console.log(err.message || err);
					reject();
				});
		}
	});
}

function taskProcess(taskSpec: FileChangeRequest): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const action: Promise<void>[] = [];
		if (taskSpec.contentChange)  // contentChange
			action.push(new Promise<void>((resolve) => {
				contentChange(taskSpec.contentChange!).then(() => {
					console.log("--- ---End Content Change operation");
					resolve();
				}).catch((err: unknown) => {
					reject(err);
				});
			}));
		else if (taskSpec.copyFile)
			action.push(new Promise<void>((resolve) => {
				copyFile(taskSpec.copyFile!).then(() => {
					console.log("--- ---End Copy File operation");
					resolve();
				}).catch((err: unknown) => {
					reject(err);
				});
			}));
		else if (taskSpec.moveRenameFile)
			action.push(new Promise<void>((resolve) => {
				moveRenameFile(taskSpec.moveRenameFile!).then(() => {
					console.log("--- ---End Move/Rename File operation")
					resolve();
				}).catch((err: unknown) => {
					reject(err);
				});
			}));
		Promise.all(action).then(() => {
			taskSpec.done = true;
			console.log(`===== Task operation ${taskSpec.opTitle} complete\n===========`)
			resolve();
		}).catch((err: unknown) => {
			reject(err);
		});
	});
}

function contentChange(changeInfo: {
	filePattern: string;
	edits: ContentChangeEdits[];
}): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		console.log(
				"\n==========" +
				"\nContent Change task:" +
				`\n      pattern='${changeInfo.filePattern}',` +
				`\n      ${changeInfo.edits.length} edits specified`);
		glob(changeInfo.filePattern, {ignore: excludePattern})
		.then((files) => {
			console.log(`   glob("${changeInfo.filePattern}")    => count: ${files.length}`);
			for (let i = 0; i < files.length; i++)
				console.log(`      [${(i + 1)}] ${files[i]}`);
			const contentChangeRead: Promise<void>[] = [];
			for (let i = 0; i < files.length; i++) {
				contentChangeRead.push(new Promise<void>((resolve) => {
					fs.readFile(files[i], "utf8", (err, content) => {
						console.log(`======\nFile #${i + 1}:  fs.readFile('${files[i]}')`);
						if (err) {
							console.log(`ERROR: ${err.message || err}`);
							resolve();
						} else {
							let changeCount = 0;
							console.log(` file '${files[i]}' opened for reading`);
							for (const edit of changeInfo.edits) {
								console.log(` edit task: '${edit.title}'`)
								const matches: RegExpMatchArray | null = content.match(edit.from);
								if (matches == null) {
									console.log(`   Not found in content: change '${edit.from}' -> '${edit.to}'`);
									continue;
								}
								console.log(`   === Change pattern found:   ${edit.from} ->  \`${edit.to}\`` +
									`  match count = ${matches.length}`);
								for (let i = 0; i < matches.length; i++)
									console.log(`  [${(i + 1)}] ${matches[i]}`);
								content = content.replace(edit.from, edit.to);
								changeCount++;
							}
							if (changeCount > 0) {
								fs.writeFile(files[i], content, "utf8", (err) => {
									console.log(`======\nFile #${i + 1}: writeFile(${files[i]}`);
									if (err)
										console.log(`  ERROR: writing file '${files[i]}'\n    ` +
												`${err.message || err}\n`);
									else
										console.log(` File #${i + 1}: '${files[i]}' successfully modified`);
									resolve();
								});
							} else
								resolve(console.log(`File #${i + 1}: '${files[i]}' no need to modify`));
						}
					});
				}));
			}
			Promise.all(contentChangeRead).then(() => {
				//console.log(responses.join("\n"));
				resolve();
			}).catch((err: unknown) => {
				reject(err);
			});
		}).catch((err) => {
			console.log(`ERROR: ${err.message || err}`);
			reject();
		});
	});
}

function copyFile(copyInfo: {from: string; to: string;}, isRename?: boolean): Promise<void> {
	return new Promise<void>((resolve) => {
		let operation:  (src: fs.PathLike, dest: fs.PathLike, callback: fs.NoParamCallback) => void;

		console.log((isRename == false) ? "\n\n\n==========\nCopy File" : "\n==========\nMove/Rename File" +
				`\n  '${copyInfo.from}' -> '${copyInfo.to}'`);
		if (isRename == false)
			operation = fs.copyFile;
		else
			operation = fs.rename;

		operation(copyInfo.from, copyInfo.to, (err) => {
			if (err)
				console.log(
						`ERROR: ${err.message || err}` +
						`\n   resolved copy source path:  ${path.resolve(copyInfo.from)}` +
						`\n   resolved copy target path:  ${path.resolve(copyInfo.to)}\n`);
			else
				console.log("    File copy success");
			resolve();
		});
	});
}

function moveRenameFile(renameInfo: {from: string; to: string;}): Promise<void> {
	return copyFile(renameInfo, true);
}

/*
const targetFolder = `${ProjectRootPath}/html`;
if (fs.existsSync(targetFolder) == false) {
    console.log(`\nERROR:  post-transpile.js::fs.existsSync(): target folder '${targetFolder}' does not exist!`)
}

function copyJSON() {
	// copy JSON files to output
	const filePattern = `${ProjectRootPath}/src/*.json`;
	glob(filePattern, (err, files) => {
		console.log("\nglob() -- File filtering operation");
	if (err)
			console.log(`ERROR 'postbuild-operations.js'::glob()\n'${err.message}'`);
		else
			for (const file of files) {
				if (fs.existsSync(file) == false) {
					console.log(`ERROR:  post-transpile.js::fs.existsSync(): file '${file}' does not exist!`);
				} else {
					const targetFile = `${targetFolder}/${path.basename(file)}`;
					fs.copyFile(file, targetFile, (err) => {
						console.log("\nfs.copyFile() -- File copy operation")
						if (err)
							copyError(err, file, targetFolder);
						else
							console.log(`copy:  '${file}'\n  -> ${targetFile}`);
					});
				}
			}
	});
}
*/

function copyError(err: NodeJS.ErrnoException, file: string, folder: string) {
   console.log(`ERROR 'postbuild-operations.js'::fs.copyFile()\n'${err.message}'`);
   if (err.code == "EPERM") {
      console.log("EPERM issue");
      fs.stat(file, (err, stats) => {
         if (err)
            console.log(`ERROR 'postbuild-operations.js'::fs.stat() Problem getting info" +
					"\n'${err.message || err}'`);
         else
            console.log(`File '${file}':    ${modeReport(stats.mode)}`)
      });
      fs.stat(folder, (err, stats) => {
         if (err)
            console.log(`ERROR 'postbuild-operations.js'::fs.stat() Problem getting info" +
					"\n'${err.message || err}'`);
         else {
            console.log(`Folder '${folder}':   ${modeReport(stats.mode)}`)
         }
      });
//      isFileLocked(file);
   }
}

function isFileLocked(file: string) {
   fs.open(file, 'r+', (err, fd) => {
      if (err) {
         if (err.code && err.code === 'EACCES') {
            console.error('File is locked');
         } else {
            console.error(`Error opening file: ${err}`);
         }
         return;
      }
      console.log('File is not locked');
      fs.close(fd, (err) => {
         if (err) {
            console.error(`Error closing file: ${err}`);
         }
      });
   });
}

function modeReport(mode: number) {
   return `\n   File mode: ${(mode & 0o7777).toString()}` +
      `\n   Is directory? ${(mode & 0o170000) === 0o40000}` +
      `\n   Read permission: ${(mode & 0o400) !== 0}` +
      `\n   Write permission: ${(mode & 0o200) !== 0}\n`;
}

runSequence();


/*

type ConfigJsonJSChanges = {
	from: string | RegExp;
	to: string[];
};


function prepareProcessingFunctions(functionString: string): string {
	const codeParts = functionString.match(/\$\{([\}]+)\}/);
	if (codeParts)
		for (const codePart of codeParts) {
			if (codePart.search(/fwdSlash/) == 0) {

			} else if (codePart.search(/path/) == 0) {
				if (codePart.substring("path".length).search(/\.dirname/) == 0) {

				}
			}
		}
	return "";

	function innerFunction(innerFunctionString) {

	}
}
	*/