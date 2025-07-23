import fs from 'fs';
import { JSDOM } from 'jsdom';
import path from "path";
import jsyaml from "js-yaml";
import beautify from "js-beautify";

type dirsType = {
      default?: string;
      [key: `dir${number}`]: string
   };
type HTMLCleanYaml = {
   dirs: dirsType;
   files: string[];
   tail: string;
};

const beautifyOptions = {	
	indent_size: 2,
	// indent_char: " " or "\t"
	indent_with_tabs: true,
	unformatted: ['img', 'br'], // Don't self-close
	content_unformatted: [],    // Format all
	indent_inner_html: false,
	indent_level: 0,
   preserve_newlines: true,
   max_preserve_newlines: 3,
	wrap_line_length: 0,
	/*  defaults
   editorconfig: false,
   eol: "\n",
   end_with_newline: false,
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
   e4x: false,
   comma_first: false,
   operator_position: "before-newline",
   indent_empty_lines: false,
   templating: ["auto"]
*/
};

function fwdSlash(text: string): string {
   return text.replace(/\\/g, "/");
}

function processHtmlFile(fileName: string, tail?: string): void {
	fs.readFile(fileName, 'utf8', (err, content) => {
   	if (err)
         console.log(`Error reading '${fileName}'\n  Err: ${err}`);
   	else {
      	let writeName: string;
   		const dom = new JSDOM(content, { includeNodeLocations: true });
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
			const formattedHtml = beautify.html(dom.serialize(), beautifyOptions);
			if (tail)
				writeName = path.join(path.dirname(fileName), `${path.basename(fileName, ".html")}-${tail}${path.extname(fileName)}`);
			else 
				writeName = fileName;
			writeName = fwdSlash(writeName);
			fs.writeFile(writeName, formattedHtml, "utf-8", (err) => {
				if (err)
					console.log(`Error writing '${writeName}'\n  Err: ${err}`);
			});
      }
   });
}

function main(): void{
   const yamlArg = process.argv.find(elem => elem.search(/\.yaml/) > 0);
   if (!yamlArg)
      return console.error("No required 'yaml' file was found in arguments");
   fs.readFile(yamlArg, 'utf8', (err, content) => {
      if (err)
         console.log(`Error reading '${yamlArg}'\n  Err: ${err}`);
      else {
         let file$: string | null;
         const yamlcontent: HTMLCleanYaml = jsyaml.load(content) as HTMLCleanYaml;
         for (const file of yamlcontent.files) {
            file$ = null;
            if (file.search(/^dir/) == 0) {
               let dirEnt: string | null = null;
               const fileComponents = file.match(/(dir\d+)\/(.*)$/);
               if (fileComponents){
                  for (dirEnt in yamlcontent.dirs)
                     if (dirEnt == fileComponents![1])
                        break;
                  if (dirEnt != null)
                     file$ = `${(yamlcontent.dirs as any)[dirEnt]}/${fileComponents![2]}`
               } else
                  console.log(`A file starting 'dir' was found in list but did not have expected format of 'dirNNN'`);
            } else 
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