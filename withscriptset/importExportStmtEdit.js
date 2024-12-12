"use strict";
import fs from "fs";
const importExportRE = /^import [^"']+['"][^"']+["'];?$|^export[^\r\n]+;?$/mg;
export default function delImportExportStmts(fileSet, withLogging) {
    let modified;
    if (fileSet)
        for (const file of fileSet) {
            modified = false;
            fs.readFile(file, "utf-8", (err, content) => {
                if (err) {
                    console.log(`Error reading ${file}\n${JSON.stringify(err, null, "  ")}`);
                }
                else {
                    if (withLogging == true)
                        console.log(`File '${file}' opened successfully for reading`);
                    const matches = content.match(importExportRE);
                    if (matches) {
                        modified = true;
                        for (const stmt of matches)
                            content = content.replace(stmt, "");
                        if (modified == true)
                            fs.writeFile(file, content, (err) => {
                                if (err)
                                    console.log(`Error writing ${file}\n${JSON.stringify(err, null, "  ")}`);
                                if (withLogging == true)
                                    console.log(`File '${file}' successfully written`);
                            });
                    }
                }
            });
        }
}
//# sourceMappingURL=importExportStmtEdit.js.map