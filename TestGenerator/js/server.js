import express from "express";
import fs from "fs";
import fsAsync from "fs/promises";
import jsyaml from "js-yaml";
import path from "path";
import cors from "cors";
const configFileName = "../config/appConfig.yaml";
const full = path.resolve(configFileName);
const appBaseConfig = `
testbanks: []
`;
const app = express();
app.use(cors());
//app.use(express.json());
//const yamlPath = path.join(__dirname, '../data/questions.yaml');
app.get('/', async (req, res) => {
    switch (req.route) {
        case '/app-yaml':
            res.send('/app-yaml');
    }
});
// Initialization and Setup
// read in the YAML config file
let configInfo;
(async () => {
    if (fs.existsSync(configFileName) == false) // if no config file, create one
        await fsAsync.writeFile(configFileName, appBaseConfig, "utf8");
    configInfo = jsyaml.load(await fsAsync.readFile(configFileName, "utf8"));
})();
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
//# sourceMappingURL=server.js.map