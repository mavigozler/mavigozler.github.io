
export { PostingConfigJsonFile, ITask, PATH_literal, complexObj};

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

type PostingConfigJsonFile = {
	createStaticContent: boolean;
	showDeviceProperties: boolean;
	DollarReduction: number[];
	baseRates: {[key: string]: number};
	InitalStyleRules: {[key: string]: {[key: string]: string | null | Array<string | null>}};
	Aliases:  PATH_literal & { [key: string]: string };
	Paths_Sets: {
		HTMLfiles: {[key: string]: string;};
		CSSfiles: { src: string[] | string; dest: string}[];
		ImportExportEditFiles: string[];
	} & complexObj;
	PowerShellTasks: {[key: string]: {[key: string]: string | null | Array<string | null>}}[];
	Testing: {
		Dest: string; // where the test folder is
		Files: (string | {name: string; edits: [string, string][]})[]
	}
};