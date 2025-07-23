"use strict";

import fs from "fs";
import path from "path";
import process from "process";
import { glob } from "glob";
import JSON5 from "json5";
import { insertStringInString, strchcount } from "./stringsExtended.js";

export const importREstring = // /^\s*import(?<!\/\/\s*)\s+(type\s+){[^}]+}\s+from\s+"[^"']+["'];?|^\s*import(?<!\/\/\s*)\s+.*\s+from\s+["'][^"']+["'];?$|^\s*\/?\/?\s*import(?<!\/\/\s*)\s+"[^"']+["'];?$/;
//    "^\\s*import(?<!\\/\\/\\s*)\\s+(type\\s+){[^}]+}\\s+from\\s+\"[^\"']+[\"'];?|^\\s*import(?<!\\/\\/\\s*)\\s+.*\\s+from\\s+[\"'][^\"']+[\"'];?$|^\\s*\\/?\\/?\\s*import(?<!\\/\\/\\s*)\\s+\"[^\"']+[\"'];?$";
	"^\\s*import(?<!\\/\\/\\s*)\\s+(type\\s+)?{[^}]+}\\s+from\\s+[\"'][^\"']+[\"'];?|^\\s*import(?<!\\/\\/\\s*)\\s+(.|\\n)*?\\s+from\\s+[\"'][^\"']+[\"'];?$|^\\s*\\/?\\/?\\s*import(?<!\\/\\/\\s*)\\s+[\"'][^\"']+[\"'];?$";

const exportREstring = // /^\s*\/?\/?\s*export\s+{[^};]+};?$|^\s*\/?\/?\s*export default.*$/;
	"^\\s*export(?<!\\/\\/\\s*)\\s+{[^};]+};?$|^\\s*export(?<!\\/\\/\\s*) default.*$";
// const exportREflagged = new RegExp(exportREstring, "mg");
const importExportRE = new RegExp(importREstring + "|" + exportREstring, "mg");
const importExportReplace = "";//"\n\n";

const glogLines: string[] = [];
function glog(message: string) {
   glogLines.push(message);
}

/**
 * @function importExportEdits -- remove `import` and `export` statements from JS files for use in browser
 * @param fileList {string[]} -- paths to files that are to be modified.
 */
export function importExportEdits(
   fileList: string[], //,
   projectPath: string,
   copyToDir: string,
   //  webpack?: {
   //      prefix: string;
   //      extension: string;
//  }
): Promise<void> {
   console.log(`Executing 'importExportEdits()`);
	return new Promise<void>((resolve, reject) => {
//      if (!projectPath)
//         projectPath = process.cwd();  // project directory
//      if (!webpack)
//         webpack = {
//            prefix: "__",
//            extension: ".wwpack-copy"
//         };

/***********
 *   PART 1: get the list of files for processing
 ***********/
      // filelist might be tsconfig.json file and can be used to get file
      if (fileList[0].search(/tsconfig\.json|tsconfig\.[^.]+\.json$/) >= 0) {
         console.log("'fileList' arg is tsconfig.json-type: reading tsconfig");
         readTsConfig(fileList[0]).then((results: string[]) => {
            __processRequests(
               results, //,
               projectPath,
               copyToDir,
//               projectPath!,
//               webpack!
            ).then(() => {
               resolve();
            }).catch((err: unknown) => {
               reject(err);
            });
         }).catch((err: unknown) => {
            reject(err);
         });
      } else {
         console.log("'fileList' arg is NOT tsconfig.json-type, but array of files");
      // collect ALL files in a list by examining inputs for no directories, directories, files
         let finalFileList: string[] = [];
         const collectActions: Promise<string[]>[] = [];
         if (fileList.length == 0) // edits all *.js files in the directory this script is found
            finalFileList.push(process.cwd());
         else {
            for (const pathPattern of fileList)
               collectActions.push(new Promise<string[]>((resolve, reject) => {
                  if (pathPattern.search(/[*?]/) >= 0)
                     glob(pathPattern).then((files: string[]) => {
                        resolve(files);
                     }).catch((err: unknown) => {
                        reject(err);
                     });
                  else
                     resolve([pathPattern]);
               }));
            Promise.all(collectActions) .then((results: string[][]) => {
               finalFileList = finalFileList.concat(results.flat());
               __processRequests(
                  finalFileList, //,
                  projectPath,
                  copyToDir,
//                  webpack!
               ) .then(() => {
                  console.log(`SUCCESSFULLY resolved 'importExportEdits()'`);
                  resolve();
               }).catch((err: unknown) => {
                  reject(err);
               });
            }).catch((err: unknown) => {
               reject(err);
            });
         }
      }
	});
}

// all files to be processed have been collected as their paths in a strict array
function __processRequests(
   fileList: string[], //,
   projectPath: string,
   copyToDir: string
//   webpack: {
//      prefix: string;
//      extension: string;
//   }
): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      const editRequests: Promise<string | null>[] = [];

/***********
*   PART 2: generation of file text free of 'import' and 'export' statements
***********/
      // this loop deletes 'import' and 'export' statements in the files
      for (const file of fileList)
         editRequests.push(new Promise<string | null>((resolve, reject) => {
   /*			const file = `${gulpfileConfig.tsconfig.files.filesCopyTo}/` +
                  (gulpfileConfig.tsconfig.files.flatten == true ? path.basename(file) :
                  file.substring(gulpfileConfig.tsconfig.files.xpiledPath.length)); */
            fs.readFile(file, "utf8", (err, content) => {
               if (err)
                  reject(glog(`ERROR editOperations()::import/export edit-readFile('${path.basename(file)}') error` +
                        "\n  errmsg: ${err}"));
               else {
                  const cutLines = content.split("\n");
                  let lineNum = 0;  // this will indicate line num where import/export stops
                  const patternMatches: RegExpMatchArray | null = content.match(importExportRE);
                  const fpathSlice = insertStringInString(
                     file.substring(projectPath.length),
                     "", // webpack?.prefix, 
                     file.length - projectPath.length - path.basename(file).length);
                  if (patternMatches) {
                     glog(`${patternMatches.length} matches in file ${fpathSlice}:`);
                     for (const match of patternMatches) {
                        const maxLineLength = Math.min(cutLines[lineNum].length, match.length, 20);
                        const EOLposition = match.substring(0, maxLineLength).indexOf("\n");
                        const noEOLmatch = EOLposition < 0 ? match.substring(0, maxLineLength) : match.substring(0, EOLposition);
                        while (cutLines[lineNum].substring(0, maxLineLength) != noEOLmatch)
                           lineNum++;
                        glog(`  - ${strchcount(match, "\n")} newlines, line [${lineNum}]: '${match.substring(0, 50)}'`);
                     }
                     content = content.replace(importExportRE, importExportReplace);
                     //.replace("\n".repeat(patternMatches ? (patternMatches.length - 1) : 2), "");
                     //if (webpack?.extension)
                     //   file = file.substring(0, file.search(/\.js/)) + `${webpack?.extension}.js`;
   //                  if (gulpfileConfig.webpack?.useWebpack == true)
   //                    file = file.substring(0, file.search(/\.js/)) +
   //                           webpackExtension + ".js";
                     fs.writeFile(file, content, (err) => {
                        if (err)
                           reject(glog(`ERROR editOperations()::import/export edit-writeFile() error` +
                           `    '${path.basename(file)}'` +
                           "\n  errmsg: ${err}"));
                        else {
                           glog(
                              `editOperations()::import/export edit-writeFile() SUCCESS` +
                              `   '${path.basename(file)}'`);
                           resolve(`${path.basename(file)}`);
                        }
                     });
                  } else
                     resolve(null);
               }
            });
         }));
      // end of loop for deleting 'import'/'export' statement lines
      Promise.all(editRequests).then((processed: (string | null)[]) => {

/***********
*   PART 3: file compare 
**********

         // pre- and post-file compares
         // 'processed' files should only be re-written JS files
         const processedFiles = processed.filter(elem => elem != null);
         const codeStartSearch = /^\s*(const|let|var|function|class)\s+/;
         const adjustmentRequests: Promise<void>[] = [];
   //         if (webpackPrefix)
   //            copyToDir = gulpfileConfig.tsconfig.files.xpiledPath;
   //         else
   //            copyToDir = gulpfileConfig.tsconfig.files.filesCopyToDir;
         for (const elistFilePath of processedFiles)
            adjustmentRequests.push(new Promise<void>((resolve, reject) => {
               let extendedBaseName, 
                  origFilePath: string;
               if (copyToDir) {
                  extendedBaseName = elistFilePath.substring(copyToDir.length);
              // const origFilePath = `${gulpfileConfig.tsconfig.files.xpiledPath}${extendedBaseName}`;
                  origFilePath = `${copyToDir}${extendedBaseName}`;
               }
               let writeFile = false;
               //if (webpack?.extension)
               //   elistFilePath = elistFilePath.substring(0, elistFilePath.search(/\.js/)) + `${webpack?.extension}.js`;

               const ImportStartRE = /^\s*import/, 
                  ExportStartRE = /^\s*export/,
                  ImportEndRE = /['"][^'"]+['"];?$/,
                  ExportEndRE = /\};?$/,
                  ImportExportFullRE = new RegExp(ImportStartRE.source + ".*" + ImportEndRE.source + "|" +
                     ExportStartRE.source + ".*" + ExportEndRE.source);
               fs.readFile(elistFilePath, "utf8", (err, elistFileContent) => {
                  if (err)
                     reject(glog(`ERROR: importExportEdits()::fs.readFile('${elistFilePath}')` +
                        "\n  ${err}"));
                  else
                     fs.readFile(origFilePath, "utf8", (err, origFileContent) => {
                        if (err)
   /* The code snippet is a comment in TypeScript code. It seems to be logging an error message using the `glog` function. The
   error message indicates that there was an error while trying to read a file at the path specified by `origFilePath`. The
   error message is formatted to include the file path and the error message itself. *
                           reject(glog(`ERROR: importExportEdits()::fs.readFile('${origFilePath}')` +
                              "\n  ${err}"));
                        else {
                           glog(`importExportEdits() checking JS file line alignment for JSMAP for '${elistFilePath}`);
                           const elistFileLines = elistFileContent.split("\n");
                           const origFileLines = origFileContent.split("\n");
                           let lastImportExportLineNum = -1,
                              multiLineImportOrExport = false,
                              multiLineImport = false;
                              //multiLineExport = false;
                           for (let lineNum = 1; lineNum < elistFileLines.length || origFileLines.length; lineNum++) {
                              const elistLine = elistFileLines[lineNum - 1];
                              const origLine  =  origFileLines[lineNum - 1];
                              if (multiLineImportOrExport == true) {
                                 if (multiLineImport == true) {
                                    if (origLine.search(ImportEndRE)  >= 0) {
                                       multiLineImport = false;
                                       multiLineImportOrExport = false;
                                       lastImportExportLineNum = lineNum;
                                    }
                                 } else // multipLineExport == true
                                    if (origLine.search(ExportEndRE)  >= 0) {
                                       //multiLineExport = false;
                                       multiLineImportOrExport = false;
                                       lastImportExportLineNum = lineNum;
                                    }
                              } else if (origLine.search(ImportExportFullRE) >= 0)
                                 lastImportExportLineNum = lineNum;
                              else if (origLine.search(ImportStartRE) == 0) {
                                 multiLineImportOrExport = true;
                                 multiLineImport = true;
                              } else if (origLine.search(ExportStartRE) == 0) {
                                 multiLineImportOrExport = true;
                                // multiLineExport = true;
                              } else if (elistLine.length == 0) {
                                 //
                              } else if (elistLine.search(codeStartSearch) >= 0) {
                                 let index: number,
                                    difference: number = 0;
                                 const origLineMark = origFileLines[lastImportExportLineNum];
                                 for (index = lastImportExportLineNum + 1; index > 0; index--, difference++)
                                    if (elistFileLines[index - 1] == origLineMark)
                                       break;
                                 if (difference > 0) {
                                    writeFile = true;
                                    index = lastImportExportLineNum - 1 - difference;
                                    while (difference > 0) {
                                       elistFileLines.splice(index, 0, "");
                                       difference--;
                                    }
                                 }
                                 // may need an else for an error here
                                 break;
                              }
                           }
                           if (writeFile == true)
                              fs.writeFile(elistFilePath, elistFileLines.join("\n"), (err) => {
                                 if (err)
                                    glog(`ERROR: importExportEdits()::fs.writeFile('${elistFilePath}')` +
                                       `\n  '${err}'`);
                                 else
                                    resolve(glog(`importExportEdits()::fs.writeFile('${elistFilePath}')\n  SUCCESS`));
                              });
                           else
                              resolve(glog(`importExportEdits() no need to update '${elistFilePath}'`));
                        }
                     });
               });
            }));
         Promise.all(adjustmentRequests).then(() => {
            resolve(glog(`importExportEdits()  All adjustment requests succeeded`));
         }).catch((err: unknown) => {
            reject (err);
         });
            /*
            checkLineNumbers(elist).then((codeInfo: CodeInfo[]) => {
               glog("Pre- and post-import/export deletion line numbers:");
               for (const preEditInfo of preEditCodeInfo) {
                  const postEditInfo = codeInfo.find(elem => elem.file == preEditInfo.file);
                  if (postEditInfo) {
                     // only interested in the first line of the file that has code beyond import/export
                     const preLineNum = preEditInfo.lines[0].lineno;
                     const postLineNum = postEditInfo.lines[0].lineno;
                     glog(`\nFile '${preEditInfo.file}'\n   Line ${preLineNum}` +
                           ` Text ${preEditInfo.lines[0].lineText}` +
                        `\nFile '${postEditInfo.file}'\n   Line ${postLineNum}` +
                           ` Text ${postEditInfo.lines[0].lineText}`);
                     // this concern is that lines were lost that affect JSMAP
                     if (postLineNum < preLineNum)
                        fs.readFile(postEditInfo.file, "utf8", (err, content) => {
                           if (err)
                              reject(glog(`editOperations()::line adjustment-readFile('` +
                                    "${path.basename(postEditInfo.file)}') error\n  msg:'${ERR}'", err));
                           else {
                              // with lost lines, they need to be added back
                              content = insertStringInString(content, "\n",
                                             getCharPositionFromLineNumber(content, postLineNum));
                              fs.writeFile(postEditInfo.file, content, (err) => {
                                 if (err)
                                    reject(glog(`editOperations()::line adjustment edit-writeFile('${path.basename(postEditInfo.file)}') error` +
                                    `  msg:'${ERR}'`));
                                 else
                                    resolve(glog(
                                    `editOperations()::line adjustment edit-writeFile('${path.basename(postEditInfo.file)}') SUCCESS`));
                              });
                           }
                        });
                  } // should an 'else' be required? Shouldn't be
               }
               resolve();
            }).catch((err: unknown) => {
               reject(err);
            });
         */
      }).catch((err: unknown) => {
         reject(err);
      });
   });
}

function readTsConfig(filepath: string): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		fs.readFile(filepath, "utf8", (err, contents) => {
			if (err)
				console.error();
			else {
				let jsonObj;	
		
				try {
					jsonObj = JSON5.parse(contents);
				} catch (e) {
					reject(`Error: ${e}`);
				}
            glob(`${jsonObj.compilerOptions.outDir}/*.js`).then((files: string[]) => {
               resolve(files);
            }).catch((err: unknown) => {
               reject(err);
            });
            /*
				const globOps: Promise<string[]>[] = [];
				if (jsonObj.files)
					globOps.push(new Promise<string[]>((resolve) => {
						resolve(jsonObj.files);
					}));
				if (jsonObj.include) {
					for (const item of jsonObj.include)
						globOps.push(new Promise<string[]>((resolve, reject) => {
                     if (item.search(/[\*\?]/) >= 0)
                        glob(item).then((files: string[]) => {
                           resolve(files);
                        }).catch((err: unknown) => {
                           reject(err);
                        });
                     else
                        resolve(item);
						}));
				}
				Promise.all(globOps).then((allFiles: string[][]) => {
               resolve(allFiles.flat().map(elem => {
                  return path.resolve(jsonObj.compilerOptions.outDir, elem.replace(/\.ts$/, ".js"));
               }));
				}).catch((err: unknown) => {
					reject(err);
				});
            */
			}
		});
	});
}

/*
const [, , tsConfigPath, jsFilePath] = process.argv;

if (!tsConfigPath || !jsFilePath) {
  console.error("Error: Missing required arguments.");
  process.exit(1);
}
*/

// the following inline code is for calling 'jsFileEditing.js' from command line
if (process.argv) {
   // calling: arg0: the path of the script being run
   // fileList: any array of paths to files that are targets for editing [required]
   // copyToDir: 
   // projectPath: 
   // webpack: 

   const [, calling, fileList, projectPath, copyToDir , /* webpack */ ] = process.argv;
   if (calling.search(/jsFileEditing.js/) >= 0) {
      console.log(`fileList = '${fileList}'`);
      console.log(`projectPath = '${projectPath}'`);
      console.log(`copyToDir = '${copyToDir}'`);
      if (!fileList) {
         console.error("Error: Missing required arguments.");
         process.exit(1);
      }
   //   baseUrlPathsEditing(
   //      "D:\\dev\\Mavigozler GitHub\\mavigozler.github.io\\CatchAFire\\ExpressionsThroughHearts\\tsconfig.JsFileEditing.json",
   //      "jsFileEditing.js"
   //   ).then(() => {
         importExportEdits(
            [fileList], //, 
            projectPath,
            copyToDir, 
         //   {prefix: "", extension: ""}
         ).then(() => {
            console.log("Processing complete.")
         }).catch(err => {
            console.error("Error:", err)
         });

   //   }).catch((err: unknown) => {
      
   //   });
   }
}

