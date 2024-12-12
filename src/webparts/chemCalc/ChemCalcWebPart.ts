import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

// import { RESTrequest } from "../../SPREST/SPHttpReqResp";
//import { JSDOM } from "jsdom";

//const SPOHtmlFileLink =
//	"https://mhalloran.sharepoint.com/:u:/r/sites/mhteam/Projects/Biochemistry%20Reference%20Calculator/ChemCalc.aspx?csf=1&web=1&e=8H5jgw"
// import styles from './ChemCalcWebPart.module.scss';

export interface IChemCalcWebPartProps {
}

//import { initializeChemCalc } from "../../ChemCalc/ModuleController";

export default class ChemCalcWebPart extends BaseClientSideWebPart<IChemCalcWebPartProps> {
	htmlDoc: string;

	public render(): void {
//		this.domElement.innerHTML = this.htmlDoc;
	}

	protected onInit(): Promise<void> {
		super.onInit().catch((err) => {});
		/*
		return getHTMLDocument()
			.then((htmlDoc: Document) => {
				this.htmlDoc = htmlDoc.body.innerHTML;
				this.render();
				initializeChemCalc();
      }).catch((err: unknown) => {
			console.log(err);

      }); */
		return Promise.resolve();
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}
}

/*function getHTMLDocument(): Promise<Document> {
	return new Promise<Document>((resolve, reject) => {
		RESTrequest({
			url: SPOHtmlFileLink,
			method: "GET",
			successCallback: (content) => {
				resolve(new JSDOM((content as string).trim()).window.document);
			},
			errorCallback: (errInfo) => {
				reject(errInfo);
			}
		});
	});
}*/