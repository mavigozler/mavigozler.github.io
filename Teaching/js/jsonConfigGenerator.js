/******
 * set up package.json with this script:
 *   "vscodeFiles": "cd .vscode && tsc -p ./tsconfig.vscode.json && node ./tasksJsonGenerator.js && node ./launchJsonGenerator.js",
 *
 * then invoke "npm run vscodeFiles" to generate the tasks.json and launch.json files.
 ******/
import * as fs from "fs";
import { exit } from "process";
const launchJsonRoot = {
    version: "0.2.0",
};
const tasksJsonRoot = {
    version: "2.0.0"
};
const cwd = process.cwd().replace(/\\/g, "/");
function entry() {
    // find and read in all launch-XXXX.yaml and tasks-XXXX.yaml in 'configs' subdir
    if (fs.existsSync("../configs") == false) {
        const parentDir = cwd.split("/").at(-1);
        if (cwd.search(/.vscode/) < 0)
            console.error("Cannot find 'configs' subfolder or even the parent '.vscode' folder");
        else if (parentDir != ".vscode")
            console.error("Cannot find '.vscode' folder which should contain 'configs' subfolder");
        else
            console.error("Cannot find 'configs' subfolder under '.vscode'");
        exit(1);
    }
    // 
}
entry();
// console.log("Updated tasks.json!");
//# sourceMappingURL=jsonConfigGenerator.js.map