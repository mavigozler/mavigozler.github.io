import express from 'express';
import { readdir } from 'fs/promises';
import { SERVER_CONFIG, PORT } from "./updateFileListing.js";
const app = express();
const getDirListing = (config) => (_req, res) => {
    readdir(config.staticRoot)
        .then((files) => {
        const filtered = files.filter(config.filesFilter);
        res.json(filtered);
    }).catch((err) => {
        res.status(500).send(`Failed to list files\nError: ${err}`);
    });
};
app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Allow requests from your web page's origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Add allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Add allowed headers
    next();
});
for (const config of SERVER_CONFIG) {
    console.log(`setting up '${config.path}'`);
    app.get(config.path, getDirListing(config));
    app.use(config.path, express.static(config.staticRoot));
}
app.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}`));
//# sourceMappingURL=filelisting.js.map