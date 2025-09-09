import type { AppConfig } from "./types/testgen.js";
import express from "express";
import fs from "fs";
import fsAsync from "fs/promises";
import jsyaml from "js-yaml";
import path from "path";
import cors from "cors";

const configFileName = "../config/appConfig.yaml";

const appBaseConfig = `
---
routes:
  GET:	
  - req: "/"
    res: "/"
  - req: "/testbanks"
    res: "$$testbanks"
  POST:
  - req: "/"
    res: Not allowed
  - req: "/testbanks"
    res: "$$addTestbanks"
testbanks:
`;

const app = express();
app.use(cors());
//app.use(express.json());

//const yamlPath = path.join(__dirname, '../data/questions.yaml');

function initRoutes(app: any, configPath: string) {
	// Initialization and Setup
	// read in the YAML config file
	let configInfo: AppConfig;
	(async () => {
		if (fs.existsSync(configPath) == false) 	// if no config file, create one
			await fsAsync.writeFile(configPath, appBaseConfig, "utf8");
		configInfo = jsyaml.load(await fsAsync.readFile(configPath, "utf8"));
		configInfo.routes.forEach(route => {
			
		});
	})();
	app.listen(5000, () => console.log('Server running on http://localhost:5000'));
}

module.exports = initRoutes;