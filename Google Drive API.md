# Google Drive API

## Setting up for OAuth 2.0 Authentication

To obtain a Google OAuth 2.0 access token programmatically in a browser page script, you typically use the [Google Identity Services (GIS) JavaScript SDK](https://developers.google.com/identity/oauth2/web/guides/use-token-model) for OAuth 2.0. Here’s a high-level process:

---

### 1. **Create a Google Cloud Project and OAuth 2.0 Client ID**

- Go to [Google Cloud Console](https://console.cloud.google.com/).
- Create a project (if you don’t have one).
- Enable the Google Drive API.
- Create OAuth 2.0 credentials (Client ID) for a Web application.
- Set your authorized JavaScript origins and redirect URIs.

---

### 2. **Add the Google Identity Services Script to Your HTML**

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

---

### 3. **Request an Access Token in JavaScript**

Here’s a minimal example using the token model:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
  <button id="authorize_button">Authorize</button>
  <script>
    const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
    const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

    let tokenClient;

    document.getElementById('authorize_button').onclick = () => {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse.access_token) {
            // Use the access token in your API requests
            console.log('Access Token:', tokenResponse.access_token);
          }
        },
      });
      tokenClient.requestAccessToken();
    };
  </script>
</body>
</html>
```

- Replace `YOUR_CLIENT_ID.apps.googleusercontent.com` with your actual client ID.
- Adjust `SCOPES` as needed for your use case.

---

### 4. **Use the Access Token**

Use the access token in your API requests as you did in your `.rest` file.

---

**Summary:**  

- Register your app and get a client ID.
- Use the Google Identity Services JS SDK.
- Call `requestAccessToken()` to get a token in the browser.
- Use the token in your API requests.

For more details, see:  
[Google Identity Services: Use OAuth 2.0 to Access Google APIs](https://developers.google.com/identity/oauth2/web/guides/use-token-model)

## The Drive REST API Requests and Responses

Google also provides a Drive API REST Client Library for making requests and processing responses.

For the browser, add

```html
<script src="https://apis.google.com/js/api.js"></script>
```

If using Node.js:

1. Install the package 'googleapis' with a manager
2. Use the following Node script

```js
import { google } from 'googleapis';
const drive = google.drive('v3');
```

Now use methods like `drive.files.list`, `drive.files.get`

Check [NPM site](https://www.npmjs.com/package/googleapis) for API
