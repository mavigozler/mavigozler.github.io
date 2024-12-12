"use strict";

export default contentBuilder;

const DollarReduction = [
   30, 27.5, 25, 23, 21, 20
];

const baseRates = [
   { subject: "Math6-9",      rate: 23 },
   { subject: "Science6-9",   rate: 21 },
   { subject: "Science10-12", rate: 23 },
   { subject: "Math10-12",    rate: 24 },
   { subject: "GenChem",      rate: 25 },
   { subject: "OrgChem",      rate: 30 },
   { subject: "Biochem",      rate: 30 },
   { subject: "Biology",      rate: 25 },
   { subject: "WebDev",       rate: 35 },
   { subject: "MSO",          rate: 30 },
   { subject: "SharePoint",   rate: 32 },
   { subject: "PowerApp",     rate: 35 }
];

function contentBuilder(htmldoc: Document): void {
	const document = htmldoc;
   // base rate calculator for table
   for (const baseRate of baseRates) {
      const spanElem = document.getElementById(baseRate.subject);
      spanElem?.replaceChild(document.createTextNode("$" + baseRate.rate.toString()),
         spanElem.firstChild as ChildNode);
   }
   // calculate group reduction rate
   const rows = document.querySelectorAll("#reduction tr");
   for (let row = 1; row < rows.length; row++) {
      const cols = rows[row].querySelectorAll("td");
      cols[2].appendChild(document.createTextNode("$" + DollarReduction[row - 1].toFixed(2)));
      cols[1].appendChild(document.createTextNode(
         (100 - DollarReduction[row - 1] / DollarReduction[0] * 100).toFixed(0) + "%"
      ));
   }
   document.getElementById("example-base")?.appendChild(
      document.createTextNode("$" + DollarReduction[0])
   );
}
