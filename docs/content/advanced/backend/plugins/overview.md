# Plugins

In this document, you’ll get an overview of plugins in Medusa, where to find them, and how to install them. If you want to learn how to create a plugin, check out [this guide](create.md) instead.

## Overview

Medusa was built with flexibility and extendibility in mind. All different components and functionalities in Medusa are built with an abstraction layer that gives developers the freedom to choose what services they want to use or how to implement a certain component in their ecommerce store.

Developers can use plugins to take advantage of this abstraction, flexibility, and extendibility. Plugins allow developers to implement custom features or integrate third-party services into Medusa.

For example, if you want to use Stripe as a payment provider in your store, then you can install the Stripe plugin on your server and use it.

An alternative approach is developing a custom way of handling payment on your ecommerce store. Both approaches are achievable by either creating a plugin or using an existing plugin.

Plugins run within the same process as the core Medusa server eliminating the need for extra server capacity, infrastructure, and maintenance. As a result, plugins can use all other services as dependencies and access the database.

## Using Existing Plugins

### Official Plugins

Medusa has official plugins that cover different aspects and functionalities such as payment, CMS, fulfillment, and notifications. You can check out the available plugins under the [packages directory in the Medusa repository on GitHub](https://github.com/medusajs/medusa/tree/master/packages).

:::tip

To feature your plugin in our repository, you can send a pull request that adds your plugin into the `packages` directory. Our team will review your plugin and, if approved, will merge the pull request and add your plugin in the repository.

:::

### Community Plugins

You can find community plugins by [searching NPM for the `medusa` or `medusa-plugin` keywords](https://www.npmjs.com/search?q=keywords%3Amedusa%2Cmedusa-plugin).

You can also check the [Awesome Medusa repository](https://github.com/adrien2p/awesome-medusajs#plugins) for a list of community plugins among other resources.

## How to Install a Plugin

To install an existing plugin, in your Medusa server run the following command:

```bash npm2yarn
npm install <plugin_name>
```

Where `<plugin_name>` is the package name of the plugin. For example, if you’re installing the Stripe plugin `<plugin_name>` is `medusa-payment-stripe`.

### Plugin Configuration

If you’re installing an official plugin from the Medusa repository, you can find in its `README.md` file a list of configurations that are either required or optional. You can also refer to the documentation related to that plugin for more details on how to install, configure, and use it.

For community plugins, please refer to the installation instructions of that plugin to learn about any required configurations.

## What’s Next 🚀

- Learn how to [create your own plugin](create.md).
- Learn how to [create a fulfillment provider](../shipping/add-fulfillment-provider.md) or a [payment provider](../payment/how-to-create-payment-provider.md).
