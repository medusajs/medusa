---
description: 'Learn how to integrate Strapi with the Medusa backend. Learn how to install the plugin and test two-way sync between the ecommerce and CMS services.'
addHowToData: true
---

# Strapi

In this document, you’ll learn how to integrate Medusa with Strapi.

:::note

This plugin is a [community plugin](https://github.com/SGFGOV/medusa-strapi-repo) and is not managed by the official Medusa team. It supports v4 of Strapi. If you run into any issues, please refer to the [repository of the community plugin](https://github.com/SGFGOV/medusa-strapi-repo).

:::

## Overview

[Strapi](https://strapi.io/) is an open source headless CMS service that allows developers to have complete control over their content models. It can be integrated into many other frameworks, including Medusa.

By integrating Strapi into Medusa, you can benefit from powerful features in your ecommerce store, including detailed product CMS details, two-way sync, an easy-to-use interface to use for static content and pages, and much more.

---

## Prerequisites

### Medusa Components

This guide assumes you already have a Medusa backend installed. If not, you can learn how to install [it here](../../create-medusa-app.mdx).

An event bus module must be installed and configured on your Medusa backend to sync data from Medusa to Strapi. You can install the [Redis event bus module](../../development/events/modules/redis.md).

### Strapi Database

You must create a PostgreSQL database to be used with Strapi. You can refer to [PostgreSQL’s documentation](https://www.postgresql.org/docs/current/sql-createdatabase.html) for more details.

---

## Setup Strapi Project

In this section, you’ll setup a Strapi project with a Medusa plugin installed. To do that:

1\. Clone the Strapi project repository:

```bash
git clone https://github.com/SGFGOV/medusa-strapi-repo.git
```

2\. Change to the `medusa-strapi-repo/packages/medusa-strapi` directory.

3\. Copy the `.env.test` file to a new `.env` file.

### Change Strapi Environment Variables

In the `.env` file, change the following environment variables:

```bash
# IMPORTANT: Change supersecret with random and unique strings
APP_KEYS=supersecret
API_TOKEN_SALT=supersecret
ADMIN_JWT_SECRET=supersecret
JWT_SECRET=supersecret

MEDUSA_STRAPI_SECRET=supersecret

MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_BACKEND_ADMIN=http://localhost:7001

SUPERUSER_EMAIL=support@medusa-commerce.com
SUPERUSER_USERNAME=SuperUser
SUPERUSER_PASSWORD=MedusaStrapi1

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=postgres_strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=
DATABASE_SSL=false
DATABASE_SCHEMA=public
```

1. Change `APP_KEYS`, `API_TOKEN_SALT`, `JWT_SECRET`, and `ADMIN_JWT_SECRET` to a random and unique string. These keys are used by Strapi to sign session cookies, generate API tokens, and more.
2. Change `MEDUSA_STRAPI_SECRET` to a random unique string. The value of this environment variable is used later in your Medusa configurations.
3. Change `MEDUSA_BACKEND_URL` to the URL of your Medusa backend. If you’re running it locally, it should be `http://localhost:9000`.
4. Change `MEDUSA_BACKEND_ADMIN` to the URL of your Medusa Admin. If you’re running it locally, it should be `http://localhost:7001`.
5. Change the following environment variables to define the Strapi super user:
    1. `SUPERUSER_EMAIL`: the super user’s email. By default, it’s `support@medusa-commerce.com`.
    2. `SUPERUSER_USERNAME`: the super user’s username. By default, it’s `SuperUser`.
    3. `SUPERUSER_PASSWORD`: the super user’s password. By default, it’s `MedusaStrapi1`.
    4. `SUPERUSER_FIRSTNAME`: the super user’s first name. By default, it’s `Medusa`.
    5. `SUPERUSER_LASTNAME`: the super user’s last name. By default, it’s `Commerce`.
6. Change the database environment variables based on your database configurations. All database environment variables start with `DATABASE_`.
7. You can optionally configure other services, such as S3 or MeiliSearch, as explained [here](https://github.com/SGFGOV/medusa-strapi-repo/tree/development/packages/medusa-strapi#media-bucket).

### Build Packages

Once you’re done, install and build packages in the root `medusa-strapi-repo` directory:

```bash npm2yarn
# Install packages
npm install
# Build packages
npm run build
```

---

## Install Plugin in Medusa

In the directory of your Medusa backend, run the following command to install the Strapi plugin:

```bash npm2yarn
npm install medusa-plugin-strapi-ts
```

### Configure Plugin

Next, add the plugin to the `plugins` array in `medusa-config.js`:

```js title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: "medusa-plugin-strapi-ts",
    options: {
      strapi_protocol: process.env.STRAPI_PROTOCOL,
      strapi_host: process.env.STRAPI_SERVER_HOSTNAME,
      strapi_port: process.env.STRAPI_PORT,
      strapi_secret: process.env.STRAPI_SECRET,
      strapi_default_user: {
          username: process.env.STRAPI_MEDUSA_USER,
          password: process.env.STRAPI_MEDUSA_PASSWORD,
          email: process.env.STRAPI_MEDUSA_EMAIL,
          confirmed: true,
          blocked: false,
          provider: "local",
      },
      strapi_admin: {
          username: process.env.STRAPI_SUPER_USERNAME,
          password: process.env.STRAPI_SUPER_PASSWORD,
          email: process.env.STRAPI_SUPER_USER_EMAIL,
      },
      auto_start: true,
    },
  },
]
```

The plugin accepts the following options:

1. `strapi_protocol`: The protocol of the Strapi server. If running locally, it should be `http`. Otherwise, it should be `https`.
2. `strapi_host`: the domain of the Strapi server. If running locally, use `127.0.0.1`.
3. `strapi_port`: the port that the Strapi server is running on, if any. If running locally, use `1337`.
4. `strapi_secret`: the same secret used for the `MEDUSA_STRAPI_SECRET` environment variable in the Strapi project.
5. `strapi_default_user`: The details of an existing user or a user to create in the Strapi backend that is used to update data in Strapi. It’s an object accepting the following properties:
    1. `username`: The user’s username.
    2. `password`: The user’s password.
    3. `email`: The user’s email.
    4. `confirmed`: Whether the user is confirmed.
    5. `blocked`: Whether the user is blocked.
    6. `provider`:  The name of the authentication provider.
6. `strapi_admin`: The details of the super admin. The super admin is only used to create the default user if it doesn’t exist. It’s an object accepting the following properties:
    1. `username`: the super admin’s username. Its value is the same as that of the `SUPERUSER_USERNAME` environment variable in the Strapi project.
    2. `password`: the super admin’s password. Its value is the same as that of the `SUPERUSER_PASSWORD` environment variable in the Strapi project.
    3. `email`: the super admin’s email. Its value is the same as that of the `SUPERUSER_EMAIL` environment variable in the Strapi project.
7. `auto_start`: Whether to initialize the Strapi connection when Medusa starts. Disabling this may cause issues when syncing data from Medusa to Strapi.

Refer to the [plugin’s README](https://github.com/SGFGOV/medusa-strapi-repo/blob/development/packages/medusa-plugin-strapi-ts/README.md) for more options.

Make sure to add the necessary environment variables for the above options in `.env`:

```bash
STRAPI_PROTOCOL=http
STRAPI_SERVER_HOSTNAME=127.0.0.1
STRAPI_PORT=1337
STRAPI_SECRET=supersecret

STRAPI_MEDUSA_USER=medusa
STRAPI_MEDUSA_PASSWORD=supersecret
STRAPI_MEDUSA_EMAIL=admin@medusa-test.com

STRAPI_SUPER_USERNAME=SuperUser
STRAPI_SUPER_PASSWORD=MedusaStrapi1
STRAPI_SUPER_USER_EMAIL=support@medusa-commerce.com
```

---

## Test Integration

To test the integration between Medusa and Strapi, first, start the Strapi server by running the following command in the `medusa-strapi-repo/packages/medusa-strapi` directory:

```bash title="medusa-strapi-repo/packages/medusa-strapi" npm2yarn
npm run develop
```

Then, start the Medusa backend by running the following command in the root directory of your Medusa backend:

```bash title="Medusa Backend" npm2yarn
npx medusa develop
```

If the connection to Strapi is successful, you’ll find the following message logged in your Medusa backend with no errors:

```bash
info:    Checking Strapi Health ,data: 
debug:   check-url: http://127.0.0.1:1337/_health ,data: 
info:    Strapi Subscriber Initialized
```

### Two-Way Syncing

To test syncing data from Medusa to Strapi, try creating or updating a product either using the Medusa Admin or the [REST APIs](https://docs.medusajs.com/api/admin#products_postproducts). This triggers the associated event in Medusa, which makes the updates in Strapi.

:::tip

If data isn’t synced with Strapi when making updates in Medusa, make sure that you’ve installed the event bus module as explained in the [Prerequisites section](#medusa-components) and that the events are triggered.

:::

To test syncing data from Strapi to Medusa, try updating one of the products in the Strapi dashboard. If you check the product’s details in Medusa, they’re updated as expected.

:::tip

Data is only synced to Strapi once you create or update them. So, if you have products in your Medusa backend from before integrating Strapi, they won’t be available by default in Strapi. You’ll have to make updates to them, which triggers the update in Strapi.

:::

### Synced Entities

The Medusa and Strapi plugins support syncing the following Medusa entities:

- `Region`
- `Product`
- `ProductVariant`
- `ProductCollection`
- `ProductCategory`

---

## Learn More

To learn more about the integration between Medusa and Strapi, refer to the [community plugin](https://github.com/SGFGOV/medusa-strapi-repo).
