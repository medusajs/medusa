---
description: 'Learn step-by-step.'
addHowToData: true
---

# Deploy Your Medusa Backend to Railway

In this document, you’ll learn how to deploy your Medusa backend to Railway.

## What is Railway

[Railway](https://railway.app/) is a hosting provider that you can use to deploy web applications and databases without having to worry about managing the full infrastructure.

Railway provides a free plan that allows you to deploy your Medusa backend along with PostgreSQL and Redis databases. This is useful mainly for development and demo purposes.

---

## Prerequisites

### Medusa Backend

It is assumed that you already have a Medusa backend installed locally. If you don’t, please follow the [quickstart guide](../../development/backend/install.mdx).

Furthermore, your Medusa backend should be configured to work with PostgreSQL and Redis. You can follow the [Configure your Backend documentation](./../../development/backend/configurations.md) to learn how to do that.

### Needed Accounts

- A [Railway](https://railway.app/) account.
- A [GitHub](https://github.com/) account to create a repository to host your backend's codebase.

### Required Tools

- Git’s CLI tool. You can follow [this documentation to learn how to install it for your operating system](./../../development/backend/prepare-environment.mdx#git).

---

## Changes to Medusa Backend Codebase

By default, Railway looks for a Dockerfile in the root of the codebase. If there is one, it will try to deploy your backend using it.

As this guide doesn't use Docker, make sure to delete `Dockerfile` from the root of your Medusa backend.

---

## Create GitHub Repository

Before you can deploy your Medusa backend you need to create a GitHub repository and push the code base to it.

On GitHub, click the plus icon at the top right, then click New Repository.

You’ll then be redirected to a new page with a form. In the form, enter the Repository Name then scroll down and click Create repository.

### Push Code to GitHub Repository

The next step is to push the code to the GitHub repository you just created.

After creating the repository, you’ll be redirected to the repository’s page. On that page, you should see a URL that you can copy to connect your repository to a local directory.

Copy the link. Then, open your terminal in the directory that holds your Medusa backend codebase and run the following commands:

```bash
git init
git remote add origin <GITHUB_URL>
```

Where `<GITHUB_URL>` is the URL you just copied.

Then, add, commit, and push the changes into the repository:

```bash
git add .
git commit -m "initial commit"
git push
```

After pushing the changes, you can find the files in your GitHub repository.

---

## Deploy to Railway

In this section, you’ll create the PostgreSQL and Redis databases first, then deploy the backend from the GitHub repository. 

### Create the PostgreSQL Database

On the Railway dashboard:

1. Click on the ”New Project**”** button.
2. Choose from the dropdown the ”Provision PostgreSQL” option.

A new database will be created and, after a few seconds, you will be redirected to the project page where you will see the newly-created database.

To find the PostgreSQL database URL which you’ll need later:

1. Click on the PostgreSQL card.
2. Choose the Connect tab.
3. Copy the Postgres Connection URL.

### Create the Redis Database

In the same project view:

1. Click on the New button.
2. Choose the Database option.
3. Choose Add Redis**.**

A new Redis database will be added to the project view in a few seconds. Click on it to open the database sidebar.

To find the Redis database URL which you’ll need later:

1. Click on the Redis card.
2. Choose the Connect tab.
3. Copy the Redis Connection URL.


### Note about Modules

If you use modules that require setting up other resources, make sure to add them at this point. This guide does not cover configurations specific to a module.

### Deploy the Medusa Backend Repository

In the same project view:

1. Click on the New button.
2. Choose the ”GitHub Repo” option.
3. Choose the ”Configure GitHub App” option to give Railway permission to read and pull your code from GitHub.
4. Choose the repository from the GitHub Repo dropdown.

:::tip

If the GitHub repositories in the dropdown are stuck on loading and aren't showing, you might need to delete the project and start over. This only happens before you configure your account with GitHub.

:::

It will take the backend a few minutes to deploy successfully.

### Configure Environment Variables

To configure the environment variables of your Medusa backend:

1. Click on the GitHub repository’s card.
2. Choose the Variables tab.
3. Add the following environment variables:

```bash
PORT=9000
JWT_SECRET=something
COOKIE_SECRET=something
DATABASE_URL=<YOUR_DATABASE_URL>
REDIS_URL=<YOUR_REDIS_URL>
```

Where `<YOUR_DATABASE_URL>` and `<YOUR_REDIS_URL>` are the URLs you copied earlier when you created the PostgreSQL and Redis databases respectively.

:::warning

It’s highly recommended to use strong, randomly generated secrets for `JWT_SECRET` and ****`COOKIE_SECRET`.

:::

### Change Start Command

The start command is the command used to run the backend. You’ll change it to run any available migrations, then run the Medusa backend. This way if you create your own migrations or update the Medusa backend, it's guaranteed that these migrations are run first before the backend starts.

To change the start command of your Medusa backend:

1. Click on the GitHub repository’s card.
2. Click on the Settings tab and scroll down to the Service section.
3. Paste the following in the Start Command field:

```bash
medusa migrations run && medusa develop
```

### Add Domain Name

The last step is to add a domain name to your Medusa backend. To do that:

1. Click on the GitHub repository’s card.
2. Click on the Settings tab and scroll down to the Domains section.
3. Either click on the Custom Domain button to enter your own domain or the Generate Domain button to generate a random domain.

---

## Test the Backend

Every change you make to the settings redeploys the backend. You can check the Deployments of the backend by clicking on the GitHub repository’s card and choosing the Deployments tab.

After the backend is redeployed successfully, open the app in your browser using the domain name. For example, you can open the URL `<YOUR_APP_URL>/store/products` which will return the products available on your backend.

:::tip

If you generated a random domain, you can find it by clicking on the GitHub repository’s card → Deployment tab.

:::

---

## Troubleshooting

If you run into any issues or a problem with your deployed backend, you can check the logs in your Railway container instance by:

1. Click on the GitHub repository’s card.
2. Click on the Deployments tab.
3. Click on the View Logs button.

---

## Run Commands on the Backend

To run commands on your backend, you can use [Railway’s CLI tool to run a local shell and execute commands](https://docs.railway.app/develop/cli#local-shell).

For example, you can run commands on the backend to seed the database or create a new user using [Medusa’s CLI tool](../../cli/reference.md).

---

## See Also

- [Deploy the Medusa Admin](../admin/index.mdx)
- [Deploy the Gatsby Storefront to Netlify](../storefront/deploying-gatsby-on-netlify.md)
