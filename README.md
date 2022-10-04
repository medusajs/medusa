<p align="center">
  <a href="https://www.medusajs.com">
    <img alt="Medusa" src="https://user-images.githubusercontent.com/7554214/153162406-bf8fd16f-aa98-4604-b87b-e13ab4baf604.png" width="100" />
  </a>
</p>
<h1 align="center">
  Medusa
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://demo.medusajs.com/">Medusa Admin Demo</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
An open-source composable commerce engine built for developers.
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

## Getting Started

You can install Medusa by either following our [Quickstart guide](https://docs.medusajs.com/quickstart/quick-start) or the following steps:

1. **Install Medusa CLI**

    ```bash
    npm install -g @medusajs/medusa-cli
    ```

2. **Create a new Medusa project**

    ```bash
    medusa new my-medusa-store --seed
    ```

3. **Start your Medusa engine**

    ```bash
    cd my-medusa-store
    medusa develop
    ```

### Requirements

- Node v14.0 or higher.
- SQLite or PostgreSQL (SQLite is only for getting started; PostgreSQL is recommended)
- Redis

You can check out [this documentation for more details about setting up your environment](https://docs.medusajs.com/tutorial/set-up-your-development-environment).

## What is Medusa?

Medusa is an open source composable commerce engine built with Node.js. Medusa enables developers to build scalable and sophisticated commerce setups with low effort and great developer experience.

You can learn more about [Medusa’s architecture in our documentation](https://docs.medusajs.com/introduction).

### Features

- **Orders, Exchanges, and Returns APIs:** Aside from the standard order management that comes with ecommerce platforms, Medusa also provides an easy and automated way to manage swaps, returns, and claims.
- **Products and Collections APIs:** Add products with extensive customization settings and sort them into collections.
- **Region API:** Configure and manage multiple regions and currencies all from one platform.
- **Plugin API:** Easily integrate fulfillment providers, payment providers, notification services, and many other custom tools and third-party services.
- ****PriceList and Promotions APIs:**** Advanced pricing for products with conditions based on its amount in the cart or promotions and discounts.
- **Tax API:** Advanced tax configurations specific to multiple regions, with capability of specifying taxes for specific products.

See more of the [ecommerce features on our documentation](https://docs.medusajs.com/#features).

## Roadmap

Write-ups for all features will be made available in [Github discussions](https://github.com/medusajs/medusa/discussions) prior to starting the implementation process.

### **2022**

- [x]  Admin revamp
- [x]  Tax API
- [x]  Tax Calculation Strategy
- [x]  Cart Calculation Strategy
- [x]  Customer Groups API
- [x]  Promotions API
- [x]  Price Lists API
- [x]  Price Selection Strategy
- [ ]  Import / Export API
- [ ]  Sales Channel API
- [ ]  Extended Product API (custom fields, publishing control, and more)
- [ ]  Extended Order API (managing placed orders, improved inventory control, and more)
- [ ]  Multi-warehouse support
- [ ]  GraphQL API

## Plugins

As a headless and extendible solution, Medusa allows you to integrate third-party services or add custom features into Medusa by installing Plugins.

Check out [our available plugins](https://github.com/medusajs/medusa/tree/master/packages) that you can install and use instantly on your Medusa server.

## Contributions

Medusa is all about the community. Therefore, we would love for you to help us build the most robust and powerful commerce engine on the market.

Whether it is fixing bugs, improving our documentation or simply spreading the word, please feel free to join in. Please check [our contribution guide](https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md) for further details about how to contribute.

## Community & Support

Use these channels to be part of the community, ask for help while using Medusa, or just learn more about Medusa:

- [Discord](https://discord.gg/medusajs): This is the main channel to join the community. You can ask for help, showcase your work with Medusa, and stay up to date with everything Medusa.
- [GitHub Issues](https://github.com/medusajs/medusa/issues): for sending in any issues you face or bugs you find while using Medusa.
- [GitHub Discussions](https://github.com/medusajs/medusa/discussions): for joining discussions and submitting your ideas.
- [Medusa Blog](https://medusajs.com/blog/): find diverse tutorials and company news.
- [Twitter](https://twitter.com/medusajs)
- [LinkedIn](https://www.linkedin.com/company/medusajs)

## Upgrade Guides

Follow our [upgrade guides](https://docs.medusajs.com/advanced/backend/upgrade-guides/) on the documentation to keep your Medusa project up-to-date.

## License

Licensed under the [MIT License](https://github.com/medusajs/medusa/blob/master/LICENSE)
