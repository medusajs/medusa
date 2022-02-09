---
title: Creating your Medusa server
---

# Creating your Medusa server

## Introduction

With the required software installed on your computer you are ready to start working on your first Medusa project.

In this part of the tutorial we will setup the skeleton for a Medusa store and will be making the first requests to your Medusa server.

Once you have completed this part of the tutorial you will have a powerful backend for digital commerce experiences. The server will be capable of handling orders, ensuring payments are going through, keeping basic product and customer data in sync, etc. You can use one of the frontend starters to quickly hook up your server to a presentation layer ([Gatsby](https://github.com/medusajs/gatsby-starter-medusa) or [Next](https://github.com/medusajs/nextjs-starter-medusa)).

## Setup a Medusa project

With Medusa CLI installed it is very easy to setup a new Medusa project, with the `new` command. In your command line run:

```shell
medusa new my-medusa-server --seed
```

The command will do a number of things:

- build a new project in a folder called my-medusa-server
- install the dependencies through yarn or npm
- setup a new git environment for version controlling your project
- create a database in postgres with the name my-medusa-server
- the `--seed` flag indicates that the database should be populated with some test data after the project has been set up

If you navigate to the root folder of your new project you will see the following files in your directory:

```
.
├── node_modules
├── src
│   ├── api
│   └── services
├── .babelrc
├── .gitignore
├── medusa-config.js
├── README.md
└── package.json
```

There is not a lot of files needed to get your Medusa store setup and this is all due to the fact that the main Medusa core (`@medusajs/medusa`) is installed as a dependency in your project giving you all the fundamental needs for a digital commerce experience.

Much of Medusa's power lies in the `medusa-config.js` which is the file that configures your store and orchestrates the plugins that you wish to use together with your store. There are some different types of plugin categories such as payment plugins, notification plugins and fulfillment plugins, but plugins can contain any form of extension that enhances your store.

For customizations that are more particular to your project you can extend your Medusa server by adding files in the `api` and `services` directories. More about customizing your server will follow in the following parts.

## Starting your Medusa server

> Note: For your server to run correctly you should configure your `COOKIE_SECRET` and `JWT_SECRET` environment variables by adding a `.env` file to the root of your Medusa project.

After your project has been set up with `medusa new`, you can run the following commands to start your server:

```shell
cd my-medusa-server
medusa develop
```

If you ran the new command with the `--seed` flag you will already have products available in your store. To view these you can run the following command in your command line:

```shell
curl -X GET localhost:9000/store/products | python -m json.tool
```

## What's next?

At this point you are all set to start creating amazing digital commerce experiences. You can take a number of different routes from here and the next part of this tutorial will revolve around creating custom functionality within your Medusa project.

Other options you could take are:

### Add a frontend to your server

We have created two starters for you that can help you lay a foundation for your storefront. The starters work with your new server with minimal configuration simply clone the starters from here:

- [Nextjs Starter](https://github.com/medusajs/nextjs-starter-medusa)
- [Gatsby Starter](https://github.com/medusajs/gatsby-starter-medusa)

### Browse the API reference

In the API reference docs you can find all the available requests that are exposed by your new Medusa server. Interacting with the API is the first step to creating truly unique experiences.

### Setup Stripe as a payment provider (Guide coming soon)

One of the first things you may want to do when building out your store would be to add a payment provider. Your starter project comes with a dummy payment provider that simply fakes payments being processed. In the real world you want a payment provider that can handle credit card information securely and make sure that funds are being transferred to your account. Stripe is one of the most popular payment providers and Medusa has an official plugin that you can easily install in your project.

## Summary

In this part of the tutorial we have setup your first Medusa project using the `medusa new` command. You have now reached a key milestone as you are ready to start building your Medusa store; from here there are no limits to how you can use Medusa as you can customize and extend the functionality of the core. In the next part of the tutorial we will be exploring how you can add custom services and endpoints to fit your exact needs.
