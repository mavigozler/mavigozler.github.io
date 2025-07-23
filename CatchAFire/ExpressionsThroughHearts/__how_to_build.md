# How to build

## Package.json Scripts

1. Run 'npm run vscodeFiles'
In the '.vscode' subdirectory are 'tasksJsonGenerator.ts' and 'launchJsonGenerator.ts' files. If necessary, make edits to them, then run the npm script. This will transpile both *.ts files and then run Node on each of the files, which will generate the final 'tasks.json' and 'launch.json' files.

2. Run 'npm run pregulp'
This will run 'tsc' on the 'tsconfig.preGulpBuild.json' file which specifies transpiling of 'preGulpBuild.ts' which is in the 'build/Gulp/pre' path, putting preGulpBuild.js in the same folder. The npm script than has Node run the script.

The script runs a series of commands (see `commandSequence` variable) that will do the following:

i. delete contents of 'build/Gulp/run' subdirectory

ii. execute 'tsc -p tsconfig.gulpfile.json' to do its transpilations

iii. compile the project: 'tsc -p tsconfig.json'

iv. run the 'baseUrlPathsEditing.js' which acts on all 'gulp*.js' files and getting info from the 'tsconfig.preGulpBuild.json' file

v) runs script 'moveJsFiles.js' to move Gulp files specified in the 'tsconfig.gulpfile.json' file

vi) runs the 'jsFileEditing.js' to do more editing using info in 'tsconfig.json' file

When that is complete, the project should be ready to use and deploy
