---
title: Plugins
---

# Plugins

The purpose of this guide is to give an introduction to the structure of a plugin and the steps required to create one. It builds upon our article describing the process of [adding custom functionality](https://docs.medusa-commerce.com/tutorial/adding-custom-functionality). It can be seen as the proceeding steps for extracting your custom functionality to a reusable package for other developers to use.

## What is a plugin?

Plugins offer a way to extend and integrate the core functionality of Medusa.

In most commerce solutions, you can extend the basic features but it often comes with the expense of having to build standalone web applications. Our architecture is built such that plugins run within the same process as the core eliminating the need for extra server capacity, infrastructure and maintenance. As a result, the plugins can use all other services as dependencies and access the database.

> You will notice that plugins vary in naming. The name should signal what functionality they provide.

In the following sections, we will go through the basics of implementing a generic plugin. And finally, how to use it as part of your commerce setup.

## Building a plugin

A plugin is essentially a Node.js project of their own. They contain a file in root, `package.json`, that holds all metadata and dependencies of the project.

The first step in creating a plugin is to initialize the Node.js project:

```bash
npm init
```

This command will ask you to fill out your project's metadata, which will eventually be used when publishing the package to NPM. After this command completes, you are ready to start implementing the functionality.

### Implementation

We've already gone through the process of building custom services, endpoints, and subscribers in another tutorial, so this will not be repeated. The process is the same for the logic within a plugin, meaning that the functionality is loaded as part of the core if the correct naming convention is followed.

To quickly get started with the implementation, we advise you to copy `/services/welcome.js`, `/api/index.js`, `/subscribers/welcome.js` and the config files from the tutorial and add them in `/src`. As a result, you should have the following folder structure:

```js
.
├── src
│   ├── api
│       └── index.js
│   └── services
│       └── welcome.js
│   └── subscribers
│       └── welcome.js
├── .babelrc
├── .gitignore
├── medusa-config.js
├── README.md
└── package.json
```

It is worth mentioning the difference between building a generic and a non-generic plugin. A non-generic plugin has a specific purpose such as processing payments or creating fulfillments. Medusa core depends on a specific implementation from such plugins, which is why we've created interfaces that enforce this. These can be found in `medusa-interfaces`.

> Note: Non-generic plugins are required to extend the correct interface, otherwise they will not be loaded correctly as part of your Medusa setup.

For a more comprehensive walkthrough of the implementation of such plugins, see our guides:

- How to build a fulfillment provider (Coming soon!)
- How to build a payment provider (Coming soon!)

### Publishing

In order for your plugin to become a part of the Medusa plugin ecosystem, you need to publish it to NPM. Make sure that you've included the `package.json` file. NPM uses the details of this file to configure the publishing. Please include `medusa` and `medusa-plugin` and possibly more in the `keywords` field of the `package.json`.

```bash
{
	"name": "medusa-payment-stripe",
	...
  "keywords": [
    "medusa",
    "medusa-payment",
    "medusa-plugin"
  ],
  "description": "Stripe Payment provider for Medusa Commerce",
	...
}
```

Finally, you should add a README for the plugin, such that the community understands the purpose of the plugin and how to install it.

## Installation and configuration

Official Medusa plugins can be found within the [mono repo](https://github.com/medusajs/medusa/tree/master/packages) and community plugins can be found by searching NPM for keywords such as `medusa` or `medusa-plugin`.

Note: For plugins to become a part of the mono repo, we require you to submit a PR request. If approved, we will publish it under the Medusa organisation on Github.

Plugins are distributed as NPM packages making it possible for developers to simply install and use a plugin via `yarn add` or `npm install`.

After installing a plugin using your preferred package manager, it should be added to `medusa-config.js`. We allow you to provide options for plugins. These options can be used for anything ranging from provider requirements such as API keys or custom configuration used in the plugin's logic. These options are injected into the services, subscribers, and APIs of the plugin.

The following steps will install the official Contentful plugin for your Medusa engine:

### Step 1: Installation

First, we add the plugin as a dependency to your project:

```bash
yarn add medusa-plugin-contentful
```

### Step 2: Configuration

In the README of the plugin, you will see the options for the plugin. Some are required and some are optional.

In your `medusa-config.js`, add the plugin and the required options:

```js
const plugins = [
	...
	{
    resolve: `medusa-plugin-contentful`,
    options: {
      space_id: "some_space_id",
      access_token: "some_access_token",
      environment: "some_environment",
    },
  },
	...
]
```

### Step 3: Usage

Depending on the purpose of the plugin, you will now be able to use the extended functionality as part of your commerce setup.

In this case, you will need to add a content type in Contentful with the fields described in the README. Products created in Medusa Admin will now be synced to Contentful, such that you can enrich them with more details enabling you to enhance the customer experience of your webshop.

## Summary

As a result of following this guide, you should now be able to both implement and install plugins for you Medusa project.
