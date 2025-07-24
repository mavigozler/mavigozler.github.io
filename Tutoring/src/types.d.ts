
export { PostingConfigYamlFile, ITask, PATH_literal, complexObj, DomElem};

interface ITask {
	title: string;
	action: "delete" | "run" | "copy";
	skip?: boolean;
	executable?: string;
	arguments?: string[];
	options?: string
	copydef?: string;
	target?: string | string[];
	dryrun?: boolean;
}

type PATH_literal = {[key: `${string}_PATH`]: {path: string; missing: "create" | "error" };}

type complexObj = { [key: string]: {[key: string]: string | null | Array<string | null>} };

type DomElem = {
	elemAttribs: {
		name: string; 
		value: string;
	}[]; 
};


type PostingConfigYamlFile = {
	createStaticContent: boolean;
	showDeviceProperties: boolean;
	DollarReduction: number[];
	baseRates: {[key: string]: number};
	InitalStyleRules: {[key: string]: {[key: string]: string | null | Array<string | null>}};
	Aliases:  PATH_literal & { [key: string]: string };
	Paths_Sets: {
		HTMLConfigData: {
			HeadTags?: {
				scriptsSection?: {
					marker: string;
					dom: DomElem[];
				};
				linksSection?: {
					marker: string;
					dom: DomElem[];
				};
			};
			Files: {
				HtmlReadFile?: string;
				HtmlWriteIndexFile?: string;
				HtmlWriteStaticFile?: string;
				TsConfigJSCompiledFilePath?: string;
			};
		};
		CSSfiles: { src: string[] | string; dest: string}[];
		ImportExportEditFiles: string[];
	} & complexObj;
	PowerShellTasks: {[key: string]: {[key: string]: string | null | Array<string | null>}}[];
	Testing: {
		Dest: string; // where the test folder is
		Files: (string | {name: string; edits: string[]})[];
	}
};