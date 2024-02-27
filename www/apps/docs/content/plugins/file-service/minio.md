---
description: 'Learn how to integrate MinIO with the Medusa backend. Learn how to install the MinIO plugin on the Medusa backend and configure it.'
addHowToData: true
---

# MinIO

This document will guide you through installing the MinIO file service plugin on your Medusa backend.

## Overview

To upload and manage file assets in Medusa, you need a file service plugin responsible for hosting the files. Without a file service plugin, you will face issues while working with Medusa, such as when uploading images for products.

Medusa provides three different options to handle your file storage. This document will focus on setting up [MinIO](https://min.io) on your local machine and connecting Medusa to it.

---

## Prerequisites

A Medusa backend is required to be set up before following along with this document. You can follow the [quickstart guide](../../development/backend/install.mdx) to get started in minutes.

---

## Set up MinIO

You can follow [MinIO’s guide to install it](https://docs.min.io/minio/baremetal/quickstart/quickstart.html) on your machine based on your operating system.

After installing it, make sure MinIO is always running when your Medusa backend is running. It’s recommended that you set up an alias to quickly start the MinIO backend as instructed at the end of the installation guides in MinIO.

### Change MinIO port

In MinIO’s documentation, port `9000` is used for the address of the MinIO backend. However, this collides with the port for the Medusa backend. You must change the port for MinIO to another one (for example, port `9001`).

After setting up and installing MinIO on your system/sub-system, you can run the following command to change MinIO port to `9001` (or any other available port) instead of `9000` to avoid the port clash:

```bash
minio server ~/minio --console-address :9090 --address :9001
```

### Create a MinIO bucket

After installing MinIO and logging into the Console, you can create a bucket that will store the files of your Medusa backend by following these steps:

1. Go to the Buckets page from the sidebar.
2. Click on the “Create Bucket” button.
3. For the Bucket Name field, enter a name for the bucket. By MinIO’s requirement, the name can only consist of lower case characters, numbers, dots (`.`), and hyphens (`-`).
4. Click on the Create Bucket button.
5. On the bucket's page, click on the edit icon next to Access Policy.
6. In the pop-up that opens, change the selected value to “public” and click Set.

:::warning

Changing the Access Policy to public will allow anyone to access your bucket. Avoid storing sensitive data in the bucket.

:::

### Generate Access Keys

To generate access keys for your plugin:

1. From the sidebar of your MinIO console, click on Access Keys
2. Click on the "Create access key" button
3. This will open a new form with randomly-generated keys. Click on the Create button.
4. A pop-up will then show the value for your Access Key and Secret Key. Copy them to use in the next section.

:::warning

You will not be able to access the Secret Key after closing the pop-up. So, make sure to store it somewhere to use later when configuring the plugin.

:::

---

## Plugin Installation

In the directory of your Medusa backend, run the following command to install the MinIO plugin:

```bash npm2yarn
npm install medusa-file-minio
```

Then, add the following environment variables in `.env`:

```bash
MINIO_ENDPOINT=<ENDPOINT>
MINIO_BUCKET=<BUCKET>
MINIO_ACCESS_KEY=<ACCESS_KEY>
MINIO_SECRET_KEY=<SECRET_KEY>
```

Where `<ENDPOINT>` is the URL of your MinIO backend, `<BUCKET>` is the name of the bucket you created earlier, and `<ACCESS_KEY>` and `<SECRET_KEY>` are the keys you generated in the previous section.

Finally, configure your `medusa-config.js` to include the plugin with the required options:

```js title="medusa-config.js"
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

:::warning

If you have multiple storage plugins configured, the last plugin declared in the `medusa-config.js` file will be used.

:::

---

## Test it Out

Run your Medusa backend alongside the [Medusa Admin](../../admin/quickstart.mdx) to try out your new file service. Upon editing or creating products, you can now upload thumbnails and images, that are stored in a MinIO backend.

![Image Uploaded on Admin](https://res.cloudinary.com/dza7lstvk/image/upload/v1668000429/Medusa%20Docs/MinIO/alabX2i_dzg2mh.png)

---

## Private Buckets

### Handle Exports

Medusa provides export functionalities including exporting products and orders. For exports to work, you must [set up a private bucket](#create-private-bucket).

### Handle Imports

Medusa provides import functionalities including importing products. For imports to work, you must [set the private bucket](#add-private-bucket-environment-variable) to be the same as the public bucket.

### Create Private Bucket

To create a private bucket, follow along the [steps mentioned earlier](#create-a-minio-bucket), but keep Access Policy set to private.

### Add Private Bucket Environment Variable

Add the following environment variable on your Medusa backend:

```bash
MINIO_PRIVATE_BUCKET=exports
```

Then, add a new option to the plugin’s options in `medusa-config.js`:

```jsx title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: `medusa-file-minio`,
    options: {
        // ...
        private_bucket: process.env.MINIO_PRIVATE_BUCKET,
    },
  },
]
```

### Use Different Secret and Access Keys

If you only add the `private_bucket` option, the same secret and access keys that you used for the public bucket will be used to access the private bucket.

If you want to use different keys, set the following environment variables:

```bash
MINIO_PRIVATE_ACCESS_KEY=<YOUR_PRIVATE_ACCESS_KEY>
MINIO_PRIVATE_SECRET_KEY=<YOUR_PRIVATE_SECRET_KEY>
```

Where `<YOUR_PRIVATE_ACCESS_KEY>` and `<YOUR_PRIVATE_SECRET_KEY>` are the access key and secret access key that have access to the private MinIO bucket.

Then, add two new options to the plugin’s options in `medusa-config.js`:

```jsx title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: `medusa-file-minio`,
    options: {
        // ...
        private_access_key_id: 
          process.env.MINIO_PRIVATE_ACCESS_KEY,
        private_secret_access_key: 
          process.env.MINIO_PRIVATE_SECRET_KEY,
    },
  },
]
```

---

## Next.js Starter Template Configuration

If you’re using a [Next.js Starter Template](../../starters/nextjs-medusa-starter.mdx), you need to add an additional configuration that adds the MinIO domain name into the configured images domain names. This is because all URLs of product images will be from the MinIO backend.

If this configuration is not added, you’ll receive the error ["next/image Un-configured Host”](https://nextjs.org/docs/messages/next-image-unconfigured-host).

In `next.config.js` add the following option in the exported object:

```jsx title="next.config.js"
const { withStoreConfig } = require("./store-config")

// ...

module.exports = withStoreConfig({
  // ...
  images: {
    remotePatterns: [
      // ...
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      // ...
    ],
  },

})
```

Where `127.0.0.1` is the domain of your local MinIO backend.

---

## See Also

- Check out [more plugins](../overview.mdx) you can add to your store.
