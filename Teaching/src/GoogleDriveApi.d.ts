
type PermissionRoles = "owner" | "organizer" | "fileOrganizer" | "writer" | "commenter" | "reader";

export interface IGoogleDriveUser {  // all properties readonly
	displayName: string; 
	kind: "drive#user"; // kind of resource
	me: boolean; // is requesting user?
	permissionId: string;  // user's ID as visible in Permission resources
	emailAddress: string;
	photoLink: string;  // A link to the user's profile photo, if available
}

export interface IGoogleDrivePermission {
	permissionDetails:{ // [R] Details of whether the permissions on this item are inherited or directly on this item.
		permissionType: "file" | "member", 
		inheritedFrom: string; // The ID of the item from which this permission is inherited; only shared drives
		role: PermissionRoles;
		inherited: boolean  // Whether this permission is inherited.
	}[];
	teamDrivePermissionDetails: {  //  THIS ITEM IS DEPRECATED!!
		teamDrivePermissionType: string,
      inheritedFrom: string,
      role: string,
      inherited: boolean
   }[];
	id: string;  // [R] The ID of this permission
	displayName: string; // [R] The "pretty" name of the value of the permission
		// this will correspond to a type: user, group, domain or anyone (no display name present)
	type: "user" | "group" | "domain" | "anyone";
	kind: "drive#permission"; // [R] kind of resource
	photoLink: string; // [R] A link to the user's profile photo, if available
	emailAddress: string; // The email address of the user or group to which this permission refers
	role: PermissionRoles;
	allowFileDiscovery: boolean; // allows the file to be discovered through search; only for domain and anyone type
	domain: string; // domain to which this permission refers
	expirationTime: string; // time at which this permission will expire (RFC 3339 date-time)
	deleted: boolean; // [R] Whether the account associated with this permission has been deleted; only for user or group
	view: "published" | "metadata";
	pendingOwner: boolean; // Whether the account associated with this permission is a pending owner
	inheritedPermissionsDisabled: boolean; // When true, only organizers, owners, and users with permissions added directly on the item can access it.
	
	/* methods
	create:  POST https://www.googleapis.com/drive/v3/files/{fileId}/permissions
	   fileId: file or shared drive ID
	   ? emailMesage=[string]  - message to include in notification email
	     moveToNewOwnersRoot=[boolean]  parameter will only take effect if item not in shared drive & request attempting to transfer the ownership of the item. If set to true, the item will be moved to the new owner's My Drive root folder and all prior parents removed. If set to false, parents are not changed.
	     sendNotificationEmail=[boolean]  Whether to send a notification email when sharing to users or groups. 
	     supportsAllDrives=[boolean]   Whether the requesting application supports both My Drives and shared drives.
	     transferOwnership=[boolean]  Whether to transfer ownership to specified user, downgrade current owner to a writer. This parameter is required as an acknowledgement of the side effect.
	     useDomainAdminAccess=[boolean]  issue request as a domain administrator; if set to true, then the requester will be granted access if the file ID parameter refers to a shared drive and the requester is an administrator of the domain to which the shared drive belongs.
	     enforceExpansiveAccess=[boolean]   Whether the request should enforce expansive access rules
	         request body: instance of Permission
	         response body: newly created instance of Permission
	delete: DELETE https://www.googleapis.com/drive/v3/files/{fileId}/permissions/{permissionId}
		need fileId and permissionId
		? supportsAllDrives=[boolean]   Whether the requesting application supports both My Drives and shared drives.
		  useDomainAdminAccess=[boolean]   Issue the request as a domain administrator; if set to true, then the requester will be granted access if the file ID parameter refers to a shared drive and the requester is an administrator of the domain to which the shared drive belongs.
		  enforceExpansiveAccess=[boolean]  Whether the request should enforce expansive access rules.
				Request body - The request body must be empty
				Response body - If successful, the response body is an empty JSON object.
	get:  GET https://www.googleapis.com/drive/v3/files/{fileId}/permissions/{permissionId}
		? supportsAllDrives=[boolean]    Whether the requesting application supports both My Drives and shared drives.
		  useDomainAdminAccess=[boolean]  Issue the request as a domain administrator; if set to true, then the requester will be granted access if the file ID parameter refers to a shared drive and the requester is an administrator of the domain to which the shared drive belongs.
				Request body - request body must be empty.
				Response body - if successful, the response body contains an instance of Permission.
	list:  GET https://www.googleapis.com/drive/v3/files/{fileId}/permissions
		? pageSize=[integer]   maximum number of permissions to return per page. When not set for files in a shared drive, at most 100 results will be returned. When not set for files that are not in a shared drive, the entire list will be returned.
		  pageToken=[string]  token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response.
		  supportsAllDrives=[boolean    Whether the requesting application supports both My Drives and shared drives.
		  useDomainAdminAccess=[boolean]    Issue the request as a domain administrator; if set to true, then the requester will be granted access if the file ID parameter refers to a shared drive and the requester is an administrator of the domain to which the shared drive belongs.
		  includePermissionsForView=[string]  Specifies which additional view's permissions to include in the response. Only 'published' is supported.
				Request body -  The request body must be empty.
				Response body  - A list of permissions for a file.
	update: PATCH https://www.googleapis.com/drive/v3/files/{fileId}/permissions/{permissionId}
		? removeExpiration=[boolean]    Whether to remove the expiration date.
		  supportsAllDrives=[boolean]   Whether the requesting application supports both My Drives and shared drives.
		  transferOwnership=[boolean]   Whether to transfer ownership to the specified user and downgrade the current owner to a writer. This parameter is required as an acknowledgement of the side effect.
		  useDomainAdminAccess=[boolean]   Issue the request as a domain administrator; if set to true, then the requester will be granted access if the file ID parameter refers to a shared drive and the requester is an administrator of the domain to which the shared drive belongs.
		  enforceExpansiveAccess=[boolean]   Whether the request should enforce expansive access rules.
				Request body -  The request body contains an instance of Permission.
				Response body - If successful, the response body contains an instance of Permission.
	*/
}

export interface IContentRestriction {
	readOnly: boolean;  // Whether the content of the file is read-only.
  	reason: string; // Reason for why the content of the file is restricted; cannot be set unless readOnly=true
	type: "globalContentRestriction";
	restrictingUser: IGoogleDriveUser; // [R]  user who set content restriction
	restrictionTime: string; // [R]  The time at which the content restriction was set (formatted RFC 3339 timestamp)
	ownerRestricted: boolean; //  Whether the content restriction can only be modified or removed by a user who owns the file
	systemRestricted: boolean; // [R] Whether the content restriction was applied by the system, for example due to an esignature
}

export interface IDriveItemLabelField {
	dateString: string[]; // Only present if valueType is dateString. RFC 3339 formatted date: YYYY-MM-DD.
	integer: string[];  // Only present if valueType is integer.
	selection: string[]; // Only present if valueType is selection
	text: string[];  // Only present if valueType is text.
	user: IGoogleDriveUser[]; // Only present if valueType is user
	kind: "drive#labelField";
	id: string;  // The identifier of this label field.
	valueType: "dateString" | "integer" | "selection" | "text" | "user"; 
}

export interface IDriveItemLabel {
	fields: {  [key: string]: IDriveItemLabelField; };
		// map (key: string, value: object (Field))  --  A map of the fields on the label, keyed by the field's ID.
	id: string;  // ID of the label
	revisionId: string;  // The revision ID of the label.
	kind: "drive#label";
}

export interface IDriveDownloadRestrictionsMetadata {
	itemDownloadRestriction: IDriveDownloadRestrictions;
	effectiveDownloadRestrictionWithContext: IDriveDownloadRestrictions;
}

export interface IDriveDownloadRestrictions {
	restrictedForReaders: boolean;
	restrictedForWriters: boolean;
		/* methods: https://developers.google.com/workspace/drive/api/reference/rest/v3/files#File.DownloadRestrictionsMetadata
	copy:  POST https://www.googleapis.com/drive/v3/files/{fileId}/copy
	   fileId: file or shared drive ID
	   ?  ignoreDefaultVisibility=[boolean]  Whether to ignore the domain's default visibility settings for the created file. Domain administrators can choose to make all uploaded files visible to the domain by default; this parameter bypasses that behavior for the request. Permissions are still inherited from parent folders.
			keepRevisionForever=[boolean]  Whether to set the 'keepForever' field in the new head revision. This is only applicable to files with binary content in Google Drive. Only 200 revisions for the file can be kept forever. If the limit is reached, try deleting pinned revisions.
			ocrLanguage=[string]    A language hint for OCR processing during image import (ISO 639-1 code).
			supportsAllDrives=[boolean]    Whether the requesting application supports both My Drives and shared drives.
			includePermissionsForView=[string]    Specifies which additional view's permissions to include in the response. Only 'published' is supported.
			includeLabels=[string]   A comma-separated list of IDs of labels to include in the labelInfo part of the response.
					Request body -  The request body contains an instance of File.
					Response body -  If successful, the response body contains an instance of File.
	create:  POST https://www.googleapis.com/upload/drive/v3/files (Upload URI for media uploads)
				POST https://www.googleapis.com/drive/v3/files  (metadata URI for metadata-only requests)

	delete: 
	download:
	emptyTrash:
	export:
	generateIds:
	get:  
	list:  
	listLabels: 
	modifyLabels:
	update: 
	watch:
	*/
}


export interface IGoogleDriveApiFile {  // [R] = readonly
	exportLinks: { [key:string]: string; };  // Links for exporting Docs Editors files to specific formats.
	parents: string[]; //  ID of the parent folder containing the file
	owners: IGoogleDriveUser[]; //[R]  The owner of this file
	permissions: IGoogleDrivePermission[]; // The full list of permissions for the file. This is only available if the requesting user can share the file.
	spaces: string[], // The list of spaces which contain the file. The currently supported values are 'drive', 'appDataFolder' and 'photos'.
	properties: { [key:string]: string; }; //map (key: string, value: value (Value format)) - 
	// A collection of arbitrary key-value pairs which are visible to all apps.
	// Entries with null values are cleared in update and copy requests.
  	appProperties: { [key:string]: string; }; // A collection of arbitrary key-value pairs which are private to the requesting app.
	// Entries with null values are cleared in update and copy requests.
	//  These properties can only be retrieved using an authenticated request. An authenticated request uses an access token obtained with an OAuth 2 client ID. You cannot use an API key to retrieve private properties.
	permissionIds: string[],  // files.list of permission IDs for users with access to this file.
	contentRestrictions: IContentRestriction[];  // Restrictions for accessing the content of the file. Only populated if such a restriction exists.
	kind: "drive#file";
	driveId: string; // ID of the shared drive the file resides in. Only populated for items in shared drives.
	fileExtension: string; // The final component of fullFileExtension. This is only available for files with binary content in Google Drive.
	copyRequiresWriterPermission: boolean; // Whether the options to copy, print, or download this file, should be disabled for readers and commenters.
	md5Checksum: string; //  The MD5 checksum for the content of the file. This is only applicable to files with binary content in Google Drive.
	contentHints: {  // Additional information about the content of the file. These fields are never populated in responses.
		indexableText: string; // Text to be indexed for the file to improve fullText queries. This is limited to 128KB in length and may contain HTML elements.
		thumbnail: { // A thumbnail for the file. This will only be used if Google Drive cannot generate a standard thumbnail.
			image: string;  // The thumbnail data encoded with URL-safe Base64 (RFC 4648 section 5).
			mimeType: string; // The MIME type of the thumbnail.
    	};
  	},
	writersCanShare: boolean; // Whether users with only writer permission can modify the file's permissions. Not populated for items in shared drives.
	viewedByMe: boolean; // Whether the file has been viewed by this user.
	mimeType: string; // The MIME type of the file.
	thumbnailLink: string;  // A short-lived link to the file's thumbnail, if available. Typically lasts on the order of hours. 
	iconLink: string;  // A static, unauthenticated link to the file's icon.
	shared: boolean;  // Whether the file has been shared.
	lastModifyingUser: IGoogleDriveUser; // The last user to modify the file. 
	headRevisionId: string;
	sharingUser: IGoogleDriveUser;
	webViewLink: string;
	webContentLink: string;
	size: string;
	viewersCanCopyContent: boolean;
	hasThumbnail: boolean;
	folderColorRgb: string;
	id: string;
	name: string;  // The name of the file.
	description: string; // A short description of the file.
	starred: boolean;  // Whether the user has starred the file.
	trashed: boolean; // Whether the file has been trashed, either explicitly or from a trashed parent folder. Only the owner may trash a file, and other users cannot see files in the owner's trash.
	explicitlyTrashed: boolean; // Whether the file has been explicitly trashed, as opposed to recursively trashed from a parent folder.
	createdTime: string;
	modifiedTime: string;
	modifiedByMeTime: string;
	viewedByMeTime: string;
	sharedWithMeTime: string;
	quotaBytesUsed: string;
	version: string;
	originalFilename: string;
	ownedByMe: boolean;
	fullFileExtension: string;
	isAppAuthorized: boolean;
	teamDriveId: string;
	capabilities: {
		canChangeViewersCanCopyContent: boolean;
		canMoveChildrenOutOfDrive: boolean;
		canReadDrive: boolean;
		canEdit: boolean;
		canCopy: boolean;
		canComment: boolean;
		canAddChildren: boolean;
		canDelete: boolean;
		canDownload: boolean;
		canListChildren: boolean;
		canRemoveChildren: boolean;
		canRename: boolean;
		canTrash: boolean;
		canReadRevisions: boolean;
		canReadTeamDrive: boolean;
		canMoveTeamDriveItem: boolean;
		canChangeCopyRequiresWriterPermission: boolean;
		canMoveItemIntoTeamDrive: boolean;
		canUntrash: boolean;
		canModifyContent: boolean;
		canMoveItemWithinTeamDrive: boolean;
		canMoveItemOutOfTeamDrive: boolean;
		canDeleteChildren: boolean;
		canMoveChildrenOutOfTeamDrive: boolean;
		canMoveChildrenWithinTeamDrive: boolean;
		canTrashChildren: boolean;
		canMoveItemOutOfDrive: boolean;
		canAddMyDriveParent: boolean;
		canRemoveMyDriveParent: boolean;
		canMoveItemWithinDrive: boolean;
		canShare: boolean;
		canMoveChildrenWithinDrive: boolean;
		canModifyContentRestriction: boolean;
		canAddFolderFromAnotherDrive: boolean;
		canChangeSecurityUpdateEnabled: boolean;
		canAcceptOwnership: boolean;
		canReadLabels: boolean;
		canModifyLabels: boolean;
		canModifyEditorContentRestriction: boolean;
		canModifyOwnerContentRestriction: boolean;
		canRemoveContentRestriction: boolean;
		canDisableInheritedPermissions: boolean;
		canEnableInheritedPermissions: boolean;
		canChangeItemDownloadRestriction: boolean
	},
	hasAugmentedPermissions: boolean;
	trashingUser: IGoogleDriveUser;
	thumbnailVersion: string;
	trashedTime: string;
	modifiedByMe: boolean;
	imageMediaMetadata: {
		flashUsed: boolean;
		meteringMode: string;
		sensor: string;
		exposureMode: string;
		colorSpace: string;
		whiteBalance: string;
		width: number,
		height: number,
		location: {
			latitude: number,
			longitude: number,
			altitude: number
		},
		rotation: number,
		time: string;
		cameraMake: string;
		cameraModel: string;
		exposureTime: number,
		aperture: number,
		focalLength: number,
		isoSpeed: number,
		exposureBias: number,
		maxApertureValue: number,
		subjectDistance: number,
		lens: string
	},
	videoMediaMetadata: {
		width: number,
		height: number,
		durationMillis: string
	},
	shortcutDetails: {
		targetId: string;
		targetMimeType: string;
		targetResourceKey: string
	},
	resourceKey: string;
	linkShareMetadata: {
		securityUpdateEligible: boolean;
		securityUpdateEnabled: boolean
	},
	labelInfo: { labels: IDriveItemLabel[]; };
	sha1Checksum: string;
	sha256Checksum: string;
	inheritedPermissionsDisabled: boolean;
	downloadRestrictions: IDriveDownloadRestrictionsMetadata;
}