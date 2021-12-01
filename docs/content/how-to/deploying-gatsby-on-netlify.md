---
title: "Deploying your Gatsby storefront on Netlify"
---

# Deploying your Gatsby storefront on Netlify

This is a guide for deploying our [Gatsby storefront starter](https://github.com/medusajs/gatsby-starter-medusa) on Netlify. Netlify is a platform that offers hosting and backend services for applications and static websites. The steps in this guide will work for most Gatsby projects.

> At this point, you should have a local Gatsby storefront project running. If not, check out [our starter](https://github.com/medusajs/gatsby-starter-medusa) or use `npx create-medusa-app` to set up your application in a matter of minutes. For the latter, see [this guide](https://docs.medusajs.com/how-to/create-medusa-app) for a small walkthrough.

### 1. Install the Netlify CLI

Install Netlify CLI on your machine using npm:

```shell=
npm install netlify-cli -g
```

### 2. Login to your Netlify account

Connect to your Netlify account from your terminal:

```shell=
netlify login
```

Follow the instructions in your terminal.

### 3. Netlify setup

In order to deploy the project to Netlify, you need to create a new site, link the storefront Git repository to the site and configure environment variables.

The Netlify CLI is used to achieve this.

#### Create a new site

```shell=
netlify init
```

Follow the instructions in your terminal to authorize and connect your Git repository.

The default build and deploy settings fit the needs of a Gatsby application, so leave these as is.

#### Add an environment variable

```shell=
netlify env:set GATSBY_STORE_URL "https://your-medusa-server.com"
```

The above environment variable should point to your Medusa server.

### 4. Push and deploy

Finally to deploy the storefront, commit and push your changes to the repository connected in step 3.

```shell=
git add .
git commit -m "Deploy Medusa Admin on Netlify"
git push origin main
```

Within a couple of minutes, your Gatsby storefront is up and running on Netlify.

> If you experience CORS issues in your new setup, you might need to add your storefront url as part of the STORE_CORS environment variable in your server setup.

### What's next?

If you haven't deployed your Medusa server to use with your new storefront, check out our guide [Deploying on Heroku](https://docs.medusajs.com/how-to/deploying-on-heroku).

Gatsby is not your thing? Check out our [Next.js storefront starter](https://github.com/medusajs/nextjs-starter-medusa).
