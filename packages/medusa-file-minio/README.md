# MinIO

Store uploaded files to your Medusa backend on MinIO.

[Plugin Documentation](https://docs.medusajs.com/plugins/file-service/minio) | [Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Store product images on MinIO
- Support for importing and exporting data through CSV files, such as Products or Prices.
- Support for both private and public buckets.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [MinIO](https://docs.min.io/minio/baremetal/quickstart/quickstart.html)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-file-minio
  ```

2\. Set the following environment variables in `.env`:

  ```bash
  MINIO_ENDPOINT=<ENDPOINT>
  MINIO_BUCKET=<BUCKET>
  MINIO_ACCESS_KEY=<ACCESS_KEY>
  MINIO_SECRET_KEY=<SECRET_KEY>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    {
      resolve: `medusa-file-minio`,
      options: {
          endpoint: process.env.MINIO_ENDPOINT,
          bucket: process.env.MINIO_BUCKET,
          access_key_id: process.env.MINIO_ACCESS_KEY,
          secret_access_key: process.env.MINIO_SECRET_KEY,
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

- [MinIO Plugin Documentation](https://docs.medusajs.com/plugins/file-service/minio)