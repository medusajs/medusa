# Quickstart

This document will guide you through setting up your Medusa server in a few minutes.

## Prerequisites

Medusa supports Node versions 14 and 16. You can check which version of Node you have by running the following command:

```bash
node -v
```

You can install Node from the [official website](https://nodejs.org/en/).

## Create a Medusa Server

### 1. Install Medusa CLI

   ```bash npm2yarn
   npm install @medusajs/medusa-cli -g
   ```

:::note

If you run into any errors while installing the CLI tool, check out the [troubleshooting guide](../troubleshooting/cli-installation-errors.mdx).

:::

### 2. Create a new Medusa project

   ```bash
   medusa new my-medusa-store --seed
   ```

### 3. Start your Medusa server

   ```bash
   cd my-medusa-store
   medusa develop
   ```

### Test Your Server

After these three steps and in only a couple of minutes, you now have a complete commerce engine running locally. You can test it out by sending a request using a tool like Postman or through the command line:

```bash
curl localhost:9000/store/products | python -m json.tool
```

:::note

This command uses Python to format the result of the request better in your command line. If you don't want to use Python you can simply send a request without the formatting:

```bash
curl localhost:9000/store/products
```

:::

## Additional Steps

### Set Up Development Environment

For an optimal experience developing with Medusa and to make sure you can use its advanced functionalities, you'll need to install more tools such as Redis or PostgreSQL.

Follow [this documentation to learn how to set up your development environment](../tutorial/0-set-up-your-development-environment.mdx).

### Server Configurations

It's important to configure your Medusa server properly and learn how environment variables are loaded.

You can learn more about configuring your server and loading environment variables in the [Configure your Server documentation](../usage/configurations.md).

### File Service Plugin

To upload product images to your Medusa server, you must install and configure one of the following file service plugins:

- [MinIO](../add-plugins/minio.md) (Recommended for local development)
- [S3](../add-plugins/s3.md)
- [DigitalOcean Spaces](../add-plugins/spaces.md)

## What's next :rocket:

- Install the [Next.js](../starters/nextjs-medusa-starter.md) or [Gatsby](../starters/gatsby-medusa-starter.md) storefronts to set up your ecommerce storefront.
- Install the [Medusa Admin](../admin/quickstart.md) to supercharge your ecommerce experience with easy access to configurations and features.
- Check out the [API reference](https://docs.medusajs.com/api/store) to learn more about available endpoints available on your Medusa server.
- Install [plugins](https://github.com/medusajs/medusa/tree/master/packages) for features like Payment, CMS, Notifications, among other features.
