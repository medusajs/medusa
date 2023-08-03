# Azure storage

Store uploaded files to your Medusa backend on S3.

[Plugin Documentation](https://docs.medusajs.com/plugins/file-service/azure-storage) | [Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Store product images on Azure Storage
- Support for importing and exporting data through CSV files, such as Products or Prices.
- Support for Bucket Policies and User Permissions.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Azure Storage blob](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

```bash
npm install medusa-file-azure-storage
```

2\. Set the following environment variables in `.env`:

```bash
AZURE_STORAGE_CONNECTION_STRING=<YOUR_AZURE_STORAGE_CONNECTION_STRING>
AZURE_STORAGE_PUBLIC_CONTAINER_NAME=<YOUR_PUBLIC_CONTAINER>
AZURE_STORAGE_PROTECTED_CONTAINER_NAME=<YOUR_PROTECTED_CONTAINER>
```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

```js
const plugins = [
  // ...
  {
    resolve: `medusa-file-azure-storage`,
    options: {
      AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
      AZURE_STORAGE_PUBLIC_CONTAINER_NAME: process.env.AZURE_STORAGE_PUBLIC_CONTAINER_NAME,
      AZURE_STORAGE_PROTECTED_CONTAINER_NAME: process.env.AZURE_STORAGE_PROTECTED_CONTAINER_NAME
    },
  },
]
```

---

## Test the Plugin

1\. Run the following command in the directory of the Medusa backend to run the backend:

```bash
npm run start
```

2\. Upload an image for a product using the admin dashboard or using [the Admin APIs](https://docs.medusajs.com/api/admin#tag/Upload).

---

## Additional Resources

- [Azure storage Plugin Documentation](https://docs.medusajs.com/plugins/file-service/auzre-storage)
