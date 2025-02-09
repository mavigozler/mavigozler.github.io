"use strict";

import fs from "fs";

const importExportRE = /^import [^"']+['"][^"']+["'];?$|^export[^\r\n]+;?$/mg; // Regex to match import and export statements

/**
 * @function delImportExportStmts - Deletes all import and export statements from the specified files
 * @param fileSet	- An array of file paths to be processed
 * @param withLogging	- Optional parameter to enable logging	
 */
export default function delImportExportStmts(fileSet: string[], withLogging?: boolean): Promise<void> {
	if (fileSet)
		return new Promise<void>((resolve, reject) => {
			let modified: boolean, 
				posn: number;
			const editOp: Promise<void>[] = [];

			console.log(`Processing ${fileSet.length} file(s)`);
			for (const file of fileSet) 
				editOp.push(new Promise<void>((resolve, reject) => {
					modified = false;
					fs.readFile(file, "utf-8", (err, content) => {
						if (err) {
							reject(console.log(`Error reading ${file}\n${JSON.stringify(err, null, "  ")}`));
						} else {
							if (withLogging == true)
								console.log(`File '${file}' opened successfully for reading`);
							const matches = content.match(importExportRE);
							if (matches) {
								modified = true;
								for (const stmt of matches)
									if ((posn = stmt.search(/export /)) >= 0) 
										content = content.replace("export ", "");
									else
										content = content.replace(stmt, "");
								if (modified == true)
									fs.writeFile(file, content, (err) => {
										if (err)
											reject(console.log(`Error writing ${file}\n${JSON.stringify(err, null, "  ")}`));
										else {
											if (withLogging == true)
												console.log(`File '${file}' successfully written`);
											resolve();
										}
									});
							} else {
								if (withLogging == true)
									console.log(`No import/export statements found in ${file}`);
								resolve();
							}
						}
					});
				}));
				Promise.all(editOp).then(() => {
					if (withLogging == true)
						console.log("All files processed successfully");
					resolve();
				}).catch((err) => {
					reject(console.log(`Error processing files\n${JSON.stringify(err, null, "  ")}`));
				});
		});
	else
		return Promise.reject("No files specified for processing");
}
