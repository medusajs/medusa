---
description: 'Learn how to integrate Spaces with the Medusa backend. Learn how to install and configure the Spaces plugin on the Medusa backend.'
addHowToData: true
---

# Spaces

In this document, you’ll learn how to install the [Spaces plugin](https://github.com/medusajs/medusa/tree/master/packages/medusa-file-spaces) on your Medusa backend and use it for storage.

## Overview

To manage images in Medusa, you need a file service plugin responsible for hosting the images. Without a file service plugin, you will face issues while working with Medusa, such as when uploading images for products.

Medusa provides three different options to handle your file storage. This document focuses on using [Spaces](https://www.digitalocean.com/products/spaces) to store images and files uploaded to the Medusa backend.

---

## Prerequisites

### Medusa Backend

A Medusa backend is required to be set up before following along with this document. You can follow the [quickstart guide](../../development/backend/install.mdx) to get started in minutes.

### Required Accounts

You need to [create a DigitalOcean account](https://cloud.digitalocean.com/registrations/new) to follow along with this documentation. A credit card is required during registration.

---

## Create DigitalOcean Spaces Bucket

On your DigitalOcean dashboard:

1. Click on the Create button at the top right.
2. Choose "Spaces Object Storage" from the dropdown.
3. In the Create a Spaces Bucket form:
   1. You can choose any of the datacenter regions listed.
   2. In the Finalize and Create section, enter a name for the field “Choose a unique Spaces Bucket name”. You’ll use this name later in the integration with Medusa.
   3. For the "Select a project" input, select the project you want to add the new Spaces Bucket to.
4. Once you’re done, click on the "Create a Spaces Bucket" button.

Your Spaces Bucket is then created and you're redirected to its page.

---

## Create Space Access Keys

1. Choose API from the bottom of the sidebar.
2. This opens the Application & API page. Choose the "Spaces Keys" tab.
3. Click on the "Generate New Key" button.
4. In the pop-up, enter a name for the access key and click Create Access Key.
5. Then, in the table, you'll find a new key added where you can copy the secret and access keys.

:::warning

The secret access key won't be shown again after you leave the page. Make sure to copy it when you see it or you’ll need to re-generate a new one.

:::

---

## Install the Spaces Plugin

In the directory of your Medusa backend, run the following command to install the Spaces plugin:

```bash npm2yarn
npm install medusa-file-spaces
```

Then, add the following environment variables:

```bash
SPACE_URL=<YOUR_SPACE_URL>
SPACE_BUCKET=<YOUR_SPACE_NAME>
SPACE_REGION=<YOUR_SPACE_REGION>
SPACE_ENDPOINT=<YOUR_SPACE_ENDPOINT>
SPACE_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID>
SPACE_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
```

Where:

1. `<YOUR_SPACE_URL>` is either the Origin Endpoint or the CDN endpoint of your Spaces Object Storage bucket.
2. `<YOUR_SPACE_NAME>` is the name of your Spaces Object Storage bucket.
3. `<YOUR_SPACE_REGION>` is the region your Spaces Object Storage bucket is in. If you're unsure, you can find it in the Origin Endpoint whose format is `https://<bucket-name>.<region>.digitaloceanspaces.com`. For example, `nyc3`.
4. `<YOUR_SPACE_ENDPOINT>` is of the format `https://<region>.digitaloceanspaces.com`. For example, `https://nyc3.digitaloceanspaces.com`.
5. `<YOUR_ACCESS_KEY_ID>` and `<YOUR_SECRET_ACCESS_KEY>` are the keys you created in the previous section.

Finally, in `medusa-config.js` add a new item to the `plugins` array:

```jsx title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: `medusa-file-spaces`,
    options: {
        spaces_url: process.env.SPACE_URL,
        bucket: process.env.SPACE_BUCKET,
        region: process.env.SPACE_REGION,
        endpoint: process.env.SPACE_ENDPOINT,
        access_key_id: process.env.SPACE_ACCESS_KEY_ID,
        secret_access_key: process.env.SPACE_SECRET_ACCESS_KEY,
    },
  },
]
```

:::warning

If you have multiple storage plugins configured, the last plugin declared in the `medusa-config.js` file will be used.

:::

### Optional Configuration

The plugin also accepts the following optional configuration:

- `downloadUrlDuration`: A number indicating the expiry time in seconds of presigned download URLs.

---

## Test the Space Plugin

Run your Medusa backend with the following command:

```bash npm2yarn
npx medusa develop
```

Then, you can either test the plugin using the [REST APIs](https://docs.medusajs.com/api/store) or using the [Medusa Admin](../../admin/quickstart.mdx).

On the Medusa Admin, create a new product and, in the Images section, upload an image then click Save. If the integration was successful, the product image will be uploaded successfully.

You can also check that the image was uploaded on the Space’s page.

---

## Next.js Starter Template Configuration

If you’re using a [Next.js Starter Template](../../starters/nextjs-medusa-starter.mdx), you need to add an additional configuration that adds the Space’s domain name into the configured images’ domain names. This is because all URLs of product images will be from the Space.

If this configuration is not added, you’ll receive the error ["next/image Un-configured Host”](https://nextjs.org/docs/messages/next-image-unconfigured-host).

In `next.config.js` add the following option in the exported object:

```jsx title="next.config.js"
const { withStoreConfig } = require("./store-config")

// ...

module.exports = withStoreConfig({
  // ...
 images: {
    remotePatterns: [
      // ...
      {
        protocol: "https",
        hostname:"<YOUR_SPACE_URL>",
      },
      // ...
    ],
  },
})
```

Where `<YOUR_SPACE_URL>` is the domain name for your Space Origin Endpoint or CDN endpoint. It's of the format `<bucket-name>.<region>.digitaloceanspaces.com` or `<bucket-name>.<region>.cdn.digitaloceanspaces.com`

---

## See Also

- Check out [more plugins](../overview.mdx) you can add to your store
- [Deploy the Medusa backend on DigitalOcean](../../deployments/server/deploying-on-digital-ocean.md)
- Install the [Next.js Starter Template](../../starters/nextjs-medusa-starter.mdx)
