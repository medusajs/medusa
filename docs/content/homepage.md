---
id: homepage
title: Overview
description: 'What is Medusa?'
slug: /
hide_table_of_contents: true
---

Welcome to Medusa, the open source Shopify alternative!

Medusa is an open-source headless commerce engine that enables developers to create amazing digital commerce experiences.

:::tip

Get started with Medusa in a few minutes with our [Quickstart guide](./quickstart/quick-start.md)!

:::

## Features

Medusa comes with a set of building blocks that allow you to create unique digital commerce experiences, below is a list of some of the features that Medusa comes with out of the box:

- **Headless**: Medusa is a highly customizable commerce API which means that you may use any presentation layer such as a website, app, chatbots, etc.
- **Regions** allow you to specify currencies, payment providers, shipping providers, tax rates, and more for one or more countries for truly international sales.
- **Orders** come with all the functionality necessary to perform powerful customer service operations with ease.
- **Carts** allow customers to collect products for purchase, add shipping details, and complete payments.
- **Products** come with relevant fields for customs, stock keeping, and sales. Medusa supports multiple options and unlimited variants.
- **Swaps** allow customers to exchange products after purchase (e.g. for incorrect sizes). Accounting, payment, and fulfillment plugins handle all the tedious work for you for automated customer service.
- **Claims** can be created if customers experience problems with one of their products. Plugins make sure to automate sending out replacements, handling refunds, and collecting valuable data for analysis.
- **Returns** allow customers to send back products and can be configured to function in 100% automated flow-through accounting and payment plugins.
- **Fulfillment API** makes it easy to integrate with any fulfillment provider by creating fulfillment plugins.
- **Payments API** makes it easy to integrate with any payment provider by creating payment plugins, we already support Stripe, Paypal, and Klarna.
- **Notification API** allows integrations with email providers, chatbots, Slack channels, etc.
- **Customer Login** gives customers a way of managing their data, viewing their orders, and saving payment details.
- **Shipping Options & Profiles** enable powerful rules for free shipping limits, multiple fulfillment methods, and more.
- **Medusa's Plugin Architecture** makes it intuitive and easy to manage your integrations, switch providers and grow with ease.
- **Customization** is supported for those special use cases that all the other e-commerce platforms can't accommodate.

## Where to Get Started

### The Medusa Server

You can follow our [quickstart guide](quickstart/quick-start.md) to install and run a Medusa server.

It's also recommended to learn how to [set up your development environment](tutorial/set-up-your-development-environment) with the required tools and services to run a Medusa server, then [configure your Medusa server](usage/configurations.md).

### The Medusa Admin

The Medusa Admin provides you with a lot of functionalities and configurations such as Product Management, Order Management, Discounts and Promotions, and more.

You can install the Medusa admin in 2 steps by following our [Medusa Admin quickstart guide](admin/quickstart.md).

### The Storefront

The final step is to set up a storefront to sell your products.

Medusa provides 2 starter storefronts, one built with [Next.js](./starters/nextjs-medusa-starter.md) and one with [Gatsby](./starters/gatsby-medusa-starter.md), that you can use to quickly set up your store and start selling.

Alternatively, you can build your own storefront with any frontend framework of your choice just by connecting to your server with the [Storefront REST APIs](https://docs.medusajs.com/api/store/collection).

## What’s Next 🚀

- Customize your Medusa server by creating your own [endpoints](./advanced/backend/endpoints/add-storefront.md), [services](./advanced/backend/services/create-service.md), and [subscribers](./advanced/backend/subscribers/create-subscriber.md).
- Check out guides under the Integrations section to install plugins for [CMS](./add-plugins/strapi.md), [Payment](./add-plugins/stripe.md), [Search Engines](./add-plugins/algolia.md), and more.
- Deploy your Medusa server in seconds on [Heroku](deployments/server/deploying-on-heroku.mdx), [Qovery](deployments/server/deploying-on-qovery.md), or [Digital Ocean](deployments/server/deploying-on-digital-ocean.md).

## Open Source Contribution

As Medusa is an open source platform, contributions to improve it and its documentation are welcome. In the GitHub repository here’s where you’ll find the different components you can contribute to:

- The core of the Medusa server resides in [`packages/medusa`](https://github.com/medusajs/medusa/tree/master/packages/medusa).
- You can also find all existing plugins under [the `packages` directory](https://github.com/medusajs/medusa/tree/master/packages).
- The documentation content resides in [`docs/content`](https://github.com/medusajs/medusa/tree/master/docs/content). The code for the documentation website is in [`www/docs`](https://github.com/medusajs/medusa/tree/master/www/docs).

You can find more details about contributing in [CONTRIBUTING.md](https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md).

## Community & Support

If you need any support during your development with Medusa, you can join our [Discord Server](https://discord.gg/medusajs). You will get help directly from our core team as well as our community.

By joining our Discord Server, you’ll also have the chance to participate in many events such as Bug Hunts and showcase your work with Medusa.
