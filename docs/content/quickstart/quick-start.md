# Quickstart

This quickstart is intended for experienced developers, that are accustomed with concepts like JavaScript, Node.js, SQL and the command line. For a more gentle introduction, see our tutorial on [how to set up your development environment](/tutorial/set-up-your-development-environment).

## Prerequisites

Medusa supports Node versions 14 and 16. You can check which version of Node you have by running the following command:

```bash
node -v
```

You can install Node from the [official website](https://nodejs.org/en/).

## Getting started

1. **Install Medusa CLI**

   ```bash npm2yarn
   npm install -g @medusajs/medusa-cli
   ```

2. **Create a new Medusa project**

   ```bash
   medusa new my-medusa-store --seed
   ```

3. **Start your Medusa engine**

   ```bash
   medusa develop
   ```

4. **Use the API**

   ```bash
   curl localhost:9000/store/products | python -m json.tool
   ```

After these four steps and only a couple of minutes, you now have a complete commerce engine running locally. You may now explore [the documentation](https://docs.medusajs.com/api) to learn how to interact with the Medusa API. You may also add [plugins](https://github.com/medusajs/medusa/tree/master/packages) to your Medusa store by specifying them in your `medusa-config.js` file.
We have a prebuilt admin dashboard that you can use to configure and manage your store find it here: [Medusa Admin](https://github.com/medusajs/admin)

## What's next?

### Set up a storefront for your Medusa project

We have created two starters for you that can help you lay a foundation for your storefront. The starters work with your new server with minimal configuration simply clone the starters from here:

- [Nextjs Starter](https://github.com/medusajs/nextjs-starter-medusa)
- [Gatsby Starter](https://github.com/medusajs/gatsby-starter-medusa)

:::tip

Medusa runs on port 9000 by default and the storefront starters are both configured to run on port 8000. If you wish to run your storefront starter on another port you should update your CORS settings in your project's `medusa-config.js`.

:::

<!-- ### Link you local development to Medusa Cloud (Coming soon!)

With your project in local development you can link your Medusa instance to Medusa Cloud - this will allow you to manage your store, view orders and test out the amazing functionalities that you are building. [Get started here](https://docs.medusajs.com/tutorial/linking-your-local-project-with-medusa-cloud). -->
