/*****************************
 *  Get file listing of files to be public/shared on Google Drive & store it in repository
 *  Uses Google Drive API with OAuth2 to get listing
 *****************************/

//import { ref } from "process";

import { google } from "googleapis";

const gapiLibraries = "client", // should be ':'-separated list of libraries to load
	apiLoadTimeout = 5000,  // milliseconds for GAPI loading to occur
	CLIENT_ID = "949429110997-pveh14isubihlnri1pnjs0vvmtmham1v.apps.googleusercontent.com",
	SCOPES = "https://www.googleapis.com/auth/drive.file",
	API_KEY = "AIzaSyCcwNPZPNCbep7lSDHt9a8rHLgUg4jnAdU",
	DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";

let accessToken: string;

function getAccessToken(): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		try {
			google.accounts.oauth2.initTokenClient({
				client_id: CLIENT_ID,
				scope: SCOPES,
				callback: (tokenResponse: any) => {
					if (tokenResponse.access_token) {
						// Use the access token in your API requests
						resolve(tokenResponse.access_token);
					} else
						reject();
				},
			}).requestAccessToken();
		} catch (exc) {
			console.log(`Exception caught: ${exc}`);
		}
	});
}

function googleApiLoadClientGetList(GoogleDriveApi: any): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		GoogleDriveApi.client.load("drive", "v3").then(() => {
			(GoogleDriveApi.client as any).drive.files.list({
				pageSize: 10,
				fields: "files(id, name)",
			}).then((response: any) => {
				resolve(response.result.files)
				console.log("Files:", response.result.files);
			}).catch((err: unknown) => {
				reject(`Method 'gapi.client.drive.files.list()' call error` +
					`\nErr: ${err}`);
			});
		}).catch((err: unknown) => {
			reject(`Method 'gapi.client.load' call error` +
				`\nErr: ${err}`);
		});
	});
}

function gapiInit(GoogleDriveApi: any): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		GoogleDriveApi.load(gapiLibraries, {
			callback: () => {
				try {
					GoogleDriveApi.client.init({
						apiKey: API_KEY,
						discoveryDocs: [ DISCOVERY_DOC ],
						//clientId: CLIENT_ID,
						//scope: SCOPES
					}).then(() => {
						resolve();
					}).catch((err: unknown) => {
						if ((err as any).message)
							reject((err as any).message);
						else
							reject(err);
					});
				} catch (e) {
					reject(e);
				}
			},
			onerror: () => {
				console.error(`Google libraries '${gapiLibraries}' failed to load: parameter issue?`);
			},
			timeout: apiLoadTimeout,
			ontimeout: () => {
				console.error(`Google libraries '${gapiLibraries}' timeout error in loading`);
			}
		});
	});
}

function getDriveFilesList(GoogleDriveApi: any): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		try {
			gapiInit(GoogleDriveApi).then(() => {
					getAccessToken().then((token: string) => {
						accessToken = token;
						console.log('Access Token:', accessToken);
						googleApiLoadClientGetList(GoogleDriveApi).then((files) => {
							resolve(files);
						}).catch(err => {
							reject(err);
						})
					}).catch(err => {
						reject(`function 'getAccessToken()' call error` +
							`\nErr: ${err}`);
					});  // get the file IDs list from the local file

			}).catch(err => {
				reject(`Init of Google API: function 'gapiInit()' call error` +
					`\nErr: ${err}`);
			});
		} catch (err) {
			reject(`Error starting Promise--in 'try block\nErr: ${err}`);
		}
	});
}


function entry() {
	// Google Drive API loading, intialization, authentication
	getDriveFilesList(google).then((items: any) => {
		console.log(items);
	});
	// file list generation

}

entry();