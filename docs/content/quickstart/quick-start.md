# Quickstart

This document will guide you through setting up your Medusa server in a few minutes.

:::tip

For a more detailed guide on how to set up your local environment to work with Medusa, check out the documentation on [how to set up your development environment](/tutorial/set-up-your-development-environment).

:::

Alternatively, you can use this button to deploy the Medusa server to Heroku directly:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/medusajs/medusa-starter-default/tree/feat/deploy-heroku)

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

After these 3 steps and in only a couple of minutes, you now have a complete commerce engine running locally. You can test it out by sending a request using a tool like Postman or through the command line:

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

### File Service Plugin

To upload product images to your Medusa server, you must install and configure one of the following file service plugins:

- [MinIO](../add-plugins/minio.md) (Recommended for local development)
- [S3](../add-plugins/s3.md)
- [DigitalOcean Spaces](../add-plugins/spaces.md)

### Server Configurations

It's important to configure your Medusa server properly and learn how environment variables are loaded.

You can learn more about configuring your server and loading environment variables in the [Configure your Server documentation](../usage/configurations.md).

## What's next :rocket:

- Install our [Next.js](../starters/nextjs-medusa-starter) or [Gatsby](../starters/gatsby-medusa-starter) storefronts to set up your ecommerce storefront quickly.
- Install the [Medusa Admin](../admin/quickstart.md) to supercharge your ecommerce experience with easy access to configurations and features.
- Check out the [API reference](https://docs.medusajs.com/api) to learn more about available endpoints available on your Medusa server.
- Install [plugins](https://github.com/medusajs/medusa/tree/master/packages) for features like Payment, CMS, Notifications, among other features.
