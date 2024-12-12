
export { ChemModule, SolnChemLibItem, BufferItem, ChemElement,
	MSInfoItem, MSMassChangeItem, AminoAcidsItem, RotorDbItem,
	SolnChemSepItem, SolnChemData
 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionForProperty = ((...args: any[]) => (any | void));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComplexObject = {[key: string]: any};
//{[key: string]: FunctionForProperty | string | string[] | boolean | number | object};

type ChemModule = {
   // names belo= w are required
   xmlDocument: Document;
	moduleId: string;
	init: () => void;
//	addEventListener: (eventType: string, callback: () => void) => void;
	#eventCallback: () => void;
//	activate: () => void;
	finishDocument: (doc: Document) => void;
   addXhtmlEventHandlers: () => void;
	handleError?: (event: ErrorEvent) => void ;
	handlePromiseRejection?: (reason: string) => void;
} & ComplexObject;
   // other properties can vary
   // eslint-disable-next-line @typescript-eslint/no-explicit-any

type ChemElement = {
	sym: string;
	Z: number;
	AW: number;
	nam: string;
	salt?: string; // name of the element salt form
}


type SolnChemSepItem = { sep: string; };

type SolnChemData = {
   sym: string; // molec formula
   MW: number;
   htmlsym: string // molec formula written in markup
   nam: string; // molecule's full name
   comname?: string; // other names more common
   spgr?: number[]; // values in standard reagent prepes
   stdgpl?: number[]; // standard gram/liter concentrations of these
   // count of spgr and stdgpl should match
   solubility?: number;
};

type SolnChemLibItem = SolnChemSepItem | SolnChemData;

type BufferItem = {
	bufname: string;
	MW: number;
	pKa?: number;
	Ka?: number | number[];
	CAS: string;
	nam: string;
	conjs: {
		counter: string; // counter ion of buffer
		salt: string | string[]; // salt form of buffer
		MW: number;  // salt MW
		CAS: string;
		tit: string; // molec formula in plain string
	}[];
};

type AminoAcidsItem = {
	name: string;
	sym3: string; // 3-letter symbol
	sym1: string; // 1-letter symbol
	mass: number;
	monoIsoMass: number;
	avgIsoMass: number;
	atoms: number[];
	pKa_cooh: number;
	pKa_nh2: number;
	pKa_side?: number;
	KDHI: number;
	shimuraPka?: number;
};

type MSInfoItem = {
	name: string;
	monoIsoMass: number;
	avgIsoMass: number;
};

type MSMassChangeItem = {
	descr: string;
	monoIsoChange: number;
	avgIsoChange: number;
};

type RotorHeaderItem = { header: string; }; // maker name

type RotorItem = {
   name: string; // maker's model or product id
   unit: string // molec formula written in markup
   angle: number;  // tube angle
   maxRpm: number;

   avgRadius: number; // the average radius at some midpoint
   minRadius: number; // usually at topmost point of tube
   maxRadius: number; // usually at bottom of tube
};

type RotorSpecialRadialDataItem = {
	avg1Radius?: number; // some models
	avg2Radius?: number; // some models
	min1Radius?: number; // some models
	min2Radius?: number; // some models
	max1Radius?: number; // some models
	max2Radius?: number; // some models
	max3Radius?: number;
}

type RotorDbItem = RotorHeaderItem | RotorItem | RotorSpecialRadialDataItem;