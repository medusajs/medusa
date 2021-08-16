<p align="center">
  <a href="https://www.medusa-commerce.com">
    <img alt="Medusa" src="https://user-images.githubusercontent.com/7554214/129161578-19b83dc8-fac5-4520-bd48-53cba676edd2.png" width="100" />
  </a>
</p>
<h1 align="center">
  Medusa
</h1>
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
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## 🚀 Quickstart

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

After these four steps and only a couple of minutes, you now have a complete commerce engine running locally. You may now explore [the documentation](https://docs.medusa-commerce.com/api) to learn how to interact with the Medusa API. You may also add [plugins](https://github.com/medusajs/medusa/tree/master/packages) to your Medusa store by specifying them in your `medusa-config.js` file.

## 🛒 Setting up a storefront for your Medusa engine
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

## ☁️ Linking development to Medusa Cloud
With your project in local development you can link your Medusa instance to Medusa Cloud - this will allow you to manage your store, view orders and test out the amazing functionalities that you are building. Linking your project to Medusa Cloud requires that you have a Medusa Cloud account.

1. **Authenticate your CLI with Medusa Cloud:**
   ```
   medusa login
   ```
2. **Link project**
   ```
   medusa link --develop
   ```

You can now navigate to Orders in Medusa Cloud to view the orders in your local Medusa project, just like you would if your store was running in production.

## Database support
In production Medusa requires Postgres and Redis, but SQLite is supported for development and testing purposes. If you plan on using Medusa for a project it is recommended that you install Postgres and Redis on your dev machine.

- [Install PostgreSQL](https://www.postgresql.org/download/)
- [Install Redis](https://redis.io/download)

To use Postgres and Redis you should provide a `database_url` and `redis_url` in your `medusa-config.js`.

## Contribution

Medusa is all about the community. Therefore, we would love for you to help us build the most robust and powerful commerce engine on the market. Whether its fixing bugs, improving our documentation or simply spreading the word, please feel free to join in.

## Repository structure

The Medusa repository is a mono-repository managed using Lerna. Lerna allows us to have all Medusa packages in one place, and still distribute them as separate NPM packages.

## Licensed

Licensed under the [MIT License](https://github.com/medusajs/medusa/blob/master/LICENSE)

## Thank you!
