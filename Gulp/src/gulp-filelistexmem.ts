'use strict';
import pkg from "../../../package.json" assert { type: 'json' };
import PluginError from "plugin-error";
import through from "through2";
import path from "path";
import VinylMod from "vinyl";

export function gulpFileListMem(params: {
	memlist: string[] | null, //
	filename: string | null, // filename for the filelist output. If null, dont use file
			// output to variable as well as file (named by string)
	options?: GulpFilelistOptions
}) {
	const fileList: string[] = [];
	let filePath: string;

	const setOptions = params.options || {} as GulpFilelistOptions;

	return through.obj(function (
			file: VinylMod,
			enc: string,
			cb: (
				error?: Error | null,
				filePart?: unknown
			) => void
		) {
			if (file.isNull())
				return cb(null, file);
			if (file.isStream())
				return cb(new PluginError(pkg.name, 'Streams not supported'));
			if (setOptions.absolute)
				filePath = path.normalize(file.path);
			else if (setOptions.flatten)
				filePath = path.basename(file.path);
			else if (setOptions.relative)
				filePath = file.relative;
			else
				filePath = path.relative(file.cwd, file.path);

			if (setOptions.removeExtensions) {
				const extension = path.extname(filePath);

				if (extension.length)
					filePath = filePath.slice(0, -extension.length);
			}
			filePath = filePath.replace(/\\/g, "/");
			if (setOptions.destRowTemplate && typeof setOptions.destRowTemplate === 'string')
				fileList.push(setOptions.destRowTemplate.replace(/@filePath@/g, filePath));
			else if (setOptions.destRowTemplate && typeof setOptions.destRowTemplate === 'function')
				fileList.push(setOptions.destRowTemplate(filePath));
			else
				fileList.push(filePath);
			cb(null, file);
		},
		function (cb: () => void) {
			const buffer = (setOptions.destRowTemplate) ?
					Buffer.from(fileList.join('')) :
					Buffer.from(JSON.stringify(fileList, null, '  '));
			if (params.filename) {
				const fileListFile = new VinylMod({
					path: params.filename,
					contents: buffer
				});
				this.push(fileListFile);
			} else if (params.memlist && Array.isArray(params.memlist) === true)
				params.memlist = (buffer.toString().match(/"([^"]+)"/g) as string[])
					.map(elem => elem.replace(/"/g, ""));
			cb();
		}
	);
}

export default gulpFileListMem;

export type GulpFilelistOptions = {
	absolute?: boolean;
	flatten?: boolean;
	relative?: boolean;
	removeExtensions?: boolean;
	destRowTemplate?: string | ((path: string) => string);
};
