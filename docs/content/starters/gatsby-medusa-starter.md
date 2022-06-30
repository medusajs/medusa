# Quickstart: Gatsby Storefront

This document guides you to install and set up the Gatsby Storefront for your Medusa Server.

![Gatsby Storefront Quick Look](https://i.imgur.com/LcAsi8r.gif)

## Prerequisites

This document assumes you already have a Medusa server installed. If you don’t, please follow the [Quickstart guide for the Medusa server](../quickstart/quick-start.md) to learn how to do it.

You should also have the Gatsby CLI installed:

```bash npm2yarn
npm install gatsby-cli -g
```

<!-- ## Instant Deployment to Netlify

Instead of manually following this guide to install then later deploy the Gatsby Storefront, you can deploy the Gatsby Storefront to Netlify with this button:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/medusajs/gatsby-starter-medusa) -->

## Installation

1\. Create a new Gatsby project using the [Medusa starter template](https://github.com/medusajs/gatsby-starter-medusa):

```bash
gatsby new my-medusa-storefront https://github.com/medusajs/gatsby-starter-medusa
```

2\. Change to the newly created directory `my-medusa-storefront` and rename the template environment variable file to use environment variables in development:

```bash
mv .env.template .env.development
```

3\. Make sure the Medusa server is running, then run the local Gatsby server:

```bash npm2yarn
npm run start
```

Your Gatsby storefront is now running at `localhost:8000`!

## Development Notes

### Customization

To customize the components, pages, and UI of your Gatsby storefront, just edit files under the `src` directory.

### Data Refresh

The Gatsby storefront uses the [gatsby-source-medusa](https://github.com/medusajs/medusa/tree/master/packages/gatsby-source-medusa) plugin to source data from your Medusa server. This data includes products, collections, and regions, and as a result, you can query this data in the storefront starter using GraphQL queries. You can also explore the data in your store on `localhost:8000/___graphql`.

Because of this, you must rebuild the site every time you update any of this data for it to be reflected in your storefront. We will soon be releasing a new version of the plugin which adds incremental builds, which will improve build times.

### Change Port

By default, the Gatsby storefront runs on port `8000`.

To change the port, change the `develop` command in `package.json` to the following:

```json
"scripts": {
    //other scripts
    "develop": "gatsby develop --port=<PORT>"
}
```

Make sure to replace `<PORT>` with the port number you want the storefront to run on. For example, `3000`.

Then, on your server, update the environment variable `STORE_CORS` to the URL with the new port:

```bash
STORE_CORS=http://localhost:<PORT>
```

:::info

For more details about the Store CORS configuration, check out the [Configure your Server documentation](../usage/configurations.md#storefront-cors).

:::

### Development Resources

If you’re not familiar with Gatsby, you can learn more about it through the following resources:

- [Documentation](https://www.gatsbyjs.com/docs)
- [Plugin Library](https://www.gatsbyjs.com/plugins/)
- [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/)

## Storefront Features

The Gatsby storefront comes with a lot of features out of the box including:

- View all products and manage your cart.

    ![Products Page](https://i.imgur.com/P0Mpvxh.png)
- Customer authentication.

    ![Sign In Page](https://i.imgur.com/0sVcZeS.png)
- Full checkout workflow.

    ![One-Page Checkout](https://i.imgur.com/5wSs3yZ.png)
- Request swaps and returns using a customer’s order ID and Email.

    ![Request Return for Order](https://i.imgur.com/mAChp3f.png)

## What’s Next 🚀

- Check the [Storefront API reference](https://docs.medusajs.com/api/store/auth) for a full list of REST APIs to use on your storefront.
- Learn how to [deploy the Gatsby storefront on Netlify](../deployments/storefront/deploying-gatsby-on-netlify.md).
- Learn how to add [Stripe as a payment provider](../add-plugins/stripe.md#gatsby-storefront).
