---
title: Create a headless ecommerce store with Gatsby, Contentful & Medusa
---

# Creating a headless ecommerce store with Gatsby, Contentful and Medusa

> Medusa is an open source headless commerce engine that allow you to create amazing digital commerce experiences. Medusa is highly customizable, allowing you to extend the core to fit your needs.

## Introduction

In this guide we will go over how to set up a modern e-commerce store using [Gatsby](https://gatsby.com) as a front end, [Contentful](https://contentful.com) as a CMS system and Medusa as a store engine. The resulting e-commerce store will be blazingly fast, highly extendable and will provide the necessary foundation to grow and evolve your e-commerce stack as your business expands to new markets and develops new software requirements.

## Overview

After following the steps outlines in this series you will have:

- A Medusa store engine capable of managing products, processing orders, handling orders and integrating with all the tools in your e-commerce stack.
- A statically generated Gatsby storefront that is on brand and customizable from homepage to checkout flow.
- A headless CMS system that can be modified and extended to create the best customer experience.

You will make use of `medusa-plugin-contentful` which is a plugin to your Medusa store engine that syncronizes products and product variants between your Medusa engine and your Contentful space. This allows you to perform content enrichment in Contentful while keeping your core master data in Medusa, for a truly headless commerce setup.

Other concepts that will be covered in this series include:

- Gatsby plugins and [File System Route API](https://www.gatsbyjs.com/docs/reference/routing/file-system-route-api/)
- [Contentful Migrations](https://www.contentful.com/developers/docs/tutorials/cli/scripting-migrations/)
- Medusa payments, fulfillments and plugins

If you want to jump straight to the code for this series you can checkout:

- [`medusa-starter-contentful`](https://github.com/medusajs/medusa-starter-contentful)
- [`medusa-contentful-storefront`](https://github.com/medusajs/medusa-contentful-storefront)

## Prerequisites

> For a full guide to how to set up your development environment for Medusa please see [the tutorial](https://docs.medusajs.com/tutorials/set-up-your-development-environment)

In order to get you started with your Gatsby, Contentful, Medusa store you must complete a couple of installations:

- Install the Medusa CLI
  ```
  yarn global add @medusajs/medusa-cli
  npm install -g @medusajs/medusa-cli
  ```
- Install the Gatsby CLI
  ```
  yarn global add gatsby-cli
  npm install -g gatsby-cli
  ```
- [Create a Contentful account](https://www.contentful.com/sign-up/)
- [Install Redis](https://redis.io/topics/quickstart)
  ```
  brew install redis
  brew services start redis
  ```

Medusa has support for SQLite and PostgreSQL and uses Redis for caching and queueing of asynchronous tasks. Redis is required for `medusa-plugin-contentful` to work correctly.

## Setting up your Medusa server

We will make use of `medusa new` to setup your local Medusa server.

```sh
medusa new medusa-contentful-store https://github.com/medusajs/medusa-starter-contentful
```

This command will setup a new directory at `medusa-contentful-store`, clone the `medusa-starter-contentful` into that directory and install the dependencies for the project.

### What's inside

You can now do `cd medusa-contentful-store` and open up your project in your text editor. Below is an overview of the directory structure and a walkthrough of what the different files do.

```
medusa-contentful-store
├── contentful-migrations
|  ├── hero.js
|  ├── index.js
|  ├── link.js
|  ├── navigation-item.js
|  ├── navigation-menu.js
|  ├── page.js
|  ├── product-variant.js
|  ├── product.js
|  ├── region.js
|  ├── tile-section.js
|  └── tile.js
├── data
|  ├── contentful-seed.json
|  └── seed.json
├── src
|  ├── api
|  ├── loaders
|  ├── services
|  └── subscribers
├── .env
├── medusa-config.js
├── package.json
└── README.md
```

#### `package.json`

If you are familiar with Node you will probably notice that your Medusa store is simply a Node project. Looking inside the `package.json` file you will find that one of the packages that is installed in the project is the `@medusajs/medusa` package. This is the core Medusa package that comes prepacked with all the functionality necessary to do digital commerce - it is also this package that makes sure to register and use the plugins and custom functionality that are configured for your store.

#### `medusa-config.js`

Your plugins and store configuration is managed in the `medusa-config.js`, if you open up the file you will see that `medusa-plugin-contentful` is configured with options as shown below. Later we will be setting up your Contentful space so that we can add the necessary environment variables to your `.env` file.

```javascript
// medusa-config.js

// Contentful Variables
const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID || "";
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN || "";
const CONTENTFUL_ENV = process.env.CONTENTFUL_ENV || "";


const plugins = [
  ...,
  {
    resolve: `medusa-plugin-contentful`,
    options: {
      space_id: CONTENTFUL_SPACE_ID,
      access_token: CONTENTFUL_ACCESS_TOKEN,
      environment: CONTENTFUL_ENV,
    },
  },
  ...
];

module.exports = {
  projectConfig: {
    redis_url: REDIS_URL,
    database_database: "./medusa-db.sql",
    database_type: "sqlite",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
  },
  plugins,
};
```

#### `/src`

In the `/src` directory there are 4 special subdirectories that are added for you already. These special directories can be used to add custom functionality to your store. Custom functionality can include custom endpoints (configured in `/api`), custom business logic (configured in `/services`), pub/sub-like subscriptions for asyncrhonous integration tasks (configured in `/subscribers`) and finally loader functions to be called when your Medusa server starts up (configured in `/loaders`). If you want to learn more about how to add custom functionality you can checkout [the tutorial](https://docs.medusajs.com/tutorials/adding-custom-functionality).

#### `/data`

We will be using two seed scripts to kickstart your development, namely `yarn seed:contentful` and `yarn seed`. Data for these seed scripts are contained in the `/data` directory.

When the seed scripts have been executed you will have a Contentful space that holds all the data for your website; this includes content for Pages, Navigtion Menu, etc.

#### `/contentful-migrations`

This directory contains scripts that create content types in your Contentful space. Contentful allows you to customize your content types with fields that can be used to hold all sorts of data, this makes it possible to create advanced data structures that will later be used to lay out your website. Writing migration scripts to evolve your content types is a really powerful tool as you can use it in CI/CD pipelines and makes your projects much more portable.

The migrations included in this project will create the following content types:

- **Page**: Represents a page on your website. Each page has a title and can take any number of "Content Modules". Content Modules can be either of the type Hero or Tile Section.
- **Hero**: a component that can take a Title, CTA and a background image.
- **Tile**: a component that can be added to a Tile Section and renders a Title, CTA and an Image.
- **Tile Section**: a component that can hold a number of Tiles or Products. When used with a Product, the Tile Section will display the product thumbnail and it's title and will link to the product page.
- **Link**: a component that can link to an external or internal path; or, alternatively, hold a reference to a Page or Product entry. If used with Page or Product, the link path will be inferred from the referenced entry.
- **Navigation Item**: an item to include in a Navigation Menu. Each navigation item has a title that can be displayed in a menu and a link that defines where the user will be navigated to when the item is clicked.
- **Product**: represents a product as syncronized from Medusa. A product's variants will be copied over as well.
- **Product Variant**: The variants of a product.
- **Region**: Represents an available region in Medusa.

## Creating a Contentful space

To create a new Contentful space log in to your Contentful account. If you already have a Contentful account with a Space configured you can click your organization name in the top left corner to reveal an overview of your organization's spaces. At the bottom of the spaces list you should click "Add space".

**Select "Community space" and "Web app only"**
In this guide we will be using a free space which gives you an incredibly strong foundation for creating on-brand customer experiences and advances shopping flows.

![](https://i.imgur.com/JOAG8uk.png)

**Add a name and select "Empty space"**

![](https://i.imgur.com/Yt8xxoX.png)

Once your space is set up you can go to your space home. We will now get the credentials needed for `medusa-plugin-contentful` to work.

Open your `.env` file in your text editor you should see:

```shell
# .env
JWT_SECRET=something
COOKIE_SECRET=something

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=

CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_ENV=
```

Your `CONTENTFUL_SPACE_ID` can be found by going to your space home and checking your browser's URL bar. The space id is the alphanumeric string following `https://app.contentful.com/spaces/`. Copy this string and paste it into your `.env` file.

To get your `CONTENFUL_ACCESS_TOKEN` go to your space home and click **Settings** > **API keys**

![](https://i.imgur.com/ZF2VQSo.png)

Then click **Content management tokens** and click **Generate personal token**. After giving your token a name you can copy it to your `.env`

![](https://i.imgur.com/hcuAeKd.png)

For `CONTENTFUL_ENVIRONMENT` add `master`.

You should now have a `.env` that looks like this:

```shell
# .env
JWT_SECRET=something
COOKIE_SECRET=something

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=

CONTENTFUL_SPACE_ID=****
CONTENTFUL_ACCESS_TOKEN=CFPAT-*******
CONTENTFUL_ENV=master
```

## Migrating and Seeding your Contentful space

Now that we have collected your credentials we are ready to migrate the Contentful space to add the content types we talked about earlier. To migrate the Contentful space open up your command line and `cd` into `medusa-contentful-store`.

You can now run:

```shell
yarn migrate:contentful
```

This script will run each of the migrations in the `contentful-migrations` directory. After it has completed navigate to your Contentful space and click "Content model" in the top navigation bar. You will see that the content types will be imported into your space. Feel free to familiarize yourself with the different types by clicking them and inspecting the different fields that they hold.

![](https://i.imgur.com/E4x43vX.png)

The next step is to seed the Contentful space with some data that can be used to display your ecommerce store's pages and navigation. To seed the database open up your command line and run:

```shell
yarn seed:contentful
```

In your Contentful space navigate to "Content" and you will be able to see the different entries in your space. You can filter the entries by type to, for example, only view Pages:

![](https://i.imgur.com/5s8NNLT.png)

You will notice that there are not any Products in your store yet and this is because we haven't created any products in your Medusa store.

To do this open your command line and run:

```shell
yarn seed
yarn start
```

This will seed your Medusa database, which will result in `medusa-plugin-contentful` synchronizing data to your Contentful space. Everytime you add or update a product the data will be copied into your Contentful space for further enrichment.

## Setting Featured Products

In Contentful navigate to "Content" and find the Page called "Home". We will now add some featured products to the home page.

- Click the "Home" entry and scroll down to the field called "Content modules"
  ![](https://i.imgur.com/ab50vOa.png)

- Click the Content module named "Featured Products" and click "Add content" in the "Tiles" field
  ![](https://i.imgur.com/5GACc0e.png)

- Click "Add existing content" as e will be adding the products that were copied over by Medusa
  ![](https://i.imgur.com/igFPzdr.png)

- Select Medusa Waterbottle and Medusa Shirt and click "Insert 2 entries"

Make sure that everything is published by hitting publish in the sidebar on the right-hand side.

## Setting up your Gatsby storefront

Now that we have your Medusa server running and your Contentful space seeded with some starter data it is time to add a presentational layer that can be used by customers to browse and purchase the items in your store.

We have already created the storefront and you can install and use it by simply running:

```
gatsby new medusa-contentful-storefront https://github.com/medusajs/medusa-contentful-storefront
```

Once `gatsby new` is complete you should rename the `.env.template` file to `.env` and add a Content Delivery token. Your content delivery token is different from the personal access token you generated earlier, so make sure that you are using the correct token when you paste it into your `.env`.

To get your token go to **Settings** > **API Keys** > **Add API key**. Now click save and copy the token specified in the field "Content Delivery API - access token".

After you have copied the token and your space ID to your `.env`, you can run `yarn start` which will start your Gatsby development server on port 8000.

You can now go to https://localhost:8000 to check out your new Medusa store.

![](https://i.imgur.com/8MHrA73.png)

## Summary

Using three powerful tools we have now set up a modern headless ecommerce store on our local development machine. This setup can scale with your business's needs and evolve to fit create amazing commerce expereiences that are unique and on brand. The steps we took in this guide were really simple and fast: first we created a Medusa server using the Medusa CLI, we then configured a Contentful space by running migrations and seed scripts. We also installed a Gatsby front end for our Medusa store using the Gatsby CLI.

## What's next

In the next part we will dig deeper into how Contentful can be used to create pages, enrich your products and structure your content. We will also take a look at the files in your Gatsby storefront.

Stay tuned!
