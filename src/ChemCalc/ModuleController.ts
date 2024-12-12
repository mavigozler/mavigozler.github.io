/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable eqeqeq */
/* insert eslint DISABLING for compiled JS here */

import { setCustomHandler, ErrorHandler } from "../GenLib/error";
import { plainWindow } from "../GenLib/windows";
import EventEmitter from "eventemitter3";
import { ChemModule } from "./ChemModule";
export {
	ChemController,
	ModuleController,
	ModuleControllerEmitter,
	initializeChemCalc,
	ChemCalcPageProperties
};

type ModuleRegistryInfo = {
	name: string;
	moduleId: string;
	pageRef: string;
	description: string[];
	menuItemText: string;
	moduleObj: ChemModule;
};

const personalizedName = "Prof. Dr. Nilg\u00fcn Halloran";
/*
export class InitEmit extends EventEmitter {}
const initEmitter = new InitEmit();
initEmitter.on("init", (data) => {
	console.log('Received init event with data:', data);
});
export const sharedEmitter = initEmitter;
*/
//const xhtmlFilePath = "../html";

const ChemCalcPageProperties = {
	tableCellPropertyValue : "",
	tableRowPropertyValue : "",
	tablePropertyValue : "",
	rowspanProperty : undefined,
	classAttributeName : undefined
};


const ModuleControllerEmitter = new EventEmitter();

class ModuleController {
	ChemModulesRegistryData: ModuleRegistryInfo[] = [];
	mainPage: HTMLDivElement | undefined;
	//contentPanelsDomNode: HTMLDivElement | undefined;
	mainMenuDomNode: HTMLDivElement | undefined;
	activeModuleMenuDomNode: HTMLDivElement | undefined;
	activeModule: ChemModule | undefined;
	mainMenuList: HTMLUListElement | undefined;
	activeModuleShutdownCallback: (() => void) | undefined = undefined;
	iframeElem: HTMLIFrameElement;
	JsonFileLocation: string;
	modulesLocation: string;
	errorHandlers: {
		generalError:  ErrorHandler;
		promiseRejection:  ((reason: string) => void);
	} = { generalError: () => {}, promiseRejection: () => {} };

	constructor () {
		// read in JSON for the menu
		this.JsonFileLocation = "%%%JSON FILES LOCATION%%%";
		this.modulesLocation = "%%%MODULES LOCATION%%%";

		this.iframeElem = document.getElementById("module-iframe") as HTMLIFrameElement;
		this.mainPage = document.getElementById("main-page") as HTMLDivElement; // div element
//		this.contentPanelsDomNode = document.getElementById("content-panels") as HTMLDivElement;
		this.mainMenuDomNode = document.getElementById("main-menu") as HTMLDivElement;
//		this.activeModuleMenuDomNode = document.getElementById("active-module-menu") as HTMLDivElement;

//		this.mainMenuList = document.createElement("ul");
//		this.mainMenuDomNode.appendChild(this.mainMenuList);
		this.initialize().then(() => {
			console.log("initialized");
		}).catch((err) => {
			console.log(err);
		});
	}

	initialize(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			let whichModule: string;
			if (location.href.search(/mhalloran.sharepoint.com/) >= 0)
				whichModule = `${this.JsonFileLocation}/modulesForSP.json`;
			else
				whichModule = `${this.JsonFileLocation}/modules.json`;
			fetch(whichModule)
			.then((content: Response) => content.json()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.then(json => {
				this.ChemModulesRegistryData = json.ChemModulesRegistryData;
				ModuleControllerEmitter.addListener("controllerNotify", () => {
					ModuleControllerEmitter.emit("init");
				});
				ModuleControllerEmitter.emit("init");
				this.buildMenu();
				// build the menu
				resolve();
			}).catch((err) => {
				reject(err);
			})).catch((err) => {
				reject(err);
			});
		});
	}

	initializePage(): void {
		const personalized = `The ${personalizedName}`,
				docTitleHeading = document.getElementById('title'),
				docFrag = document.createDocumentFragment();
		if (personalized.length > 4) {
			docFrag.appendChild(document.createTextNode(personalized));
			docFrag.appendChild(document.createElement("br"));
		}
		docTitleHeading!.insertBefore(docFrag, docTitleHeading!.firstChild);
	}

	registerModule(
		moduleId: string,
		moduleObj: ChemModule
	): boolean {
		let thisModule;
		if ((thisModule = this.ChemModulesRegistryData.find(elem => elem.moduleId == moduleId)) != null)
			thisModule.moduleObj = moduleObj;
		return false;
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	activateModule (moduleId: string): void {
		const regModuleItem = this.ChemModulesRegistryData.find(modItem => modItem.moduleId == moduleId);
	//	this.activeModuleMenuDomNode!.style.display = "";
		this.mainPage!.style.display = "none";
	//	this.activeModuleShutdownCallback = moduleObj.d;
		this.iframeElem.style.display = "block";
		this.iframeElem.src = `${this.modulesLocation}/${regModuleItem!.pageRef}`;
		this.iframeElem.addEventListener("load", (/* _event: Event */) => {
			regModuleItem!.moduleObj.xmlDocument = this.iframeElem.contentDocument as Document;
			regModuleItem!.moduleObj.finishDocument(this.iframeElem.contentDocument!);
			regModuleItem!.moduleObj.addXhtmlEventHandlers();
	//		regModuleItem!.moduleObj.activate();
		});
		this.activeModule = regModuleItem!.moduleObj as ChemModule;
		this.errorHandlers.generalError = this.activeModule.handleError as ErrorHandler;
		this.errorHandlers.promiseRejection = this.activeModule.handlePromiseRejection as ((arg: string) => void);
	}

	deactivateModule (): void {
//		this.activeModuleMenuDomNode!.style.display = "";
//		this.mainMenuDomNode!.style.display = "none";
		this.iframeElem.style.display = "none";
		this.activeModule = undefined;
	}

	buildMenu (): void {
		// find module registry
		// create the document fragment
		// style:  name with clickable go to, description
		const wholeMenuDiv = document.createElement("div");
		wholeMenuDiv.id = "wholeMenu";
		for (const module of this.ChemModulesRegistryData) {
			const menuItemDiv = document.createElement("div");
			wholeMenuDiv.appendChild(menuItemDiv);
			menuItemDiv.id = module.moduleId + "MenuItem";
			menuItemDiv.className = "menuItemDiv";
			const menuItemModClick = document.createElement("p");
			menuItemDiv.appendChild(menuItemModClick);
			menuItemModClick.className = "menuItemModClickP";
			menuItemModClick.appendChild(document.createTextNode(module.name));
			menuItemModClick.setAttribute("data-moduleId", module.moduleId);
			menuItemModClick.addEventListener("click", (event: Event) => {
				this.activateModule((event.target! as HTMLElement).getAttribute("data-moduleId") as string);
			});
			const menuItemModDesc = document.createElement("p");
			menuItemDiv.appendChild(menuItemModDesc);
			menuItemModDesc.className = "menuItemModDesc";
			menuItemModDesc.appendChild(document.createTextNode(module.description.join(" ")));
		}
		document.getElementById("main-menu")!.appendChild(wholeMenuDiv);
	}
}

let ChemController: ModuleController;
let DescriptionWin: Window | undefined = undefined;
let finePrintWin : Window | undefined = undefined;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// document.addEventListener("DOMContentLoaded", (event: Event) => {
function initializeChemCalc(): void {
	ChemController = new ModuleController();
	// error handler must be set right away
	setCustomHandler("error", ChemController.errorHandlers.generalError);
	setCustomHandler("unhandledrejection", ChemController.errorHandlers.promiseRejection);
   ChemController.initializePage();

	document.getElementById("what-is-this-anchor")!.addEventListener("click", () => {
		const body_content = document.getElementById("description")!;
		if (DescriptionWin && DescriptionWin.closed == false)
			DescriptionWin.focus();
		else // see browser.js for def of left and top
			DescriptionWin = plainWindow("menubar=false,personalbar=false," +
				"toolbar=false,resizable=yes,scrollbars=yes," +
				"width=" + screen.availWidth * 0.85 +
				",height=" + screen.availHeight * 0.75 +
				",left=0," +
				"top=" + screen.availHeight * 0.2,
				{
					winTitle: "BeeChem Calculator:  Product Description",
					headerStyle: "h1 {font-size:115%;color:blue;margin-top:2em;}",
					body: body_content.innerHTML,
					closeButton: true
				}
			) as Window;
			// window.location = location.protocol + location.hostname +
			//		location.pathname;		});
	});

	document.getElementById("fine-print-click")!.addEventListener("click", () => {
		if (finePrintWin && finePrintWin.closed == false)
			finePrintWin.focus();
		else
			finePrintWin = plainWindow("menubar=false,personalbar=false," +
				"toolbar=false,resizable=yes,scrollbars=yes,width=" +
				screen.availWidth * 0.7 + ",height=" +
				screen.availHeight * 0.9 + ",left=" +
				screen.availWidth * 0.25 + ",top=0",
				{
					winTitle: "The Fine Print",
					headerStyle: "h1 {font-size:115%;color:blue;}",
					body: document.getElementById("fineprint")!.innerHTML,
					closeButton: true
				}
			) as Window;
	//	location = location.protocol + location.hostname +
	//			location.pathname;
	});


/*	function write_requirements(): void {
		document.getElementById("mainmenu-page")!.style.display = "none";
		document.getElementById("requirements-page")!.style.display = "block";
	} */
}