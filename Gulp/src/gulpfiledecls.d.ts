export { GulpCallback, ConfigNameInfo, CodeInfo, GulpYAML, YAMLArray,
	PlatformBuildConfig, GulpfileConfigsInfo, HTMLdef,
	tsconfigPathMaps, EditInfo, deleteAsyncOptions,
	LinkScriptItem, TsConfigInfo, TmoveRename, strTuple, TmoveRenameForGlob,
	GulpConfigBaseDefs, YAMLObject, WholeYAML, strTupleBool, TsConfigJsonElements,
	glogVerbosity, HtmlScripts, HtmlModule };
//	ConfigStage, ConfigNameStageInfo, SelectedConfig, TsConfigJson,

import { DependencyInfo } from "./resolveImports.ts";
import { GulpFilelistOptions } from './gulp-filelistexmem';

type YAMLValue = string | number | boolean | null | YAMLArray | YAMLObject;
interface YAMLObject {
  [key: string]: YAMLValue;
}
type YAMLArray = Array<YAMLValue>

type WholeYAML = Record<string, YAMLValue>;

type glogVerbosity = "minimal" | "medium" | "high" | 1 | 2 | 3;

type ConfigNameInfo = {
	value: string;
	name: string;
	description?: string;
	short?: string;
	disabled?: boolean | string;
}
interface GulpYAML {
	configNameInfo: ConfigNameInfo[];
	options: {
		loggingVerbosity: glogVerbosity;
	};
	default: YAMLObject;
	base: GulpConfigBaseDefs;
	platform: {
		build: PlatformBuildConfig;
	}[];
}

interface GulpfileConfigsInfo {
	gulpfileJSdirectory: string; // location of 'gulpfile.js'
	fileYAML: WholeYAML;  // contents of YAML file
	configNameInfo: ConfigNameInfo[]; // formatted for inquirer
	base: GulpConfigBaseDefs; // important 'base' definitions
	configs: PlatformBuildConfig[];
	defaultConfig: {
		platform: string;
		build: string;
	}
}

interface GulpConfigBaseDefs {
	ProjectRootPath: string; // "D:/dev/_Projects/<project-name>",
	GulpRootPath: string; // "${ProjectRootPath}/build/Gulp",
	browserSubDir: string; // "/browser"
	browserPath: string; // "${ProjectRootPath}/${browserSubDir}",
	browserScriptsPath: string; // "${browserPath}/js",
	NodeClientPath: string; // "${ProjectRootPath}/nodeJSclient",
	LogsPath: string; // "${ProjectRootPath}/logs",
	ProjectSourcesSubDir: string; // "/src",
	ProjectSourcesPath: string; // "${ProjectRootPath}/${ProjectSourcesSubDir}",
	LibsSourcesSubDir: string; // "/srclibs",
	LibsSourcesPath: string; // "${ProjectRootPath}/${LibsSourcesSubDir}"
	[key: string]: string;
}

type GulpCallback = () => void;

type EditInfo = {
	filepath: string;
	fixes: { target: string; replace: string | string[]; flags?: string}[];
};


type CodeInfo = {
	file: string;
	lines: {
		lineno: number;
		lineText: string;
	}[];
};

// component of type HTMLdefs
type tsconfigPathMaps = {default: string;} & {
	from:string;
	to:string;
	filesCopyTo: string;
	typemodule?:boolean;
	except?:string[];
	flatten?:boolean;
	order?: string[];
	ref?: number[];
};

// component of platformStateConfig
type deleteAsyncOptions = {
	force?: boolean;
	dryRun?: boolean;
	preview?: boolean;
	concurrency?: number;
	dot?: boolean;
	matchBase?: boolean;
	followSymlinks?: boolean;
}

// component of type HTMLdef
type LinkScriptItem = string | {
	href: string;
	rel?: string;
	integrity?: string;
	crossorigin?: string;
	refs?: number[];
};

type HtmlModule = {
	verbosity: boolean;
	tsconfigPathMaps: tsconfigPathMaps[];
	// (Record<string, string> | string)[];
};

type HtmlScripts = {
	special: LinkScriptItem[];
	module: HtmlModule
};

type HTMLdef = {
	templateTransform: {from: string; to: string; ref:number;}[];
	subfolderPaths?: { [key: string]: string };
	links?: LinkScriptItem[];
	scripts?: HtmlScripts;
	replace?: { 
		fromPattern: string; 
		toText: string 
	}[];
	add?: { 
		insertionPoint: string; 
		insertionText: string 
	}[];
	del?: string[]; 
};

interface TsConfigJsonElements {
	compilerOptions:
		{[key: string]: string | string[] | object }
		& {
			baseUrl?: string;
			paths?: {[key: string]: string[]};
		};
	files?: string[];
	include?: string[];
	exclude?: string[];
	references?: string[];
	extends?: string;
}

 // component of 'interface PlatformBuildConfig'
type TsConfigInfo = {
	configFilePath: string;
	projectDirectory: string;
	compilerOptionsOverrides: {
		// gulp-typescript specified
		sourceMap: boolean;
		outDir: string;
		thisUndefinedOutDirOverrides: boolean;
		rootDir: string; // use with outDir to control output dir structure
	};
	files: {
		emitted: {
			jsFiles: string[];
			jsMapFiles: string[];
		};
		base: DependencyInfo[];
		dependencies: DependencyInfo[];
		placedFiles: {
			jsFiles: string[];
			jsMapFiles: string[];
			tsFiles: string[];
		};
		list: string[];  // the file list retrieved by module
		tsclist: {
			memlist: string[] | null;
			filename: string | null;
			options?: GulpFilelistOptions;
		};
	//	path: string; // required for use of gulp-filelist modification
		xpiledPath: string;  // path to there transpiled files are delivered
		filesCopyToDir: string; // from tsconfigPathMaps 'filesCopyTo'
		releaseSubDir: string;
//		scriptFilesToDir: string;  // from tsconfigPathMaps 'to'
		flatten: boolean; // from tsconfigPathMaps 'flatten'
		allInputFiles: string[];
	}
	tsconfigJson: TsConfigJsonElements;
};

// components of PlatformBuildConfig
type TmoveRename = strTuple | strTupleBool | TmoveRenameForGlob;
type strTuple = [ string, string ];
type strTupleBool = [ string, string, boolean ];
type TmoveRenameForGlob = [ string, {dir?: string; ext?: string;}, boolean ];

type WebpackConfig = {
	useWebpack: boolean;  // changes how the build is done if webpack used
	name: string; // webpack.config option to name this config (for multiple configs)
	mode: "none" | "development" | "production";
	context: string; // a property useful to webpack.config.js
	entryJS: string; // JS file that is the entry point
	resolve: {
		extensions: string[]; // [".ts", ".js"],
		modules: string[]; //[  "srclibs", "node_modules" ]
	};
	wpOutputSettings: {
		path: string; // SelectedGulpfileConfig.base.browserPath
		filename: string; // this will be bundle file name SelectedGulpfileConfig.webpack?.bundleName,
		clean?: boolean; //  cleans the output directory before emitting anything
		pathinfo?: boolean | undefined; // "verbose"; // "verbose"
	};
	htmlPlugin: {
		htmlTemplatePath: string;  // path to HTML template file to use
		filename: string;  // name of finished html/aspx file
	};
	GulpRelated: {
		src: string; // should be globbed string pointing to JS files to be bundled
		dest: string; // where the bundled JS file will go
		configJSpath: string; // path to webpack.config.js
		tsconfigFilePath: string; // path to the tsconfig.<>.json used
	}
};

interface PlatformBuildConfig {
	platform: string;
	build: string;
	base: GulpConfigBaseDefs;
	buildDescription: string;
	disabled: boolean;
	preclean: {
		patterns: string[];
		options?: deleteAsyncOptions;
	};
	tsconfig: TsConfigInfo;
	copy: ({
		from: string[];
		to: string;
		webpackExcept?: boolean;
	} & {
		bypass: boolean
	})[];
	moveRename: (TmoveRename & {bypass: boolean})[];
	edits: ({   // use regular expressions
		filepath: string;
		fixes: {target: string; flags: string; replace: string;}[];
	} & {bypass: boolean})[];
	package: string[];
	html: HTMLdef | null;
	webpack?: WebpackConfig;
	finish: {
		markReadOnly: string[];
		delete: {
			id: number | string;
			path: string;
			filter?: string;
			recursive?: boolean;
			deleteTree?: boolean;
			preview?: boolean;
		}[];
	};
	fileYAML: GulpYAML;
}

/*


type ConfigStage = {
	stageName: string;
	info: PlatformBuildConfig;
};
// This is the format of the actual file
type ConfigJson = {
	configNames: ConfigNameInfo[];
	base: {
		ProjectRootPath: string;
		LogsPath: string; // log files directory
		browser: string; // dir from which browser will be launched
		browserTestDir: string;
		ProjectSourcesPath: string;  // where source *.ts files specific for project
		LibsSourcesPath: string;  // where source *.ts files for support libraries
		//browserLoadPage: string;
	};
	outputReportPath?: string | undefined;
} & {
	[key: string]: Record<string, PlatformBuildConfig>;
};

type ConfigNameStageInfo = {
	configName: ConfigNameInfo;
	stages: ConfigStage[];
};

/// This is the memory structure organization of Gulpfile.config.json in code
 */