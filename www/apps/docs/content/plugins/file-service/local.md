---
description: 'Learn how to install the local file service to upload images and assets locally on your Medusa backend.'
addHowToData: true
---

# Local File Storage

This document will guide you through installing the local file storage plugin on your Medusa backend.

## Overview

To upload and manage file assets in Medusa, you need a file service plugin responsible for hosting the files. Without a file service plugin, you will face issues while working with Medusa, such as when uploading images for products.

Medusa provides three different options to handle your file storage. The local file storage plugin makes it easy to upload file assets locally during development.

:::note

For production, it's recommended to use a file service plugin that hosts your images on a third-party service. This file service doesn't handle advanced features such as private uploads, which means you can't use it for functionalities like import or export products. Check [the file service plugins](./index.mdx) for available other options to use.

:::

---

## Prerequisites

A Medusa backend is required to be set up before following along with this document. You can follow the [quickstart guide](../../create-medusa-app.mdx) to get started in minutes.

---

## Install Plugin

In the directory of your Medusa backend, run the following command to install the local file service plugin:

```bash npm2yarn
npm install @medusajs/file-local
```

Then, configure your `medusa-config.js` to include the plugin with the required options:

```js title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: `@medusajs/file-local`,
    options: {
      // optional
    },
  },
]
```

:::warning

If you have multiple storage plugins configured, the last plugin declared in the `medusa-config.js` file will be used.

:::

### Options

You can pass the plugin the following options:

- `upload_dir`: a string indicating the relative path to upload the files to. By default, it's `uploads/images`.
- `backend_url`: a string indicating the URL of your backend. This is helpful if you deploy your backend or change the port used. By default, it's `http://localhost:9000`.

---

## Test the Plugin

Run your Medusa backend alongside the [Medusa Admin](../../admin/quickstart.mdx) to try out your new file service. Upon editing or creating products, you can now upload thumbnails and images, that are stored locally in your backend.

The files will be stored under the `upload_dir` specified in the plugin options (if no option is specified, they'll be stored in the `uploads/images` directory by default.)

---

## Next.js Starter Template Configuration

If you’re using a [Next.js Starter Template](../../starters/nextjs-medusa-starter.mdx), you need to add an additional configuration that adds the backend's domain name into the configured images domain names. This is because all URLs of product images will be from the Medusa backend.

If this configuration is not added, you’ll receive the error ["next/image Un-configured Host”](https://nextjs.org/docs/messages/next-image-unconfigured-host).

In `next.config.js` add the following option in the exported object:

```js title="next.config.js"
const { withStoreConfig } = require("./store-config")

// ...

module.exports = withStoreConfig({
  // ...
 images: {
    remotePatterns: [
      // ...
      {
        protocol: "http", // or https
        hostname:"<BACKEND_URL>",
      },
      // ...
    ],
  },
})
```

Where `<BACKEND_URL>` is the URL of your backend. If you're running the backend locally, the value would be `localhost`.

---

## See Also

- Check out [more plugins](../overview.mdx) you can add to your store.
