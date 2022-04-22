---
title: "Deploying Admin on Netlify"
---

# Deploying Admin on Netlify

This is a guide for deploying Medusa Admin on Netlify. Netlify is a platform that offers hosting and backend services for applications and static websites.

:::note

At this point, you should have a running instance of Medusa Admin. If not, check out [these steps](https://github.com/medusajs/admin#-setting-up-admin) or use `npx create-medusa-app` to set up your application in a matter of minutes. For the latter, see [this guide](https://docs.medusajs.com/how-to/create-medusa-app) for a small walkthrough.

:::

### 1. Install the Netlify CLI

Install Netlify CLI on your machine using npm:

```bash npm2yarn
npm install netlify-cli -g
```

### 2. Login to your Netlify account

Connect to your Netlify account from your terminal:

```bash
netlify login
```

Follow the instructions in your terminal.

### 3. Netlify setup

In order to deploy on Netlify, you need to create a new site, link the admin repository to the site and configure environment variables.

The Netlify CLI is used to achieve this.

#### Create a new site

```bash
netlify init
```

Follow the instructions in your terminal to authorize and connect your Git repository.

The default build and deploy settings fit the needs of a Gatsby application, so leave these as is.

#### Add an environment variable

```bash
netlify env:set GATSBY_MEDUSA_BACKEND_URL "https://your-medusa-server.com"
```

The above environment variable should point to your Medusa server.

### 4. Push and deploy

Finally to deploy the admin, commit and push your changes to the repository connected in step 3.

```bash
git add .
git commit -m "Deploy Medusa Admin on Netlify"
git push origin main
```

Within a couple of minutes, your Medusa Admin is live and running on Netlify.

:::note

If you experience CORS issues in your new setup, you might need to add your admin url as part of the ADMIN_CORS environment variable in your server setup.

:::

### What's next?

If you haven't deployed your Medusa server to use with your new admin, check out our guide [Deploying on Heroku](https://docs.medusajs.com/how-to/deploying-on-heroku).
