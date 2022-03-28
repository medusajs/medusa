<p align="center">
  <a href="https://www.medusajs.com">
    <img alt="Medusa" src="https://user-images.githubusercontent.com/7554214/153162406-bf8fd16f-aa98-4604-b87b-e13ab4baf604.png" width="100" />
  </a>
</p>
<h1 align="center">
  Medusa
</h1>

<h4 align="center">
  <a href="https://github.com/medusajs/admin">Medusa Admin</a> |
  <a href="https://www.medusajs.com">Website</a> |
  <a href="https://www.medusajs.com/blog">Blog</a> |
  <a href="https://www.linkedin.com/company/medusa-commerce">LinkedIn</a> |
  <a href="https://twitter.com/medusajs">Twitter</a> |
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://medusajs.notion.site/medusajs/Medusa-Home-3485f8605d834a07949b17d1a9f7eafd">Notion</a>
</h4>

<p align="center">
Medusa is an open-source headless commerce engine that enables developers to create amazing digital commerce experiences.
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
  </a>
  <a href="https://circleci.com/gh/medusajs/medusa">
    <img src="https://circleci.com/gh/medusajs/medusa.svg?style=shield" alt="Current CircleCI build status." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/medusa"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Quickstart

1. **Install Medusa CLI**
   ```bash
   npm install -g @medusajs/medusa-cli
   ```
2. **Create a new Medusa project**
   ```
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

We have a prebuilt admin dashboard that you can use to configure and manage your store find it here: [Medusa Admin](https://github.com/medusajs/admin)

After these four steps and only a couple of minutes, you now have a complete commerce engine running locally. You may now explore [the documentation](https://docs.medusajs.com/api) to learn how to interact with the Medusa API. You may also add [plugins](https://github.com/medusajs/medusa/tree/master/packages) to your Medusa store by specifying them in your `medusa-config.js` file.

## Roadmap 2022

Write-ups for all features will be made available in [Github discussions](https://github.com/medusajs/medusa/discussions) prior to starting the implementation process.

### Q1
- [x] Admin revamp
- [x] Tax API
- [x] Strategy pattern
- [ ] Promotions API
- [ ] Bulk import / export

### Q2
- [ ] Extended Product API (custom fields, price lists, publishing control, and more)
- [ ] Extended Order API (managing placed orders, improved inventory control, and more)
- [ ] Sales Channel API
- [ ] Multi-warehouse support
- [ ] GraphQL API
  
## Setting up a storefront for your Medusa project

Medusa is a headless commerce engine which means that it can be used for any type of digital commerce experience - you may use it as the backend for an app, a voice application, social commerce experiences or a traditional e-commerce website, you may even want to integrate Medusa into your own software to enable commerce functionality. All of these are use cases that Medusa supports - to learn more read the documentation or reach out.

To provide a quick way to get you started with a storefront install one of our traditional e-commerce starters:

- [Gatsby Starter](https://github.com/medusajs/gatsby-starter-medusa)
  ```
  npm install -g gatsby-cli
  gatsby new my-medusa-storefront https://github.com/medusajs/gatsby-starter-medusa
  ```
- [Nextjs Starter](https://github.com/medusajs/nextjs-starter-medusa)
  ```
  npx create-next-app -e https://github.com/medusajs/nextjs-starter-medusa my-medusa-storefront
  ```

With your starter and your Medusa store running you can open http://localhost:8000 (for Gatsby) or http://localhost:3000 (for Nextjs) in your browser and view the products in your store, build a cart, add shipping details and pay and complete an order.

## Features

Medusa comes with a set of building blocks that allow you to create amazing digital commerce experiences, below is a list of some of the features that Medusa come with out of the box:

- **Headless**: Medusa is a highly customizable commerce API which means that you may use any presentation layer such as a website, app, chatbots, etc.
- **Regions** allow you to specify currencies, payment providers, shipping providers, tax rates and more for one or more countries for truly international sales.
- **Orders** come with all the functionality necessary to perform powerful customer service operations with ease.
- **Carts** allow customers to collect products for purchase, add shipping details and complete payments.
- **Products** come with relevant fields for customs, stock keeping and sales. Medusa supports multiple options and unlimited variants.
- **Swaps** allow customers to exchange products after purchase (e.g. for incorrect sizes). Accounting, payment and fulfillment plugins handle all the tedious work for you for automated customer service.
- **Claims** can be created if customers experience problems with one of their products. Plugins make sure to automate sending out replacements, handling refunds and collecting valuable data for analysis.
- **Returns** allow customers to send back products and can be configured to function in a 100% automated flow through accounting and payment plugins.
- **Fulfillment API** makes it easy to integrate with any fulfillment provider by creating fulfillment plugins, check the `/packages` directory for a full list of plugins.
- **Payments API** makes it easy to integrate with any payment provider by creating payment plugins, we already support Stripe, Paypal and Klarna.
- **Notification API** allow integrations with email providers, chatbots, Slack channels, etc.
- **Customer Login** to give customers a way of managing their data, viewing their orders and saving payment details.
- **Shipping Options & Profiles** enable powerful rules for free shipping limits, multiple fulfillment methods and more.
- **Medusa's Plugin Architecture** makes it intuitive and easy to manage your integrations, switch providers and grow with ease.
- **Customization** is supported for those special use cases that all the other e-commerce platforms can't accommodate.

## Database support

In production Medusa requires Postgres and Redis, but SQLite is supported for development and testing purposes. If you plan on using Medusa for a project it is recommended that you install Postgres and Redis on your dev machine.

- [Install PostgreSQL](https://www.postgresql.org/download/)
- [Install Redis](https://redis.io/download)

To use Postgres and Redis you should provide a `database_url` and `redis_url` in your `medusa-config.js`.

## Contribution

Medusa is all about the community. Therefore, we would love for you to help us build the most robust and powerful commerce engine on the market. Whether it is fixing bugs, improving our documentation or simply spreading the word, please feel free to join in. Please check [our contribution guide](https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md) for further details about how to contribute.

## Repository structure

The Medusa repository is a mono-repository managed using Lerna. Lerna allows us to have all Medusa packages in one place, and still distribute them as separate NPM packages.

## Licensed

Licensed under the [MIT License](https://github.com/medusajs/medusa/blob/master/LICENSE)

## Thank you!
