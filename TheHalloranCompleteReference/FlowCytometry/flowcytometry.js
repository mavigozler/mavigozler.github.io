const ELEMENT_NODE = 1,
		ATTRIBUTE_NODE = 2,
		TEXT_NODE = 3,
		CDATA_SECTION_NODE = 4,
		ENTITY_REFERENCE_NODE = 5,
		ENTITY_NODE = 6,
		PROCESSING_INSTRUCTION_NODE = 7,
		COMMENT_NODE = 8,
		DOCUMENT_NODE = 9,
		DOCUMENT_TYPE_NODE = 10,
		DOCUMENT_FRAGMENT_NODE = 11,
		NOTATION_NODE = 12;
function nodeTreeSearch(node, childString, childType) {
	let searchRE, 
      retval = null;

	if (node == null || childString == null ||
				(childType != ELEMENT_NODE && childType != TEXT_NODE))
		return null;
	if (childType == TEXT_NODE)
		searchRE = new RegExp(childString);
	for (const cnode = node.firstChild; cnode != null; cnode = cnode.nextSibling) {
		switch (childType) {
		case ELEMENT_NODE:
			if (cnode.nodeName.toLowerCase() == childString.toLowerCase())
				return (cnode);
			break;
		case TEXT_NODE:
			if (childType == TEXT_NODE && cnode.search(searchRE) >= 0)
			{
				delete searchRE;
				return (cnode);
			}
			break;
		}
		if (cnode.hasChildNodes() == true &&
				(retval = nodeTreeSearch(cnode, childString, childType)) != null)
			break;
	}
	if (searchRE)
		delete searchRE;
	return retval;
}

function activateTR(tdNode) {
	const trElem = tdNode.parentNode;
	let displayVal;

	if ((displayVal = trElem.getAttribute("displaying")) == null ||
					displayVal == "false") {
		if (displayVal == null) {
			var attrNode = document.createAttribute("displaying");
			trElem.setAttributeNode(attrNode);
		}
		trElem.setAttribute("displaying", true);
		setTDNodes(tdNode.parentNode, true);
	} else {
		trElem.setAttribute("displaying", false);
		setTDNodes(tdNode.parentNode, false);
	}
}

function deactivateTable(tblNode, set) {
	let rowset;

	if (set == true)
		rowset = false;
	else
		rowset = true;
	for (trElem = nodeTreeSearch(tblNode, "tr", ELEMENT_NODE); trElem != null;
			trElem = trElem.nextSibling)
		setTDNodes(trElem, rowset);
}

function setTDNodes(TRnode, show) {
	for (const cnode = TRnode.firstChild; cnode != null; cnode = cnode.nextSibling) 		
      if (cnode.nodeName.toLowerCase() == "td" &&
				cnode.className != "feature" && cnode.className != "cellfullycentered")
			if (show == true)
				cnode.style.display = "";
			else
				cnode.style.display = "none";
}

function showTable(tblNode, chkBoxObj) {
	if (chkBoxObj.checked == true)
		deactivateTable(tblNode, false);
	else
		deactivateTable(tblNode, true);
}

const client = "nd";
let clientVersion, UAt;
//                    1   2           3       4        5
const matchRE = /.*\/(\d*)(\.\d)*\s*\((.*)\)\s*(.*)$/;
// var matchRE = /\((.*);\s*(.*);.*\)/;
const userAgent = navigator.userAgent.match(matchRE);
if (userAgent[4].length > 0)
{
	userAgent[5] = userAgent[4].match(/(.+)\/(\d{8})/);
	userAgent[4] = userAgent[5][1];
	userAgent[5] = userAgent[5][2];
}
const UAparen = userAgent[3].split(";");

if (UAparen[1].search(/\s+.*/) >= 0) {
	userAgent[3] = UAparen[1].match(/\s+(.*)/)[1];
	if (userAgent[3].search(/.*\s+.*/) >= 0)
		userAgent[3] = userAgent[3].match(/(.*)\s+.*/)[1];
} else
	userAgent[3] = "";
if ((UAt = UAparen[UAparen.length - 1].match(/(\d)\.(\d*)/)) != null) {
	userAgent[6] = UAt[1];
	userAgent[7] = UAt[2];
}
/*
userAgent
    1 = major version num
    2 = minor version/revision series
	 4 = if filled, will say Gecko, indicating Mozilla
	 5 = gecko build date YYYYMMDD

	 3 = 'MSIE' if IntExplorer, 'U' if Mozilla or Netscape
	 6 = major version num
	 7 = minor version/revision series
*/

if (navigator.appName == "Netscape" && userAgent[3] == "U") {
	if (userAgent[4] == "Gecko")
		client = "mz";
	else
		client = "nn";
} else if (userAgent[3].search(/Opera/) >= 0 || userAgent[3] == "Opera")
   client = "op";
	/* Opera indicates in two different ways, within and after the ')' */
else if (navigator.appName.search(/Microsoft Internet Explorer/) >= 0 || userAgent[3] == "MSIE")
// or else it's the most popularly used browser
	client = "ie";
	
if (client == "mz") {
	var Arr = navigator.userAgent.match(/rv:\s*(\d\.\d)/);
	clientVersion = Arr[1];
} else if (userAgent[4].length > 0)
	clientVersion = userAgent[4] + "." + userAgent[5];
else if (userAgent.length >= 8)
	clientVersion = userAgent[6] + "." + userAgent[7];

/******** end Client/Browser determination code ****************/

/******** start Compatibility Code:  Wrappers, Workarounds, Fixes **********/
/****************************************
Netscape Navigator and Javacript compatibility
  Javascript          NN Versions
  ----------          -----------
    1.0                  2.0
    1.1                  3.0
    1.2               4.0 - 4.05
    1.3               4.06 - 4.5
    1.4
	 1.5                  6.0  also any version of Mozilla

*****************************************/
if (!document.all && document.getElementsByTagName("*"))
    document.all = document.getElementsByTagName("*");

// document.createDocumentFragment() does not exist before IE6
if (client == "ie" && Number(clientVersion) < 6.0)
	document.createDocumentFragment = document.createElement("");

var left = "screenX=";
var top = "screenY=";
if (client == "ie")
{
	left = "left=";
	top = "top=";
}
