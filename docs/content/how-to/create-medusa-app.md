---
title: Using create-medusa-app
---
# Using create-medusa-app
With the new `create-medusa-app` tool you will get your [Medusa](https://github.com/medusajs/medusa) development environment ready within a couple of minutes. After completion, you will have a Medusa backend, a Gatsby or Next.js storefront, and an admin dashboard up and running on your local machine.

Starting a new e-commerce project just got easier, now with one command.

## Getting started with `create-medusa-app`

Use `create-medusa-app` with npx:

```bash
npx create-medusa-app
```

Or Yarn:

```bash
yarn create medusa-app
```

Behind the scenes, `create-medusa-app` is populating your database with some initial set of mock data, which helps to interact with Medusa setup intuitively straight away. 

Right after hitting one of those commands, the multistep installation process will be initiated, so the starter can be shaped right for the specific needs.

### Destination folder

Enter the path to the directory that will become the root of your Medusa project:

```bash
? Where should your project be installed? › my-medusa-store
```

### Pick the starter you prefer

```bash
? Which Medusa starter would you like to install? …
❯ medusa-starter-default
  medusa-starter-contentful
  Other
```

You will be presented with three options:

- `medusa-starter-default` is the most lightweight version of a Medusa project
- `medusa-starter-contentful` almost like the default starter, but with `medusa-plugin-contentful` preinstalled
- `Other` if you have a different starter that you would wish to install from `Other` will give you the option of providing a URL to that starter. An additional question will be asked if you choose this option:

    ```bash
    Where is the starter located? (URL or path) › https://github.com/somecoolusername/my-custom-medusa-starter
    ```

For the walkthrough purposes, we assume that the selected starter is `medusa-starter-default` and proceed to the next step.

### Selecting a Storefront

After selecting your Medusa starter you will be given the option to install one of our storefront starters. At the moment we have starters for Gatsby and Next.js:

```bash
Which storefront starter would you like to install? …
❯ Gatsby Starter
  Next.js Starter
  None
```

You may also select `None` if the choice is to craft a custom storefront for your product. 

`create-medusa-app` now has all of the info necessary for the installation to begin.

```bash
Creating new project from git: https://github.com/medusajs/medusa-starter-default.git
✔ Created starter directory layout
Installing packages...
```

Once the installation has been completed you will have a Medusa backend, a demo storefront, and an admin dashboard.

## What's inside

Inside the root folder which was specified at the beginning of the installation process the following structure could be found:

```bash
/my-medusa-store
  /storefront // Medusa storefront starter
  /backend // Medusa starter as a backend option 
  /admin // Medusa admin panel 
```

`create-medusa-app` prints out the commands that are available to you after installation. When each project is started you can visit your storefront, complete the order, and view the order in Medusa admin.

```bash
⠴ Installing packages...
✔ Packages installed
Initialising git in my-medusa-store/admin
Create initial git commit in my-medusa-store/admin

  Your project is ready 🚀. The available commands are:

    Medusa API
    cd my-medusa-store/backend
    yarn start

    Admin
    cd my-medusa-store/admin
    yarn start

    Storefront
    cd my-medusa-store/storefront
    yarn start
```

## **What's next?**

To learn more about Medusa to go through our docs to get some inspiration and guidance for the next steps and further development:

- [Find out how to set up a Medusa project with Gatsby and Contentful](https://docs.medusajs.com/how-to/headless-ecommerce-store-with-gatsby-contentful-medusa)
- [Move your Medusa setup to the next level with some custom functionality](https://docs.medusajs.com/tutorial/adding-custom-functionality)
- [Create your own Medusa plugin](https://docs.medusajs.com/guides/plugins)

If you have any follow-up questions or want to chat directly with our engineering team we are always happy to meet you at our [Discord](https://discord.gg/DSHySyMu).
