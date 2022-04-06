# Strapi

Use [Medusa](https://github.com/medusajs/medusa) and [Strapi](https://github.com/strapi/strapi) to power your commerce setup for a full open-source headless solution. In recent years, it has become increasingly popular to go with a headless approach when building ecommerce, blogs, portfolios, and the likes. Among many benefits, you get improved performance, more customizability, and support to scale as your business grows.

A headless system is essentially a decoupling of presentational layers and backend. It cuts off the traditional proprietary frontend displaying your content (hence the name), and instead gives you Rest APIs, you can consume from whatever system, client, or service you would like.

Going with the headless approach when building your setup will provide you with a modular system with best-in-breed services within each specific area of your stack; CMS, ecommerce, etc. This is in contrast to how you would traditionally choose a monolithic platform that partly (or hardly) caters to all of your needs.

This article will guide you through setting up a headless ecommerce setup in which content is managed by [Strapi](http://strapi.io) and the ecommerce is powered by [Medusa](https://github.com/medusajs/medusa) - on a 100% open-source stack.

## Why Medusa, and why Strapi?

The bottleneck of headless ecommerce systems is most often the amount of resources it requires to both get started and to maintain. You need backend developers to handle your infrastructure and integrations and frontend developers to build the customer experience. This is one of the reasons many existing headless solutions target enterprise businesses. To allow for small to mid-sized businesses to enter the space, one must cater to the developer experience. If the onboarding, setup, and implementation process are all easy to approach, you no longer need a team of ten to build a scalable ecommerce setup.

Strapi and Medusa are two systems built primarily for developers and the combination of the two enables you to build an ecommerce store with a blazingly fast, content-rich frontend and a highly extendable backend.

Both projects are open-source, headless, and built with Node.js. They use a very similar architecture for plugins and customizations, that gives you the ability to extend your commerce and CMS to fit exactly your needs. Let's now dive into the installation and setup of the two.

## Installation

The following guide for setting up the plugin assumes, that you are familiar with both Strapi and Medusa. If this is not the case, visit the official [Medusa](https://docs.medusajs.com/tutorial/set-up-your-development-environment) and [Strapi](https://strapi.io/documentation/developer-docs/latest/getting-started/introduction.html) documentation.

### Setting up Medusa

First, create a Medusa project using your favorite package manager. You can go about this in two ways:

**Use `npx`**
`npx create-medusa-app` will allow you to create a Medusa store engine, a storefront, and Medusa admin in a single command

```bash
# using npx
npx create-medusa-app

# using yarn
yarn create medusa-app
```

> When choosing `npx` you are shown different store engine options as part of the setup. For this Strapi tutorial, you should choose `medusa-starter-default`. Optionally, pick a storefront.

**Use `medusa-cli`**
`@medusajs/medusa-cli` is our Command Line Tool for creating the Medusa store engine (alongside many other powerful commands). Use it as such:

```bash
# using yarn
yarn global add @medusajs/medusa-cli

# using npm
npm install -g @medusajs/medusa-cli

# initialise a Medusa project
medusa new my-medusa-store
```

Medusa uses Redis for emitting events in the system, so ensure, that this is installed and running

```
$ redis-cli
127.0.0.1:6379> ping
PONG
```

And in `medusa-config.js` you should enable it. Your project config in the bottom of the file should look similar to this:

```bash
projectConfig: {
  redis_url: REDIS_URL,
  database_database: "./medusa-db.sql",
  database_type: "sqlite",
  store_cors: STORE_CORS,
  admin_cors: ADMIN_CORS,
},
```

Additionally, add Strapi to your list of plugins:

```json
{
  "resolve": `medusa-plugin-strapi`,
  "options": {
    "strapi_medusa_user": "medusa_user",
    "strapi_medusa_password": "medusaPassword1",
    "strapi_url": "127.0.0.1",
    "strapi_port": "1337"
  }
}
```

And finally, install the plugin using your package manager:

```bash
#using yarn
yarn add medusa-plugin-strapi

# using npm
npm install medusa-plugin-strapi
```

You've now successfully installed and configured your Medusa store engine. Seed it with data and start it up by running:

```bash
# using npm
npm run seed && npm start

# using yarn
yarn seed && yarn start
```

We'll now turn to the Strapi side of things.

### Setting up Strapi

Similar to how you installed Medusa, you can install Strapi using your favorite package manager. Use the `strapi-medusa-template` to create your project. The template is a custom Strapi implementation required for the two systems to work together.

```bash
# using npx
npx create-strapi-app@3.6.8 strapi-medusa --template https://github.com/Deathwish98/strapi-medusa-template.git

# using yarn
yarn global add create-strapi-app@3.6.8

create-strapi-app strapi-medusa --template https://github.com/Deathwish98/strapi-medusa-template.git
```

> Note: The plugin expects node version to be '>= 10.16.0 and <=14.x.x', otherwise it will throw an error.

After running the command, you have a full Strapi project configured to synchronize with Medusa. Upon the initial start of the Strapi server, all the required models will be created. They will correlate with models from Medusa to allow for two-way synchronization.

> Note: The Strapi template starter uses SQLite as the default database. There is a known bug related to `knex.js` that comes from multiple write connections. Restarting the Strapi server should make the error disappear.

**Synchronization**

The power of using Strapi with Medusa comes from two-way synchronization. Strapi allows you to enrich your products with extra fields and data, such that you can perfect the customer experience. But for the products to appear in Strapi, you are required to create them in Medusa. For the commerce logic in your presentational layer to function properly, you need the Medusa IDs of products and variants. This is used for operations like adding to cart and going through the checkout flow.

When products are created in Medusa, the two-way communication ensures that data is kept consistent between the two systems. Though only some fields are synchronized and those are:

**Product**: title, subtitle, description, handle
**Variants**: title
**Region**: name

> Further down the road, the support for synchronizing more entities is expected to be introduced

**Using Postgres in Medusa (optional)**

For Postgres to function, you need to create a local database. One way of doing this would be to use your terminal:

```json
createdb medusa-store
```

Depending on what system you are on and how your local Postgres is configured, the above command might fail. In that case, please investigate the correct way to create a local database on your pc.

Navigate to your newly created Medusa project (`<project name>/backend` if you used `npx`). In `medusa-config.js`, ensure that you have Redis and Postgres enabled. The project configurations at the bottom of the file should look similar to this:

```bash
projectConfig: {
  redis_url: REDIS_URL,
  database_url: DATABASE_URL,
  database_type: "postgres",
  store_cors: STORE_CORS,
  admin_cors: ADMIN_CORS,
},
```

> Note: the `DATABASE_URL` variable should use the Postgres database created in the previous step

## Summary and next steps

You are now provided with the toolbox for creating amazing digital commerce experiences on top of a highly extendable CMS system and ecommerce platform.

To quickly get started, see our starters for:

- [GatsbyJS](https://github.com/medusajs/gatsby-starter-medusa) (much more feature-rich V2 coming soon)
- [NextJS](https://github.com/medusajs/nextjs-starter-medusa)

A big thanks to community member Pawan Sharma ([Deathwish98](https://github.com/Deathwish98)) for leading the implementation of this integration with Strapi. If you want to be part of the Medusa community, feel free to join us on our [Discord channel](https://discord.gg/F87eGuwkTp).
