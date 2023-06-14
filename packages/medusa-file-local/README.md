# Local file storage

Store uploaded files to your Medusa backend locally.

> Not suited for production environments

[Plugin Documentation](https://docs.medusajs.com/plugins/file-service/local) | [Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Store product images locally

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

```bash
npm install @medusajs/file-local
```

2 \. In `medusa-config.js` add the following at the end of the `plugins` array:

```js
const plugins = [
  // ...
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: 'uploads/images', // optional
      backend_url: 'http://localhost:9000' // optional
    }
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

