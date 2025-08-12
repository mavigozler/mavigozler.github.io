import { google } from 'googleapis';
import path from 'path';
// Replace 'path/to/your/service-account-key.json' with the actual path
const KEYFILEPATH = path.join(__dirname, 'path/to/your/service-account-key.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly']; // Or other scopes as needed
function listFiles() {
    return new Promise((resolve, reject) => {
        const auth = new google.auth.GoogleAuth({
            keyFile: KEYFILEPATH,
            scopes: SCOPES,
        });
        const drive = google.drive({ version: 'v3', auth });
        try {
            drive.files.list({
                pageSize: 10,
                fields: 'nextPageToken, files(id, name)',
            }).then((res) => {
                const files = res.data.files;
                if (files && files.length) {
                    console.log('Files:');
                    files.forEach((file) => {
                        console.log(`${file.name} (${file.id})`);
                    });
                }
                else {
                    console.log('No files found.');
                }
                resolve();
            });
        }
        catch (err) {
            reject(`The API returned an error:\nErr: ${err}`);
        }
    });
}
listFiles();
//# sourceMappingURL=test.js.map