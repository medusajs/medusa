---
description: "General steps for deploying the backend."
addHowToData: true
---

# General Deployment Guide for Medusa Backend

In this guide, you’ll learn the general steps you need to take when deploying your Medusa backend. This is useful when the [platform-specific deployment guides](./index.mdx) do not include your selected hosting provider.

## Prerequisites

It’s assumed you already have a Medusa backend installed and configured on your local machine. If not, check out the [create-medusa-app guide](../../create-medusa-app.mdx) to install a Medusa project.

---

## (Optional) Step 1: Create GitHub Repository

Many hosting providers allow you to deploy your project directly from GitHub. This makes it easier for you to push changes and updates without having to manually trigger the update in the hosting provider.

If your hosting provider supports that, create a GitHub repository and push your backend’s code to it.

---

## Step 2: Start Script in package.json

Make sure the `start` script in your `package.json` runs migrations, the `build` command, and the `medusa start` command:

```json title="package.json"
"start": "npm run build && medusa migrations run && medusa start"
```

---

## Step 3: Set ssl Database Option

In production, it’s recommended to set the [database_extra option](../../references/medusa_config/interfaces/medusa_config.ConfigModule.mdx#database_extra) in `medusa-config.js` to disable the `ssl.rejectUnauthorized` option:

```jsx title="medusa-config.js"
module.exports = {
  projectConfig: {
    // ...
    database_extra: process.env.NODE_ENV !== "development" ?
      {
        ssl: {
          rejectUnauthorized: false,
        },
      } : {},
  },
}
```

---

## Step 4: Setup PostgreSQL Database

Your Medusa backend must connect to a remote PostgreSQL database. If your hosting provider doesn’t support creating a PostgreSQL database, you can use [Neon](https://neon.tech/).

Once you set up your PostgreSQL database, make sure to have the connection URL to the database at hand so that you can set it later in your environment variables.

---

## (Optional) Step 5: Configure the Admin

If you're using the Medusa Admin plugin, you have two options to deploy it: either with the backend or separately.

### Deploying with the Backend

To deploy the admin with the backend:

1. Your chosen hosting provider and plan must offer at least 2GB of RAM.
2. Enable the [autoRebuild option](../../admin/configuration.mdx#plugin-options) of the admin plugin:

```js title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      // other options...
    },
  },
]
```

Alternatively, you can use a GitHub action to build the admin as explained [here](../index.mdx#deploy-admin-through-github-action).

### Deploying Separately

If you choose to deploy the admin separately, disable the admin plugin's [serve option](../../admin/configuration.mdx#plugin-options):

```js title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      // only enable `serve` in development
      // you may need to add the NODE_ENV variable
      // manually
      serve: process.env.NODE_ENV === "development",
      // other options...
    },
  },
]
```

This ensures that the admin isn't built or served in production. You can also change `@medusajs/admin` dependency to be a dev dependency in `package.json`.

You can alternatively remove the admin plugin for the plugins array.

:::tip

Refer to the [admin deployment guides on how to deploy the admin separately](../admin/index.mdx).

:::

---

## (Optional) Step 6: Setup Architectural Services

Aside from PostgreSQL, you may be using modules or plugins that require some additional architectural setup. For example, if you’re using the [Redis Events Module](../../development/events/modules/redis.md), you must set up a Redis database and obtain a connection URL to it.

---

## Step 7: Deploy your Backend

You can deploy your backend now to your hosting provider. During or after the deployment process, based on your hosting provider, you need to add the following environment variables:

```bash
DATABASE_TYPE=postgres
DATABASE_URL=<YOUR_DB_URL>
JWT_SECRET=<RANDOM_SECRET>
COOKIE_SECRET=<RANDOM_SECRET>
NODE_ENV=production
NPM_CONFIG_PRODUCTION=false
```

Where:

- `<YOUR_DB_URL>` is the connection URL to the PostgreSQL database you set up in [step 4](#step-4-setup-postgresql-database).
- `<RANDOM_SECRET>` is a random string that will be used to create authentication and cookie tokens. Make sure to set different ones for `JWT_SECRET` and `COOKIE_SECRET`.

Make sure to also add any other environment variables relevant to your backend. For example, if you’ve setup Redis as explained in [step 5](#optional-step-5-setup-architectural-services), make sure to add an environment variable for the Redis connection URL.

---

## Step 8: Test it Out

After you’ve deployed your backend, you can test it out in different ways:

- Go to `<BACKEND_URL>/health`, where `<BACKEND_URL>` is the URL to your deployed backend. If the deployment was successful, you should see `OK` printed in your browser.
- If you deployed the [admin dashboard with the backend](#deploying-with-the-backend), you can go to `<BACKEND_URL>/app` to view the admin dashboard. If you changed the value of the admin plugin’s `path` configuration, make sure to replace `app` with that instead.

---

## Set Up CORS Configuration

To connect your storefront and, if deployed separately, your admin dashboard to your deployed Medusa backend, make sure to set up the [admin_cors and store_cors configuration](../../references/medusa_config/interfaces/medusa_config.ConfigModule.mdx#admin_cors) in `medusa-config.js` accordingly.

---

## Create Admin User

If your hosting provider gives you access to execute commands in your deployed Medusa backend project, you can create a new admin user by running the following command in the root directory of your deployed Medusa backend:

```bash
npx medusa user --email admin@medusa-test.com --password supersecret
```
