"use strict";

import fs from "fs";
import { glob } from "glob";
import path from "path";
import { rename } from "fs/promises";
import JSON5 from "json5";

export default function moveFiles(fileList: string[], destination: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const moveOps: Promise<void>[] = [];

		const destDirEntry = fs.statSync(destination);
		if (destDirEntry.isDirectory() == false) {
			reject(`The specified destination path is not a directory`);
			return;
		}
		destination = path.resolve(destination).replace(/\\/g, "/");
		for (let file of fileList) {
			file = path.resolve(file).replace(/\\/g, "/");
			moveOps.push(new Promise<void>((resolve, reject) => {
				const renamePath = path.join(destination, path.basename(file));
				rename(file, renamePath).then(() => {
					if (file.search(/\.js\.map$/) > 0)
						fixJsMapFile(renamePath, file).then(() => {
							resolve();
						}).catch((err: unknown) => {
							reject(`Promise error with 'fixJsMapFile()': ${err}`);
						});
					else if (file.search(/\.js$/) > 0) {
						// fix relative paths in `import` statements in the js file	
						const relativeShift = path.relative(path.dirname(file), path.dirname(renamePath));
						fixJsFile(renamePath, relativeShift).then(() => {
							resolve();
						}).catch((err: unknown) => {	
							reject(`Promise error with 'fixJsFile()': ${err}`);
						});	
					} else
						resolve();
				}).catch((err: unknown) => {
					reject(`Promise error: rename()': ${err}`);
				});
			}));
		}
		Promise.all(moveOps).then(() => {
			resolve();
		}).catch((err: unknown) => {
			reject(`Promise error: Promise.all(moveOps): ${err}`);
		});
	});
}

// this code in place for moveFiles() to be called from command line
const [, calling, tsconfigFile ] = process.argv;

if (calling.search(/moveJsFiles.js/) >= 0) {
	if (!tsconfigFile) {
		console.error("Error: Missing required arguments for using 'moveFiles()'.");
		process.exit(1);
	}
	fs.readFile(tsconfigFile, "utf8", (err, contents) => {
		if (err) 
			console.error(`Node.readFile tsconfig failed: ${err}`);
		else {
			const jsonObj = JSON5.parse(contents);
			const dest = jsonObj.compilerOptions.outDir;
			glob(`${dest}/**/*.js*`).then((files: string[]) => {
				files = files.filter(elem => elem.search(/moveJsFiles\.js*/) < 0);
				moveFiles(files, dest) .then(() => {
					console.log("moveFiles() SUCCESS");
				}).catch((err: unknown) => {
					console.log(`Error during call to 'moveFiles()': ${err}`);
				});
			}).catch((err: unknown) => {
				console.log(`Error in calling 'glob()': ${err}`);
			});
			//const globOps: Promise<string[]>[] = [];
			// find the outDir
			/*
			if (jsonObj.files)
				globOps.push(new Promise<string[]>((resolve) => {
					resolve(jsonObj.files);
				}));
			if (jsonObj.include)
				for (const item of jsonObj.include)
					globOps.push(new Promise<string[]>((resolve, reject) => {
						glob(item).then((files: string[]) => {
							resolve(files);
						}).catch((err: unknown) => {
							reject(err);
						});
					}));
			Promise.all(globOps).then((results: string[][]) => {
				moveFiles(results.flat(), dest)
				.then(() => {
					console.log("SUCCESS")
				}).catch((err: unknown) => {
					console.log(`Err: ${err}`)
				});		
			}).catch((err: unknown) => {
				console.error(err);
			}); */
		}
	});
}

function fixJsMapFile(file: string, ref: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.readFile(file, "utf8", (err, contents) => {
			if (err)
				reject(`Node.readFile() fixJsMapFile error:  ${err}`);
			else {
				// get the source value in js.map file
				const source = contents.match(/sources":\["([^"]+)"\]/)![1];
				// must remove basename from reference file, keep the source path
				const newSource = path.relative(path.dirname(file), path.resolve(path.dirname(ref), source));
				// convert source and file to absolute, then make relative for
				contents = contents.replace(source, newSource.replace(/\\/g, "/"));
				fs.writeFile(file, contents, (err) => {
					if (err)
						reject(`Node.writeFile() error:  ${err}`);
					else
						resolve();
				});
			}
		});
	});
}


function fixJsFile(file: string, relativeShift: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.readFile(file, "utf8", (err, contents) => {
			if (err)
				reject(`Node.readFile() fixJsMapFile error:  ${err}`);
			else {
				// get all import statements in js file
				const importStatements = contents.match(/import\s+.*from\s+["'](\.\.?)[^"']+["']/gm);
				if (importStatements) {
					for (const statement of importStatements) {
						// get the path from the import statement
						const match = statement.match(/from\s+["']([^"']+)["']/);
						if (match && match[1]) {
							const importPath = match[1];
							// check if the path is relative or absolute
								// convert to absolute path
							const absoluteImportForm = path.resolve(importPath);
								// convert to relative path from the file location
							const relativePath = path.relative(path.resolve(relativeShift), absoluteImportForm);
							contents = contents.replace(importPath, "./" + path.basename(relativePath));
						}
					}
					fs.writeFile(file, contents, (err) => {
						if (err)
							reject(`Node.writeFile() error:  ${err}`);
						else
							resolve();
					});				
				} else
					resolve();  // no import statements found, resolve immediately
			}
		});
	});
}