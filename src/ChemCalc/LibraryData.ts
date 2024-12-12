"use strict";

/* insert eslint DISABLING for compiled JS here */

/*
type TSolnChemLib = {
	sep: string;

	sym: string;
	MW:  number;
	htmlsym: string;
	nam: string;
	comname: string;
	spgr: number[];
	stdgpl: number[];
};
*/

import { SolnChemLibItem, ChemElement, BufferItem, AminoAcidsItem,
	MSInfoItem, MSMassChangeItem, RotorDbItem } from "./ChemModule";
export { LibraryData };


const SolnChemLibData: {
	CommonCompounds: SolnChemLibItem[];
	OtherSalts: SolnChemLibItem[];
 } = {
		/* commercial acids and bases */
	CommonCompounds: [
		{ sep: "Commercial Acids" },
		{ sym: "HCl",		MW:  36.46, htmlsym: "HCl",
				nam: "hydrogen chloride",	comname: "hydrochloric acid",
				spgr: [ 1.18, 1.05 ], stdgpl: [  424,  105 ]	},
		{ sym: "CH3COOH", MW:  60.05, htmlsym: "CH<sub>3</sub>COOH",
				nam: "ethanoic acid", comname: "(glacial) acetic acid",
				spgr: [ 1.05, 1.045 ], stdgpl: [ 1045,  376 ] },
		{ sym: "H2SO4",	MW:  98.1,	htmlsym: "H<sub>2</sub>SO<sub>4</sub>",
				nam: "hydrogen sulfur tetraoxide", comname: "sulfuric acid",
				spgr: [ 1.84 ], stdgpl: [ 1766 ] },
		{ sym: "H3PO4",	MW:  98.0,	htmlsym: "H<sub>3</sub>PO<sub>4</sub>",
				nam: "hydrogen phosphorus tetraoxide", comname: "phosphoric acid",
				spgr: [ 1.70 ], stdgpl: [ 1445 ] },
		{ sym: "HNO3", 	MW:  63.02, htmlsym: "HNO<sub>3</sub>",
				nam: "hydrogen nitrogen trioxide", comname: "nitric acid",
				spgr: [ 1.42, 1.40, 1.37 ], stdgpl: [ 1008,  938, 837 ]  },
		{ sym: "HClO4",	MW: 100.5,	htmlsym: "HClO<sub>4</sub>",
				nam: "hydrogen chlorine tetraoxide", comname: "perchloric acid",
				spgr: [ 1.67, 1.54], stdgpl: [ 1172,  923 ] },
		{ sep: "Commercial Bases" },
		{ sym: "NH4OH",	MW:  34.04, htmlsym: "NH<sub>4</sub>OH",
			nam: "tetrahydrogen nitrogen hydroxide",  comname: "ammonium hydroxide",
			spgr: [ 0.91, 0.898 ], stdgpl: [  505, 252 ] },
		{ sym: "NaOH", 	MW:  40.0,	htmlsym: "NaOH", nam: "sodium hydroxide",
			spgr: [ 1.53, 1.11 ], stdgpl: [  763, 111 ], solubility: -1 },
		{ sym: "KOH",		MW:  56.1,	htmlsym: "KOH",  nam: "potassium hydroxide",
			spgr: [ 1.52, 1.09 ], stdgpl: [  757, 109 ], solubility: -1 },
		/* common salts */
		{ sep: "Common Salts" },
		{ sym: "NaCl", 	MW:  58.44, htmlsym: "NaCl", nam: "sodium chloride",
				solubility: -1 },
		{ sym: "KCl",		MW:  74.56, htmlsym: "KCl",  nam: "potassium chloride",
				solubility: -1 },
		{ sym: "K2HPO4",	MW: 174.18,
				htmlsym: "K<sub>2</sub>HPO<sub>4</sub>", nam: "potassium hydrogen phosphate",
				solubility: -1 },
		{ sym: "KH2PO4",	MW: 136.09,
				htmlsym: "KH<sub>2</sub>PO<sub>4</sub>", nam: "potassium dihydrogen phosphate",
				solubility: -1 },
		{ sym: "Na2HPO4",	MW: 141.96,
				htmlsym: "Na<sub>2</sub>HPO<sub>4</sub>", nam: "sodium hydrogen phosphate",
				solubility: -1 },
		{ sym: "NaH2PO4 * 2 H2O",	MW: 156.01,
				htmlsym: "NaH<sub>2</sub>PO<sub>4</sub> &bull; 2&nbsp;H<sub>2</sub>O",
				nam: "sodium dihydrogen phosphate dihydrate", solubility: -1 },
		{ sym: "Na2CO3",	MW: 105.99,
					htmlsym: "Na<sub>2</sub>CO<sub>3</sub>", nam: "sodium carbonate",
					solubility: -1 },
		{ sym: "(NH4)3PO4",	MW: 132.08,
				htmlsym: "(NH<sub>4</sub>)<sub>3</sub>PO<sub>4</sub>", nam: "triammonium phosphate",
				solubility: -1, comname: "ammonium phosphate" },
		{ sym: "NaN3", 	MW:  65.01, htmlsym: "NaN<sub>3</sub>",
					nam: "sodium azide"	},
		{ sym: "NaNO3", 	MW:  84.99, htmlsym: "NaNO<sub>3</sub>",
							nam: "sodium nitrate", solubility: -1 },
		{ sym: "KNO3",		MW:  101.11, htmlsym: "KNO<sub>3</sub>",
							nam: "potassium nitrate", solubility: -1 },
		{ sym: "K2SO4",	MW: 174.26,
				htmlsym: "K<sub>2</sub>SO<sub>4</sub>", nam: "potassium sulfate",
				solubility: -1 }
	],
	OtherSalts : [
		{ sym: "Pb(OOCCH3)2", MW: 325.28,
				htmlsym: "Pb(OOCCH<sub>3</sub>)<sub>2</sub>", nam: "lead acetate" },
		{ sym: "Cu(OOCCH3)2 H2O", MW: 199.65,
				htmlsym: "Cu(OOCCH<sub>3</sub>)<sub>2</sub> &bull;&nbsp;H<sub>2</sub>O", nam: "copper(II) acetate monohydrate" },
		{ sym: "ZnSO4 & 7 H2O", MW: 287.54,
				htmlsym: "ZnSO<sub>4</sub> &bull; 7&nbsp;H<sub>2</sub>O", nam: "copper(II) acetate monohydrate" },
		{ sym: "Ca(OH)2", MW: 56.11,
				htmlsym: "Ca(OH)<sub>2</sub>", nam: "calcium hydroxide" },
		{ sym: "Hg(NO3)2", MW: 324.60,
				htmlsym: "Hg(NO<sub>3</sub>)<sub>2</sub>", nam: "mercuric nitrate" },
		{ sym: "Fe(NO3)3 * 9 H2O", MW: 404.0,
				htmlsym: "Fe(NO<sub>3</sub>)<sub>3</sub> &bull; 9&nbsp;H<sub>2</sub>O",
				nam: "iron(III) nitrate nonahydrate" },
		{ sym: "Hg(NO3)2", MW: 324.60,
				htmlsym: "Hg(NO<sub>3</sub>)<sub>3</sub>", nam: "mercuric nitrate" }
	],
};

	/*
	acetic acid            CH3COOH          1.75 x 10-5    4.756
	ammonium ion           NH4+             5.60 x 10-10   9.252
	anilinium ion          C6H5NH3+         2.54 x 10-5    4.596
	benzoic acid           C6H5COOH         6.31 x 10-5    4.200
	chloroacetic acid      CH2ClCOOH        1.36 x 10-3    2.866
	cyanic acid            HOCN             3.54 x 10-4    3.451
	dichloroacetic acid    CHCl2COOH        5.68 x 10-2    1.246
	dimethylammonium ion   (H3C)2NH2+       1.82 x 10-11  10.739
	ethanol                CH3CH2OH         1.31 x 10-14  13.882
	formic acid            HCOOH            1.86 x 10-4    3.732
	hydrazoic acid         HN3              2.37 x 10-5    4.625
	hydrazinium ion        H2NNH3+          1.03 x 10-8    7.989
	hydrochloric acid      HCl              greater than 1 negative
	hydrocyanic acid       HCN              5.85 x 10-10   9.233
	hydrofluoric acid      HF               6.94 x 10-4    3.159
	hydroxylammonium ion   HONH3+           1.12 x 10-6    5.951
	hypochlorous acid      HClO             2.81 x 10-8    7.551
	imidazolium ion        C3H3NNH2+        1.02 x 10-7    6.992
	lactic acid            H3CCHOHCOOH      1.37 x 10-4    3.863
	methylammonium ion     H3CNH3+          2.39 x 10-11  10.622
	ethanolammonium ion    HOCH2CH2NH3+     3.17 x 10-10   9.499
	nitric acid            HNO3            27.79          -1.444
	nitrous acid           HNO2             5.98 x 10-4    3.224
	perchloric acid        HClO4           38.29          -1.583
	phenol                 C6H5OH           1.08 x 10-10   9.968
	pyridinium ion         C5H5NH+          6.80 x 10-6    5.167
	trimethylammonium ion  (H3C)3NH+        1.72 x 10-10   9.763
	water                  H2O              1.01 x 10-14  13.994

	arsenic acid     H3AsO4            K1 = 5.65 x 10-3    2.248
	-                H2AsO4-           K2 = 1.75 x 10-7    6.757
	-                HAsO42-           K3 = 2.54 x 10-12  11.596
	boric acid       H3BO3             K1 = 5.78 x 10-10   9.238
	carbonic acid    "H2CO3"           K1 = 4.35 x 10-7    6.361
	-                HCO3-             K2 = 4.69 x 10-11  10.329
	chromic acid     H2CrO4            K1 = 3.55          -0.550
	-                HCrO4-            K2 = 3.36 x 10-7    6.473
	citric acid      HOC(CH2COOH)3     K1 = 7.42 x 10-4    3.130
	-                -                 K2 = 1.75 x 10-5    4.757
	-                -                 K3 = 3.99 x 10-6    5.602
	EDTA             C2H4N2(CH2COOH)4  K1 = 9.81 x 10-3    2.008
	-                -                 K2 = 2.08 x 10-3    2.683
	-                -                 K3 = 7.98 x 10-7    6.098
	-                -                 K4 = 6.60 x 10-11  10.181
	glycinium ion    H3NCH2COOH+       K1 = 4.47 x 10-3    2.350
	-(glycine)       H2NCH2COOH        K2 = 1.67 x 10-10   9.778
	hydrogen sulfide H2S               K1 = 1.02 x 10-7    6.992
	-                HS-               K2 = 1.22 x 10-13  12.915
	oxalic acid      HOOCCOOH          K1 = 5.40 x 10-2    1.268
	-                HOOCCOO-          K2 = 5.23 x 10-5    4.282
	phthalic acid    C6H4(COOH)2       K1 = 1.13 x 10-3    2.946
	-                -                 K2 = 3.90 x 10-6    5.409
	phosphoric acid  H3PO4             K1 = 7.11 x 10-3    2.148
	-                H2PO4-            K2 = 6.23 x 10-8    7.206
	-                HPO42-            K3 = 4.55 x 10-13  12.342
	succinic acid    C(CH2)2COOH       K1 = 6.21 x 10-5    4.207
	-                HOOC(CH2)2COO-    K2 = 2.31 x 10-6    5.636
	sulfuric acid    H2SO4             K1 > 1              negative
	-                HSO4-             K2 = 1.01 x 10-2    1.994
	sulfurous acid   H2SO3             K1 = 1.71 x 10-2    1.766
	-                HSO3-             K2 = 5.98 x 10-8    7.223 */

const Buffers: BufferItem[] = [
	{ bufname: "Tris", MW: 121.14, pKa: 8.1, CAS: "77-86-1",
			nam: "tris(hydroxymethane)aminopropane",
			conjs: [
				{ counter: "carbonate", salt: "Tris carbonate", MW: 304.3,
						CAS: "68123-29-5", tit: "NaHCO3" },
				{ counter: "chloride", salt: "TrisHCl", MW: 157.64,
						CAS: "1185-53-1", tit: "HCl" },
				{ counter: "phosphate", salt: "TrisPO4", tit: "H3PO4",
						CAS: "", MW: -1 },
				{ counter: "acetate", salt: "Tris acetate", MW: 181.19,
						CAS: "6850-28-8", tit: "CH3COOH" }
			] },
	{ bufname: "Tricine", MW: 179.2, pKa: 8.15, CAS: "5704-04-1",
			nam: "N-tris(hydroxymethyl)methylglycine",
			conjs: [
				{ counter: "chloride", salt: "Tricine HCl", tit: "HCl",
					CAS: "", MW: -1
				}
			] },
	{ bufname: "acetate", MW: 60.05, Ka: 1.75e-5,
			nam: "(glacial) acetic acid", CAS: "",
			conjs: [
				{ counter: "sodium",  salt: "NaOOCCH3", tit: "NaOH",
					CAS: "", MW: -1 },
				{ counter: "potassium", salt: "KOOCCH3", tit: "KOH",
					CAS: "", MW: -1 }
			]
		},
	{ bufname: "phosphate", MW: 98.1, Ka: [ 7.11e-3, 6.23e-8, 4.55e-13 ],
			nam: "phosphoric acid", CAS: "",
			conjs: [
				{ counter: "sodium", salt: ["Na3PO4", "Na2HPO4" , "NaH2PO4" ],
							tit: "NaOH" , CAS: "", MW: -1 },
				{ counter: "potassium", salt: ["K3PO4", "K2HPO4", "KH2PO4" ],
							tit: "H3PO4" ,	CAS: "", MW: -1 }
			] },
	{ bufname: "glycylglycine", MW: 132.12, pKa: 8.4, CAS: "556-50-3",
			nam: "glycylglycine",
			conjs: [
				{ counter: "chloride",  salt: "glycylglycine chloride", tit: "HCl",
				CAS: "", MW: -1 },
			] },
	{ bufname: "imidazole", MW: 68.08, pKa: 7.0, CAS: "288-32-4",
			nam: "imidazole",
			conjs: [
				{ counter: "chloride", salt: "imidazole-HCl", tit: "HCl",
					CAS: "", MW: -1 }
			] },
	{ bufname: "Bis-Tris", MW: 209.2, pKa: 6.50, CAS: "6976-37-0",
			nam: "bis-(2-hydroxyethyl)iminotris(hydroxymethyl)methane",
			conjs: [
				{ counter: "chloride", salt: "Bis-Tris chloride", tit: "HCl",
				CAS: "", MW: -1 }
			] },
	{ bufname: "borate", MW: 61.83, Ka: 5.78e-10, CAS: "10043-35-3",
			nam: "boric acid",
			conjs: [
				{ counter: "sodium", salt: [ "NaBO3H2", "Na2BO3H", "Na3BO3" ], tit: "NaOH" ,
				CAS: "", MW: -1 }
			] },
	{ bufname: "hydroxylamine", MW: 61.83, pKa: 6.03, CAS: "",
			nam: "hydroxylamine",
			conjs: [
				{ counter: "chloride", salt: "hydroxylamine chloride", tit: "HCl" ,
				CAS: "", MW: -1 }
			] },
	{ bufname: "carbonate", MW: 0, Ka: [ 4.35e-7, 4.69e-11 ], CAS: "",
			nam: "",
			conjs: [
				{ counter: "sodium", salt: [ "NaHCO3", "Na2CO3" ], tit: "NaOH" ,
				CAS: "", MW: -1 },
				{ counter: "potassium", salt: [ "KHCO3", "K2CO3" ], tit: "KOH" ,
				CAS: "", MW: -1 }
			] },
	{ bufname: "chromate", MW: 0, Ka: [ 3.55, 3.36e-7 ], CAS: "",
			nam: "chromic acid",
			conjs: [
				{ counter: "sodium", salt: [ "NaHCrO4", "Na2CrO4" ], tit: "NaOH" ,
				CAS: "", MW: -1 },
				{ counter: "potassium", salt: [ "KHCrO4", "K2CrO4" ], tit: "KOH" ,
				CAS: "", MW: -1 }
			] },
	{ bufname: "AMPD", MW: 0, pKa: 8.8, CAS: "",
			nam: "2-amino-2-methyl-1,3-propanediol",
			conjs: [
				{ counter: "chloride",  salt: "AMPD chloride", tit: "HCl" ,
					CAS: "", MW: -1 }
			] },
	{ bufname: "citrate", MW: 98.1, Ka: [ 7.11e-3, 6.23e-8, 4.55e-13 ],
			nam: "phosphoric acid", CAS: "",
			conjs: [
				{ counter: "sodium", salt: ["Na3PO4", "Na2HPO4" , "NaH2PO4" ],
							tit: "NaOH" , CAS: "", MW: -1 },
				{ counter: "potassium", salt: ["K3PO4", "K2HPO4", "KH2PO4" ],
							tit: "H3PO4" , CAS: "", MW: -1 }
			] },
//   <!-- GOOD's BUFFERS  -->
	{ bufname: "ACES", MW: 182.2, pKa: 6.88, CAS: "7365-82-4",
			nam: "N-2-[2-acetamido)-2-aminoethanesulfonic acid",
			conjs: [
				{ counter: "sodium",  salt: "ACES sodium", tit: "NaOH" ,
				CAS: "", MW: -1 }
			] },
	{ bufname: "ADA", MW: 190.2, pKa: 6.6, CAS: "26239-55-4",
			nam: "N-[carbamoylmethyl]iminodiacetic acid",
			conjs: [
				{ counter: "sodium",  salt: "ADA sodium", tit: "NaOH" ,
				CAS: "", MW: -1 }
			] },
	{ bufname: "AMP", MW: 89.14, pKa: 9.7, CAS: "124-68-5",
			nam: "2-amino-2-methyl-1-propanol",
			conjs: [
				{ counter: "chloride",  salt: "AMP chloride", tit: "HCl" ,
				CAS: "", MW: -1 }
			] },
	{ bufname: "AMPSO", MW: 227.3, pKa: 9.0, CAS: "68399-79-1",
			nam: "3-[(1,1-dimethyl-2-hydroxyethyl)amino]-2-hydroxypropanesulfonic acid",
			conjs: [
				{ counter: "sodium",  salt: "AMPSO sodium", MW: 249.3,
						CAS: "102029-60-7", tit: "NaOH" },
			] },
	{ bufname: "CAPS", MW: 221.32, pKa: 10.40, CAS: "1135-40-6",
			nam: "3-[cyclohexylamino]-1-propanesulfonic acid",
			conjs: [
				{ counter: "sodium",  salt: "CAPS sodium", MW: 243.31,
						CAS: "", tit: "NaOH" },
			] },
	{ bufname: "CAPSO", MW: 237.3, pKa: 9.6, CAS: "73463-39-5",
			nam: "3-[cyclohexylamino]-2-hydroxy-1-propanesulfonic acid",
			conjs: [
				{ counter: "sodium",  salt: "CAPSO sodium", tit: "NaOH" ,
				CAS: "", MW: -1 }
			] },
	{ bufname: "CHES", MW: 207.29, pKa: 9.55, CAS: "103-47-9",
			nam: "2-[cyclohexylamino]-ethanesulfonic acid",
			conjs: [
				{ counter: "sodium",  salt: "CHES sodium", tit: "NaOH" ,
				CAS: "", MW: -1 }
			] },
	{ bufname: "DIPSO", MW: 243.3, pKa: 7.6, CAS: "68399-80-4",
			nam: "3-[N,N-bis(2-hydroxyethyl)amino]-2-hydroxypropanesulfonic acid",
			conjs: [
				{ counter: "sodium",  salt: "DIPSO sodium", tit: "NaOH" ,
				CAS: "", MW: -1 }
			] },
	{ bufname: "HEPES", MW: 238.3, pKa: 7.55, CAS: "7365-45-9",
			nam: "N-[2-hydroxyethyl]piperazine-N'-[2-ethanesulfonic acid]",
			conjs: [
				{ counter: "sodium",  salt: "HEPES sodium", MW: 260.3,
						CAS: "75277-39-3", tit: "NaOH" },
			] },
	{ bufname: "HEPPS (EPPS)", MW: 252.3, pKa: 8.0, CAS: "16052-06-5",
			nam: "N-[2-hydroxyethyl]piperazine-N'-[3-propanesulfonic acid]",
			conjs: [
				{ counter: "sodium",  salt: "HEPES sodium", tit: "NaOH" ,
				CAS: "", MW: -1 }
			] },
	{ bufname: "HEPPSO", MW: 268.3, pKa: 7.8, CAS: "68399-78-0",
			nam: "N-[2-hydroxyethyl]piperazine-N'-[2-hydroxypropanesulfonic acid]",
			conjs: [
				{ counter: "sodium",  salt: "HEPPSO sodium", tit: "NaOH" ,
				CAS: "", MW: -1 }
			] },
	{ bufname: "MES monohydrate", MW: 213.2, pKa: 6.15,
			nam: "2-[N-morpholino]ethanesulfonic acid", CAS: "",
			conjs: [
				{ counter: "sodium", salt: "MES sodium", tit: "NaOH" ,
				CAS: "", MW: -1 }
			] },
	{ bufname: "MOPS", MW: 209.27, pKa: 7.20, CAS: "1132-61-2",
			nam: "3-[N-morpholino]propanesulfonic acid",
			conjs: [
				{ counter: "sodium",  salt: "MOPS sodium", MW: 231.25,
						CAS: "71119-22-7", tit: "NaOH" }
			] },
	{ bufname: "MOPSO", MW: 225.3, pKa: 6.9, CAS: "68399-77-9",
			nam: "3-[N-morpholino]-2-hydroxypropanesulfonic acid",
			conjs: [
				{ counter: "sodium",  salt: "MOPSO sodium", MW: 247.2,
						CAS: "79803-73-9", tit: "NaOH" }
			] },
	{ bufname: "PIPES", MW: 648.7, pKa: 6.80, CAS: "",
			nam: "piperazine-N,N'-bis[2-ethanesulfonic acid]",
			conjs: [
				{ counter: "sodium",  salt: "PIPES sodium", MW: 670.67,
						CAS: "100037-69-2", tit: "NaOH" },
			] },
	{ bufname: "POPSO", MW: 362.4, pKa: 7.8, CAS: "68189-43-5",
			nam: "piperazine-N,N'-bis[2-hydroxypropanesulfonic acid]",
			conjs: [
				{ counter: "sodium",  salt: "POPSO disodium", MW: 406.4,
						CAS: "108321-07-9", tit: "NaOH" },
			] },
	{ bufname: "TAPS", MW: 243.3, pKa: 8.4, CAS: "29915-38-6",
			nam: "N-tris(hydroxymethyl)methyl-3-aminopropanesulfonic acid",
			conjs: [
				{ counter: "sodium",  salt: "TAPS sodium", MW: 265.3,
						CAS: "91000-53-2", tit: "NaOH" },
			] },
	{ bufname: "TES", MW: 207.2, pKa: 7.40, CAS: "",
			nam: "N-tris(hydroxymethyl)methyl-2-aminoethanesulfonic acid",
			conjs: [
				{ counter: "sodium",  salt: "TES disodium", MW: 251.2,
						CAS: "70331-82-7", tit: "NaOH" },
			] }
];

const Elements: ChemElement[] = [
	{ sym: "H",  Z:  1, AW:   1.00794, nam: "hydrogen"   },
	{ sym: "Li", Z:  3, AW:   6.941,   nam: "lithium"    },
	{ sym: "B",  Z:  5, AW:  10.811,   nam: "boron"      },
	{ sym: "C",  Z:  6, AW:  12.0107,  nam: "carbon"     },
	{ sym: "N",  Z:  7, AW:  14.0067,  nam: "nitrogen"   },
	{ sym: "O",  Z:  8, AW:  15.9994,  nam: "oxygen", salt: "oxide" },
	{ sym: "F",  Z:  9, AW:  18.9984,  nam: "fluorine", salt: "fluoride" },
	{ sym: "Na", Z: 11, AW:  22.98977, nam: "sodium"     },
	{ sym: "Mg", Z: 12, AW:  24.3050,  nam: "magnesium"  },
	{ sym: "Al", Z: 13, AW:  26.9815,  nam: "aluminum"   },
	{ sym: "Si", Z: 14, AW:  28.0855,  nam: "silicon"    },
	{ sym: "P",  Z: 15, AW:  30.973761,nam: "phosphorus" },
	{ sym: "S",  Z: 16, AW:  32.065,   nam: "sulfur"     },
	{ sym: "Cl", Z: 17, AW:  35.4527,  nam: "chlorine", salt: "chloride" },
	{ sym: "K",  Z: 19, AW:  39.0983,  nam: "potassium"  },
	{ sym: "Ca", Z: 20, AW:  40.078,   nam: "calcium"    },
	{ sym: "Sc", Z: 21, AW:  44.96,    nam: "scandium"   },
	{ sym: "Ti", Z: 22, AW:  47.90,    nam: "titanium"   },
	{ sym: "V",  Z: 23, AW:  50.9415,  nam: "vanadium"   },
	{ sym: "Cr", Z: 24, AW:  51.9961,  nam: "chromium"   },
	{ sym: "Mn", Z: 25, AW:  54.938,   nam: "manganese"  },
	{ sym: "Fe", Z: 26, AW:  55.847,   nam: "iron"       },
	{ sym: "Co", Z: 27, AW:  58.9332, nam: "cobalt"     },
	{ sym: "Ni", Z: 28, AW:  58.69,   nam: "nickel"     },
	{ sym: "Cu", Z: 29, AW:  63.546,  nam: "copper"     },
	{ sym: "Zn", Z: 30, AW:  65.39,   nam: "zinc"       },
	{ sym: "Ga", Z: 31, AW:  69.72,   nam: "gallium"    },
	{ sym: "Ge", Z: 32, AW:  72.59,   nam: "germanium"  },
	{ sym: "As", Z: 33, AW:  74.92,   nam: "arsenic"    },
	{ sym: "Se", Z: 34, AW:  78.96,   nam: "selenium"   },
	{ sym: "Br", Z: 35, AW:  79.904,  nam: "bromine", salt: "bromide"  },
	{ sym: "Rb", Z: 37, AW:  85.4678, nam: "rubidium"   },
	{ sym: "Be", Z:  4, AW:   8.5,    nam: "beryllium"  },
	{ sym: "Sr", Z: 38, AW:  87.62,   nam: "strontium"  },
	{ sym: "Y",  Z: 39, AW:  88.91,   nam: "yttrium"    },
	{ sym: "Zr", Z: 40, AW:  91.22,   nam: "zirconium"  },
	{ sym: "Nb", Z: 41, AW:  92.91,   nam: "niobium"    },
	{ sym: "Mo", Z: 42, AW:  95.94,   nam: "molybdenum" },
	{ sym: "Tc", Z: 43, AW:  99,      nam: "technetium" },
	{ sym: "Ru", Z: 44, AW: 101.1,    nam: "ruthenium"  },
	{ sym: "Rh", Z: 45, AW: 102.91,   nam: "rhodium"    },
	{ sym: "Pd", Z: 46, AW: 106.42,   nam: "palladium"  },
	{ sym: "Ag", Z: 47, AW: 107.8682, nam: "silver"     },
	{ sym: "Cd", Z: 48, AW: 112.411,  nam: "cadmium"    },
	{ sym: "In", Z: 49, AW: 114.82,   nam: "indium"     },
	{ sym: "Sn", Z: 50, AW: 118.69,   nam: "tin"        },
	{ sym: "Sb", Z: 51, AW: 121.75,   nam: "antimony"   },
	{ sym: "Te", Z: 52, AW: 127.6,    nam: "tellerium"  },
	{ sym: "I",  Z: 53, AW: 126.90447, nam: "iodine", salt: "iodide"   },
	{ sym: "Cs", Z: 55, AW: 132.90543, nam: "cesium"    },
	{ sym: "Ba", Z: 56, AW: 137.327,  nam: "barium"     },
	{ sym: "Ce", Z: 58, AW: 140.12,   nam: "cerium"     },
	{ sym: "Pr", Z: 59, AW: 140.91,   nam: "praseodymium" },
	{ sym: "Nd", Z: 60, AW: 144.24,   nam: "neodymium"  },
	{ sym: "Sm", Z: 62, AW: 150.35,   nam: "samarium"   },
	{ sym: "Gd", Z: 64, AW: 157.12,   nam: "gadolinium" },
	{ sym: "Tb", Z: 65, AW: 158.92,   nam: "terbium"    },
	{ sym: "Ho", Z: 67, AW: 164.93,   nam: "holmium"    },
	{ sym: "Tm", Z: 69, AW: 168.93,   nam: "thulium"    },
	{ sym: "Yb", Z: 70, AW: 173.04,   nam: "ytterbium"  },
	{ sym: "Lu", Z: 71, AW: 174.97,   nam: "lutetium"   },
	{ sym: "Hf", Z: 72, AW: 178.49,   nam: "hafnium"    },
	{ sym: "Ta", Z: 73, AW: 180.95,   nam: "tantalum"   },
	{ sym: "W",  Z: 74, AW: 183.85,   nam: "tungsten"   },
	{ sym: "Re", Z: 75, AW: 186.23,   nam: "rhenium"    },
	{ sym: "Os", Z: 76, AW: 190.2,    nam: "osmium"     },
	{ sym: "Pt", Z: 78, AW: 195.08,   nam: "platinum"   },
	{ sym: "Au", Z: 79, AW: 196.96654, nam: "gold"      },
	{ sym: "Hg", Z: 80, AW: 200.59,   nam: "mercury"    },
	{ sym: "Tl", Z: 81, AW: 204.37,   nam: "thallium"   },
	{ sym: "Pb", Z: 82, AW: 207.19,   nam: "lead"       },
	{ sym: "Bi", Z: 83, AW: 208.98,   nam: "bismuth"    },
	{ sym: "At", Z: 85, AW: 210,      nam: "astatine"   },
	{ sym: "Th", Z: 90, AW: 232.04,   nam: "thorium"    },
	{ sym: "U",  Z: 92, AW: 238.03,   nam: "uranium"    }
];

const AminoAcids: AminoAcidsItem[] = [
	// atoms : [ C, H, N, O, S ]
	// KDHI : Kyte & Doolittle Hydropathy Index
	{ name : "Alanine",       sym3 : "Ala", sym1 : 'A', mass :  89.0477,
		monoIsoMass : 71.03711, avgIsoMass : 71.0788, atoms : [ 3, 7, 1, 2 ] ,
		pKa_cooh : 2.34, pKa_nh2 : 9.69,
		KDHI : 1.8 },
	{ name : "Arginine",      sym3 : "Arg", sym1 : 'R', mass : 174.1117,
		monoIsoMass : 156.10111, avgIsoMass : 156.18748, atoms : [ 6, 14, 4, 2 ],
		pKa_cooh: 2.17, pKa_nh2: 9.04, pKa_side: 12.48, shimuraPka : 12.5,
		KDHI : -4.5 },
	{ name : "Asparagine",    sym3 : "Asn", sym1 : 'N', mass : 132.0535,
		monoIsoMass : 114.04293, avgIsoMass : 114.10384, atoms : [ 4, 8, 2, 3 ],
		pKa_cooh: 2.02, pKa_nh2: 8.80,
		KDHI : -3.5 },
	{ name : "Aspartic Acid", sym3 : "Asp", sym1 : 'D', mass : 133.0375,
		monoIsoMass : 115.02694, avgIsoMass : 115.0886, atoms : [ 4, 7, 1, 4 ],
		pKa_cooh: 1.88, pKa_nh2: 9.60, pKa_side : 3.65, shimuraPka: 3.95,
		KDHI : -3.5 },
	{ name : "Cysteine",      sym3 : "Cys", sym1 : 'C', mass : 121.0198,
		monoIsoMass : 103.00919, avgIsoMass : 103.1388, atoms : [ 3, 7, 1, 2, 1 ],
		pKa_cooh: 1.96, pKa_nh2: 10.28, pKa_side : 8.18,
		KDHI : 2.5 },
	{ name : "Glutamic Acid", sym3 : "Glu", sym1 : 'E', mass : 147.0532,
		monoIsoMass : 129.04259, avgIsoMass : 129.11548, atoms : [ 5, 9, 1, 4 ],
		pKa_cooh: 2.19, pKa_nh2: 9.67, pKa_side : 4.25, shimuraPka: 4.45,
		KDHI : -3.5 },
	{ name : "Glutamine",     sym3 : "Gln", sym1 : 'Q', mass : 146.0691,
		monoIsoMass : 128.05858, avgIsoMass : 128.13072, atoms : [ 5, 10, 2, 3 ],
		pKa_cooh: 2.17, pKa_nh2: 9.13,
		KDHI : -3.5 },
	{ name : "Glycine",       sym3 : "Gly", sym1 : 'G', mass :  75.0320,
		monoIsoMass :  57.02146, avgIsoMass :  57.05192, atoms : [ 2, 5, 1, 2 ],
		pKa_cooh: 2.34, pKa_nh2: 9.60,
		KDHI : -0.4 },
	{ name : "Histidine",     sym3 : "His", sym1 : 'H', mass : 155.0695,
		monoIsoMass : 137.05891, avgIsoMass : 137.14108, atoms : [ 6, 9, 3, 2 ],
		pKa_cooh: 1.82, pKa_nh2: 9.17, pKa_side : 6.00, shimuraPka: 6.45,
		KDHI : -3.2 },
	{ name : "Isoleucine",    sym3 : "Ile", sym1 : 'I', mass : 131.0946,
		monoIsoMass : 113.08406, avgIsoMass : 113.15944, atoms : [ 6, 13, 1, 2 ],
		pKa_cooh: 2.36, pKa_nh2: 9.68,
		KDHI : 4.5 },
	{ name : "Leucine",       sym3 : "Leu", sym1 : 'L', mass : 131.0946,
		monoIsoMass : 113.08406, avgIsoMass : 113.15944, atoms : [ 6, 13, 1, 2 ],
		pKa_cooh: 2.36, pKa_nh2: 9.60,
		KDHI : 3.8 },
	{ name : "Lysine",        sym3 : "Lys", sym1 : 'K', mass : 146.1055,
		monoIsoMass : 128.09496, avgIsoMass : 128.17408, atoms : [ 6, 14, 2, 2 ],
		pKa_cooh: 2.18, pKa_nh2: 8.95, pKa_side : 10.53, shimuraPka: 10.2,
		KDHI : -3.9 },
	{ name : "Methionine",    sym3 : "Met", sym1 : 'M', mass : 149.0511,
		monoIsoMass : 131.04049, avgIsoMass : 131.19256, atoms : [ 5, 11, 1, 2, 1 ],
		pKa_cooh: 2.28, pKa_nh2: 9.21,
		KDHI : 1.9 },
	{ name : "Phenylalanine", sym3 : "Phe", sym1 : 'F', mass : 165.0790,
		monoIsoMass : 147.06841, avgIsoMass : 147.17656, atoms : [ 9, 11, 1, 2 ],
		pKa_cooh: 1.83, pKa_nh2: 9.13,
		KDHI : 2.8 },
	{ name : "Proline",       sym3 : "Pro", sym1 : 'P', mass : 115.0633,
		monoIsoMass :  97.05276, avgIsoMass :  97.11668, atoms : [ 5, 9, 1, 2 ],
		pKa_cooh: 1.99, pKa_nh2: 10.96,
		KDHI : 1.6 },
	{ name : "Serine",        sym3 : "Ser", sym1 : 'S', mass : 105.0426,
		monoIsoMass :  87.03203, avgIsoMass :  87.0782, atoms : [ 3, 7, 1, 3 ],
		pKa_cooh: 2.21, pKa_nh2: 9.15, KDHI : -0.8 },
	{ name : "Threonine",     sym3 : "Thr", sym1 : 'T', mass : 119.0582,
		monoIsoMass : 101.04768, avgIsoMass : 101.10508, atoms : [ 4, 9, 1, 3 ],
		pKa_cooh: 2.11, pKa_nh2: 9.62,
		KDHI : -0.7 },
	{ name : "Tryptophan",    sym3 : "Trp", sym1 : 'W', mass : 204.0899,
		monoIsoMass : 186.07931, avgIsoMass : 186.2132, atoms : [ 11, 12, 2, 2 ],
		pKa_cooh: 2.38, pKa_nh2: 9.39,
		KDHI : -0.9 },
	{ name : "Tyrosine",      sym3 : "Tyr", sym1 : 'Y', mass : 181.0739,
		monoIsoMass : 163.06333, avgIsoMass : 163.17596, atoms : [ 9, 11, 1, 3 ],
		pKa_cooh: 2.20, pKa_nh2: 9.11, shimuraPka: 9.8,
		KDHI : -1.3 },
	{ name : "Valine",        sym3 : "Val", sym1 : 'V', mass : 117.0790,
		monoIsoMass :  99.06841, avgIsoMass :  99.13256, atoms : [ 5, 11, 1, 2 ],
		pKa_cooh: 2.32, pKa_nh2: 9.62,
		KDHI : 4.2 }
];
// <!-- Other Amino acids -->
const SpecialAminoAcids: MSInfoItem[] = [
	{ name: "Sarcosine",
			monoIsoMass:  71.03711, avgIsoMass:  71.0788 },
	{ name: "Homoserine lactone",
			monoIsoMass:  83.03711, avgIsoMass:  83.0898 },
	{ name: "Homoserine",
			monoIsoMass: 101.04768, avgIsoMass: 101.10508 },
	{ name: "Pyroglutamic acid",
			monoIsoMass: 111.03203, avgIsoMass: 111.1002 },
	{ name: "Ornithine",
			monoIsoMass: 114.07931, avgIsoMass: 114.1472 },
	{ name: "Carboamidomethylcysteine",
			monoIsoMass: 160.03065, avgIsoMass: 160.19672 },
	{ name: "Carboxymethylcysteine",
			monoIsoMass: 161.01466, avgIsoMass: 161.18148 },
	{ name: "Pyridylethylcysteine",
			monoIsoMass: 208.06703, avgIsoMass: 208.28408 },
];
// <!-- Special Constants -->
const SpecialAAConstants = [
	{ name: "N-Term",   sym3: "N-term", shimuraPka: 7.6 },
	{ name: "C-Term",   sym3: "C-term", shimuraPka: 3.6 },
];

const Ribonucleotides: MSInfoItem[] = [
	{ name: "Adenosine", monoIsoMass: 329.05252, avgIsoMass: 329.2091 },
	{ name: "Guanosine", monoIsoMass: 345.04744, avgIsoMass: 345.2084 },
	{ name: "Cytidine", monoIsoMass: 305.04129, avgIsoMass: 305.1840 },
	{ name: "Uridine", monoIsoMass: 306.02530, avgIsoMass: 306.1687 }
];

const Deoxyribonucleotides: MSInfoItem[] = [
	{ name: "Deoxyadenosine", monoIsoMass: 313.05761, avgIsoMass: 313.2097 },
	{ name: "Deoxyguanosine", monoIsoMass: 329.05252, avgIsoMass: 329.2091 },
	{ name: "Deoxycytidine", monoIsoMass: 289.04637, avgIsoMass: 289.1847 },
	{ name: "Deoxythymidine", monoIsoMass: 304.04604, avgIsoMass: 304.1964 }
];

const PostTranslationalModMassChanges: MSMassChangeItem[] = [
	{ descr: "Homoserine by CNBr",
				monoIsoChange: -29.99281, avgIsoChange: -30.0935 },
	{ descr: "Pyroglutamate (N-terminal Gln Cyclization)",
				monoIsoChange: -17.02655, avgIsoChange: -17.0306 },
	{ descr: "Disulfide bond formation",
				monoIsoChange: -2.01565, avgIsoChange: -2.0159 },
	{ descr: "C-terminal amide by Gly",
				monoIsoChange: -0.98402, avgIsoChange: -0.9847 },
	{ descr: "Asn or Gln deamidation",
				monoIsoChange: -0.98402, avgIsoChange: -0.9847 },
	{ descr: "Methylation",
				monoIsoChange: 14.01565, avgIsoChange: 14.0269 },
	{ descr: "Met oxidation",
				monoIsoChange: 15.99491, avgIsoChange: 15.9994 },
	{ descr: "Hydroxylation",
				monoIsoChange: 15.99491, avgIsoChange: 15.9994 },
	{ descr: "Peptide bond hydrolysis",
				monoIsoChange: 18.01060, avgIsoChange: 18.0153 },
	{ descr: "Formylation",
				monoIsoChange: 27.99491, avgIsoChange: 28.0104 },
	{ descr: "Acetylation",
				monoIsoChange: 42.01056, avgIsoChange: 42.0373 },
	{ descr: "Asp or Glu carboxylation",
				monoIsoChange: 43.98983, avgIsoChange: 44.0098 },
	{ descr: "Cys carboxyamidomethylation by iodoacetamide",
				monoIsoChange: 57.02146, avgIsoChange: 57.0520 },
	{ descr: "Cys carboxymethylation by iodoacetate",
				monoIsoChange: 58.00548, avgIsoChange: 58.0367 },
	{ descr: "Sulfation",
				monoIsoChange: 79.95682, avgIsoChange: 80.0624 },
	{ descr: "Phosphorylation",
				monoIsoChange: 79.96633, avgIsoChange: 79.9799 },
	{ descr: "Cys pyridylethylation",
				monoIsoChange: 105.05785, avgIsoChange: 105.1393 },
	{ descr: "Cysteinylation",
				monoIsoChange: 119.00410, avgIsoChange: 119.1442 },
	{ descr: "Pentosylation (Ara, Rib, Xyl)",
				monoIsoChange: 132.04226, avgIsoChange: 132.1166 },
	{ descr: "Deoxyhexosylation",
				monoIsoChange: 146.05795, avgIsoChange: 146.1430 },
	{ descr: "Hexosamination (GalN, GlcN)",
				monoIsoChange: 161.06881, avgIsoChange: 161.1577 },
	{ descr: "Hexosylation (Frc, Gal, Glc, Man)",
				monoIsoChange: 162.05282, avgIsoChange: 162.1424 },
	{ descr: "Lipoic acid (amide bond to Lysine)",
				monoIsoChange: 188.03296, avgIsoChange: 188.3147 },
	{ descr: "N-acetylhexosamines (GalNAc, GlcNAc)",
				monoIsoChange: 203.07937, avgIsoChange: 203.195 },
	{ descr: "Farnesylation",
				monoIsoChange: 204.18780, avgIsoChange: 204.3556 },
	{ descr: "Myristoylation",
				monoIsoChange: 210.19836, avgIsoChange: 210.3598 },
	{ descr: "Biotinylation (amide bond to Lysine)",
				monoIsoChange: 226.07760, avgIsoChange: 226.2994 },
	{ descr: "Pyridoxal phosphate (Schiff Base formed to Lysine)",
				monoIsoChange: 231.02966, avgIsoChange: 231.1449 },
	{ descr: "Palmitoylation",
				monoIsoChange: 238.22966, avgIsoChange: 238.4136 },
	{ descr: "Stearoylation",
				monoIsoChange: 266.26096, avgIsoChange: 266.4674 },
	{ descr: "Seranylgeranylation",
				monoIsoChange: 272.25040, avgIsoChange: 272.4741 },
	{ descr: "N-acetylneuraminic acid (Sialic acid, NeuAc, NANA, SA)",
				monoIsoChange: 291.09542, avgIsoChange: 291.2579 },
	{ descr: "Glutathionylation",
				monoIsoChange: 305.06816, avgIsoChange: 305.3117 },
	{ descr: "N-glycolylneuraminic acid (NeuGc)",
				monoIsoChange: 307.08003, avgIsoChange: 307.2573 },
	{ descr: "5'-Adenosylation",
				monoIsoChange: 329.05252, avgIsoChange: 329.2091 },
	{ descr: "4'-Phosphopanthetheine",
				monoIsoChange: 339.07797, avgIsoChange: 339.3294 },
	{ descr: "ADP-ribosylation (from NAD)",
				monoIsoChange: 541.06111, avgIsoChange: 541.3052 }
];

const	MassSpecIsotopes = [ // source	75 Pure Appl. Chem. 683-800 (2003)
		{ isotope: "H1",       xmass:  1.00782503207,  rel_abund:   99.9885 },
		{ isotope: "H2",       xmass:  2.0141017778,   rel_abund:    0.0115 },
		{ isotope: "H3",       xmass:  3.0160492777,   rel_abund:    0.00  },
		{ isotope: "C11",      xmass: 11.0114336,      rel_abund:    0.00  },
		{ isotope: "C12",      xmass: 12.00000,        rel_abund:   98.93  },
		{ isotope: "C13",      xmass: 13.003354838,    rel_abund:    1.07  },
		{ isotope: "C14",      xmass: 14.003241989,    rel_abund:    0.0   },
		{ isotope: "N14",      xmass: 14.0030740048,   rel_abund:   99.636 },
		{ isotope: "N15",      xmass: 15.000108892,    rel_abund:    0.364 },
		{ isotope: "O16",      xmass: 15.99491461956,  rel_abund:   99.757 },
		{ isotope: "O17",      xmass: 16.99913170,     rel_abund:    0.038 },
		{ isotope: "O18",      xmass: 17.999161,       rel_abund:    0.205 },
		{ isotope: "F19",      xmass: 18.99840322,     rel_abund:  100.0   },
		{ isotope: "Na23",     xmass: 22.9897692809,   rel_abund:  100.0   },
		{ isotope: "Mg24",     xmass: 23.9850417,      rel_abund:   78.99  },
		{ isotope: "Mg25",     xmass: 24.98583692,     rel_abund:   10.00  },
		{ isotope: "Mg26",     xmass: 25.982592929,    rel_abund:   11.01  },
		{ isotope: "Si28",     xmass: 27.97692649,     rel_abund:   92.223 },
		{ isotope: "Si29",     xmass: 28.97649468,     rel_abund:    4.685 },
		{ isotope: "Si30",     xmass: 29.97377018,     rel_abund:    3.092 },
		{ isotope: "P31",      xmass: 30.97376149,     rel_abund:  100     },
		{ isotope: "S32",      xmass: 31.97207100,     rel_abund:   94.99  },
		{ isotope: "S33",      xmass: 32.97145854,     rel_abund:    0.75  },
		{ isotope: "S34",      xmass: 33.96786687,     rel_abund:    4.25  },
		{ isotope: "S36",      xmass: 35.96708088,     rel_abund:    0.01  },
		{ isotope: "Cl35",     xmass: 34.96885271,     rel_abund:   75.76  },
		{ isotope: "Cl37",     xmass: 36.96590260,     rel_abund:   24.24  },
		{ isotope: "K39",      xmass: 38.9637069,      rel_abund:   93.2581},
		{ isotope: "K40",      xmass: 39.96399867,     rel_abund:    0.0117},
		{ isotope: "K41",      xmass: 40.96182597,     rel_abund:    6.7302},
		{ isotope: "Ca40",     xmass: 39.9625912,      rel_abund:   96.941 },
		{ isotope: "Ca42",     xmass: 41.9586183,      rel_abund:    0.647 },
		{ isotope: "Ca43",     xmass: 42.9587668,      rel_abund:    0.135 },
		{ isotope: "Ca44",     xmass: 43.9554811,      rel_abund:    2.086 },
		{ isotope: "Ca46",     xmass: 45.9536927,      rel_abund:    0.004 },
		{ isotope: "Ca48",     xmass: 47.952533,       rel_abund:    0.187 },
		{ isotope: "Mn55",     xmass: 54.9380493,      rel_abund:  100.0   },
		{ isotope: "Fe54",     xmass: 53.9396147,      rel_abund:    5.845 },
		{ isotope: "Fe56",     xmass: 55.9349418,      rel_abund:   91.754 },
		{ isotope: "Fe57",     xmass: 56.9353983,      rel_abund:    2.119 },
		{ isotope: "Fe58",     xmass: 57.9332801,      rel_abund:    0.282 },
		{ isotope: "Cu63",     xmass: 62.9296007,      rel_abund:   69.15  },
		{ isotope: "Cu65",     xmass: 64.9277938,      rel_abund:   30.85  },
		{ isotope: "Zn64",     xmass: 63.9291461,      rel_abund:   48.268 },
		{ isotope: "Zn66",     xmass: 65.9260364,      rel_abund:   27.975 },
		{ isotope: "Zn67",     xmass: 66.9271305,      rel_abund:    4.102 },
		{ isotope: "Zn68",     xmass: 67.9248473,      rel_abund:   19.024 },
		{ isotope: "Zn70",     xmass: 69.925325,       rel_abund:    0.631 },
		{ isotope: "I127",     xmass: 126.904468,      rel_abund:  100.0   }
];

const ExampleProteins = [
		{ name : "Bovine Serum Albumin" , altName : "BSA" , uniprotId: "ALBU_BOVIN",
			organism : "Bos taurus", uniprotAccNum: "P02769" ,
			sequence :
				"MKWVTFISLL LLFSSAYSRG VFRRDTHKSE IAHRFKDLGE EHFKGLVLIA FSQYLQQCPF" +
				"DEHVKLVNEL TEFAKTCVAD ESHAGCEKSL HTLFGDELCK VASLRETYGD MADCCEKQEP" +
				"ERNECFLSHK DDSPDLPKLK PDPNTLCDEF KADEKKFWGK YLYEIARRHP YFYAPELLYY" +
				"ANKYNGVFQE CCQAEDKGAC LLPKIETMRE KVLASSARQR LRCASIQKFG ERALKAWSVA" +
				"RLSQKFPKAE FVEVTKLVTD LTKVHKECCH GDLLECADDR ADLAKYICDN QDTISSKLKE" +
				"CCDKPLLEKS HCIAEVEKDA IPENLPPLTA DFAEDKDVCK NYQEAKDAFL GSFLYEYSRR" +
				"HPEYAVSVLL RLAKEYEATL EECCAKDDPH ACYSTVFDKL KHLVDEPQNL IKQNCDQFEK" +
				"LGEYGFQNAL IVRYTRKVPQ VSTPTLVEVS RSLGKVGTRC CTKPESERMP CTEDYLSLIL" +
				"NRLCVLHEKT PVSEKVTKCC TESLVNRRPC FSALTPDETY VPKAFDEKLF TFHADICTLP" +
				"DTEKQIKKQT ALVELLKHKP KATEEQLKTV MENFVAFVDK CCAADDKEAC FAVEGPKLVV" +
				"STQTALA" ,
			process : [
				{ feature : "signal" , start : 1 , end : 18 , avgMass : 2106.55 , pI : 8.34 },
				{ feature : "propeptide" , start : 19 , end : 22 },
				{ feature : "chain" , start : 25 , end : 607 , avgMass : 66432.96 , pI : 5.60 }
			],
			domains : [
				{ feature : "albumin 1" , start : 19 , end : 209 },
				{ feature : "albumin 2" , start : 210 , end : 402 },
				{ feature : "albumin 3" , start : 403 , end : 600 }
			],
			disulfidePair : [ 77, 86, 99, 115, 114, 125, 147, 192, 191, 200,
				223, 269, 268, 276, 288, 302, 301, 312, 339, 384, 383, 392,
				415, 461, 460, 471, 484, 500, 499, 510, 537, 582, 581, 590 ]
		},

		{ name : "Yeast Alcohol Dehydrogenase I subunit" ,
			altName : "YADH1" , uniprotId: "ADH1_YEAST",
			organism : "Saccharomyces cerevisiae", uniprotAccNum: "P00330" ,
			sequence :
				"MSIPETQKGV IFYESHGKLE YKDIPVPKPK ANELLINVKY SGVCHTDLHA WHGDWPLPVK" +
				"LPLVGGHEGA GVVVGMGENV KGWKIGDYAG IKWLNGSCMA CEYCELGNES NCPHADLSGY" +
				"THDGSFQQYA TADAVQAAHI PQGTDLAQVA PILCAGITVY KALKSANLMA GHWVAISGAA" +
				"GGLGSLAVQY AKAMGYRVLG IDGGEGKEEL FRSIGGEVFI DFTKEKDIVG AVLKATDGGA" +
				"HGVINVSVSE AAIEASTRYV RANGTTVLVG MPAGAKCCSD VFNQVVKSIS IVGSYVGNRA" +
				"DTREALDFFA RGLVKSPIKV VGLSTLPEIY EKMEKGQIVG RYVVDTSK" ,
			process : [
				{ feature : "initiator Met" , start : 1 , end : 1 },
				{ feature : "chain" , start : 2 , end : 348 , avgMass : 66432.96 , pI : 5.60 }
			],
			domains : [
				{ feature : "NAD binding" , start : 178 , end : 184 },
				{ feature : "NAD binding" , start : 269 , end : 271 }
			],
			disulfidePair : [   // none
			]
		},
];

const ExamplePeptides = [
		{ name : "angiotensin I (human)" , CAS: "70937-97-2" ,
			monoMass : 1296.6853 , avgMass : 1297.51 ,
			sequence : "DRVYIHPFHL" },
		{ name : "substance P [acetate hydrate]" , CAS: "33507-63-0" ,
			monoMass : 1347.7360 , avgMass : 1348.66 ,
			sequence : "RPKPQQFFGL M-nh2" },
		{ name : "Glu[1]-Fibrinopeptide B" , CAS: "103213-49-6" ,
			monoMass : 1570.6774 , avgMass : 1571.61 ,
			sequence : "EGVNDNEEGF FSAR" },
		{ name : "Renin substrate tetradecapeptide/Angiotensinogen 1-14 (porcine)" ,
				CAS: "20845-02-7" ,
			monoMass : 1758.9326 , avgMass : 1760.05 ,
			sequence : "DRVYIHPFHL LVYS" },
		{ name : "ACTH fragment 18-39 (human) [CLIP]" , CAS: "53917-42-3" ,
			monoMass : 2465.1989 , avgMass : 2466.72 ,
			sequence : "RPVKVYPNGA EDESAEAFPL EF" }
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ReductionPotentials = [
//	Electrode Couple                 E0, V     dE0/dT, mV/K
	{ EC: "Na+ + e- ==> Na", 	E0: -2.7144,   dE0dT: -0.758 },
	{ EC: "Mg2+ + 2e- ==> Mg", 	E0: -2.3568,   dE0dT: +0.208 },
	{ EC: "Al3+ + 3e- ==> Al", 	E0: -1.676,   dE0dT: +0.532 },
	{ EC: "Zn2+ + 2e- ==> Zn", 	E0: -0.7621,   dE0dT: +0.119 },
	{ EC: "Fe2+ + 2e- ==> Fe", 	E0: -0.4089,   dE0dT: +0.178 },
	{ EC: "Cd2+ + 2e- ==> Cd", 	E0: -0.4022,   dE0dT: -0.030 },
	{ EC: "Tl+ + e- ==> Tl", 		E0: -0.3358,   dE0dT: -1.313 },
	{ EC: "Sn2+ + 2e- ==> Sn", 	E0: -0.1410,   dE0dT: -0.322 },
	{ EC: "Pb2+ + 2e- ==> Pb", 	E0: -0.1266,   dE0dT: -0.215 },
	{ EC: "2H+ + 2e- ==> H2(SHE)", 	E0: 0.0000,   dE0dT: 0.000 },
	{ EC: "S4O62- + 2e- ==> 2S2O32-", 	E0: +0.0238,   dE0dT: -1.32 },
	{ EC: "Sn4+ + 2e- ==> Sn2+", 	E0: +0.1539,   dE0dT: -0.159 },
	{ EC: "SO42- + 4H+ + 2e- ==> H2O + H2SO3(aq)", 	E0: +0.1576,   dE0dT: +0.784 },
	{ EC: "Cu2+ + e- ==> Cu+", 	E0: +0.1607,   dE0dT: +0.776 },
	{ EC: "S + 2H+ + 2e- ==> H2S", 	E0: +0.1739,   dE0dT: -0.224 },
	{ EC: "AgCl + e- ==> Ag + Cl-", 	E0: +0.2221,   dE0dT: -0.648 },
	{ EC: "Saturated Calomel (SCE)", 	E0: +0.2412,   dE0dT: -0.661 },
	{ EC: "UO22+ + 4H+ + 2e- ==> U4+ + 4H2O", 	E0: +0.2682,   dE0dT: -1.572 },
	{ EC: "Hg2Cl2 + 2e- ==> 2Cl- + 2Hg", 	E0: +0.2680,   dE0dT: -0.301 },
	{ EC: "Bi3+ + 3e- ==> Bi", 	E0: +0.286,   dE0dT: "====" },
	{ EC: "Cu2+ + 2e- ==> Cu", 	E0: +0.3394,   dE0dT: +0.011 },
	{ EC: "Fe(CN)63- + e- ==> Fe(CN)64-", 	E0: +0.3557,   dE0dT: -2.494 },
	{ EC: "Cu+ + e- ==> Cu", 	E0: +0.5180,   dE0dT: -0.754 },
	{ EC: "I2 + 2e- ==> 2I-", 	E0: +0.5345,   dE0dT: -0.126 },
	{ EC: "I3- + 2e- ==> 3I-", 	E0: +0.5354,   dE0dT: -0.187 },
	{ EC: "H3AsO4(aq) + 2H+ + 2e- ==> H3AsO3(aq) + H2O", 	E0: +0.5748,   dE0dT: -0.258 },
	{ EC: "2HgCl2 + 4H+ + 2e- ==> hg2Cl2 + 2Cl-", 	E0: +0.6011,   dE0dT: +0.149 },
	{ EC: "Hg2SO4 + 2e- ==> 2Hg + SO42-", 	E0: +0.6152,   dE0dT: -0.825 },
	{ EC: "I2(aq) + 2e- ==> 2I-", 	E0: +0.6195,   dE0dT: -0.443 },
	{ EC: "O2 + 2H+ + 2e- ==> H2O2(l)", 	E0: +0.6237,   dE0dT: -1.172 },
	{ EC: "O2 + 2H+ + 2e- ==> H2O2(aq)", 	E0: +0.6945,   dE0dT: -0.317 },
	{ EC: "Fe3+ + e- ==> Fe2+", 	E0: +0.769,   dE0dT: +1.170 },
	{ EC: "Hg22+ + 2e- ==> Hg", 	E0: +0.7955,   dE0dT: -0.721 },
	{ EC: "Ag+ + e- ==> Ag", 	E0: +0.7991,   dE0dT: -0.989 },
	{ EC: "Hg2+ + 2e- ==> Hg", 	E0: +0.8519,   dE0dT: -0.116 },
	{ EC: "2Hg2+ + 2e- ==> Hg2+", 	E0: +0.9083,   dE0dT: +0.094 },
	{ EC: "NO3- + 3H+ + 2e- ==> HNO2(aq) + H2O", 	E0: +0.9275,   dE0dT: -0.371 },
	{ EC: "VO2+ + 2H+ + e- ==> VO2+ + H2O", 	E0: +1.0004,   dE0dT: -0.902 },
	{ EC: "HNO2(aq) + H+ + e- ==> NO + H2O", 	E0: +1.0362,   dE0dT: -0.826 },
	{ EC: "Br2(l) + 2e- ==> 2Br-", 	E0: +1.0775,   dE0dT: -0.612 },
	{ EC: "Br2(aq) + 2e- ==> 2Br-", 	E0: +1.0978,   dE0dT: -0.176 },
	{ EC: "2IO3- + 12H+ + 10e- ==> 6H2O + I2", 	E0: +1.2093,   dE0dT: -0.245 },
	{ EC: "O2 + 4H+ + 4e- ==> 2H2O", 	E0: +1.2288,   dE0dT: -0.846 },
	{ EC: "MnO2 + 4H+ + 2e- ==> Mn2+ + 2H2O", 	E0: +1.1406,   dE0dT: -0.643 },
	{ EC: "Cl2 + 2e- ==> 2Cl-", 	E0: +1.3601,   dE0dT: -1.248 },
	{ EC: "MnO4- + 8H+ + 5e- ==> 4H2O + Mn2+", 	E0: +1.5119,   dE0dT: -0.646 },
	{ EC: "2BrO3- + 12H+ + 10e- ==> 6H2O + Br2", E0:  +1.5131,   dE0dT: -0.252 },
	{ EC: "Ce4+ + e- ==> Ce3+", 	E0: +1.7432,   dE0dT: +0.318 }
];

/* ========================================================================
Notes: Values for 0.1 MPa and 25oC in aqueous 1.0 molar acid solution,
calculated from U.S.N.B.S. tables of molar thermodynamic properties unless
in italics. The potential values are given to the nearest 0.1 mV if known,
thermal coefficients to the nearest 0.001 mV/K if known. The thermal
coefficient is that of the isothermal cell in which one of the electrodes
is the standard hydrogen electrode. Ions are all aqueous. Elements and
compounds are pure substances, present in their usual state at 25oC, unless
otherwise indicated. The saturated calomel reference potential is the
experimental value for pure mercury in contact with an aqueous solution
saturated with both Hg2Cl2 and KCl.
========================================================================
*/



/*
	Detergent Use Code as a string:
		Bit 5 = solubilization of membrane proteins (leftmost)
		Bit 4 = analytical & diagnostic
		Bit 3 = chromatography & electrophoresis
		Bit 2 = delivery of drugs
		Bit 1 = enzymology
		Bit 0 = immunology
	CMC is given in millimolar as a range
*/

const Detergents = [
	// <!--        Non-ionic detergents          -->
		{ acronym: "Big CHAP", MW: 878.1, CAS: "86303-22-2",
			name: "N,N-bis(3-D-gluconamidopropyl)cholamide",
			cmc_low: 3, cmc_high: 4, aggregate_low: 10, aggregate_high: 10,
			use: "000100", type: "non-ionic" },
		{ acronym: "Brij 35", MW: 1200, CAS: "9002-92-0",
			name: "polyoxyethylene-2,3-laurylether",
			cmc_low: 0.05, cmc_high: 0.1, aggregate_low: 20, aggregate_high: 40,
			use: "111110", type: "non-ionic" },
		{ acronym: "C<sub>12</sub> E<sub>8</sub>", MW: 538.8, CAS: "3005-98-9",
			name: "octaethylene glycol mono-N-dodecylether",
			cmc_low: 0.11, cmc_high: 0.11, aggregate_low: 123, aggregate_high: 123,
			use: "101010", type: "non-ionic" },
		{ acronym: "C<sub>12</sub> E<sub>9</sub>", MW: 583.1, CAS: "3055-99-9",
			name: "nonaethylene glycol mono-N-dodecylether",
			cmc_low: 0.08, cmc_high: 0.08, aggregate_low: -1, aggregate_high: -1,
			use: "111110", type: "non-ionic" },
		{ acronym: "n-Octyl-&beta;-D-glucose", MW: 292.3, CAS: "",
			name: "n-Octyl-&beta;-D-glucopyranoside",
			cmc_low: 20, cmc_high: 25, aggregate_low: 84, aggregate_high: 84,
			use: "100000", type: "non-ionic" },
		{ acronym: "n-Decyl-&beta;-D-glucopyranoside", MW: 320.4, CAS: "58846-77-8",
			name: "",
			cmc_low: 2, cmc_high: 3, aggregate_low: -1, aggregate_high: -1,
			use: "100000", type: "non-ionic" },
		{ acronym: "n-Dodecyl-&beta;-D-glucopyranoside", MW: 348.5, CAS: "59122-55-3",
			name: "",
			cmc_low: 0.13, cmc_high: 0.13, aggregate_low: -1, aggregate_high: -1,
			use: "100000", type: "non-ionic" },
		{ acronym: "n-Dodecyl-&beta;-D-maltoside", MW: 510.6, CAS: "69227-93-6",
			name: "",
			cmc_low: 0.1, cmc_high: 0.6, aggregate_low: 98, aggregate_high: 98,
			use: "111111", type: "non-ionic" },
		{ acronym: "Deoxy Big CHAP", MW: 862.1, CAS: "86303-23-3",
			name: "",
			cmc_low: 1.1, cmc_high: 1.4, aggregate_low: 8, aggregate_high: 16,
			use: "001000", type: "non-ionic" },
		{ acronym: "MEGA-8", MW: 321.5, CAS: "85316-98-9",
			name: "",
			cmc_low: 58, cmc_high: 58, aggregate_low: -1, aggregate_high: -1,
			use: "110110", type: "non-ionic" },
		{ acronym: "MEGA-9", MW: 335.5, CAS: "85261-19-4",
			name: "",
			cmc_low: 19, cmc_high: 25, aggregate_low: -1, aggregate_high: -1,
			use: "110110", type: "non-ionic" },
		{ acronym: "MEGA-10", MW: 349.5, CAS: "85261-20-7",
			name: "",
			cmc_low: 6, cmc_high: 7, aggregate_low: -1, aggregate_high: -1,
			use: "110111", type: "non-ionic" },
		{ acronym: "NP-40 (substitute)", MW: 602.8, CAS: "9036-19-5",
			name: "Nonidet P40: octyl (I) phenoxypolyethoxyethanol",
			cmc_low: 0.05, cmc_high: 0.3, aggregate_low: 149, aggregate_high: 149,
			use: "101000", type: "non-ionic" },
		{ acronym: "Triton X-100", MW: 0, CAS: "",
			name: "",
			cmc_low: 0.2, cmc_high: 0.9, aggregate_low: 140, aggregate_high: 140,
			use: "000000", type: "non-ionic" },
		{ acronym: "Triton X-114", MW: 0, CAS: "",
			name: "",
			cmc_low: 0.2, cmc_high: 0.2, aggregate_low: -1, aggregate_high: -1,
			use: "000000", type: "non-ionic" },
		{ acronym: "Tween 20", MW: 1228, CAS: "",
			name: "polyoxyethylene sorbitan monolaurate",
			cmc_low: 0.06, cmc_high: 0.06, aggregate_low: -1, aggregate_high: -1,
			use: "000000", type: "non-ionic" },
		{ acronym: "Tween 80", MW: 1310, CAS: "",
			name: "polyoxyethylene sorbitan monooleate",
			cmc_low: 0.012, cmc_high: 0.012, aggregate_low: 60, aggregate_high: 60,
			use: "000000", type: "non-ionic" },
	// <!--        Anionic detergents          -->
		{ acronym: "Deoxycholic acid", MW: 414.6, CAS: "",
			name: "",
			cmc_low: 5.0, cmc_high: 5.0, aggregate_low: 4, aggregate_high: 10,
			use: "000000", type: "anionic" },
		{ acronym: "LDS", MW: 272.3, CAS: "",
			name: "Lithium dodecyl sulfate (lithium lauryl sulfate)",
			cmc_low: 7, cmc_high: 10, aggregate_low: -1, aggregate_high: -1,
			use: "000000", type: "anionic" },
		{ acronym: "SDS", MW: 288.4, CAS: "",
			name: "Sodium dodecyl sulfate (sodium lauryl sulfate)",
			cmc_low: 8.27, cmc_high: 8.27, aggregate_low: 62, aggregate_high: 62,
			use: "000000", type: "anionic" },
		{ acronym: "Sodium lauryl sarcosine", MW: 288.4, CAS: "",
			name: "Sodium lauryl sarcosine",
			cmc_low: -1, cmc_high: -1, aggregate_low: -1, aggregate_high: -1,
			use: "000000", type: "anionic" },
	// <!--        Cationic detergents          -->
		{ acronym: "Cetyldimethylammonium bromide", MW: 378.5, CAS: "",
			name: "Cetyldimethylammonium bromide",
			cmc_low: -1, cmc_high: -1, aggregate_low: -1, aggregate_high: -1,
			use: "000000", type: "cationic" },
		{ acronym: "CTAB", MW: 364.1, CAS: "",
			name: "Cetyldimethylammonium bromide",
			cmc_low: 1.0, cmc_high: 1.0, aggregate_low: 170, aggregate_high: 170,
			use: "000000", type: "cationic" },
	// <!--        Zwitterionic detergents          -->
		{ acronym: "CHAPS", MW: 614.9, CAS: "",
			name: "3-(3-Cholamidopropyl)dimethylammonio-1-propanesulfonate",
			cmc_low: 6, cmc_high: 10, aggregate_low: 4, aggregate_high: 14,
			use: "000000", type: "zwitterionic" },
		{ acronym: "CHAPSO", MW: 630.9, CAS: "",
			name: "3-(3-Cholamidopropyl) dimethylammonio-2-hydroxy-1-propanesulfonate",
			cmc_low: 8.0, cmc_high: 8.0, aggregate_low: 11, aggregate_high: 11,
			use: "000000", type: "zwitterionic" },
];

const StdEquip = {
			Beakers:  [ 10, 50, 100, 125, 250, -400, 500, 1000, 4000 ],
			GradCyls: [ 10, 25, 50, 100, 250, 500, 1000, 2000, 4000 ],
			Pipets: [ 1.0, 5.0, 10.0, 25.0 ],
			VarPipets: [
				{ lo: 2, 	hi: 10,	 dim: "uL" },
				{ lo: 10,	hi: 100,  dim: "uL" },
				{ lo: 100,	hi: 1000, dim: "uL" },
				{ lo: 1, 	hi: 5,	 dim: "mL" } ]
};

const RotorDatabase: RotorDbItem[] = [

	{ header : "Sorvall" },
	{ name : "SS-34" , unit : "mm", angle : 34 , maxRpm : 20500 ,
			avgRadius : 69.9 , minRadius : 32.7 , maxRadius : 107.0 },
	{ name : "SA-300" , unit : "mm", angle : 34 , maxRpm : 25000 ,
			avgRadius : 60.1 , minRadius : 23.5 , maxRadius : 96.7 },
	{ name : "SA-600" , unit : "mm", angle : 34 , maxRpm : 17000 ,
			avgRadius : 92.4 , minRadius : 55.2 , maxRadius : 129.6 },
	{ name : "SA-800" , unit : "mm", angle : 20 , maxRpm : 20500 ,
			avgRadius : 72.9 , minRadius : 41.2 , maxRadius : 104.5 },
	{ name : "SA-512" , unit : "mm", angle : 23 , maxRpm : 19500 ,
			avg1Radius : 72.7 , avg2Radius : 89.5 ,
			min1Radius : 47.0 , min2Radius : 63.7 ,
			max1Radius : 98.4 , max2Radius : 115.2 },
	{ name : "SLA-1000" , unit : "mm", angle : 23 , maxRpm : 16500 ,
			avgRadius : 68.1 , minRadius : 18.4 , maxRadius : 117.7 },
	{ name : "SLA-1500" , unit : "mm", angle : 23 , maxRpm : 15000 ,
			avgRadius : 86.3 , minRadius : 36.6 , maxRadius : 135.9 },
	{ name : "SLA-3000" , unit : "mm", angle : 23 , maxRpm : 12000 ,
			avgRadius : 95.3 , minRadius : 39.4 , maxRadius : 151.1 },
	{ name : "HB-4" , unit : "", angle : 0 , maxRpm : 0 ,
			avgRadius : 0 , minRadius : 0 , maxRadius : 0 },
	{ name : "HB-6" , unit : "mm", angle : 90 , maxRpm : 13000 ,
			avgRadius : 95.7 , minRadius : 45.0 , maxRadius : 146.3 },
	{ name : "HS-4" , unit : "mm", angle : 90 , maxRpm : 7500 ,
			avgRadius : 122.5 , minRadius : 72.2 , maxRadius : 172.3 },
	{ name : "SH-3000 bucket" , unit : "mm", angle : 90 , maxRpm : 4700 ,
			avgRadius : 138.3 , minRadius : 91.1 , maxRadius : 185.4 },
	{ name : "SH-3000 microplate" , unit : "mm", angle : 90 , maxRpm : 4700 ,
			avgRadius : 150.2 , minRadius : 150.2 , maxRadius : 150.2 },

	{ header : "Beckman" },
	{ name : "Type 100 Ti" , unit : "mm", angle : 26, maxRpm : 100000 ,
			avgRadius : 55.5 , minRadius : 39.5 , maxRadius : 71.6 },
	{ name : "Type 90 Ti" , unit : "mm", angle : 25, maxRpm : 90000 ,
			avgRadius : 55.4 , minRadius : 34.2 , maxRadius : 76.5 },
	{ name : "Type 70.1 Ti" , unit : "mm", angle : 24, maxRpm : 70000 ,
			avgRadius : 61.2 , minRadius : 40.5 , maxRadius : 82.0 },
	{ name : "Type 70 Ti" , unit : "mm", angle : 23, maxRpm : 70000 ,
			avgRadius : 65.7 , minRadius : 39.5 , maxRadius : 91.9 },
	{ name : "Type 50.4 Ti" , unit : "mm", angle : 20, maxRpm : 50000 ,
			avgRadius : 96.1 , minRadius : 80.8 , maxRadius : 111.5 },
	{ name : "Type 50.2 Ti" , unit : "mm", angle : 24, maxRpm : 50000 ,
			avgRadius : 81.2 , minRadius : 54.4 , maxRadius : 107.9 },
	{ name : "Type 45.1 Ti" , unit : "mm", angle : 24, maxRpm : 45000 ,
			avgRadius : 69.8 , minRadius : 35.9 , maxRadius : 103.8 },
	{ name : "Type 45 Ti" , unit : "mm", angle : 30, maxRpm : 45000 ,
			avgRadius : 108.5 , minRadius : 104 , maxRadius : 113 },
	{ name : "Type 25" , unit : "mm", angle : 25, maxRpm : 25000 ,
			max1Radius : 100.4 , max2Radius : 116.3 , max3Radius : 131.1 },
	{ name : "Type 19" , unit : "mm", angle : 25, maxRpm : 19000 ,
			avgRadius : 83.9 , minRadius : 34.4 , maxRadius : 133.4 },
	{ name : "NVT 100" , unit : "mm", angle : 8, maxRpm : 100000 ,
			avgRadius : 57.6 , minRadius : 48.3 , maxRadius : 67.0 },
	{ name : "NVT 90" , unit : "mm", angle : 8, maxRpm : 90000 ,
			avgRadius : 61.8 , minRadius : 52.4 , maxRadius : 71.1 },
	{ name : "NVT 65.2" , unit : "mm", angle : 8.5, maxRpm : 65000 ,
			avgRadius : 78.4 , minRadius : 68.8 , maxRadius : 87.9 },
	{ name : "NVT 65" , unit : "mm", angle : 7.5, maxRpm : 65000 ,
			avgRadius : 72.2 , minRadius : 59.5 , maxRadius : 84.9 },
	{ name : "VTi 90" , unit : "mm", angle : 0, maxRpm : 90000 ,
			avgRadius : 64.5 , minRadius : 57.9 , maxRadius : 71.1 },
	{ name : "VTi 65.2" , unit : "mm", angle : 0, maxRpm : 65000 ,
			avgRadius : 81.3 , minRadius : 74.7 , maxRadius : 87.9 },
	{ name : "VTi 65.1" , unit : "mm", angle : 0, maxRpm : 65000 ,
			avgRadius : 76.7 , minRadius : 68.5 , maxRadius : 84.9 },
	{ name : "VTi 50" , unit : "mm", angle : 0, maxRpm : 50000 ,
			avgRadius : 73.7 , minRadius : 60.8 , maxRadius : 86.6 },
	{ name : "SW 60 Ti" , unit : "mm", angle : 90, maxRpm : 60000 ,
			avgRadius : 91.7 , minRadius : 63.1 , maxRadius : 120.3 },
	{ name : "SW 55 Ti" , unit : "mm", angle : 90, maxRpm : 55000 ,
			avgRadius : 84.6 , minRadius : 60.8 , maxRadius : 108.5 },
	{ name : "SW 41 Ti" , unit : "mm", angle : 90, maxRpm : 41000 ,
			avgRadius : 110.2 , minRadius : 67.4 , maxRadius : 153.1 },
	{ name : "SW 40 Ti" , unit : "mm", angle : 90, maxRpm : 40000 ,
			avgRadius : 112.7 , minRadius : 66.7 , maxRadius : 158.8 },
	{ name : "SW 32.1 Ti" , unit : "mm", angle : 90, maxRpm : 32000 ,
			avgRadius : 113.6 , minRadius : 64.4 , maxRadius : 162.8 },
	{ name : "SW 32 Ti" , unit : "mm", angle : 90, maxRpm : 32000 ,
			avgRadius : 109.7 , minRadius : 66.8 , maxRadius : 152.5 },
	{ name : "SW 28.1 Ti" , unit : "mm", angle : 90, maxRpm : 28000 ,
			avgRadius : 122.1 , minRadius : 72.9 , maxRadius : 171.3 },
	{ name : "SW 28 Ti" , unit : "mm", angle : 90, maxRpm : 28000 ,
			avgRadius : 118.2 , minRadius : 75.3 , maxRadius : 161.0 },
	{ name : "TLA-120.2" , unit : "mm", angle : 30, maxRpm : 120000 ,
			avgRadius : 31.8 , minRadius : 24.5 , maxRadius : 38.9 },
	{ name : "TLA-120.1" , unit : "mm", angle : 30, maxRpm : 120000 ,
			avgRadius : 31.8 , minRadius : 24.5 , maxRadius : 38.9 },
	{ name : "TLA-110" , unit : "mm", angle : 28, maxRpm : 110000 ,
			avgRadius : 37.2 , minRadius : 26.0 , maxRadius : 48.5 },
	{ name : "TLA-100.3" , unit : "mm", angle : 30, maxRpm : 100000 ,
			avgRadius : 37.9 , minRadius : 27.5 , maxRadius : 48.3 },
	{ name : "TLA-100" , unit : "mm", angle : 30, maxRpm : 100000 ,
			avgRadius : 34.5 , minRadius : 30.0 , maxRadius : 38.9 },
	{ name : "TLA-55" , unit : "mm", angle : 45, maxRpm : 55000 ,
			avgRadius : 40 , minRadius : 25 , maxRadius : 55 },
	{ name : "MLA-130" , unit : "mm", angle : 35, maxRpm : 130000 ,
			avgRadius : 41.9 , minRadius : 29.9 , maxRadius : 53.9 },
	{ name : "MLA-80" , unit : "mm", angle : 26, maxRpm : 80000 ,
			avgRadius : 45.7 , minRadius : 29.5 , maxRadius : 61.9 },
	{ name : "TLN-120" , unit : "mm", angle : 8, maxRpm : 120000 ,
			avgRadius : 30.3 , minRadius : 24.3 , maxRadius : 36.3 },
	{ name : "TLN-100" , unit : "mm", angle : 8, maxRpm : 100000 ,
			avgRadius : 43.3 , minRadius : 32.5 , maxRadius : 54.2 },
	{ name : "MLN-80" , unit : "mm", angle : 9, maxRpm : 80000 ,
			avgRadius : 43.3 , minRadius : 32.5 , maxRadius : 54.2 },
	{ name : "TLV-100" , unit : "mm", angle : 0, maxRpm : 100000 ,
			avgRadius : 30.2 , minRadius : 24.6 , maxRadius : 35.7 },
	{ name : "TLS-55" , unit : "mm", angle : 90, maxRpm : 55000 ,
			avgRadius : 59.4 , minRadius : 42.2 , maxRadius : 76.5 },
	{ name : "MLS-50" , unit : "mm", angle : 90, maxRpm : 50000 ,
			avgRadius : 71.7 , minRadius : 47.5 , maxRadius : 95.8 },
	{ name : "A-110" , unit : "mm", angle : 18, maxRpm : 110000 ,
			avgRadius : 12.1 , minRadius : 9.5 , maxRadius : 14.7 },
	{ name : "A-100/30" , unit : "mm", angle : 30, maxRpm : 92000 ,
			avgRadius : 13.2 , minRadius : 8.3 , maxRadius : 17.6 },
	{ name : "A-100/18" , unit : "mm", angle : 18, maxRpm : 95000 ,
			avgRadius : 12.1 , minRadius : 9.5 , maxRadius : 14.7 },
	{ name : "A-95" , unit : "mm", angle : 30, maxRpm : 95000 ,
			avgRadius : 13.3 , minRadius : 8.9 , maxRadius : 17.6 }
];



const LibraryData = {

	SolnChemLib: SolnChemLibData.CommonCompounds.concat(SolnChemLibData.OtherSalts),
	Buffers: Buffers,
	Elements: Elements,
	AminoAcids: AminoAcids,
	SpecialAminoAcids: SpecialAminoAcids,
	SpecialAAConstants: SpecialAAConstants,
	Ribonucleotides: Ribonucleotides,
	Deoxyribonucleotides: Deoxyribonucleotides,
	PostTranslationalModMassChanges: PostTranslationalModMassChanges,
	MassSpecIsotopes: MassSpecIsotopes,
	ExampleProteins: ExampleProteins,
	ExamplePeptides: ExamplePeptides,
	Detergents: Detergents,
	StdEquip: StdEquip,
	RotorDatabase: RotorDatabase,

	getAtomicMass : function (atom: string): number | null {
		const Elements: ChemElement[] = this.Elements;
		for (const elemt of Elements)
			if (atom == elemt.sym)
				return elemt.AW;
		return null;
	},

	getIsotopicMass : function (isotope: string) {
		const MassSpecIsotopes = LibraryData.MassSpecIsotopes;
		for (let i = 0; i < MassSpecIsotopes.length; i++)
			if (isotope == MassSpecIsotopes[i].isotope)
				return MassSpecIsotopes[i].xmass;
		return undefined;
	},

	getIsotopeAbundance : function (isotope: string) {
		const MassSpecIsotopes = LibraryData.MassSpecIsotopes;
		for (let i = 0; i < MassSpecIsotopes.length; i++)
			if (isotope == MassSpecIsotopes[i].isotope)
				return MassSpecIsotopes[i].rel_abund;
		return undefined;
	}
};

