"use strict";

/* insert eslint DISABLING for compiled JS here */
/**** <!--  PCR-Related code  -->  ***/

import { ChemController } from "./ModuleController";
import { replaceSpanText } from "../GenLib/html-dom";

const PcrCalculations = {

	xmlDocument: {} as Document,

	moduleId: "SolnChem",

	init : function () {
		if (typeof ChemController === "object")
			ChemController.registerModule(this.moduleId, this);
	},


	activate : function () {
		ChemController.activateModule(this);
   	(document.getElementById("pcr_data")! as HTMLFormElement).reset();
   	document.getElementById("pcr-page")!.style.display = "block";
	},

   /* Freier et al. equations
      Tm = DeltaH/(DeltaS + R * ln(C/4)) + 16.6 log ([K+]/(1 + 0.7[K+])) -
   			273.15
      where:   */
   Delta_H : [ /* enthalpy of adjacent bases calcd by nearest neighbor
   	   If primer is pentamer ATGCA, then DeltaH(ATGCA) =
   	          DeltaH(AT) + DeltaH(TG) + DeltaH(GC) + DeltaH(CA)  */
   //   The table fo enthalpy values is here:
   //    ========================================
   //                    (-cal/mol)
   //                     Second NT
   //    First NT    dA      dC     dG       dT
   //    --------  ------  ------ ------- -------
   /*       dA */   9100,   6500,   7800,   8600,
   /*       dC */   5800,  11000,  11900,   7800,
   /*       dG */   5600,  11100,  11000,   6500,
   /*       dT */   6000,   5600,   5800,   9100  ],
   //    ========================================

   Delta_S : [  /* entropy of adjacent bases calcd by nearest neighbor */
   //    ========================================
   //                    (-cal/mol K)
   //                     Second NT
   //    First NT    dA      dC     dG       dT
   //    --------  ------  ------ ------- -------
   /*       dA */   24.0,   17.3,   20.8,   23.9,
   /*       dC */   12.9,   26.6,   27.8,   20.8,
   /*       dG */   13.5,   26.7,   26.6,   17.3,
   /*       dT */   16.9,   13.5,   12.9,   24.0  ],
   //     ========================================


   pcrCalc : function (): void {
		let i,
			baseG,
			baseA,
			baseC,
			baseT,
			concK,
			prevBase,
			deltaEnthalpy,
			deltaEntropy;

		const seq = (document.getElementById("DNAseq") as HTMLInputElement)!.value;
		const seqerr = (document.getElementById("seqerr") as HTMLInputElement)!;
		if (seq.length == 0) {
			seqerr.value =
				"No sequence has been entered.  Enter only A, C, T, G" +
				" in either all lowercase or uppercase and no spaces";
			return;
		}
		if ((seq.search(/^[catg]+$/)) < 0 &&
				(seq.search(/^[CATG]+$/) < 0)) {
			if ((seq.search(/^[caug]+$/)) < 0 &&
					(seq.search(/^[CAUG]+$/) < 0)) {
				if (seq.search(/^[CcAaTtGg]+$/) < 0)
					seqerr.value =
						"Sequence contains illegal characters:  only A, C, T, G" +
						" in either all lowercase or uppercase and no spaces";
					else
					seqerr.value =
						"No mixed case sequences:  either all uppercase or lowercase";
				return;
			}
			seqerr.value =
				"Note that uracil (U/u) will be treated as thymidine (T/t) " +
				"and calculated only for Bolton & McCarthy";
		}
		const potassium = (document.getElementById("potassium") as HTMLInputElement)!;
		if (isNaN(concK = parseFloat(potassium.value)) == true)
			concK = 0.1;
		potassium.value = concK.toString();
		seqerr.value = "";
		baseG = baseA = baseC = baseT = deltaEnthalpy = deltaEntropy = 0;
		prevBase = 0;
		for (i = 0; i < seq.length; i++) {
			switch (seq.charAt(i)) {
			case 'G':
			case 'g':
				baseG++;
				deltaEnthalpy += this.Delta_H[prevBase * 4 + 2];
				deltaEntropy += this.Delta_S[prevBase * 4 + 2];
				prevBase = 2;
				break;
			case 'A':
			case 'a':
				baseA++;
				deltaEnthalpy += this.Delta_H[prevBase * 4 + 0];
				deltaEntropy += this.Delta_S[prevBase * 4 + 0];
				prevBase = 0;
				break;
			case 'T':
			case 't':
			case 'U':
			case 'u':
				baseT++;
				deltaEnthalpy += this.Delta_H[prevBase * 4 + 3];
				deltaEntropy += this.Delta_S[prevBase * 4 + 3];
				prevBase = 3;
				break;
			case 'C':
			case 'c':
				baseC++;
				deltaEnthalpy += this.Delta_H[prevBase * 4 + 1];
				deltaEntropy += this.Delta_S[prevBase * 4 + 1];
				prevBase = 1;
				break;
			}
			if (i == 0)
				deltaEnthalpy = deltaEntropy = 0;
		}
		const n = baseG + baseC + baseT + baseA;
		replaceSpanText(
			"boltontemp",
			(Math.round((81.5 + 16.6 * Math.log(concK)/Math.LN10 + 0.41 * ((baseG + baseC) / n * 100) - 675 / n) * 10) / 10).toFixed(1),
			this.xmlDocument
		);
		replaceSpanText(
			"freiertemp",
			(Math.round((deltaEnthalpy / (deltaEntropy + (this.MOLAR_GAS_CONSTANT_J_per_K_mol / 4.184, this.xmlDocument) *   // J per calorie
			Math.log(n / 4)) + 16.6 * (Math.log(concK / (1 + 0.7 * concK)) / Math.LN10) - 273.15) * 10) / 10).toFixed(1),
			this.xmlDocument
		);

		if (seq.search(/[uU]+/) < 0)
			replaceSpanText(
				"wallacetemp",
				(2 * (baseA + baseT) + 4 * (baseC + baseG)).toFixed(1),
				this.xmlDocument
			);
		else
			replaceSpanText(
				"wallacetemp",
				"",
				this.xmlDocument
			);
		return;
	}

};

PcrCalculations.init();
