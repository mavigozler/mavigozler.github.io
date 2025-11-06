<?php


?>
<!DOCTYPE html>
<html lang="en">
<head>
<title>Glossary for Clinical Laboratory Medicine</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="./stdcss/std.css" rel="stylesheet">
<link href="/style/glossary.css" rel="stylesheet">
</head>
<body>

<p id="title">
Glossary for Clinical Laboratory Medicine

<p style="margin-top:4em;font-size:83%;">
This glossary was originally created by its maintainer for his own
learning purposes, to keep the maintainer fluent in the terminology
of proteomics and to serve as a strict reference.  For this reason
it is intended that this glossary be authoritative at some level.
As such the definitions contained within are <b>always tentative</b>,
meaning that they are being revised continually so that the meanings,
descriptions, and style of presentation meet the strict and exacting
requirements of the maintainer and the readers (namely you), the purpose
of which is to make the glossary both readable and informative.
Corrections, suggestions, criticisms, and contributions are
not only welcome, but they are
<a href="mailto:mavigozler@yahoo.com?subject=Proteomics%20Glossary%20Correction%2FCriticism%2FSuggestion%2FContribution">requested</a>.
<p>
This glossary requires interaction with a database that stores terms and
definitions in HTML markup.

<dl>


<!-- pseudocode

   1. Sort the database on the term column alphabetically
   2. if it begins with a letter, lower or uppercase, check the letter against
       the previous term.  If the letter does not match, output the
       following markup:
       <h1 class="letter">%theletter%</h1>
   3. Constructing term + definition
       a) set variable $term = column 'term' value, $termId = "", and
          $termClass = "", $def = column 'defintion' value
       b) if column 'term_id' is not null, set variable
       	$termId = " id=\"" + 'term_id' value + "\""
       c) if column 'term_class is not null, set variable
       	$termClass = " class=\"" + 'term_class' value + "\""
       output the following string:
       "<dt".$termId.$termClass.">".$term."\n <dd>".$def."\n\n";



-->


<!-- ===================================================================
   A
 ======================================================================= -->
<h1 class="letter">A</h1>

<dt id="amide">amide
 <dd>a feature (moiety) within a molecule that has the structure
R-C(=O)-N(-R&prime;&prime;)-R&prime;, that is a carbonyl joined to a
mono- or di-substituted nitrogen;  it is a very energetically stable
form of bond, requiring moderately severe conditions (very acidic
or alkaline conditions to cause acid or base catalysis, with or without
the application of heat) to be hydrolyzed;  the <a href="#pepbond">peptide
bond</a> is a special instance of the monosubstituted amide bond
representing the joining of two naturally occurring amino acids

<dt>alignment
 <dd>in metabolomics, a preprocessing step in which variables in different
samples are adjusted to enable between-sample comparisons
 <br>[<a href="#jansen">Jansen</a>]

<dt>amplicon
 <dd>the molecule of double-stranded DNA that is produced by <a 
href="#pcr">PCR</a>
 <p class="detail">
   in most cases, it is a copy of (a segment of) the template DNA, but in many 
   cases, especially to produce clonable amplicons, primers with extended bases 
   on the ends (first cycle purposeful mismatches) to include restriction sites 
   produce amplicons differnet than the template sequence

<dt>amu
 <dd>see <a href="#amu">atomic mass unit</a>

<dt id="amu">atomic mass unit
 <dd>symbolized as <b>amu</b> and usually <b>u</b>, it is a standard mass unit 
that is exactly equal to one-twelfth of the mass of a neutral atom of the 
carbon-12 isotope, whose mass is exactly 12.00000 u;  in SI units, it has the 
value of <a 
href="http://physics.nist.gov/cgi-bin/cuu/Value?ukg">1.660539&nbsp;&times;&nbsp;10<sup>&minus;27</sup>&nbsp;kg</a>

<dt id="avgm-z">average <i>m/z</i>
 <dd>the weighted <i>m/z</i> (mass-to-charge) value of all the
isotopes in a cluster corresponding to an ionic species (molecular or
atomic ion)

<table class="eqnserif" style="margin:1em auto;">
<tr><td rowspan="2">average <i>m/z</i> =
 <td style="border-bottom:1px solid black;"> &sum; <i>w<sub>i</sub> I<sub>i</sub></i>
<tr><td>&sum; <i>I<sub>i</sub></i>
</table>

<p>
Consider the example data on an isotope cluster.

<table class="horizruled graytable"
 style="margin:1em auto;">
<tr><th><i>m/z</i> <br><i>w<sub>i</sub></i>
  <th>Relative Intensity <br> <i>I<sub>i</sub></i>
<tr><td>1085.55  <td>100
<tr><td>1086.57  <td>58
<tr><td>1087.58  <td>24.5
<tr><td>1088.6   <td>8
<tr><td>1089.61  <td>2
</table>
<p>
The formula is thus applied:

<table class="eqnserif"
style="margin:1em -7.5em;width:50em;font:normal 100% Arial,Helvetica,sans-serif;">
<tr><td rowspan="2">average <i>m/z</i> =
 <td style="border-bottom:1px solid black;">
 (1085.55 &times; 100) + (1086.57 &times; 58) + (1087.58 &times; 24.5) +
  (1088.6 &times; 8) + (1089.61 &times; 2)
 <td rowspan="2"> = 1086.285
<tr><td>100 + 58 + 24.5 + 8 + 2
</table>
<p>
The first peak in the isotope cluster has <i>m/z</i> 1085.55 and is the
monoisotopic peak.
<p>
It is customary to use average <i>m/z</i> or mass values for large proteins
(&gt; 10 kDa) rather than monoisotopic <i>m/z</i> or mass values since the
latter are extremely difficult to determine accurately with very large
masses.

<dt id="avgmass">average mass
 <dd>the mass of a singly charged ion (|<i>z</i>| = 1) determined
by the weighted average of the intensities
of all the isotopes corresponding to a charged species measured in
a mass spectrometer; see <a href="#avgm-z">average <i>m/z</i></a>

<dt id="avogadro">Avogadro&rsquo;s number
 <dd>Avogadro&rsquo;s number (<i>N</i><sub>A</sub>) is the number of atoms
found in exactly 12.00000 g of carbon-12
 <p class="detail">this is the <em>strict</em>
definition of the value of the number, and the fact that it has a value
of 6.022 &times; 10<sup>23</sup> is a result of its strict definition,
and not the definition itself; see also <a href="#mole">mole</a>

<dt id="bkgdsub">background subtraction
 <dd>the first (or one of the first) steps in the processing of mass
spectra, this attempts to lower the baseline of the mass spectra to
the zero intensity (or ion count line);  along with
<a href="#smoothing">smoothing</a>, this represents the noise filtering
processing stage of mass spectral processing
 <p class="detail">
 There are different approaches to the background subtraction of the
continuous line plot which is the mass spectrum.  Typically a set
of curves is constructed having a certain polynomial fit (order).

<!-- ===================================================================
   B
 ======================================================================= -->
<h1 class="letter">B</h1>

<dt>base peak
 <dd>the most intense (<q>highest</q> or <q>largest</q>)
peak within an <a href="#cluster">isotope cluster</a> that represents
a molecular (or possibly atomic) ionic species whose
<a href="#monoisotopic">monoisotopic</a> mass

<dt>biplot
 <dd>[metabolomics] the combined visualization of scores and loading from
a component model [<a href="#jansen">Jansen</a>

<dt id="bottom-up">bottom-up proteomics
 <dd><q><q>Bottom-up</q> strategies to proteome analysis involve cleaving
the protein into peptide fragments that are...sufficiently distinctive to
allow protein identification</q> [Bogdanov and Smith, <i>Mass Spectrom. Rev.</i>
<b>24</b>: 168-200, 2005]. It includes the use of <a href="#pmf">peptide
mass fingerprinting</a> techniques as well as the technique which uses
both MS and MS/MS spectra which
respectively provide the masses of proteolyzed (usually tryptic) peptides and
data on their fragmentation to produce sequence tags, and which together can
provide high confidence identifications of proteins from searching protein and
gene sequence databases, especially when sequence coverage is specified to a
minimum.
 <br>
[<b>Note</b>: the terms <q>bottom-up</q> and <q>top-down</q> have different
or multiple meanings depending on the context used.  For example, they may have
different meanings in proteomics <em>and</em> in mass spectrometry, a tool used
in proteomics, so it is fundamental to know the context in which these terms
are used.]
 <br>Compare <a href="#top-down">top-down proteomics</a>.


<!-- ===================================================================
   C
 ======================================================================= -->
<h1 class="letter">C</h1>

<dt>carbamidoylation
 <dd>in proteomics, typically refers to the alkylation by iodoacetamide
(ICH<sub>2</sub>CONH<sub>2</sub>) of cysteine (Cys, C) side chain
sulfhydryl moieties, in which the iodide is displaced in classic
S<sub>N</sub>2-type nucleophic substitution reactions by an ionized
or polarized sulfhydryl to form a carbamidoyl group
(Cys-CH<sub>2</sub>-S-CH<sub>2</sub>-C(=O)-NH<sub>2</sub>) on the side
chain and to prevent re-formation of disulfide bonds;  the mass added
to the peptide (about 57 Da) that contains the C residue must be
considered when doing protein identification database searches

<dt>centering
 <dd>[metabolomics] a preprocessing step removing information equal
for all samples in a dataset [<a href="#jansen">Jansen</a>]

<dt>centroiding
 <dd>the mathematical process of evaluating the center of the area
of any peak (namely of peak of signal data) in order to determine its
position on a two-coordinate grid;  in mass spectrometry, it is the
set of steps (algorithm) in signal processing to determine the center
of the area of the peak on an intensity vs. <i>m/z</i> plot
 <p class="detail">
 Centroiding of the mass spectrum usually involves conversion of the
continuous signal plot into vertical lines whose position on the abscissa
(<i>m/z</i> scale) represent vertical line that can be formed from
the peak area centroid, while the height
of the vertical line represents the value on the ordinate in which
a horizontal line is drawn from the ordinate axis to the peak area centroid.
In other cases, the height of the vertical line might be the peak height
itself, and not the area centroid.  Centroiding is also used to refer
the conversion of the continuous peak signal to a set of the vertical
lines representing whose height is the peak height and position on the
abscissa is where the peak height occurs on the <i>m/z</i> axis;
no centroiding of the peak area was actually determined.
The mass spectrometrist should be very careful in using and explaining
the process of centroiding if it deviates from the norm.

<dt id="charge">
 <dd>In proteomics, many biomolecules can be ionized and thus acquire
an integer multiple of an electrical charge, which is the value of a proton
or electron.  In mass spectrometry, the value for charge is symbolized by
the letter <i>z</i>.  In other cases in chemistry and physics, it might be
symbolized by the letter <i>q</i>.  Charge multiples can be positive 
(+1, +2, +3, ...) or negative (&minus;1, &minus;2, &minus;3, ...).

<dt>charge state
 <dd>for any species observed in a mass spectrum with a value <i>m/z</i>,
the actual determination of its charge <i>z</i> refers to its charge state
 <p class="detail">
 Charge state can be determined from the mass spectrum by an examination
of the difference in <i>m/z</i> values of the isotopes in a cluster.

<dt>CID
 <dd>see <a href="#cid">collision-induced dissociation</a>

<dt id="cid">collision-induced dissociation
 <dd>a technique used in mass spectrometry in which a
<a href="#precursor">precursor</a> (<a href="#parent">parent</a>) ion
is accelerated it into the path  of inert (unreactive) gas molecules
(typically argon or nitrogen) to produce fragment ions whose masses
will be determined to provide additional information;
in proteomics, When the precursor ion is a peptide, CID often results
in fragmentation along the peptide backbone in which the mass differences
between peptides provides information about the amino acid in the
parent ion (<a href="#denovo"><i>de novo</i> sequencing</a>);
mass spectrometers operated <a href="#msms">MS/MS</a> mode is synonymous
with the use of CID or precursor fragmentation mode

<dt>component
 <dd>[metabolomics] the combination of all measured dependent variables
used in multivariate methods to concisely describe the information of interest
[<a href="#jansen">Jansen</a>]

<dt>cross-validation
 <dd>[metabolomics] a validation method to determine the total number of components
[<a href="#jansen">Jansen</a>]

<!-- ===================================================================
   D
 ======================================================================= -->
<h1 class="letter">D</h1>

<dt id="da">Da
 <dd>The unit symbol/abbreviation used to refer to the 
<a href="#dalton">dalton</a>

<dt id="dalton">dalton
 <dd>the value of the <a href="#amu">atomic mass unit (amu)</a>,
a unit conveniently used in the natural sciences, and having the approximate
mass of the proton, hydrogen atom, or neutron;  

<dt>deisotoping (also de-isotoping)
 <dd>The process of representing the mass of an ionic species as a single
mass rather than reporting the masses of all its detected isotopes in the
isotope cluster
 <p class="detail">
  Deisotoping means making a decision to select which masses will be
reported as representing the peptide masses.  For small proteins or peptides,
the deisotoped mass is usually the <a href="#monoisotopic">monoisotopic</a>
mass, while for very large proteins, it is the average mass (since the
monoisotopic mass is detected and reported differently by different
mass spectrometers depending on conditions and sensitivity.

<dt id="denovo"><i>de novo</i> sequencing
 <dd>refers to the ability of certain mass spectromters with the technology
to fragment peptides in a manner that the interpretation of their spectra
can produce sequence tags, useful in helping to identify the protein to which
that peptide belongs

<dt>dependent variable
 <dd>[metabolomics] a variable of which the value is determined by the 
experimental outcome [<a href="#jansen">Jansen</a>]

<dt id="desorption">desorption
 <dd>the movement of molecules in a bound or mixed phase into
an unbound or unmixed phase through an energetically (thermodynamically)
favorable process;  in MALDI-MS, a matrix absorbs laser light and provides
the energy for ionization of the matrix and target/analyte molecules,
as well as the transition from a solid phase to the gaseous phase (sublimation)

<dt>desolvation
 <dd>part of the process of electrospray ionization (ESI) in which
solvent molecules are removed by heating nebulized flowing solution
so as to produce gas-phase solute ions for mass measurement in a mass
spectrometer; desolvation usually involves use of a hot unreactive (typically
nitrogen) gas to produce droplets that rapidly decrease in size

<!-- ===================================================================
   E
 ======================================================================= -->
<h1 class="letter">E</h1>

<dt id="e"><i>e</i>
 <dd>the symbol for the fundamental unit of charge, which is the charge of a 
proton or an electron;  in SI units (Coulombs), this value has been determined 
to be <a 
href="http://physics.nist.gov/cgi-bin/cuu/Value?e">1.6021765&nbsp;&times;&nbsp;10<sup>&minus;19</sup>&nbsp;C</a>

<dt>ECD
 <dd>see <a href="#ecd">electron capture-induced dissociation</a>

<dt id="ecd">electron capture-induced dissociation (ECD)
 <dd>Developed in 1998, a cathode used to produce free electrons is used to
inject electrons at extremely low energy (&lt;1 eV) into the chamber containing
molecular cations (by protonation: [M + <i>n</i>H]<sup><i>n</i>+</sup>) which are
in cyclotronic motion, by which they become radical cations
  [M + <i>n</i>H]<sup>&bull;<i>n</i>+</sup>, which are metastable and undergo
  certain characteristic fragmentation pathways dependent upon molecular structure
  and the presence of certain functional groups.  Fragmentation is more rapid
 than with <a href="#cid">CID</a>, and with peptides/proteins, cleavages at
  the N-&alpha;C bond occur to produce Biemann <i>c</i>- and <i>z</i>-type ions.
  Posttranslational modifications of peptides unstable in CID are often preserved
   with ECD; disulfide bonds are broken in ECD (see Bogdanov &amp; Smith (2004)
   <i>Mass Spec. Rev.</i> <b>24</b>, 168).
 <p>
  ECD is only possible in FTICR-MS instruments.


<dt id="esi">electrospray ionization (ESI)
 <dd>a means of achieving gaseous phase ionized molecules of substances
in solution suitable for mass measurement (mass spectrometry)
by applying a (i) high voltage
between a capillary from which they emerge and a port where ions enter
the MS flight path and (ii) a heated nebulizing gas to evaporate aerosilized
solute/solvent droplets quickly (desolvation)

<dt>ergodic
 <dd>in mass spectrometry, refers to all the random processes in which energy
in an excited molecular ion might be redistributed to the molecule (changes
in vibrational or rotational mode) before any dissociation/fragmentation might
take place

<dt>ESI
 <dd>see <a href="#esi">electrospray ionization</a>

<!-- ===================================================================
   F
 ======================================================================= -->
<h1 class="letter">F</h1>

<dt id="fixedmod">fixed modification
 <dd>a modification to one or more functional groups or moieties of a protein
or peptide, particularly to the side chains of amino acids, which are
controlled or caused by the biochemist studying a proteome; it usually
represents an attempt to create a structure of the peptide or protein
that makes it amenable to an analysis or preparation (e.g., chromatographic
separation);  the most common fixed modification is the reductive
alkylation of cysteine residue side chains to break and prevent the
reformation of disulfide bonds, whose presence in inter- and intramolecular
structural formation can complicate analysis

<dt>functional genomics
 <dd>[ ]

<dt>functional proteomics
 <dd>a systematic study of the function of proteins that make up a proteome,
usually with the intention of establishing networks of interaction

<!-- ===================================================================
   G
 ======================================================================= -->
<h1 class="letter">G</h1>

<dt>germplasm
 <dd>(1) germ cells and their precursors serving as the bearers of heredity
and being fundamentally independent of other cells  (2) the hereditary
material of the germ cells (synonym for GENES) 
[<a href="http://www.merriam-webster.com/dictionary/germplasm">Merriam-Webster
Online Dictionary</a>]

<!-- ===================================================================
   H
 ======================================================================= -->
<h1 class="letter">H</h1>

<dt id="hardionize">hard ionization
 <dd>ionization of analyte molecules within the source of a mass spectrometer in which
the analyte is ionized by a physical process, such as by impact with
a particle beam (of electrons or other ions) or by application of heat
or temperature; cf. <a href="#softionize">soft ionization</a>

<dt id="hydrolase">hydrolase
 <dd>an enzyme whose catalytic activity involves mediating the breaking
of bonds using water (H<sub>2</sub>O), and which effects hydrolysis; it
is usually catabolic
<!-- ===================================================================
   I
 ======================================================================= -->
<h1 class="letter">I</h1>

<dt>independent variable
 <dd>[metabolomics] variable of which the value is chosen by the researcher
[<a href="#jansen">Jansen</a>]

<dt id="irmpd">infrared multi-photon dissociation (IRMPD)
 <dd>

<dt>iodoacetamide
 <dd>a chemical with structure ICH<sub>2</sub>C(=O)NH<sub>2</sub>
that is used to alkylate nucleophilic moieties, such as cysteine sulfhydryls
made reactive in slightly alkaline conditions;  the reaction is
nucleophilic substitution of type S<sub>N</sub>2, with displacement of
the excellent leaving group iodide (the halogens with larger atomic
radius make progressively better leaving groups); see
<a href="#reducalkyl">reductive alkylation</a>

<dt>ion suppression
 <dd>a concept in mass spectrometry which refers generally to any chemical or
physical environment or conditions which prevent the generation of quantifiable
or even detectable counts of ions being measured in the mass spectrometer;
specifically refers to chemical and/or physical environments or conditions that
stop a potentially ionizable molecule from becoming ionized, or which prevent
ionized molecules from entering from one phase into the gas phase, required
for mass spectrometry

<dt id="siunits">International System of Units
 <dd>also called the SI (System Internationale) units, they define the
seven fundamental dimensions to characterize the intrinsic properties
of mass or energy;  these units measure properties realted to
length (the meter), mass (the kilogram), time (the second),
electrical charge flow (the ampere), thermal energy (the kelvin),
the count of atoms in a substance (the mole), and luminance (the candela)

<dt>introgression lines (ILs)
 <dd>[to be entered]

<dt>IRMPD
 <dd>see <a href="#irmpd">infrared multi-photon dissociation</a>

<dt id="cluster">isotope cluster
 <dd>the set of peaks in a mass spectrum that represent the isotopic
variants of the ionized species discriminated by the mass spectrometer
<div class="detail">
The appearance of the distribution of isotopic variant peaks (as shown
by differences in intensities) depends chiefly on the relative abundance
of isotopes that make up the atoms of ionized molecules, but is also
influenced by the type of ionization and whether the ionization used
causes an addition or loss of mass or charge, or both, to the ionized
species that represents a significant proportion of the <i>m/z</i> value.
<!--
<p>
For example, the MALDI-based ionization of a peptide of 10 amino acids,
having a mass of approximately 1100-1300 Da, will have either a proton
added to it or removed from it to achieve the ionization, and while the
addition or loss of a protein can be resolved on today&rsquo;s high-resolution
mass spectrometers, it will not significantly alter the
-->
</div>

<!-- ===================================================================
   J
 ======================================================================= -->
<h1 class="letter">J</h1>

<dt>jack-knife
 <dd>[metabolomics] a validation method to determine the importance of each
dependent variable in a described difference [<a href="#jansen">Jansen</a>]

<!-- ===================================================================
   L
 ======================================================================= -->
<h1 class="letter">L</h1>

<dt>LC/MS or LC-MS
 <dd><i><b>l</b>iquid <b>c</b>hromatography/<b>m</b>ass <b>s</b>pectrometry</i>:
any liquid chromatography system whose elution is coupled to
a mass spectrometer as the final detector;  in proteomics, refers to a
liquid chromatography system that separates (purifies) peptides which will
be analyzed in <a href="#msms">MS/MS</a> mode for purposes of fragmenting
them to get amino acid sequence information
 <ul>
 <li>LC/LC-MS/MS:  refers to multi-dimensional liquid chromatography
mass spectrometry in general; can also refer to <a href="#mudpit">MudPIT</a>
technology
 <li>LC-ESI-MS:  specifies that the LC-MS system uses an electrospray
ionization (ESI) source, although in proteomics, it is nearly universally
used as the source
 </ul>

<dt>library
 <dd>a term used usually to designate the complete collection of information;
in molecular biology, it refers to the permanent storage of the complete
collection of <i>biochemical</i> information (usually in the form of DNA)
 <p class="detail">
 Based on the definition of library, a <b>genomic [DNA] library</b> is
essentially the complete collection of information about the genome of
an organism:  one creates a genomic DNA library first by extracting DNA
from a source (cells, tissues) that are known to contain the whole genome
(e.g., don't use red blood cells, since they have no nuclei, and B
lymphocytes are not good because their genomic DNA is actually altered
or spliced out), fragmenting enzymatically or mechanically to a certain
convenient size, then ligating it to a vector designed for managing genomic
libraries, and then transforming competent hosts designed to store genomic
libraries in vivo (the technology for in vitro manipulation of genomic
libraries does not yet exist).  A <b>cDNA library</b> is made by
isolating mRNA that has a poly(A)<sup>+</sup> tail (using an oligo-dT
column or media) and reverse-transcribing a DNA strand (cDNA) using
a recombinant high-efficiency reverse transcriptase, then creating
the 2nd strand using standard PCR methods;  the cDNA strands are then
ligated to vectors and stored in convienent hosts

<dt>linear discriminant analysis
 <dd>[metabolomics] supervised method that describes the differences between
sample groups based on the full data [<a href="#jansen">Jansen</a>]

<dt id="loadingplot">loadings
 <dd>[metabolomics] values in a component model describing the relative 
importance of dependent variable [<a href="#jansen">Jansen</a>]

<!-- ===================================================================
   M
 ======================================================================= -->
<h1 class="letter">M</h1>

<dt><i>m/z</i>
 <dd>the common abbreviated reference to <a
href="#mass-to-charge">mass-to-charge</a> (q.v.) used in mass spectrometry

<dt>MALDI
 <dd>see <a href="#maldi">matrix-assisted laser desorption ionization</a>

<dt><a id="mass-to-charge"></a>mass-to-charge
 <dd>simply the ratio of the mass of an atom or molecule to its charge, usually
referenced by the abbreviation <i>m/z</i>, and the fundametal property by
which ionized atoms and molecules are distinguished (separated) or analyzed
in a mass spectrometer;  <i><b>m</b></i> is expressed in atomic mass units,
while <i><b>z</b></i> is an integer multiple (1, 2, 3, ...) of the elementary
charge of a proton or electron, which can be signed (..., &minus;3, &minus;2,
&minus;1, [+]1, [+]2, [+]3,...) but usually is not for purposes of referring
to the <i>m/z</i> value of an ion (generally the <b>mode</b> of mass spectrometry
is described as positive or negative).
<br>see <a href="#mass">mass</a> and <a
href="#charge">charge</a> for detailed meanings and their use in the <i>m/z</i> context

<dt id="maldi">matrix-assisted laser desorption ionization (MALDI)
 <dd>a means of producing gaseous phase ionized molecules for measurement
in mass spectrometers by employing the ability of a
<a href="#matrix">matrix</a> molecule to absorb light energy from a laser,
which is then used to cause the ionization
and <a href="#desorption">desorption</a> of a target/analyte
molecule (not directly ionizable by the light energy of a laser).

<dt>mass spectrometer
 <dd>an instrument that must minimally do at least three things:
<ol>
<li>produce gaseous phase ionized molecules
<li>discriminate/select for the mass of these gas phase ionized molecules
<li>detect these ionized gas phase molecules
</ol>
The principle by which mass is measured can vary greatly among
mass spectrometers.

<dt id="ms">mass spectrometry
 <dd>the science and instrumentation, including the research and development
of methods, involved in the accurate measurement of the mass of
gaseous phase ionized molecules or molecular fragments

<dt>mass spectrum
 <dd>the report of the results of both the absolute or relative abundance or
intensity as well as the measurement of the ratio or ratios
of the mass-to-charge of one or more species that are amenable to
such determination in a mass spectrometer; by convention, and possibly
by definition, the mass spectrum is presented in such a report as a plot
of the absolute or relative abundance or intensity (an absolute abundance
or intensity is usually a numerical count of the species/ions detected)
against the mass-to-charge ratio (<i>m/z</i>) of the species detected,
and for the range of <i>m/z</i> values set for detection

<dt id="mpss">massively parallel signature sequencing (MPSS)
 <dd>[ ]

<dt id="matrix">matrix
 <dd>any substance into which other substances (usually smaller in
proportion or fewer in number) are embedded;  in MALDI mass spectrometry,
the matrix is the material in which peptides or proteins are embedded
and which serves as an antenna to collect the light energy from the laser to produce
gas phase ions, that is channel the energy (1) to cause the
ionization of both the matrix and analyte molecules (by mechanisms still
largely hypothesized) and (2) to create convective and/or radiative
heat in which molecules move from the solid to the gas phase

<!-- ===================================================================
   Me
 ======================================================================= -->
<h1 class="letter">Me</h1>

<dt id="mass">
 <dd>In chemistry and partly in physics, refers to matter which can be measured 
gravitationally for the purpose of specifying its presence quantitatively
and relatively.  In the simplest way, it refers to matter and not to matter
in forms of energy.

<dt>metabolic fingerprinting
 <dd>observance of any pattern of metabolites that change in response to a
condition or treatment (disease, toxin exposure, environmental or genetic
alterations); the workflow of fingerprinting analysis involve obtaining
two samples, one of the condition/treatment and the other its proper control,
extracting all or a class of metabolites and spiking with internal standard
(if used), analyzing on the instrument (GC-MS, LC-MS, CE-MS), 
processing data using multivariate analysis (e.g. PCA) to produce
a <a href="#scoreplot">score plot</a> (for groups) and a 
<a href="#loadingplot">loading plot</a> (for markers), and identifying markers
by libraries, MS/MS, NMR, etc.
  <br>[<a href="#dettmer" id="back-dettmer">Dettmer</a>]
 <p>Global, rapid and high-throughput analysis of crude samples or sample 
extracts for sample classification or screening of samples. Identification and 
quantification is not performed. Minimal sample preparation.
 <br> [<a href="#dunn">Dunn</a>]
 <p>use signals from hundreds to thousands of metabolites for rapid sample
classification via statistical analysis
 <br> [<a href="#hegeman">Hegeman</a>]

<dt>metabolic footprinting
 <dd>metabolic fingerprinting in which the pattern analysis is of metabolites 
done on conditioned cell culture medium
  <br>[<a href="#dettmer">Dettmer</a>]
 <p>Global measurement of metabolites secreted from the intra-cellular volume in to 
the extra-cellular spent growth medium. Highthroughput method not requiring 
rapid quenching and time consuming extraction of intra-cellular metabolites for 
microbial metabolomics.
 <br> [<a href="#dunn">Dunn</a>]
 <p>similar approach to fingerprinting which examines the signal associated with
an organism's growth in a substrate or medium by analysis of chemical species
in the substrate
 <br> [<a href="#hegeman">Hegeman</a>]

<dt id="metaprofiling">metabolic profiling
 <dd>the quantitative analysis of a group of metabolites either related to a specific
metabolic pathway or a class of compounds;  the study of biomarkers in disease or
the substrates and products of enzymatic reactions would be an example 
  <br>[<a href="#dettmer">Dettmer</a>]
 <p>Analysis to identify and quantify metabolites related through similar 
chemistries or metabolic pathways. Normally employ chromatographic separation 
before detection with minimal metabolite isolation after sampling.
 <br> [<a href="#dunn">Dunn</a>]
 <p>attempts to identify and quantify a specific class or classes of chemically
related metabolites that often share chemical properties that facilitate 
simultaneous analysis
 <br> [<a href="#hegeman">Hegeman</a>]

<dt>metabolite
 <dd>small molecules that participate in general metabolic reactions and
that are required for the maintenance, growth, and normal function of a cell

<dt>metabolite target analysis
 <dd>Quantitative determination of one or a few metabolites related to a
specific metabolic pathway after extensive sample preparation and
separation from the sample matrix and employing chromatographic
separation and sensitive detection.
 <br> [<a href="#dunn">Dunn</a>]

<dt id="metabolomics">metabolomics
 <dd>a systematic effort to identify and quantify the metabolites in a biological
system
  <br>[<a href="#dettmer">Dettmer</a>]
 <p>the <q>ultimate goal</q> of metabolimics is the highly reproducible qualitative
and quantitative analysis of all metabolites in an organism under certain conditions
  <br>[<a href="#verpoorte">Verpoorte</a>]
 <p>the qualitative and quantitative study of all metabolites in tissues and
biofluids (rather than a metabolite-targeted analysis)
  <br>[<a href="#xiayan">Xiayan</a>]
 <p id="back-sana">the comparative analysis of metabolites, the intermediate or final products
of cellular metabolism, found in sets of similar biological samples; it is a small
molecule analysis problem (molecular weight &lt; 1500), often of highly complex
samples, in which the chemical identity is often unknown.  The metabolome of an
organism refers to the qualitative and quantitative set of all small molecules that
participate in general metabolic reactions for cell growth and maintenance.
 <br> [<a href="#sana">Sana</a>]
 <p id="back-dunn">Non-biased identification and quantification of all metabolites in a
biological system. The analytical technique(s) must be highly
selective and sensitive. No one analytical technique, or combination
of techniques, can currently determine all metabolites present
in microbial, plant or mammalian metabolomes.
 <br> [<a href="#dunn">Dunn</a>]

<dt>metabonomics
 <dd><a href="#wishart" id="back-wishart">Wishart</a> reports that there is no 
difference to between <a href="#metabolomics">metabolomics</a> and metabonomics, 
and considers them both to be specifically a reference to methods that describe
<a href="#metaprofiling">metabolic profiling</a>.
 <p>quantification of the time-dependent changes in metabolite levels which are
affected by lifestyle, diet, gene modification or mutation, environmental stimuli,
and drug administration
 <br>[<a href="#xiayan">Xiayan</a>]
  <p>The quantitative measurement of the dynamic multiparametric metabolic 
response of living systems to pathophysiological stimuli or genetic modification
 <br> [<a href="#dunn">Dunn</a>]

<dt>method
 <dd>[metabolomics] the calculation by which a model is obtained 
[<a href="#jansen">Jansen</a>]  

<dt id="miRNA">micro RNA
 <dd>

<dt>miRNA
 <dd><a href="#miRNA">micro RNA</a>

<dt>model
 <dd>[metabolomics] a series of mathematical equations describing a (biological)
phenomenon [<a href="#jansen">Jansen</a>]  

<dt id="monomass">monoisotopic mass
 <dd>the mass of any single isotope of an ionic species whose mass is
measured in a mass spectrometer, as opposed to the <a href="#avgmass">average
mass</a> of the species where isotopes are not distinguished;  by some
convention, the monoisotopic mass refers to the smallest mass of the
isotope of an ionic species (molecule or atom) among all the isotopic
variants of the species; in a mass spectrum, it represents the smallest
<em>detectable</em> mass of a species measurable in the mass spectrum,
after multiplying all <i>m/z</i> values representing the species by the
charges of those species

<dt id="monoisotopic">monoisotopic peak
 <dd>in the mass spectrum, it is the peak within an <a href="#cluster">isotope
cluster</a> that represents the smallest <i>m/z</i> value in the cluster;
it also represents the smallest mass of a species (molecule or atom) when
all <i>m/z</i> values of the isotopic variants are multiplied by the charge
of the species

<dt>modification
 <dd>refers to the chemical transformation or modification of a protein
or peptide deliberately or intentionally (often called
<a href="#fixedmod">fixed modification</a>) or modification occurring
naturally (biologically) or accidentally (<a href="#varimod">variable
modification</a>)

<dt id="mole">mole
 <dd>one of the seven base units in the <a href="#siunits">International
System of Units</a> (SI, System Internationale), it is the count of
atoms that make up the mass of substance which is identical to the
number of atoms as are found in 12.00000 grams of
carbon-12; see also <a href="#avogadro">Avogadro&rsquo;s number</a>

<dt>MPSS
 <dd>see <a href="#mpss">massively parallel signature sequencing</a>

<dt id="msms">MS/MS
 <dd>The mass spectrometry of the fragmentation (product ions) of 
selected or multiple molecules that were introduced into the mass spectrometer
at the source.  Fragmentation is achieved by various methods and approaches
(typically by acceleration of the ionized molecules into a non-reactive
inert gas molecule streaming orthogonally into the instrument in a collision
component).  Additionally serial fragmentation (fragmentation of fragments)
can be achieved in more complex/advanced instruments:  this is often referred
to as MS/MS/MS or MS<sup><i>n</i></sup> where <i>n</i> is the number of serial
fragmentations possible, less 1.

<dt>MudPIT
 <dd><a href="#mudpit"><b>mu</b>lti-<b>d</b>imensional <b>p</b>rotein
<b>i</b>dentification <b>t</b>echnology</a>

<dt id="mudpit">multi-dimensional protein identification technology
 <dd>the name phrase given by J.R. Yates III and co-workers to describe
a strategy for getting information about the proteins in the proteome
of cells or tissues by generating a peptide <q>soup</q> from the
proteins in the extract (i.e., the peptides are from the digestion
of the impure mixture of proteins rather than a single protein as might
be obtained in a gel spot) and then purifying the peptides by liquid
chromatography for mass
and sequence (by MS/MS fragmentation mode) analysis in an online
electrospray ionization mass spectrometer (ESI-MS);  also called
by the acronym <q>MudPIT</q> by its originators
 <p class="detail">
 The classic liquid chromatography configuration for MudPIT makes use
of a strong cation exchange (SCX) trap column that is loaded first
with the mixture of the tens of thousands of peptides.  Peptides that
elute unbound from the SCX column are trapped on to  reversed-phase (RP)
trap column.  Solvent/valve switching is then done to elute the peptides
from the RP trap on to a reversed-phase separation column, and the
resolved peptides are detected on the ESI-MS, where they get their
parent mass measured and then are sequenced in an automated switch to
MS/MS (fragmentation) mode.  There are enough unique peptide sequences
such that their parent proteins can be identifed.  This approach has
been demonstrated in yeast to identify 3-4 times the number of proteins
that high-throughput gel-based approach can achieve.

<dt>multiplex PCR
 <dd><a href="#pcr">PCR</a> in which more than one amplicon is produced
simultaneously within the PCR cycle program;  the amplicon sequences
should not overlap on the template

<!-- ===================================================================
   N
 ======================================================================= -->
<h1 class="letter">N</h1>

<dt>near-isogenic lines (NILs)
 <dd>[to be entered]

<dt>neutral loss
 <dd>in mass spectrometry, the cleavage or fragmentation of a moiety (part)
of an ionized molecule that carries no charge (is not ionized) and leaves the
other moiety (part) of the molecule ionized;  normally neutral losses (fragments
with no charge) are not detectable by the instrument, but it depends on whether
fragmentation occurs while the pre-fragmented molecule has momentum (velocity
and direction) toward the mass spectrometer detector;  neutral losses are
determined based on a combination of the data of the ionized fragment and an
understanding of the principles of chemistry (energy, bonding)

<dt>neutral loss scan [mode]
 <dd>a mode (capability) of mass spectrometry in which all precursor ions can
be filtered in a scan and the product ions can be scanned with an offset
representing the neutral loss difference in mass units;  only spaced-based
(and not time-based) mass spectrometers can be used with this type of scan since
it requires the simultaneous detection of precursor ion with product ion

<dt id="nominalmass">nominal mass
 <dd>the mass of a substance which is calculated based on the use of
simple integer values assigned for the number of mass units for the atoms;
thus H=1, C=12, O=16, N=14, etc. is used to approximate the mass;  nominal
mass has very little value in mass spectrometry

<dt>normalization
 <dd>[metabolomics] a preprocessing step in which the values of variables
in different samples are adjusted for a comparison to become possible
 [<a href="#jansen">Jansen</a>]  

<!-- ===================================================================
   O
 ======================================================================= -->
<h1 class="letter">O</h1>

<dt id="omics">OMICS
 <dd>according to <a href="#verpoorte" id="back-verpoorte">Verpoorte et al</a>, 
it is the total analysis of the organism: its genome (genomics), the 
transcription of the genome (transcriptomics), the translation of the genome 
(proteomics), and biomolecules (<q>metabolites</q>) whose creation and 
destruction/modification/transformation (anabolism and catabolims) is controlled 
by the translated genome (proteins in their capacity as enzymes). <q> 'Omics' 
cover[s] the total chemistry from DNA to organic molecules.</q>

<dt>overfit
 <dd>[metabolomics] description of information specif to a few samples by
a model  [<a href="#jansen">Jansen</a>]  

<!-- ===================================================================
   P
 ======================================================================= -->
<h1 class="letter">P</h1>


<dt id="parent">parent ion
 <dd>used interchangeably with the preferred term
<a href="#precursor">precursor ion</a>

<dt>partial least squares
 <dd>[metabolomics] a supervised method describing the differences between
sample groups based on supervised components  [<a href="#jansen">Jansen</a>]  

<dt id="ppm">parts per million
 <dd>a count of an item of interest occurring in one million (10<sup>6</sup>)
total items present; the term <q>parts per hundred</q> is equivalent to the
term <b>per cent</b> or <b>percent</b>
 <ul>
 <li>in mass spectrometry, ppm is used to designate the error in a
  mass measurement, and so for example, a mass measured to be 1265.199 Da
  with an error of &plusmn; 10 ppm will have that error described in
  the units of mass measurement as
  1265.199&nbsp;&times;&nbsp;10/10<sup>6</sup>&nbsp;=&nbsp;0.013, or
  1265.199&nbsp;&plusmn;&nbsp;0.013&nbsp;Da; an error of 0.1% is
  1265.199&nbsp;&times;&nbsp;0.1/100&nbsp;=&nbsp;1.265, or
  1265.199&nbsp;&plusmn;&nbsp;1.265&nbsp;Da
 <li>in chemistry, a 1% (w/v) solution is 1&nbsp;g per 100&nbsp;ml and
so logically a 1 (w/v) ppm solution is 1&nbsp;g per 10<sup>6</sup>&nbsp;ml, equivalent to
1&nbsp;mg per liter (divide both quantities by 10<sup>3</sup> to get a
more sensible value)
 </ul>

<dt>PCR
 <dd>the well-known common abbreviated reference to <a href="#pcr">polymerase
chain reaction</a>

<dt>permutation test
 <dd>[metabolomics] a validation method to determine whether a difference
described in a modle is related to the experiment  [<a href="#jansen">Jansen</a>]  

<dt id="pepbond">peptide bond
 <dd>a special <a href="#amide">amide</a> bond that represents the joining
of two amino acids;  the peptide bond represents the essential chemical
linking of multiple amino acids to form a polymer of amino acids, namely
a <a href="#polypeptide">polypeptide</a>;  all living cells possess
the ability to produce biologically polypeptides through the
<a href="#translation">translation</a> of genetic code, which is a process
which in part involves use of cellular energy to link amino acids in
the polymer by peptide bonds

<dt id="pmf">peptide mass fingerprinting
 <dd>the mass spectrum representing the peptides of a protein obtained by
deliberate fragmentation by physicochemical means, typically by single
or serial endoprotease digestion, in a controlled and reasonably
reproducible manner
<p class="detail">
The sample analyzed in the mass spectrum must represent the
digest or fragmentation of a single (pure or homogeneous) protein species.
The use of the term <q>fingerprinting</q> indicates that the
mass spectrum obtained can be used to identify uniquely the protein from
which the peptides were derived, just as a set of fingerprints can be used to
identify uniquely a human being.  In reality, not all product peptides
(of which there can be theoretically 20-40 tryptic peptides alone
for a 30-40 kDa polypeptide) are detected by the instrument and observed
in the mass spectrum.  It is usually sufficient to have between 5-10
peptides to provide a high-scoring match to identify the protein
in a database search.


<dt id="pna">peptide nucleic acid
 <dd>(usually abbreviated PNA) these are essentially forms of the bases of
 nucleotides that are linked in a polymer not by phosphoribose but by
 aminoethyleglycine moeities. Thus you substitute -O-ribose(-base)-O-P(=O)
 (-O<sup>&minus;</sup>)-O- with -NH-CH<sub>2</sub>-CH<sub>2</sub>N(-C[=O]-CH<sub>
 2</sub>-base)-CH<sub>2</sub>C(=O)- backbone. PNA polymers bind the complement
 more strongly because of the loss of negatively charged backbone.

<p class="detail">
 PNA bind with greater affinity for mRNA, making them antisense (translational
 downregulation) agents.  They also displace their own natural sense strand
 and bind the complement.  PNA are considered potential therapeutics to
 be delivered inside cells:  they are covalently bound to peptide vectors
 (sequences) which are generally cell surface ligands or have functions as
 cell-penetrating peptides.  PNA show natural ability to penetrate some cell
 types (e.g. neuronal cells) without vectorization.  General penetrating
 peptides do not distinguish cell type, whereas ligands help to target certain
 cell types. 

<dt id="phagemid">phagemid
 <dd>a vector plasmid that is largely derived from a bacteriophage, hence
<q>phage</q> + (plas)<q>mid</q>; in particularly it carries the origin of
replication from a single-stranded bacteriophage such as M13 or f1;
phagemids emerged from the need to subclone dsDNA plasmids into single-stranded
phage vectors particularly for sequencing.  Phagemid features include both
phage and bacterial host origins of replication, a phage packaging signal
and a gene for a coat protein that can be fused with a cloned/target gene
of interest (for phage display, which requires co-infection with a helper
phage to complement missing genes

<dt id="pid">photo-induced dissociation (PID)
 <dd>[ ]

<dt>PID
 <dd>see <a href="#pid">photo-induced dissociation</a>

<dt id="plasmid">plasmid
 <dd>molecules of DNA that are not structurally integrated as the genome of the 
organism that are chromosomes, ranging in size from 1000 bases (1 kb) to more 
than 200 kb, and usually double-stranded covalently closed circular molecules 
existing in superhelical form within the bacterial cell; and having a means of 
replicating that is independent of replication of the host chromosome (they can 
exist in hundreds to thousands of copies while the host chromosome is single 
copy); and having mechanisms that allow partition of copies into daughter cells 
during cell division; and which have genetic elements that often confer a 
particular advantage such as antibiotic resistance or enzymes that modify 
foreign DNA
 <br>[<i>Molecular Cloning: A Laboratory Manual</i> 3rd Ed.]

<dt id="pcr">polymerase chain reaction (PCR)
 <dd><b>long definition</b> (actually explanation): an innovation that solved 
that problem of how to amplify double-stranded DNA of interest in a cyclic 
fashion of separating the DNA strands (denaturation, using heat) and generating 
their complementary strands using a DNA polymerase in order to produce amounts 
of the ds DNA for detection and further manipulation; the innovation was in 
finding a DNA polymerase that did not have to be repetitively added to the 
mixture every time the double&rarr;single-stranded denaturation step was done, 
which inactivated the DNA polymerase;  the most logical question was to ask, 
<q>how do thermophilic bacteria thrive and grow (i.e., replicate DNA) in the 
boiling environment of hot springs?</q>
 <p style="margin-top:0;">
 <b>more precise, if not shorter, definition</b>:  the process of producing 
numerous molecules (<i>amplifying</i>) which are copies of a molecule of 
double-stranded DNA (or just a segment of it) (<q>template</q>) by denaturing 
the template molecule using near-water boiling temperatures in the presence of 
an excess of short single-stranded oligonucleotides (<q>primers</q>) whose 
sequence is complementary to the 5&prime;- and 3&prime;-ends of the template 
molecule, which anneal to the denatured long strands of the template molecule in 
a rapid cooling step, and which are necessary to <q>prime</q> the completion of 
the synthesis of the complementary strand by a thermostable DNA polymerase from 
the bacterium <i>Thermophilus aquaticus</i> (<i>Taq</i> polymerase) at its 
optimal temperature of about 72&deg;.
  <p class="detail">
    For every cycle, theoretically two molecules are produced from one molecule, 
    so <i>n</i> cycles should produce 2<sup><i>n</i></sup> molecules. Typically 
    there are 30 to 40 cycles in a PCR amplification program, so a single 1000 
    bp (1 kbp) molecule (mass 1096 zeptograms, 1 zeptogram = 
    10<sup>&minus;21</sup> grams = 10<sup>&minus;9</sup> picograms) will produce 
    1073741824 (= 2<sup>30</sup>) copies of itself after 30 cycles, which is 
    ~1.2 ng of product.  For 40 cycles, 1099511627776 (= 2<sup>40</sup>, or 1024 
    times more than 2<sup>30</sup>) molecules are produced, which should be 
    nearly 1 &micro;g.  In practice amplification is never so efficient, but 
    since the starting number of molecules are never just one molecule (might be 
    a thousand), it produces in just 2-3 hours DNA sufficient to do many 
    analyses and procedures (cloning, sequencing) of the target molecule.

<dt id="polypeptide">polypeptide
 <dd>a polymer of amino acids.  If it has a biological function in some
aspect, it is usually called a <a href="#protein">protein</a>.

<dt>ppm
 <dd>see <a href="#ppm">parts per million</a>

<dt id="precursor">precursor ion
 <dd>the ionized species (molecule) that represents the whole molecule
prior its deliberate disintegration and the spectral analysis of its
fragment ions;  mass spectrometers today can be automated to measure the
parent ion mass and then switched to a mode to fragment the parent ion
and obtain the spectrum of masses of the fragments; a term used interchangably
with <a href="#parent">parent ion</a> (deprecated)


<dt>precursor ion scan [mode]
 <dd>a mode (capability) of a tandem (MS/MS) or MS<sup>n</sup> (with <i>n</i>
&ge; 2) mass spectrometer with the ability to selectively filter the product
ions to detect a particular product ion (and count it) while scanning
(filtering) of all precursor ions to observe which precursor ion(s) produce the
specific product ion;  not achievable with analyzers that use time-based
determination of <i>m/z</i>

<dt>preprocessing
 <dd>[metabolomics] the modification of the values in a dataset according
to specific rules, so that information of interest can be focused upon
 [<a href="#jansen">Jansen</a>]  

<dt>principal component analysis
 <dd>[metabolomics] an unsupervised method which tries to describe as much
varation in the dependent variables as possible  [<a href="#jansen">Jansen</a>]  

<dt>principal component-discriminant functional analysis
 <dd>[metabolomics] supervised method describing differences between sample
groups based on PCA components [<a href="#jansen">Jansen</a>]


<dt>product ion
 <dd>the ionized product of a precursor ion that has been fragmented (intentionally
or otherwise) by a mass spectrometer; also called <q>daughter ion</q>
(deprecated)

<dt>product ion scan [mode]
 <dd>a mode (capability) of a tandem (MS/MS) or MS<sup>n</sup> (with <i>n</i> &ge; 2)
mass spectrometer with the ability to selectively filter precursor ions
and fragment them to scan (by filtering) their product ions;  this is
a common investigative mode for looking the structure of a precursor ion

<dt>protease
 <dd>an enzyme that is a <a href="#hydrolase">hydrolase</a> (i.e.,
has hydrolytic activity) that is directed to the catalytic hydrolysis
of the <a href="#pepbond">peptide bond</a>; during some methods in
proteomics, such as the preparation of cell extracts for protein
separation, active proteases are absolutely unwanted and efforts are
taken to inhibit their activity completely, while in other methods,
such as the preparation of peptides using trypsin for mass fingerprinting,
proteases are used in a controlled manner

<dt id="protein">protein
 <dd>One or more polypeptides possessing at least one biological function.  If 
there is more than one polypeptide, the polypeptides assemble to provide the 
biological function.  A protein can possess more than one biological function or 
purpose.  Compare the meaning of <a href="#polypeptide">polypeptide</a>.

<dt id="proteome">proteome
 <dd>the total set of proteins present within a cell or tissue (group
of identically differentiated cells) and which is representative
of the set of proteins expressed at any given time or
phase of development;  only one genome can ever be determined in a
cell or tissue type, but several proteomes may exist in the lifetime
or existence of a cell or tissue type

<dt>proteomics
 <dd>
 <ul>
 <li>the science and instrumentation, including the research and development
of methods, which are involved in the study and determination of the
<a href="#proteome">proteome</a>
 <li>a <q>classical description</q> of proteomics includes
(1) protein profiling, (2) protein identification and (3) elucidation
of protein-protein interaction [<a name="back-yarmush"></a><a
href="#yarmush">Yarmush</a>]
 <li>the objective of proteomics is a systematic identification of all
proteins expressed in a cell or tissue, including posttranslational
modifications [<a name="back-wu"></a><a href="#wu">Wu</a>]
 </ul>

<!-- ===================================================================
   Q
 ======================================================================= -->
<h1 class="letter">Q</h1>

<dt>qPCR
 <dd>see <a href="#qPCR">quantitative polymerase chain reaction</a>

<dt id="qPCR">quantitative polymerase chain reaction (qPCR)
 <dd>any PCR technique in which the amount of the double-stranded DNA
representing the amplicon is determined quantitatively after each amplification
cycle.  In practice, a sensitive detection/measurement technique is used, such
as a fluorescent label or tag whose signal increases with each amplfication
cycle.  This signal increase often occurs when a template or primer strand
has a flourescent quencher removed during PCR replication.
<a href="RTPCR">Real-time PCR</a> thermal cyclers with special photometric
diodes and detectors are usually used to perform this technique.

<dt>quantitative trait loci (QTL)
 <dd>[to be entered]


<!-- ===================================================================
   R
 ======================================================================= -->
<h1 class="letter">R</h1>

<dt id="RT-PCR">real-time polymerase chain reaction (qPCR, qRT-PCR)
 <dd>Refers to the use of PCR to amplify target DNA which incorporates a label
that produces a signal whose intensity increases when complementary strands
are created at each amplification step, and the signal can be detected and
reported as a specific quantity.  A special instrument that provides the function
of thermal cycling for PCR and which contains signal reading ability enables 
the ability to perform qPCR.  There are many strategies by which the signal
(typically a fluorescent substance) is produced as the new strands are synthesized.
The starting strand can be DNA from any source, or it can be RNA which is 
first reversed-transcribed (see <a href="#RT-PCR">RT-PCR"</a>).

<dt>recombinant inbred lines (RILs)
 <dd>[to be entered]

<dt id="reducalkyl">reductive alkylation
 <dd>a two-stage chemical reaction in which a reduction and then an
alkylation occurs;  it specifically and usually refers to the reduction
of disulfide bridging bonds in proteins and then the alkylation of
the cysteine sulfhydryls to prevent reformation of the disulfide bonds,
in preparation of the analysis of these proteins or their peptides,
particularly by mass spectrometry

<dt id="replicon">replicon
 <dd>sequences of DNA that function as the origin of replication and its control 
elements for copying biologically/functionally important DNA usually in 
preparation for cell division.  It is usually several hundred base pairs long. 
The pMB1 and colE1 replicons are most well known, and regulate about 15-20 
copies/cell (pBR322 carries the pMB1 replicon).  However, pUC plasmids carry a 
modified pMB1 replicon and can be present in 500-700 copies per cell.

 <br>[<i>Molecular Cloning: A Laboratory Manual</i> 3rd Ed.]
 

<dt id="revtranscriptPCR">reverse transcription polymerase chain
reaction
 <dd>In its simplest form, this procedure is used to produce complimentary DNA 
sequences from RNA sequences, and then to amplify the resulting DNA sequences
to levels that can be used for analysis or for manipulation for the purposes
of cloning or expressing those sequences as proteins in a manner that can be
controlled by the scientists.  This methodical process occurs <i>in vitro</i>.
 <p>
Since RNA is being transcribed into DNA, this means that the RNA represents
genes that are actually expressed up to the level of transcription.  A general
assumption is that the transcribed gene is also translated, that is, expressed
as a protein.  (For prokaryotes, this probably true, but for eukaryotes, this
can be a false assumption.)  
 <div style="font-size:83%;">
For processing of the transcriptome, typically the messenger-type 
RNA molecules (mRNA) in cells or tissues, the steps are:
 <ol>
 <li>Messenger RNA (mRNA) molecules are extracted from the cells 
or tissues of interest.  Special chemicals, particularly inhbitors for
ubiquitous RNases, are necessary to preserve mRNA in the extract.
 <li>Reverse transcription is performed by adding the enzyme <b>reverse 
transcriptase</b> (an RNA-dependent DNA polymerase), deoxyribonucleotide 
triphosphates (dNTPs) to provide substrate to build the DNA strand, a buffer 
stabilizing the pH and to prevent oxidation of enzymes, magnesium salt, and 
perhaps other components.  If specifically mRNA is the target, a short DNA 
sequence of thymidine bases ("oligo dT") is added, as it pairs with the 
polyadenylation sequence that is specifically used to modify mRNA 
posttranscriptionally, and reverse transcriptase, like other enzymes that are in 
the class of DNA polymerases, is dependent on a primer sequence bound to the
complementary strand and featuring a 3'-hydroxyl end.
 <li>The polymerase chain reaction (PCR) can now be done on the cDNA produced
by reverse transcription.  The thermostable <i>Taq</i> polymerase is added
along with dNTPs, magnesium salt, buffer to adjust pH and ionic strength
among other components.  Again primers must be added for amplifying the target
DNA.
 </ol>
<p>
In the second (PCR) step, many variations can be attempted to amplify the cDNA. 
To amplify only a specific (one gene or genetic element) sequence, forward and 
reverse primers specific for that gene or element are added to the PCR mix, and 
only one cDNA type will be amplified.  To amplify almost every cDNA molecule,
random forward and reverse primers can be added and the PCR done.
</div>

<dt id="rna-interference">RNA interference
 <dd>the biological processes related how RNA in single- or double-stranded
form results in changes in gene expression that sometimes protect organisms
(against infection by viruses, for example) or which sometimes can cause
or be indicators of disease; RNAi forms can be used in medical diagnostics

<dt>RNAi
 <dd><a href="#rna-interference">RNA interference</a>

<dt id="rtpcr">RT-PCR
 <dd>Unfortunately, this abbreviation has been used to describe two different
concepts in molecular biology.
  <ol>
  <li>see <a href="#revtranscriptPCR">Reverse transcription polymerase
chain reaction</a>
  <li>see <a href="#RTPCR">Real-time polymerase chain reaction</a>
  </ol>
<p>
RT-PCR is the preferred abbreviated for <b>reverse transcription polymerase 
chain reaction</b>.  Q-PCR, qPCR, QRT-PCR, or qRT-PCR is the preferred 
abbreviation for real-time PCR.

<!-- ===================================================================
   S
 ======================================================================= -->
<h1 class="letter">S</h1>

<dt>SAGE
 <dd>see <a href="#sage">serial analysis of gene expression</a>

<dt id="savitzky">Savitzky-Golay
 <dd>a <a href="#smoothing">smoothing</a> process which is a digital
filter for signal data with a time domain; the algorithm averages
a signal intensity weighted by a quadratic curve, which is more preferable
than other types of moving window averages

<dt>scaling
 <dd>[metabolomics] preprocessing step removing information equal for all
samples from a dataset [<a href="#jansen">Jansen</a>]  

<dt id="scoreplot">scores
 <dd>[metabolomics] values in a component model describing the variation between
samples [<a href="#jansen">Jansen</a>]

<dt>selective reaction monitoring
 <dd>SRM is a mode (capability) of a tandem (MS<sup>n</sup>) mass spectrometer
to in which both the analyzers are put into filter (and not wide scan) mode
for the precursor and product <i>m/z</i>; this mode increases the sensitivity
of assessing whether a precursor fragments to a specific product

<dt>sequence proteomics
 <dd>the systematic study of proteins in a database that deals with their
amino acid sequences, including the sequences of translated RNA/DNA that coded
them, and including any annotation or curation or bioinformatics techniques
related with the primary sequence of proteins and peptides

<dt id="sage">serial analysis of gene expression (SAGE)
 <dd>a means of determining the (quantitative) level of gene expression
by sequencing concatenated short stretches of cDNA, each representing
a tag of an mRNA molecule, and then counting the replicate tags to
determine relative levels of expression

<dt>SG
 <dd>possibly an abbreviation for <a href="#savitzky">Savitzky-Golay</a>

<dt>shRNA
 <dd><a href="#shRNA">small heterogeneous RNA</a>

<dt>SID
 <dd>see <a href="#sid">surface-induced dissociation</a>

<dt>siRNA
 <dd><a href="#siRNA">small inhibitor RNA</a>

<dt id="shRNA">small heterogeneous RNA
 <dd>

<dt id="siRNA">small inhibitor RNA
 <dd>

<dt id="smoothing">smoothing
 <dd>a stage in the processing of mass spectra in which the continuous
line plot of the spectrum is smoothed to eliminate noise in the signal
 <p class="detail">Normally smoothing of the mass spectrum line plot
is preceded by <a href="#bkgdsub">background subtraction</a>, in which
both processes reduce noise in the signal.  There are various approaches
to line smoothing, including replotting points by calculating a running
mean with varying sizes of windows.

<dt id="softionize">soft ionization
 <dd>ionization of analyte molecules within the source of a mass spectrometer in which
charged species are bound to the analyte molecule through simple
chemical reactions, such protonation or deprotonation (acid-base
chemistry or field-induced reduction or oxidation) or adduct formation
with a sodium or potassium ion; descriptive of MALDI- or ESI-based
ionization; cf. <a href="#hardionize">hard ionization</a>

<dt>supervised method
 <dd>[metabolomics] a data analysis method using the available information
about the independent variables in generating the model [<a href="#jansen">Jansen</a>]  

<dt id="sid">surface-induced dissociation (SID)
 <dd>[ ]

<dt>SWISSPROT (sometimes SWISS-PROT)
 <dd>an annotated database of protein sequences determined directly by
protein chemistry methods and by <i>in silico</i> translation

<!-- ===================================================================
   T
 ======================================================================= -->
<h1 class="letter">T</h1>

<dt>Th
 <dd>see <a href="#thomson">Thomson</a>

<dt><a id="thomson"></a>Thomson
 <dd>a unit/dimension proposed as a replacement for the dimensionless quantity 
<i>m/z</i> which forms the absicissa of the mass spectrum;  some have defined it 
as equivalent to 1 <i><a href="#u">u</a>/e</i> and 1 <a 
href="#da">Da</a>/<i>e</i>, where <a href="#u"><b>u</b></a> is an alternative reference to <a 
href="#amu">atomic mass unit</a>, <b><i>e</i></b> is the elementary charge or
fundamental unit of charge;  in SI units, it is
1.660539&nbsp;&times;&nbsp;10<sup>&minus;27</sup>&nbsp;kg &divide; 
1.6021765&nbsp;&times;&nbsp;10<sup>&minus;19</sup>&nbsp;C =
1.036427&nbsp;&times;&nbsp;10<sup>&minus;8</sup> kg/C

<dt id="tof">time-of-flight (ToF or TOF)
 <dd>a principle in mass spectrometry that allows the measurement of
the mass of an ionized gas-phase species (atom or molecule) by accelerating
it in a high voltage electric field (<i>E</i>) to
a constant velocity (<i>v</i>) and then measuring the time (<i>t</i>)
it takes for the molecule to be sensed by a detector as it traverses
a path whose length must be known or determined;  because the
potential energy imparted by the electric field [<i>U&nbsp;=&nbsp;zeE</i>]
becomes the kinetic energy of the ionic species
[<i>W&nbsp;=&nbsp;&frac12;mv</i><sup>2</sup>, or
<i>W&nbsp;=&nbsp;&frac12;m</i>(<i>d/t</i>)<sup>2</sup>, where
<i>d</i> is the length of flight in the mass spectrometer tube
and <i>t</i> is the time
of its flight], the equation <i>U&nbsp;=&nbsp;W</i> can be algebraically arranged
to show the relationship that <i>t</i>&nbsp;=&nbsp;<i>d</i>&radic;<span
style="text-decoration:overline;"><i>m/2ezE</i></span>, but since
<i>d</i> (the flight tube length), <i>e</i> (the coulombic charge of a
single unit of charge), and <i>E</i> (the electrical potential or voltage
used to accelerate the ionic species) are all essentially constant,
the equation can be reduced to <i>t</i>&nbsp;=&nbsp;<i>C</i>&radic;<span
style="text-decoration:overline;"><i>m/z</i></span>, or time of flight is
proportional the square root of the mass to the charge, and where <i>C</i>
represents all the constant factors described

<dt>ToF (also TOF)
 <dd>see <a href="#tof">time-of-flight</a>

<dt><a id="top-down"></a>top-down proteomics
 <dd><q>Top-down</q> proteomics is the characterization of a protein
with its structure still intact, enabling studies of the protein that would
be impossible (or less possible) by the use of the <a href="#bottom-up">bottom-up
proteomics</a> approach.  For example, analysis of post-translational modification
 [see Bogdanov and Smith, <i>Mass Spectrom. Rev.</i>
<b>24</b>: 168-200, 2005].
  <br>Compare <a href="#bottom-up">bottom-up proteomics</a>

<dt>transcriptomics
 <dd>the science, including instrumentation and hardware and software tools,
involved with the study of the entire set of transcribed products
(polyribonucleotides in the messenger [mRNA], ribosomal [rRNA],
translational [tRNA] and nucleostructure [heterochromatin RNA]) with a
cell, tissue or organism at any given time or state of development
  <p class="detail">
  The tools in transcriptomics include <a href="#rtpcr">RT-PCR</a> which
 is used to make EST libraries

<dt id="translation">translation
 <dd>In biology, the process by which RNA is expressed as (converted) to 
protein.  Typically the RNA molecule is produced by transcription from the
DNA sequence that represents a gene or other coding sequence.  The RNA
is then <i>translated</i> into protein when ribosomes attach to it, providing
the enzymatic machinery to produce a polypeptide from the RNA sequence.

<dt>trypsin
 <dd>a protein that is a member of the class of hydrolases, and which
is specifically a protein hydrolase (or protease);  because its mechanism
of hydrolysis is mediated by a serine residue side chain in the active
site, it is a member of the <i>serine hydrolases</i> or <i>serine
proteases</i> group of proteolytic enzymes; its active site selects
for residues that are positively charged at the pH (usually around 8) at
which trypsin is optimally active, and these are usually lysine (Lys, K)
and arginine (Arg, R) residues, in which hydrolytic cleavage of the peptide
bond is achieved on the carboxyl side of the R or K residue;  trypsin
will not cleave R or K residues that are immediately followed proline
(P) residues, or carboxyl-side prolines; it also has difficulty hydrolyzing
R or K residues immediately surrounded by negatively charged residues,
such as two or more adjacent glutamate or aspartate residues, or
phosphorylated serines and/or threonines

<!-- ===================================================================
   U
 ======================================================================= -->
<h1 class="letter">U</h1>

<dt id="u"><i>u</i>
 <dd>the symbol/abbreviation representing the dimension of the 
<a href="#amu">atomic mass unit</a>

<dt>UV-PD
 <dd>see <a href="#uvpd">ultraviolet photodissociation</a>

<dt id="uvpd">ultraviolet photodissociation
 <dd>UV-PD (or UVPD) 

<!-- ===================================================================
   V
 ======================================================================= -->
<h1 class="letter">V</h1>

<dt id="plasmid-vector">vector
 <dd>a apecial type of plamsid that has been recruited for use in molecular 
biology, for the cloning and expression of genetic material; its sequence
may entirely be of natural origin, but more likely it is constructed 
of a mosaic of sequences that provide some advantage for its use; in particular
it must be <em>selectable</em> in that the continued existence or high
copy number of the plasmid containing the original vector sequence depends
upon an interaction of host factors and pressure upon the host to maintain
the vector because it has elements for host survival.

<dt id="varimod">variable modification
 <dd>a modification to one or more functional groups or moieties of a protein
or peptide, particularly to the side chains of amino acids, that cannot
be controlled by the biochemist studying a proteome; it usually represents
an incidental or biologically produced (post-translational modification)
that must be systematically considered especially when significant peaks
of the mass spectrum cannot be matched;  examples of variable modification
include oxidation of methonine and phosphorylation of residues target
by protein kinases (serine, threonine, and tyrosine are the most common)

</dl>

<hr>

<h1>Sources</h1>
<p>The web pages of <a href="http://www.matrixscience.com">Matrix Science</a>
have been used to obtain some information and some of their wording
was used, such as in the definition of <a href="#nominalmass">nominal mass</a>.
<ul>
<li id="dettmer">Dettmer K, Aronov PA, Hammock BD (2007) <i>Mass Spectrometry Rev</i> 
<b>26</b>,  51-78. [<a href="#back-dettmer">return to text</a>]

<li id="dunn">Dunn WB, Bailey NJC, Johnson HE (2005) <i>The Analyst</i> 
<b>130</b>,  606-625. [<a href="#back-dunn">return to text</a>]

<li id="hegeman">Hegeman AD (2010) Plant metabolomics&mdash;meeting the 
analytical challenges of comprehensive metabolite analysis. 
<i>Brief Funct Genomic Proteomic</i> <b>9</b>, 139-48.

<li id="jansen">Jansen JJ, Smit S, Hoefsloot HCJ, Smilde AK (2009) 
<i>Phytochem. Anal.</i> <b>21</b>,  48-60.

<li id="sana">Sana TR, Waddell K, Fischer SM (2008) <i>J. Chromatog. B</i>
<b>871</b>: 314-321. [<a href="#back-sana">return to text</a>]

<li id="verpoorte">Verpoorte R, Choi YH, Kim HK (2010) <i>Phytochem. Anal.</i> 
<b>21</b>,  2-3. [<a href="#back-verpoorte">return to text</a>]

<li id="wishart">Wishart DS (2010) <q>Computational Approaches to Metabolomics</q>
(Chap 14) in Matthiesen R, ed., <i>Bioinformatics Methods in Clinical Research</i>,
Methods in Molecular Biology Vol 593, pp 283-313. [<a href="#back-wishart">return to text</a>]

<li id="wu">Wu CC, MacCoss MJ, Howell KE, Yates 3rd JR (2003) <i>Nat. 
Biotechnol.</i> <b>21</b>,  532-538. [<a href="#back-wu">return to text</a>]

<li id="xiayan">Xiayan L, Legido-Quigley C (2008) <i>Electrophoresis</i>
 <b>29</b>, 3724-3736.

<li id="yarmush"> Yarmush ML, Jayaraman A  (2002) <i>Annu. Rev. Biomed. Eng.</i> 
<b>4</b>,  349-373. [<a href="#back-yarmush">return to text</a>]
</ul>
</body>
</html>
