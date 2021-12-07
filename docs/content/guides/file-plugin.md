---
title: Create a file plugin
---

# File Plugin

This guide will give an introduction about the File Service and steps required to create a custom file uploader plugin for Medusa. It build on article about [creating custom plugins](https://docs.medusajs.com/guides/plugins). 

As an example, we will create a File plugin that uploads the product images to Cloudinary. 

## The File API

The file api is used to upload and manage product images used in Medusa. 

## Implementing the File Service

The File Service is an built in interface in Medusa Core. It has two methods which must be overidden by our custom implementation of the service: `upload` and `delete`.

As the names suggest, upload allows us to specify the logic for uploading the file/image to our service while delete is used for deleting the image.

Both of the methods must return an promise.
The upload method should return the url of uploaded image.
In case of any error uploading, both methods should reject the promise and return an appropriate error message.

Here is the implementation of the base file service that we will extend. 
```javascript
/**
 * Interface for file connectors
 * @interface
 */
class BaseFileService extends BaseService {
  constructor() {
    super()
  }

  upload() {
    throw Error("upload must be overridden by the child class")
  }

  delete() {
    throw Error("delete must be overridden by the child class")
  }
}

export default BaseFileService
```

See the example below for detailed usage.

## Example

We will create an plugin for uploading product images to [Cloudinary](https://cloudinary.com/)

The first step is to create an account on Cloudinary and copy the credentials like given below. 

```
cloud_name: "xx"
api_key: "xx"
api_secret: "xx"

```

The first step in creating a plugin is to initialize the Node.js project:

```bash
npm init
```

This command will ask you to fill out your project's metadata, which will eventually be used when publishing the package to NPM. After this command completes, you are ready to start implementing the functionality.

Next up, we need to install cloudinary's Node.js SDK.

```bash
npm install cloudinary
```

### Implementation

To quickly get started with the implementation, we advise you to copy `/services/`, `/api/`, `/subscribers/` and the config files from the tutorial and add them in `/src`. As a result, you should have the following folder structure:

```js
.
├── src
│   ├── api
│   └── services
│   └── subscribers
├── .babelrc
├── .gitignore
├── medusa-config.js
├── README.md
└── package.json
```

We will create a new file `cloudinary.js` in the `services` directory.

```javascript
import fs from "fs";

import { v2 as cloudinary } from "cloudinary";
import { FileService } from "medusa-interfaces";

class CloudinaryService extends FileService {
	constructor({}, options) {
		super();

        // Initialize the Cloudinary sdk
		cloudinary.config({
            cloud_name: options.cloud_name,
            api_key: options.api_key,
            api_secret: options.api_secret,
            secure: options.secure,
        });
	}

	// File upload
	upload(file) {
		console.log("Starting image upload");
		return new Promise((resolve, reject) => {
            // upload_stream allows to upload a file stream
			var upload_stream = cloudinary.uploader.upload_stream(
				{},
				function (err, image) {
					if (err) {
                        // Reject and return an error if the file upload failed
						console.error(err);
						reject(err);
						return;
					}
                    // Return the url of image uploaded
					resolve({ url: image.url });
				}
			);
            // Create a file stream from path and forward it to our uploader
			fs.createReadStream(file.path).pipe(upload_stream);
		});
	}

	delete(file) {
		return new Promise((resolve, reject) => {
			// Pass the name of file to be deleted
			cloudinary.uploader.destroy(file, function (result) {
				resolve(result);
			});
		});
	}
}

export default CloudinaryService;
```

### Publishing

In order for your plugin to become a part of the Medusa plugin ecosystem, you need to publish it to NPM. Make sure that you've included the `package.json` file. NPM uses the details of this file to configure the publishing. Please include `medusa` and `medusa-plugin` and possibly more in the `keywords` field of the `package.json`.

```bash
{
	"name": "medusa-file-cloudinary",
	...
  "keywords": [
    "medusa",
    "medusa-file",
    "medusa-plugin"
  ],
  "description": "Cloudinary File Plugin for Medusa Commerce",
	...
}
```

Finally, you should add a README for the plugin, such that the community understands the purpose of the plugin and how to install it.


## Summary

As a result of following this guide, you should now be able to both implement a custom file plugin for your Medusa project.
