<p align="center">
  <a href="https://nextjs.org/">
    <img alt="Next.js" src="https://medusa-public-images.s3.eu-west-1.amazonaws.com/nextjs.png" width="100" />
  </a>
</p>
<h1 align="center">
  Medusa Next.js Starter
</h1>
<p align="center">
Medusa is an open-source headless commerce engine that enables developers to create amazing digital commerce experiences.
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
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

> **Prerequisites**: To use the starter you should have a Medusa server running locally on port 9000. Check out [medusa-starter-default](https://github.com/medusajs/medusa-starter-default) for a quick setup.

## Quickstart

1. **Setting up the environment variables**

   Navigate into your projects directory and get your enviroment variables ready:

   ```shell
   cd nextjs-starter-medusa/
   mv .env.template .env.local
   ```

   Add your Stripe API key to your `.env.local`

   ```
   NEXT_PUBLIC_STRIPE_KEY=pk_test_something
   ```

2. **Install dependencies**

   Use Yarn to install all dependencies.

   ```shell
   yarn
   ```

3. **Start developing.**

   You are now ready to start up your project.

   ```shell
   yarn dev
   ```

4. **Open the code and start customizing!**

   Your site is now running at http://localhost:8000!

   Edit `/pages/index.js` to see your site update in real-time!

5. **Learn more about Medusa**

   - [Website](https://www.medusa-commerce.com/)
   - [GitHub](https://github.com/medusajs)
   - [Documentation](https://docs.medusa-commerce.com/)

6. **Learn more about Next.js**

   - [Documentation](https://nextjs.org/docs)
