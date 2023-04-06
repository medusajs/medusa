# S3

Store uploaded files to your Medusa backend on S3.

[Plugin Documentation](https://docs.medusajs.com/plugins/file-service/s3) | [Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Store product images on S3
- Support for importing and exporting data through CSV files, such as Products or Prices.
- Support for Bucket Policies and User Permissions.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [S3](https://aws.amazon.com/s3)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-file-s3
  ```

2\. Set the following environment variables in `.env`:

  ```bash
  S3_URL=<YOUR_BUCKET_URL>
  S3_BUCKET=<YOUR_BUCKET_NAME>
  S3_REGION=<YOUR_BUCKET_REGION>
  S3_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID>
  S3_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    {
      resolve: `medusa-file-s3`,
      options: {
          s3_url: process.env.S3_URL,
          bucket: process.env.S3_BUCKET,
          region: process.env.S3_REGION,
          access_key_id: process.env.S3_ACCESS_KEY_ID,
          secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
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

- [S3 Plugin Documentation](https://docs.medusajs.com/plugins/file-service/s3)