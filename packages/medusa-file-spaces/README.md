# DigitalOcean Spaces

Store uploaded files to your Medusa backend on Spaces.

[Plugin Documentation](https://docs.medusajs.com/plugins/file-service/spaces) | [Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Store product images on DigitalOcean Spaces
- Support for importing and exporting data through CSV files, such as Products or Prices.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-file-spaces
  ```

2\. Set the following environment variables in `.env`:

  ```bash
  SPACE_URL=<YOUR_SPACE_URL>
  SPACE_BUCKET=<YOUR_SPACE_NAME>
  SPACE_ENDPOINT=<YOUR_SPACE_ENDPOINT>
  SPACE_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID>
  SPACE_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    {
      resolve: `medusa-file-spaces`,
      options: {
          spaces_url: process.env.SPACE_URL,
          bucket: process.env.SPACE_BUCKET,
          endpoint: process.env.SPACE_ENDPOINT,
          access_key_id: process.env.SPACE_ACCESS_KEY_ID,
          secret_access_key: process.env.SPACE_SECRET_ACCESS_KEY,
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

- [Spaces Plugin Documentation](https://docs.medusajs.com/plugins/file-service/spaces)