"use strict";

/* insert eslint DISABLING for compiled JS here */
/**** <!--  Mass Spectrometry-related code --->  ***/

const MassSpecCalculations = {

	init : function () {
      var xhtmlText = `${xhtmlFilePath}/MassSpecCalc.xhtml`;  // name of HTML file with module markup for middle panel
		if (typeof ChemController === "object")
			ChemController.registerModule(this, xhtmlText);
        // call the ChemController.registerModule() method!
	},

	activate : function () {
		ChemController.activateModule(this);
		document.getElementById("mass-spec-page")!.style.display = "";
	},

   finishDocument : function () {
      var selNode, selAttribs, optAttribs, optVals, optTexts;
      // enzyme
      selAttribs = [
         "name=enzyme"
      ];
      optAttribs = null;
      optVals = null;
      optTexts = [ "trypsin", "chymotrypsin", "endoproteinase Lys-C" ];
      selNode = makeSelectList(selAttribs, optVals, optTexts, optAttribs);
      document.getElementById("enzyme")!.appendChild(selNode);

      // Cys modification
      selAttribs = [
         "name=cysmod"
      ];
      optTexts = [ "no modification", "reduction only (e.g. DTT or TBP)",
   			"carbamidomethylation (iodoacetamide)",
   			"carboxymethylation (iodoacetic acid)",
   			"pyridylethylation" ];
      selNode = makeSelectList(selAttribs, optVals, optTexts, optAttribs);
      document.getElementById("cysmod")!.appendChild(selNode);
   },


/*
	write_massSpec : function () {
		document.getElementById("massSpectrumForm")!.reset();
		document.getElementById("proteinSequenceForm")!.reset();
		document.getElementById("mass-spec-page")!.style.display = "block";
		document.getElementById("mainmenu-page")!.style.display = "none";
	},
*/
	setMSmodule : function (buttonObj) {
		if (buttonObj.textContent.search(/Protein Sequence/) >= 0) {
			document.getElementById("mass-spec-analysis-mod")!.style.display = "none";
			document.getElementById("protein-sequence-analysis-mod")!.style.display = "block";
		} else if (buttonObj.textContent.search(/Mass Spectrum/) >= 0) {
			document.getElementById("protein-sequence-analysis-mod")!.style.display = "none";
			document.getElementById("mass-spec-analysis-mod")!.style.display = "block";
		}
	},

	setExampleMassSpecAnalysis : function () {
		document.getElementById("mass-spec-entry")!.value;
	},

	setExampleProteinSequenceAnalysis : function () {
	},

	analyzeMassSpectrum : function (form) {
		var i, j,
			data, gdata, dataFound, commaIsDecimal, count,
			spectralData = [], specDataSub,
			DEFAULT_MOST_INTENSE_COUNT = 10,
			mostIntenseCount = DEFAULT_MOST_INTENSE_COUNT,
			url = "http://127.0.0.1/",
			pdata = form.elements["mass-spec-entry"].value.trim(),
			errNode = document.getElementById("AAerror")!.
			errTxt = "There is no entry in the input box",
			maxIntensity = -1,
			minIntensity = Number.POSITIVE_INFINITY,
			minMZ, maxMZ, m_z, intens, range,
			M_Z = [],
			Intensity = [],
			mostIntenseM_Z = [],
			globalformatMatch = /(\d+\.?\d*)\s*,\s*(\d+\.\d*)\s*\r?\n?|(\d+\.?\d*)[ \t]+(\d+\.?\d*)\s*\r?\n?/g,
			formatMatch = /(\d+\.?\d*)\s*,\s*(\d+\.\d*)\s*\r?\n?|(\d+\.?\d*)[ \t]+(\d+\.?\d*)\s*\r?\n?/,
			displayText =
					"<table class=\"mass-spec-vals\">\n" +
					"<col style=\"width:8em;\"><col span=\"3\" " +
					"style=\"width:6em;\"><thead><tr><th><i>m/z<\/i> <th>Absolute Intensity" +
					"<th>Relative Intensity <th>Normalized Intensity<tbody>",
			node;
		if (form.elements["comma-is-decimal"].checked == true)
			commaIsDecimal = true;
		else
			commaIsDecimal = false;
		if (pdata == "") {
			if (errNode.hasChildNodes() == true)
				errNode.replaceChild(document.createTextNode(errTxt), errNode.firstChild);
			else
				errNode.appendChild(document.createTextNode(errTxt));
			errNode.style.display = "";
			return;
		}
		// Before tackling a huge textbox value, analyze it, split it up, be smart
		// try to get number of lines first
		count = pdata.match(/\n/g);
		if (count.length > 1000 && confirm("There are an estimated " +
					count.length + " lines of data in the entry" +
					"\n\nYou will be asked after every 1000 values are processed\n" +
					"whether to continue proceeding.\n\nContinue anyway?") == false)
			return;
		while ((specDataSub = pdata.match(/(.*\n){1000}/)) != null) {
			spectralData.push(specDataSub[0]);
			pdata = pdata.substring(specDataSub[0].length);
		}
		spectralData.push(pdata);
		for (i = 0; i < DEFAULT_MOST_INTENSE_COUNT; i++)
			mostIntenseM_Z.push(new mzPair(0, 0));
		count = 0;
		/*
		var t2;
		var t1 = new Date(); */
		for (i = 0; i < spectralData.length; i++) {
			if (commaIsDecimal == true)
				spectralData[i] = spectralData[i].replace(/,/g, ".");
			gdata = spectralData[i].match(globalformatMatch);
			/* <!--
			if (i > 0)
			{
				t2 = new Date();
				if (confirm("So far " + M_Z.length + " m/z values have been " +
						"processed.  The last 1000 values took " +
						((t2 - t1) / 1000) +
						" seconds to process.\n\nContinue?") == false)
					return;
				delete t1;
				delete t2;
				t1 = new Date();
			}
			--> */
			for (j = 0; j < gdata.length; j++) {
				data = gdata[j].match(formatMatch);
				if (data[1] || data[3]) {
					M_Z.push(m_z = Number(data[1] ? data[1] : data[3]));
					if (data[2] || data[4])
					{
						Intensity.push(intens= Number(data[2] ? data[2] : data[4]));
						if (minIntensity > intens) {
							minIntensity = intens;
							minMZ = m_z;
						}
						if (maxIntensity < intens) {
							maxIntensity = intens;
							maxMZ = m_z;
						}
						mostIntenseM_Z.push(new mzPair(m_z, intens));
						mostIntenseM_Z.sort(rankIntensities);
						mostIntenseM_Z.pop();
					}
					else
						Intensity.push(-1);
				}
			}
		}
		range = maxIntensity - minIntensity;
		for (i = mostIntenseM_Z.length - 1; i >= 0; i--)
			displayText += "\n<tr><td>" + mostIntenseM_Z[i].m_z.toFixed(3) + "<td>" +
					mostIntenseM_Z[i].intensity + "<td>" +
					(mostIntenseM_Z[i].intensity / maxIntensity * 100).toFixed(1) + "<td>" +
					((mostIntenseM_Z[i].intensity - minIntensity) / range * 100).toFixed(1);
		displayText += "<tfoot><\/table>";
		node = document.getElementById("most-intense-mz")!.
		node.replaceChild(buildDocFrag._build(displayText), node.firstChild);
		displayText =
				"<table class=\"mass-spec-vals\">\n<thead><tr><th><i>m/z<\/i> <th>Absolute Intensity" +
				"<th>Relative Intensity <th>Normalized Intensity<tbody>";
		for (var i = 0; i < M_Z.length; i++)
			displayText += "\n<tr><td>" + M_Z[i].toFixed(3) + "<td>" + Intensity[i] + "<td>" +
					(Intensity[i] / maxIntensity * 100).toFixed(1) + "<td>" +
					((Intensity[i] - minIntensity) / range * 100).toFixed(1);
		displayText += "<tfoot><\/table>";
		node = document.getElementById("entered-spectrum")!.
		node.replaceChild(buildDocFrag._build(displayText), node.firstChild);
	},

	// Constructor for an object with property 'm_z' and 'intensity' pair
	mzPair : function (MZ, intensity) {
		this.m_z = MZ;
		this.intensity = intensity;
		return this;
	},

	rankIntensities : function (mzPair1, mzPair2) {  // a sort function
		return (mzPair1.intensity - mzPair2.intensity);
	},

	accessNum : undefined,
	UPKBID : undefined,

	analyzeProtein : function (form) {
		var i, j,
			pdata = form.elements["peptide-entry"].value,
			errNode = document.getElementById("AAerror")!.
			errTxt = "There is no entry in the input box",
			ajaxClient,
			identifier,
			UniProtKBAccessionNumberRE =
    /[A-NR-Z][0-9][A-Z][A-Z0-9][A-Z0-9][0-9]|[OPQ][0-9][A-Z0-9][A-Z0-9][A-Z0-9][0-9]/;

		if (pdata == "") {
			if (errNode.hasChildNodes() == true)
				errNode.replaceChild(document.createTextNode(errTxt), errNode.firstChild);
			else
				errNode.appendChild(document.createTextNode(errTxt));
			errNode.style.display = "";
			proteotable.style.display = "none";
			return;
		}
		if ((this.accessNum = pdata.match(UniProtKBAccessionNumberRE)) != null ||  // is accession number?
					(this.UPKBID = pdata.match(/[A-Z0-9]{1,5}_[A-Z0-9]{1,5}/)) != null) { // is entry name?
		  ajaxClient = new Ajax.HttpPipe();
			if (this.accessNum)
				identifier = this.accessNum = this.accessNum[0];
			else if (this.UPKBID)
				identifier = this.UPKBID = this.UPKBID[0];
			ajaxClient.setUrl("http://www.uniprot.org/uniprot/" + identifier + ".txt");
			ajaxClient.setMethod("GET"); // valid constants are "GET", "POST", "HEAD"
			ajaxClient.setAsynchronousCallback(this.acceptUniprot);
			ajaxClient.setMimeType("text/plain");
			ajaxClient.sendData();  // sends data when all parameters are initialized
		} else
			this.processInput(pdata);
	},

	acceptUniprot : function (httpPipe) {
		var response = httpPipe.responseText,
			accessNumRE, upkbidRE, sequence,
			sequenceRE = /\nSQ\s+(SEQUENCE)?.*;\n(\s+([ACDEFGHIKLMNPQRSTVWY]{10}\s){1,6})+([ACDEFGHIKLMNPQRSTVWY]{1,10})/;
		if (this.accessNum) {
			accessNumRE = new RegExp("\nAC\s+" + this.accessNum);
			if (accessNumRE.test(response) == true)
				sequence = response.match(sequenceRE);
		} else if (this.UPKBID) {
			upkbidRE = new RegExp("ID\\s+" + this.UPKBID);
			if (upkbidRE.test(response) == true)
				sequence = response.match(sequenceRE);
		}
		if (sequence) {
			sequence = sequence;
		}
	},

	processInput : function (info) {
			proteotable = document.getElementById("proteoresults")!.
			protonMass = LibraryData.getIsotopicMass("H1"),
			getAtomicMass = LibraryData.getAtomicMass,
			getIsotopicMass = LibraryData.getIsotopicMass,
			waterMass = 2 * protonMass + LibraryData.getIsotopicMass("O16"),
			AminoAcids = LibraryData.AminoAcids,
			pmassAvg,
			pmassMono,
			pI = 0.0,
			pI_count = 0,
			positionAtoms = [], // the atoms at each position
			atoms = [ "C", "H", "N", "O", "S" ],
			atomCount = [ 0, 0, 0, 0, 0 ],
			BiemannABC = [],
			BiemannXYZ = [],
			node, node2,
			isCTermAmide = false;

		if (info.search(/\-nh2$/) > 0) {
			if (info.length == 4)
				null; // should be an error
			isCTermAmide = true;
			info = info.slice(0, -4);
		}
		info = info.toUpperCase();
		for (i = 0; i < info.length; i++) {
			if (info[i] == ' ' || info[i] == '\n')
				continue;
			for (j = 0; j < AminoAcids.length; j++)
				if (info[i] == AminoAcids[j].sym1)
					break;
			if (j == AminoAcids.length) {
				errTxt = "Not a valid accession number, accession name, or amino acid sequence";
				if (errNode.hasChildNodes() == true)
					errNode.replaceChild(document.createTextNode(errTxt), errNode.firstChild);
				else
					errNode.appendChild(document.createTextNode(errTxt));
				errNode.style.display = "";
				proteotable.style.display = "none";
				return;
			}
			positionAtoms.push(AminoAcids[j].atoms);
/*
			if (i == 0)
				pI += AminoAcids[j].pKa_nh2;
			else if (i == info.length - 1)
				pI += AminoAcids[j].pKa_cooh;
			if (AminoAcids[j].pKa_side) {
				pI += AminoAcids[j].pKa_side;
				pI_count++;
			} */
		}
		for (i = 0; i < positionAtoms.length; i++) {
			atomCount[0] += positionAtoms[i].atoms[0];
			atomCount[1] += positionAtoms[i].atoms[1] - 2;
			atomCount[2] += positionAtoms[i].atoms[2];
			atomCount[3] += positionAtoms[i].atoms[3] - 1;
			if (positionAtoms[i].atoms[4])
				atomCount[4] += positionAtoms[i].atoms[4];
			BiemannABC.push ( [
				// Biemann a_n calculation
					(positionAtoms[i].atoms[0] - 1) * getIsotopicMass("C12") +
					(positionAtoms[i].atoms[1] - 2) * getIsotopicMass("H1") +
						positionAtoms[i].atoms[2] * getIsotopicMass("N14") +
					(positionAtoms[i].atoms[3] - 2) * getIsotopicMass("O16") +
						positionAtoms[i].atoms[4] > 0 ? positionAtoms[i].atoms[4] * getIsotopicMass("S32") : 0 +
						i > 0 ? Biemann[Biemann.length - 1][0] : 0,
				// Biemann b_n calculation
					(positionAtoms[i].atoms[0]) * getIsotopicMass("C12") +
					(positionAtoms[i].atoms[1] - 2) * getIsotopicMass("H1") +
						positionAtoms[i].atoms[2] * getIsotopicMass("N14") +
					(positionAtoms[i].atoms[3] - 1) * getIsotopicMass("O16") +
						positionAtoms[i].atoms[4] > 0 ? positionAtoms[i].atoms[4] * getIsotopicMass("S32") : 0 +
						i > 0 ? Biemann[Biemann.length - 1][1] : 0,
				// Biemann c_n calculation
					(positionAtoms[i].atoms[0] - 1) * getIsotopicMass("C12") +
					(positionAtoms[i].atoms[1] - 1) * getIsotopicMass("H1") +
					(positionAtoms[i].atoms[2] + 1) * getIsotopicMass("N14") +
					(positionAtoms[i].atoms[3] - 1) * getIsotopicMass("O16") +
						positionAtoms[i].atoms[4] > 0 ? positionAtoms[i].atoms[4] * getIsotopicMass("S32") : 0 +
						i > 0 ? Biemann[Biemann.length - 1][2] : 0,
			] );
		}
		for (i = positionAtoms.length - 1; i >= 0; i--) {
			BiemannXYZ.push ( [
				// Biemann x_n calculation
					(positionAtoms[i].atoms[0] - 1) * getIsotopicMass("C12") +
					(positionAtoms[i].atoms[1] - 2) * getIsotopicMass("H1") +
						positionAtoms[i].atoms[2] * getIsotopicMass("N14") +
					(positionAtoms[i].atoms[3] - 2) * getIsotopicMass("O16") +
						positionAtoms[i].atoms[4] > 0 ? positionAtoms[i].atoms[4] * getIsotopicMass("S32") : 0 +
						i > 0 ? Biemann[Biemann.length - 1][0] : 0,
				// Biemann y_n calculation
					(positionAtoms[i].atoms[0]) * getIsotopicMass("C12") +
					(positionAtoms[i].atoms[1] - 2) * getIsotopicMass("H1") +
						positionAtoms[i].atoms[2] * getIsotopicMass("N14") +
					(positionAtoms[i].atoms[3] - 1) * getIsotopicMass("O16") +
						positionAtoms[i].atoms[4] > 0 ? positionAtoms[i].atoms[4] * getIsotopicMass("S32") : 0 +
						i > 0 ? Biemann[Biemann.length - 1][1] : 0,
				// Biemann z_n calculation
					(positionAtoms[i].atoms[0] - 1) * getIsotopicMass("C12") +
					(positionAtoms[i].atoms[1] - 1) * getIsotopicMass("H1") +
					(positionAtoms[i].atoms[2] + 1) * getIsotopicMass("N14") +
					(positionAtoms[i].atoms[3] - 1) * getIsotopicMass("O16") +
						positionAtoms[i].atoms[4] > 0 ? positionAtoms[i].atoms[4] * getIsotopicMass("S32") : 0 +
						i > 0 ? Biemann[Biemann.length - 1][2] : 0,
			] );
		}
		// post-sequencing processing
		if (isCTermAmide == true)
			atomCount[2]++;
		else // just add one H2O molecule
			atomCount[3]++;
		atomCount[1] += 2;
		pmassAvg = atomCount[0] * getAtomicMass("C") +
				atomCount[1] * getAtomicMass("H") + atomCount[2] * getAtomicMass("N") +
				atomCount[3] * getAtomicMass("O") + atomCount[4] * getAtomicMass("S");
		pmassMono = atomCount[0] * getIsotopicMass("C12") +
				atomCount[1] * getIsotopicMass("H1") + atomCount[2] * getIsotopicMass("N14") +
				atomCount[3] * getIsotopicMass("O16") + atomCount[4] * getIsotopicMass("S32");
		pI /= pI_count + 2;
		node = document.getElementById("molformula")!.
		while (node.firstChild)
			node.removeChild(node.firstChild);
		for (i = 0; i < atoms.length; i++) {
			if (atomCount[i] == 0)
			 continue;
			node.appendChild(document.createTextNode(atoms[i]));
			node.appendChild(node2 = document.createElement("sub"));
			node2.appendChild(document.createTextNode(atomCount[i]));
		}
		replaceAllChildren(document.getElementById("pmass-avg")!.
				document.createTextNode(setSigDigits(pmassAvg, 8)));
		replaceAllChildren(document.getElementById("pmass-mono")!.
				document.createTextNode(setSigDigits(pmassMono, 8)));
		replaceAllChildren(document.getElementById("pmass-mono-plus")!.
				document.createTextNode(setSigDigits(pmassMono + protonMass, 8)));
		replaceAllChildren(document.getElementById("pmass-mono-minus")!.
				document.createTextNode(setSigDigits(pmassMono - protonMass, 8)));
		replaceAllChildren(document.getElementById("isoelectric")!.
				document.createTextNode(pI.toFixed(2)));
		document.getElementById("proteoresults")!.style.display = tablePropertyValue;
		errNode.style.display = "none";
		proteotable.style.display = tablePropertyValue;
	},

	insertExample : function () {
		var exampleProteins = LibraryData.exampleProteins,
			examplePeptides = LibraryData.examplePeptides,
			count = exampleProteins.length + examplePeptides.length,
			i = Math.floor(count * Math.random()),
			form = document.getElementById("proteinSequenceForm")!.
			infoBox = document.getElementById("info-box")!.
			text, texts = [],
			example;

		if (i > examplePeptides.length - 1)
			example = exampleProteins[i - examplePeptides.length];
		else
			example = examplePeptides[i];
		text = example.sequence.replace(/\s+/g, "");
		for (i = 0; i < text.length; i += 50)
			texts.push(text.slice(i, i + 50));
		form.elements["peptide-entry"].value = texts.join("\n");
		text = example.name + (example.uniprotId ? "\nUniProt ID:  " + example.uniprotId : "") +
			(example.CAS ? "\nCAS:  " + example.CAS : "") +
			(example.uniprotAccNum ? "\nUniProt Accession Number:  " + example.uniprotAccNum : "");
		infoBox.replaceChild(document.createTextNode(text), infoBox.firstChild);
	}

};

MassSpecCalculations.init();

function clearTextArea(obj) {
	obj.form.elements['peptide-entry'].value='P00330';
}