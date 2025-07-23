"use strict";

// this must stand alone for post transpilation processing
export { baseUrlPathsEditing };

import fs from "fs";
import {glob} from  "glob";
import JSON5 from "json5";

const noJsInImportStringRE = /from\s+["'][^"']+(?<!\.js)["'];/, 
   noJsInImportStringCaptureRE = /from\s+["']([^"']+(?<!\.js))["'];/;

const pathsKeyRE = /^(.*?)(?=\/\*$|$)/;

function baseUrlPathsEditing(
   fullPathToTsConfigJsonFile: string,
   fullPathToJsFileToEdit: string, // consider changing to a list of files
   option?: string
): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      console.log(`Executing 'baseUrlPathsEditing(\n` +
         `  ${fullPathToTsConfigJsonFile},\n` +
         `  ${fullPathToJsFileToEdit}\n` + 
			(option ? `  'option' set: "${option}"\n` : `   'option' not set`) +
         `)'`);
      if (fs.existsSync(fullPathToTsConfigJsonFile) == false)
         reject(localError(`The specified tsconfig.json file path does not exist`));
//      if (fs.existsSync(fullPathToJsFileToEdit) == false)
// reject(localError(`The specified target file for editing does not exist`));
      fs.readFile(fullPathToTsConfigJsonFile, "utf8", (err, json) => {
         // parse the json file
         if (err)
            reject(localError(`Error trying to read tsconfig file\nErr: ${err}`));
         else {
            let jsonObj, paths: {[key: string]: string[]} | null = null;
				const modifiedPathKeys: {[key: string]: string[]} = {};
            try {
               jsonObj = JSON5.parse(json);
					paths = jsonObj.compilerOptions.paths;
            } catch (e) {
               reject(localError(`Error parsing tsconfig file or finding the 'paths' property`));
               return;
            }
				// find the tsconfig.json `paths` property keys and values
            for (const path in paths) {
               const pathParts = path.match(pathsKeyRE);
               if (pathParts) {
                  const valueElems = paths[path];
                  const modiifiedValueElems = valueElems.map(elem => {
                     const valuePathParts = elem.match(pathsKeyRE);
                     if (valuePathParts)
                        return valuePathParts[1];
                     return elem;
                  });
                  modifiedPathKeys[pathParts[1]] = modiifiedValueElems;
               }
               else {
                  modifiedPathKeys[path] = paths[path].map(elem => {
                     const valuePathParts = elem.match(pathsKeyRE);
                     if (valuePathParts)
                        return valuePathParts[1];
                     return elem;
                  });
               }
            }
            if (Object.keys(modifiedPathKeys).length == 0) {
               console.log("No `paths` property was found in the tsconfig file");
               resolve();
            } else {
               console.log(`The following paths were found in the tsconfig file:\n` +
                  `  ${JSON.stringify(modifiedPathKeys, null, 2)}`);
					// open the JS file to edit import statements with path abbreviations
               // edit the files
					getJsFilesToEdit(fullPathToJsFileToEdit).then((JsFilesToEdit: string[]) => {
						for (let i = 0; i < JsFilesToEdit.length; i++) {
							const fullPathToJsFileToEdit = JsFilesToEdit[i];
							console.log(`Editing the file '${fullPathToJsFileToEdit}'`);
							// read the file to edit
							fs.readFile(fullPathToJsFileToEdit, "utf8", (err, contents) => {
								if (err)
									reject(localError(`Could not read '${fullPathToJsFileToEdit}' for editing\nErr: ${err}`));
								else {
									let found = false;
									for (const key in modifiedPathKeys) {
										if (contents.search(key) < 0) {
											console.log(`The key '${key}' was not found in the file '${fullPathToJsFileToEdit}'`); 
											continue;
										} else {
                                 console.log(`The key '${key}' was found in the file '${fullPathToJsFileToEdit}'`);
											found = true;
                              }
										const importFNames = contents.match(RegExp(`${key}[^"']+['"]`, "g"));
										if (importFNames) {
											for (let i = 0; i < importFNames.length; i++) {
												const importFNameParts = importFNames[i].match(/([^"']+)["']/);
												if (importFNameParts && importFNameParts[1]) {
													let newImportFName = importFNameParts[1];
													if (importFNameParts[1].search(/\.js$/) < 0)
														newImportFName += ".js";
													if (option)
														newImportFName = newImportFName.replace(key, option);
													else {
														let keyValue = modifiedPathKeys[key][0];
														if (keyValue.search(noJsInImportStringRE) >= 0)
															keyValue = keyValue.replace(noJsInImportStringCaptureRE, "from \"$1.js\";");
														console.log(`The key '${key}' was set to '${keyValue}'`);
														newImportFName = newImportFName.replace(key, keyValue);
													}  
													contents = contents.replace(importFNameParts[1], newImportFName);
													break;
												}
											}
										}
									}
									// write the modified
									if (found == false)
										console.log(`No paths were found in the file '${fullPathToJsFileToEdit}'`);
									else 
										fs.writeFile(fullPathToJsFileToEdit, contents, (err) => {
											if (err)
												reject(localError(`Could not save the modified '${fullPathToJsFileToEdit}'\nErr: ${err}`));
											else {
												console.log(`SUCCESSFULLY executed 'baseUrlPathsEditing()'`);
												resolve();
											}
										});
								}
							});
						}
					}).catch((err: unknown) => {
						reject(localError(`Error getting the files to edit\nErr: ${err}`));
					});
            }
         }
      });
   });
}

function getJsFilesToEdit(fullPathToJsFileToEdit: string): Promise<string[]> {
   return new Promise<string[]>((resolve, reject) => {
      if (fullPathToJsFileToEdit.search(/[*?]/) < 0) // if not a wildcard
         resolve([fullPathToJsFileToEdit]);
      else 
			glob(fullPathToJsFileToEdit).then((files: string[]) => {
				resolve(files);
			}).catch((err: unknown) => {
				reject(err);
         });
   });
}

function localError(msg: string): void {
   console.error(`Error: ${msg}`);
}

const [, calling, tsConfigPath, jsFilePath] = process.argv;

if (calling.search(/baseUrlPathsEditing.js/) >= 0) {
   if (!tsConfigPath || !jsFilePath) {
      console.error("Error: Missing required arguments.");
      process.exit(1);
    }
    
    baseUrlPathsEditing(tsConfigPath, jsFilePath)
      .then(() => {
         console.log("Processing complete.")
         process.exit(0);
      })
      .catch(err => {
         console.error("Error:", err);
         process.exit(1);
      });
}
