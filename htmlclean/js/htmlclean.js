"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const jsdom_1 = require("jsdom");
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const js_beautify_1 = __importDefault(require("js-beautify"));
const beautifyOptions = {
    indent_size: 2,
    // indent_char: " " or "\t"
    indent_with_tabs: true,
    unformatted: ['img', 'br'], // Don't self-close
    content_unformatted: [], // Format all
    indent_inner_html: false,
    max_preserve_newlines: 2,
    /*  defaults
    preserve_newlines: true
   editorconfig: false,
   eol: "\n",
   end_with_newline: false,
   indent_level: 0,
   preserve_newlines: true,
   max_preserve_newlines: 10,
   space_in_paren: false,
   space_in_empty_paren: false,
   jslint_happy: false,
   space_after_anon_function: false,
   space_after_named_function: false,
   brace_style: "collapse" | "expand" | "end-expand" | "none",
   unindent_chained_methods: false,
   break_chained_methods: false,
   keep_array_indentation: false,
   unescape_strings: false,
   wrap_line_length: 0,
   e4x: false,
   comma_first: false,
   operator_position: "before-newline",
   indent_empty_lines: false,
   templating: ["auto"]
*/
};
function fwdSlash(text) {
    return text.replace(/\\/g, "/");
}
function processHtmlFile(fileName, tail) {
    fs_1.default.readFile(fileName, 'utf8', (err, content) => {
        if (err)
            console.log(`Error reading '${fileName}'\n  Err: ${err}`);
        else {
            let writeName;
            const dom = new jsdom_1.JSDOM(content, { includeNodeLocations: true });
            /* {
                const document = dom.window;
               // --- OPTIONAL: Handle inline <script> or <style>
               // For example, we could remove them:
               document.querySelectorAll("script").forEach((script: HTMLScriptElement) => {
               // Only remove inline scripts (i.e., without src attribute)
                  if (!script.src) {
                     const comment = document.createComment(
                        ` [REMOVED INLINE SCRIPT] `
                     );
                     script.replaceWith(comment);
                  }
               });
               document.querySelectorAll("style").forEach((style: HTMLStyleElement) => {
                       const comment = document.createComment(
                           ` [REMOVED INLINE STYLE] `
                       );
                       style.replaceWith(comment);
                   });
            } */
            const formattedHtml = js_beautify_1.default.html(dom.serialize(), beautifyOptions);
            if (tail)
                writeName = path_1.default.join(path_1.default.dirname(fileName), `${path_1.default.basename(fileName, ".html")}-${tail}${path_1.default.extname(fileName)}`);
            else
                writeName = fileName;
            writeName = fwdSlash(writeName);
            fs_1.default.writeFile(writeName, formattedHtml, "utf-8", (err) => {
                if (err)
                    console.log(`Error writing '${writeName}'\n  Err: ${err}`);
            });
        }
    });
}
function main() {
    const yamlArg = process.argv.find(elem => elem.search(/\.yaml/) > 0);
    if (!yamlArg)
        return console.error("No required 'yaml' file was found in arguments");
    fs_1.default.readFile(yamlArg, 'utf8', (err, content) => {
        if (err)
            console.log(`Error reading '${yamlArg}'\n  Err: ${err}`);
        else {
            let file$;
            const yamlcontent = js_yaml_1.default.load(content);
            for (const file of yamlcontent.files) {
                file$ = null;
                if (file.search(/^dir/) == 0) {
                    let dirEnt = null;
                    const fileComponents = file.match(/(dir\d+)\/(.*)$/);
                    if (fileComponents) {
                        for (dirEnt in yamlcontent.dirs)
                            if (dirEnt == fileComponents[1])
                                break;
                        if (dirEnt != null)
                            file$ = `${yamlcontent.dirs[dirEnt]}/${fileComponents[2]}`;
                    }
                    else
                        console.log(`A file starting 'dir' was found in list but did not have expected format of 'dirNNN'`);
                }
                else
                    file$ = `${yamlcontent.dirs.default}/${file}` || file;
                if (file$ != null)
                    processHtmlFile(file$, yamlcontent.tail);
                else
                    console.log(`File list entry '${file}' could not be processed. Check YAML file`);
            }
        }
    });
}
main();
//# sourceMappingURL=htmlclean.js.map