# Gulp System

## Setup

- Always ensure the latest version of Gulp is installed: pnpm add -D gulp@latest
- If using gulp-typescript, 'pnpm add -D gulp-typescript@latest
- Watch capabilities of Gulp: consider using them

The simplest test of how Gulp is working is the following code:

```js
function defaultTask(cb) {
   // place code for your default task here
   cb();  // placed at end of task code to return
}
exports.default = defaultTask;  // cjs form
```

Then on the command line, use 'gulp' or 'gulp default' after installing 'gulp-cli'

### Gulp TS transpilation

Several `*.ts` files make up the Gulp system. These files are compiled using a JSON configuration file `tsconfig.gulpfile.json` in the project directory, with a `tsconfig.json` file in the `./build/Gulp/src` path off the project directory. Transpilation output `*.js` files are delivered under `./build/Gulp/run` with added path segments with the file located.

### PreGulp Build

The Gulp `*.js` and any `js.map` source map files need to should normally be run in Node but are not even in a state for Node to run them. For one thing, `import` statements in these Node files are not processed to point with the relative path to dependency `*.js` files in their transpiled state. When `tsc` transpiles the `tsconfig.json` file with its properties `baseUrl` and `paths` and their values to locate these dependencies but the transpilation does not create a `.js` file with those `import` paths pointing to those dependencies. Post-transpilation processing is further required.

## Files

### Pre-Gulp Build Files

#### preGulpBuild.ts

This JS script is used to run a sequence of operations that prepare the entry point of the Gulp system, namely the 'gulpfile.js' itself.

#### baseUrlPathsEditing.ts

This file contains an exported public function `baseUrlPathsEditing`:

```ts
export function baseUrlPathsEditing(
   fullPathToTsConfigJsonFile: string,
   fullPathToJsFileToEdit: string, // consider changing to a list of files
   option?: string
): Promise<void>
```

This function reads a `tsconfig.json` file (Argument 1) to get its `baseUrl` and `paths` properties as they are used to construct `import` statements which point to mdule-specific dependencies. `tsc` needs to locate these dependencies directly through the these properties of the config JSON file. It when uses those values to open one or more JS files (Argument 2) and look for `import` statements that `tsc` used to resolve modules using those properties. Initially the function accepted only one JS that had to exist, but it now accepts a string with `globbing` characters to find JS files in a path. (A later version of this function might accept a string array to cover multiple files in multiple paths.)

This file also has a private function `getJsFilesToEdit()`  returning a Promise to utilize Node's `glob` module to get those JS file paths (not the actual files).

```ts
function getJsFilesToEdit(fullPathToJsFileToEdit: string): Promise<string[]>
```

#### moveJsFiles.ts

This file can be used to move (rename) multiple files (Argument 1) to a destination path (Argument 2) using the `moveFiles()` function.

```ts
export default function moveFiles(fileList: string[], destination: string): Promise<void> 
```

Internally it calls Node `rename` which works on single files and does not use directories in the 2nd argument. It has two private functions `fixJsMapFile` and `fixJsFile` as part of the move/rename process.

```ts
function fixJsMapFile(file: string, ref: string): Promise<void>
function fixJsFile(file: string, relativeShift: string): Promise<void> 
```

`moveFile()` detects file name extensions `*.js` and `*.js.map` and calls the appropriate private function. In the case of `*.js` files, `fixJsFile()` reads the file content to look for `import` statements and makes adjustments to any files pointed to by relative paths, to ensure that relative path naming is adjusted so a runtime MODULE_NOT_FOUND error is not encountered. For `*.js.map` files, it reads the JSON config for the `sources` property which points to `*.ts` source and makes the adjustment to that value so the source map can be found.

There is inline entry code that also looks for whether `moveFile()` is called from the command line to execute it.

#### jsFileEditing.ts

This file is currently utilized to convert JS files from being transpiled for Node to a browser environment. Its entry point function is `importExportEdits()`

```ts
export function importExportEdits(
   fileList: string[] //,
//   projectPath?: string,
//   webpack?: {
//      prefix: string;rings representing valid filesystem paths which include paths with globbing characters that
//      extension: string;
   }
): Promise<void>
```

Argument 1 is the vital part. It can take multiple st collect files in one directory. It will find all existing files first before doing its task. After finding the files, it modifies the files in place. It will delete the affected lines without changing existing lines that would affect source maps created.

#### postbuild-operations.ts

(disused)

---

### gulpfile.ts

Entry file to Gulp build system. Tasks are defined now as functions to follow Gulp 4 convention.

The file defines the following tasks in a `series` call

   ```gulpfile.ts
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
      packaging, // not yet implemented
      webpackBundle,
      finish
   );
   ```

### scriptFileBuilding.ts

File contains Gulp task as function `determineAllProjectFiles(done: GulpCallback): void`, `determineTsConfigFilePath(configInfo: TaskStageConfig): string`, and the `tsCompile()` which will use the 'gulp-typescript' module. The Gulp task as function `scriptFileCopyOperations(): Promise&lt;void&gt;` is also contained. It does the job of copying JS, JSMAP, and TS files (if source maps used) to locations specifed in GCJ file. It tests whether webpack will be used to see the operations to be done. For TS files, it does internal edits on import statements since TS files are copied to target directories.

### gulp-filelistexmem.ts

This is an adaptation of a Gulp plugin in the NPMJS repository. Originally this plugin output to a file a list of files to be transpiled, but the change was made to put the list in memory so that other Gulp tasks could make use of the list. This is even better since the list could be manipulated in any manner

### resolveImports.ts

This file can be used indepndently of Gulp actually, since it can read in the content of any TS file, parse its `import` statements, then resolve the dependencies. It opens TS files and does its analysis in multiple rounds to complete a search for all dependencies, keeping a  list of found files. The search/discovery process might find files already found, so the list is reduced to the unique set and then returned.

### webpack.config.ts

This file is described by the Webpack bundler system and its documentation is elswhere. The setup for this does not contain hard-coded specifications, but instead the specific "hard-coded" settings are contained in a 'webpack' property of the GCJ file for specifying tasks and stages.

## `gulpfile.config.yaml`

This is where all possible configurations are kept. A schema will be developed later.

```yaml
configNameInfo:    # format also for InquirerChoice type of Node module 'inquirer'
  - name: browser
    value: browser
    description: building interface for the browser
    disabled: false
    short: ''
  - name: node
    value: node
    description: building interface for Node
    disabled: false
    short: ''
default:
  task: browser
  stage: release
base:
  ProjectRootPath: 'D:/dev/Mavigozler GitHub/mavigozler.github.io/CatchAFire/ExpressionsThroughHearts'
  GulpRootPath: ${ProjectRootPath}/build/Gulp
  browserReleaseDirName: forBrowser
  browserReleasePath: ${ProjectRootPath}/${browserReleaseDirName}
  browserRelease: ${browserReleasePath}
  browserScriptsPath: ${browserPath}/js
  NodeClientPath: ${ProjectRootPath}/nodeJSclient
  LogsPath: ${ProjectRootPath}/logs
  ProjectSourcesSubDir: /src
  ProjectSourcesPath: ${ProjectRootPath}/${ProjectSourcesSubDir}
  LibsSourcesSubDir: /srclibs
  LibsSourcesPath: ${ProjectRootPath}/${LibsSourcesSubDir}
browser:
  # ---- build test of browser
  test:
    preclean:
      patterns:
        - ${projectRoot}/lib/*
        - ${projectRoot}/html/*.html
      options:
        force: true
        dryRun: false
    tsconfig:
      path: null  # will go to tsconfig.json, "" = dont use tsconfig.json
      compilerOptionsOverrides:
        outDir: ${projectRoot}/lib
        sourceMap: true
    html:
      templateTransform:
        - from: ${HTML_TEMPLATES}/ChemCalcTemplate.html
          to: ${HTML_REALPATH}/ChemCalc.html
      subfolderPaths:
        JS: ../js
        CSS: ../css
        HTML: ../html
        HTML_REALPATH: ${projectRoot}/html
        HTML_TEMPLATES: ${projectRoot}/html/Templates
        JSON_FILES: ${JS}
      links:  # // use '<!-- $${LINK ELEMENTS} -->' in HTML Template
          # something like "${CSS}/<name-of-CSS-fileÇ.css"
        - ${CSS}/ChemCalc.css
      scripts:  # use '<!-- $${SCRIPT ELEMENTS} -->' in HTML Template'
        special: https://cdnjs.cloudflare.com/ajax/libs/eventemitter3/5.0.1/index.min.js
         # "src": "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js",
         # "integrity": "sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6",
         # crossorigin": "anonymous" },
        module:   #  format: "%%<string>%%" match a substring in from than map
          tsconfigPathMaps:  # default: ./${JS}
            - from: '%%lib%%'
              to: ${JS}
              typemodule: false
              flatten: false
              except:
                - nobrowser.js
              filesCopyTo: ${HTML_REALPATH}/${JS}
              order:
                - ModuleController
                - UtilFuncs
      replace: []
      add: []
      del: []
    copy:
      - bypass: true
      - from:
          - ${projectRoot}/html/modules/*.xhtml
          - ${projectRoot}/html/modules/*.css
        to: ${JS}/modules
      - from:
          - ${projectRoot}/src/*.json
        to: ${HTML_REALPATH}/${JS}
    moveRename: []  # ["${projectRoot}/lib/index.js.map", "${projectRoot}/test/index.js.map"]
    edits:  # if "^" insert at start, if "$" append replace
      - bypass: false
      - filepath: ${projectRoot}/js/ModuleController.js
        fixes:
          - target: '%%%JSON FILES LOCATION%%%' # flags: gm
            replace: ${JS}
          - target: '%%%MODULES LOCATION%%%'  # flags: gm
            replace: ${HTML}/modules
    webpack:
      entryJS: ${projectRoot}/${JS}/ChemCalcjs
      dest: ${projectRoot}/${JS}
  # -----  build release of browser
  release:
    preclean:
      patterns:
        - ${browserRelease}*
        - ${projectRoot}/lib/*
        - ${projectRoot}/html/*.html
      options:
        force: true
        dryRun: false
    tsconfig:
      path: null
      compilerOptionsOverrides:
        outDir: undefined
        thisUndefinedOutDirOverrides: false
        sourceMap: true
        rootDir: null
    html:
      templateTransform:
        - from: ${HTML_TEMPLATES}/ChemCalcTemplate.html
          to: ${HTML_REALPATH}/ChemCalc.html
      subfolderPaths:
        JS: ./js
        CSS: ./css
        HTML: ${projectRoot}/html
        HTML_REALPATH: ${projectRoot}/html
        HTML_TEMPLATES: ${projectRoot}/html/Templates
        JSON_FILES: ${JS}
      links:
        - ${CSS}/ChemCalc.css
      scripts:
        special:
          - src: https://cdnjs.cloudflare.com/ajax/libs/eventemitter3/5.0.1/index.min.js
            integrity: sha512-2Ennqwp8s5F7iz0njdlWWKbd6bCby5nny78Wt9e9t780ErG6eb/vaFDkIt/j3EVhBXeCYH7uc0eFmOvc0EbwLA==
            crossorigin: anonymous
            refrrerpolicy: no-referrer
        module:
          tsconfigPathMaps:
            - from: '%%lib%%'
              to: ${JS}
              typemodule: false
              flatten: false
              except:
                - nobrowser.js
              filesCopyTo: ${browserReleasePath}/js
              order:
                - ModuleController
                - UtilFuncs
      replace: []
      add: []
      del: []
    copy:
      - bypass: false
      - from:
          - ${projectRoot}/html/ChemCalc.html
        to: ${browserReleasePath}
      - from:
          - ${projectRoot}/html/modules/*.xhtml
        to: ${browserReleasePath}/modules
      - from:
          - ${projectRoot}/html/modules/*.css
        to: ${browserReleasePath}/modules
      - from:
          - ${projectRoot}/css/*.css
        to: ${browserReleasePath}/css
      - from:
          - ${projectRoot}/html/modules/modulesForSP.json
        to: ${browserReleasePath}/js
    moveRename:
      - - ${browserReleasePath}/ChemCalc.html
        - ${browserReleasePath}/ChemCalc.aspx
      - - ${browserReleasePath}/modules/*.xhtml
        - dir: .
          ext: aspx
    edits:
      - filepath: ${browserReleasePath}/js/ModuleController.js
        fixes:
          - target: '%%%JSON FILES LOCATION%%%'
            replace: ${JS}
          - target: '%%%MODULES LOCATION%%%'
            replace: ./modules
      - filepath: ${browserReleasePath}/js/modulesForSP.json
        fixes:
          - target: .xhtml
            replace: .aspx
    webpack:
      entryJS: ${projectRoot}/${JS}/ChemCalc.js
      dest: ${projectRoot}/${JS}
    cleanup:
      - id: delete files/folders in 'build/Gulp/run'
        path: ${projectRoot}/build/Gulp/run
        filter: ^(?:(?!\.js$|\.js\.map$|\.tsbuildinfo$).)*$
        recursive: true
        preview: true
# ---- build Node
node:
  build: # ---- no other stage for Node
    preclean:
      patterns:
        - ${projectRoot}/js/**/*
        - ${projectRoot}/lib/**/*
        - ${projectRoot}/html/*Node*.html
      options:
        force: true
    tsconfig:
      path: tsconfig.node.json
      compilerOptionsOverrides:
        outDir: ${projectRoot}/lib
        sourceMap: true
    html:
      templateTransform:
        - from: ${HTML_TEMPLATES}/ChemCalcTemplate.html
          to: ${HTML_REALPATH}/ChemCalc4Node.html
      subfolderPaths:
        JS: ../js
        CSS: ../css
        HTML: ${projectRoot}/html
        HTML_TEMPLATES: ${projectRoot}/html/Templates
        TEST: ../test
      links:
        - ${CSS}/elements.css
        - ${CSS}/listing.css
      scripts:
        special: []
        module:
          tsconfigPathMaps:
            - from: '%%lib%%'
              to: ${JS}
              typemodule: false
              flatten: false
      replace: []
      add: []
      del: []
    copy: []
    moveRename: []
    edits:
      - filepath: ${projectRoot}/js/node/EventHandlers.js
        fixes:
          - target: "use strict";
            replace:
              - |-
                "use strict";

                import { sendRequest, setupMethod, formatDate, hideHeaderSet,
              - ' showHeaderSet, setupXDigest, deleteHeader, fillPrevious,'
              - |2+
                 addHeader, loadPreviousData } from "./ChemCalc.js";

      - filepath: ${projectRoot}/js/node/ChemCalc.js
        fixes:
          - target: |
              "use strict";
            replace:
              - |-
                "use strict";

                export { sendRequest, setupMethod, formatDate,
              - ' hideHeaderSet, showHeaderSet, setupXDigest,'
              - |2+
                 deleteHeader, fillPrevious, addHeader, loadPreviousData };

    webpack:
      entryJS: ${projectRoot}/${JS}/ChemCalcjs
      dest: ${projectRoot}/${JS}
    cleanup:
      - id: delete files/folders in 'build/Gulp/run'
        path: ${projectRoot}/build/Gulp/run
        filter: ^(?:(?!\.js$|\.js\.map$|\.tsbuildinfo$).)*$
        recursive: true
        preview: true
```

## Tasks

The tasks indicated below are what the Gulp system does to achieve its goals. Tasks in Gulp are done within a JS function.

### Logging with `glog`

A Gulp LOGgin function is defined in 'gulpfileGlobals.ts' and has been set up to report processing verbosely and errors:

   `glog(message: string, err?: unknown, level?: LogLevel): void`

### `systemSetup(done: GulpCallback)` [gulpfile.ts]

Initializes by reading in the configuration file 'gulpfile.config.yaml' using the support function `readGulpfileConfigYaml(argList: parseArgs.ParsedArgs): Promise&lt;WholeJSON&gt;` reads in the all-important 'gulpfile.config.json' (GCJ) and it only does that. The next call is to `loggerSetup()` which sets up the winston logging module in connection with `glog()`. `systemSetup()` uses the arguments passed to Gulp to determine the task to be done (not task as in Gulp task), usually whether to build for 'browser' or 'node'. The other argument is to determine what 'stage' to build (test, release). Gulp makes use of passed-in argument or uses Inquirer to query the user interactively for the 'task' and 'stage'. The inner function `initializeSelectedConfigBuild(selConfig: TaskStageConfig)` is provided to set up many objects that will be referenced in later tasks. Part of this is to set up a Gulp dictionary, set up in 'gulpfileGlobals.ts'.

### `preclean(): Promise&lt;void&gt;` [scriptFileBuilding.ts] is all about deleting files and directories

for the build. It looks for patterns and paths from the GCJ definitions. It allows for testing too (optional dryRun)

### `determineAllProjectFiles(done: GulpCallback)` is required to take inventory of all '.ts' and '.js' files

The first activity is to `determineTsConfigFilePath(configInfo: TaskStageConfig): string` which looks for the path in the file system where the 'tsconfig.json' file is. Once found, it reads the config.json file. It will not do the compilation/transpilation task but use the files to find dependencies by resolving `import` statements in scripts starting from the 'base' scripts defined in the `files`, `include` and `exclude` properties. It traces all these files in rounds of search of the `import` statements. This all starts with `resolveImports(params: {projectPath: string, configInfo: TaskStageConfig, filePatterns?:  string[], reportingFunction?: (...args: any[]) =&gt; void }): Promise&lt;DependencyInfo[]&gt;` [resolveImports.ts]. This is described later.

### `tsCompile()` [scriptFileBuilding.ts] is the next task that does the actual transpilation

### `processHtml(): Promise&lt;void&gt;` for the browser build will create the HTML (or ASPX for SharePoint) file

It requires specification info from GCJ file in the `html` property of the JSON:
   i - `templateTransform` property currently specifies the rename of an HTML template to the final HTML file. HTML templates will generally put in a marker for &lt;link&gt; and &lt;script&gt; elements in the &lt;head&gt; element to indicate placement. For multiple HTML templates, each template will have a `ref` property with a numeric value to indicate which template will be referenced in later configuration information

   ii - `subfolderPaths` is a property containing abbreviations for specify absolute and relative paths to be used in building the &lt;script&gt; and &lt;link&gt; elements.

   iii - `links` is used to specify the 'href' attribute of links if it is just a string, or multiple attributes presented as an object in GCJ. Gulp will create the link from the GCJ specification. For explanation of the `refs` property, see the next (scripts) paragraph.

   iv - `scripts` has two subparts. `special` refers to JS files that are external and downloaded using HTTPS: protocols for the 'src' attribute. This section will be an array of string or objects in which a string specifies only an 'src' attribute only for a &lt;script&gt; element or an object where the script element has more than one attribute. When the `refs` (note not `ref`) property is used for multiple HTML templates, the ref property is an array pf numeric values where the value specifies in which HTML template the &lt;script&gt; elements is to be constructed. Thus if a `refs` value is `refs: [ 2, 3]`, that means the script information will be put into template files with `ref: 2` and `ref: 3` in the `templateTransform` property.

   The 2nd subpart `module` is responsible for specifying how JS files from transpilation by TSC will be put into an HTML file, as well as other JS files not transpiled but existing as library code. For transpiled files the property `tsconfigPathMaps` in `module` will be defined. It is an array of a very complex object with this structure, which is show in the GCJ description below. It helps to place the scripts in the HTML file, whether to use attributes in the script tag, any special order to use in loading scripts, and which scripts to use in which HTML templates for building multiple HTML files in a complex web application.

   v - `replace` an array intended to specify REPLACEMENT of text/content in an HTML file [this has not been utilized and it may be put into disuse]

   vi - `add` an array intended to specify ADDITION of text/content in an HTML file [this has not been utilized and it may be put into disuse]

   vii - `del` an array intended to specify DELETION of text/content in an HTML file [this has not been utilized and it may be put into disuse]

   Within the processHtml() function includes code for handling all the 'html' section of GCJ, with inner functons to build specific HTLM elements, and to build sections of the HTML file with those elements. It includes Node filesystem functions `fs.readFile` and `fs.writeFile`

### `otherCopyOperations(): Promise&lt;void&gt;` performs the role of copying files that have been produced by transpilation or other processes to their final destinations

The 'copy' property in GCJ file specifies files to be moved, whether a single file with a full path or multiple files specified by a glob naming pattern. This process makes use of Node functions like 'makedirp' to create directories/paths since Node fs.copyFile() requires existing paths.

### `moveRename(): Promise&lt;void&gt;` is used to rename (Unix calls it 'move' although it does not require change of directory) files

GCJ contains an array of [string, string] (2 element tuples) that make up the 'moveRename' section. The first element of the tuple is the current filename and the second element is the name the file is to have. Since the 'moveRename' operation is done by `fs.rename()` Node function, constraints on renaming are placed by it.

### `editOperations(): Promise&lt;void&gt;` deals with JS, JSMAP, and TS files to set them up for browser or Node environment, and also for debugging with source maps

All edit operations are specified in CGJ in 'edits' and the spec is below.

`importExportEdits(gulpfileConfig: TaskStageConfig): Promise&lt;void&gt;` has the job of fixing up `import` and `export` statements in JS files. Browser scripts cannot have `import` and `export` statements in them so have to be removed (Webpack and Rollup do this, but I don't want to bundle all scripts in one JS file). Also with the use of source maps, TS files are placed in the same location as JS and JSMAP files

### `webpackBundle()` brings in Webpack to set up bundled script

It sets up the 'webpack.config.ts' file required by Webpack to set parameters and to initialize, if that option is chosen. The hard-coded parameters are specified in 'webpack' of GCJ file.

### `finish(done: GulpCallback)` specifies the last set of operations, such as cleanup (deletions)

### gulpfileGlobals.ts

In this file include the `glog()` logging function, working with winston module. Also included are support functions like `fwdSlash(theString: string): string` and the `GulpDictionarySystem` which is a class with four methods initialized at startup.

## Snippets

```ts
type dirEntryInfo = {
   entryPath: string;
   entryType: "FOLDER" | "FILE" | "UNKNOWN";
   isDeleted: boolean;
};


function checkLineNumbers(fileList: string[]): Promise<CodeInfo[]> {
   return new Promise<CodeInfo[]>((resolve, reject) => {
      const codeStartSearch = /^\s*(\/\/|\/\*)?\s*(const|let|var|function)\s+/;
      const codeInfo: CodeInfo[] = [];
      const lineDataReqs: Promise<void>[] = [];
      for (const file of fileList)
         lineDataReqs.push(new Promise<void>((resolve, reject) => {
            findLineNumber(file, codeStartSearch, true).then((data) => {
               codeInfo.push({
                  file: file,
                  lines: data
               });
               resolve();
            }).catch((err: unknown) => {
               reject(glog(`editOperations()::import/export - findLineNumber(): ERROR\n ${ERR}`));
            });
         }));
      Promise.all(lineDataReqs).then(() => {
         resolve(codeInfo);
      }).catch((err: unknown) => {
         reject(err);
      });
   });
}


function getEmittedFiles(): Promise<void> {
   return new Promise<void>((resolve, reject) => {
      const gulpfileConfig = SelectedGulpfileConfig.taskStateConfig!;
      const cwd = process.cwd();
      process.chdir(GulpDict.resolveString(gulpfileConfig.base.ProjectRootPath));
      exec('tsc --listEmittedFiles', (err, stdout, stderr) => {
      if (err) {
         glog(`ERROR: listEmittedFiles()  errmsg: ${err.message}`);
         if (stdout)
            glog(`ERROR: ${stdout}`);
         reject();
      } else {
         if (stderr)
            glog(`listEmittedFiles()...stderr ${stderr}`);
            if (stdout) { // stdout
               const tsFileLines = stdout.match(/^TSFILE:.*$/gm);
               if (tsFileLines) {
                  if (!gulpfileConfig?.tsconfig)
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     gulpfileConfig.tsconfig = {} as any;
                  if (!gulpfileConfig.tsconfig.emittedFilesList)
                     gulpfileConfig.tsconfig.emittedFilesList = {
                        jsFiles: tsFileLines.map(elem => {
                           const matches = elem.match(/TSFILE:\s+([^.]+\.js)$/);
                           if (matches) return matches[1];
                        }).filter(elem => elem !== undefined) as string[],
                        jsMapFiles: tsFileLines.map(elem => {
                           const matches = elem.match(/TSFILE:\s+([^.]+\.js\.map)/);
                           if (matches) return matches[1];
                        }).filter(elem => elem !== undefined) as string[]
                     };
               }
               glog(
                  "Emitted files:" +
                  `\nJS files:  (${gulpfileConfig.tsconfig.emittedFilesList.jsFiles.length} items)` +
                  `\n   ${gulpfileConfig.tsconfig.emittedFilesList.jsFiles.join("\n   ")}` +
                  `\nJS.MAP files: (${gulpfileConfig.tsconfig.emittedFilesList.jsMapFiles.length} items)` +
                  `\n   ${gulpfileConfig.tsconfig.emittedFilesList.jsMapFiles.join("\n   ")}`
               );
               process.chdir(cwd);
               resolve();
            }
         }
      });
   });
}
```
