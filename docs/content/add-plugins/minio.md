# MinIO

This document will guide you through installing the MinIO file service plugin on your Medusa server.

## Overview

To manage images in Medusa, you need a file service plugin responsible for hosting. Without a file service plugin, you will face issues while working with Medusa, such as when uploading images for products.

Medusa provides three different options to handle your file storage. This document will focus on setting up [MinIO](https://min.io) on your local machine and connecting Medusa to it.

## Prerequisites

A Medusa server is required to be set up before following along with this document. You can follow the [quickstart guide](../quickstart/quick-start.md) to get started in minutes.

## Set up MinIO

You can follow [MinIO’s guide to install it](https://docs.min.io/minio/baremetal/quickstart/quickstart.html) on your machine based on your operating system.

After installing it, make sure MinIO is always running when your Medusa server is running. It’s recommended that you set up an alias to quickly start the MinIO server as instructed at the end of the installation guides in MinIO.

:::warning

In MinIO’s documentation, port `9000` is used for the address of the MinIO server. However, this collides with the port for the Medusa server. You must change the port for MinIO to another one (for example, port `9001`).

:::

### Create a MinIO bucket

After installing MinIO and logging into the Console, click on “Create Bucket” to create a new bucket that will store the files of your Medusa server.

![Create Bucket](https://i.imgur.com/PwLldKt.png)

Then, in the form, enter a name for the bucket and click on Create Bucket. By MinIO’s requirement, the name can only consist of lower case characters, numbers, dots (`.`), and hyphens (`-`).

![Bucket Info](https://i.imgur.com/UB477rl.png)

After creating the bucket, click on the cog icon at the top right to configure the bucket.

![Configure Bucket](https://i.imgur.com/0pB8RIM.png)

Then, click on the edit icon next to Access Policy. This will open a pop-up.

![Access Policy](https://i.imgur.com/qo3QQz4.png)

In the pop-up, change the selected value to “public” and click Set.

:::warning

Changing the Access Policy to public will allow anyone to access your bucket. Avoid storing sensitive data in the bucket.

:::

### Generate Access Keys

From the sidebar of your MinIO console, click on Identity then Service Accounts.

![Service Accounts Sidebar](https://i.imgur.com/CkTbrEc.png)

Then, click on Create Service Account.

![Create Service Account](https://i.imgur.com/a000HQf.png)

This will generate a random Access Key and Secret Key for you.

![Generated Keys](https://i.imgur.com/my4c7zU.png)

Click on Create. A pop-up will then show the value for your Access Key and Secret Key. Copy them to use in the next section.

:::caution

You will not be able to access the Secret Key after closing the pop-up. So, make sure to store it somewhere to use later when configuring the plugin.

:::

## Plugin Installation

In the directory of your Medusa server, run the following command to install the MinIO plugin:

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

Where `<ENDPOINT>` is the URL of your MinIO server, `<BUCKET>` is the name of the bucket you created earlier, and `<ACCESS_KEY>` and `<SECRET_KEY>` are the keys you generated in the previous section.

Finally, configure your `medusa-config.js` to include the plugin with the required options:

```bash
{
    resolve: `medusa-file-minio`,
    options: {
        endpoint: process.env.MINIO_ENDPOINT,
        bucket: process.env.MINIO_BUCKET,
        access_key_id: process.env.MINIO_ACCESS_KEY,
        secret_access_key: process.env.MINIO_SECRET_KEY,
    },
},
```

:::caution

If you have multiple storage plugins configured, the last plugin declared in the `medusa-config.js` file will be used.

:::

## Test it Out

Run your Medusa server alongside the [Medusa Admin](../admin/quickstart.md) to try out your new file service. Upon editing or creating products, you can now upload thumbnails and images, that are stored in a MinIO server.

![Image Uploaded on Admin](https://i.imgur.com/alabX2i.png)

## Next.js Storefront Configuration

If you’re using a [Next.js](../starters/nextjs-medusa-starter.md) storefront, you need to add an additional configuration that adds the MinIO domain name into the configured images domain names. This is because all URLs of product images will be from the MinIO server.

If this configuration is not added, you’ll receive the error ["next/image Un-configured Host”](https://nextjs.org/docs/messages/next-image-unconfigured-host).

In `next.config.js` add the following option in the exported object:

```jsx
module.exports = {
    //other options
    images: {
    domains: [
        "127.0.0.1",
        //any other domains...
    ],
  },
}
```

Where `127.0.0.1` is the domain of your local MinIO server.

## What’s Next 🚀

- Check out [more plugins](https://github.com/medusajs/medusa/tree/master/packages) you can add to your store.
