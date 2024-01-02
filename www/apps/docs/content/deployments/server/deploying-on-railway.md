---
description: 'Learn step-by-step.'
addHowToData: true
---

# Deploy Your Medusa Backend to Railway

In this document, you’ll learn how to deploy your Medusa backend to Railway.

## What is Railway

[Railway](https://railway.app/) is a hosting provider that you can use to deploy web applications and databases without having to worry about managing the full infrastructure.

Railway provides a free trial (no credit card required) that allows you to deploy your Medusa backend along with PostgreSQL and Redis databases. This is useful mainly for development and demo purposes.

:::note

If you're deploying the admin plugin along with the backend, you'll need at least the Developer plan. The resources provided by the starter plan will cause memory errors.

:::

If you also don't have a Medusa project, you can deploy to Railway instantly with this button:

<a 
  href="https://railway.app/template/zC7eOq?referralCode=TW4Qi0" className="img-url no-zoom-img">
  <img src="https://railway.app/button.svg" alt="Deploy with Railway" className="no-zoom-img"/>
</a>

---

## Prerequisites

### Medusa Backend

It is assumed that you already have a Medusa backend installed locally. If you don’t, please follow the [quickstart guide](../../development/backend/install.mdx).

Furthermore, your Medusa backend should be configured to work with PostgreSQL and Redis. You can follow the [Configure your Backend documentation](./../../development/backend/configurations.md) to learn how to do that.

### Production Modules

If you're using development modules for events and caching, it's highly recommended to install production modules instead. These can be:

- [Redis Event Module](../../development/events/modules/redis.md)
- [Redis Cache Module](../../development/cache/modules/redis.md)

### Needed Accounts

- A [Railway](https://railway.app/) account.
- A [GitHub](https://github.com/) account to create a repository to host your backend's codebase.

### Required Tools

- Git’s CLI tool. You can follow [this documentation to learn how to install it for your operating system](./../../development/backend/prepare-environment.mdx#git).

---

## (Optional) Step 1: Add Nixpacks Configurations

If you've created your project using `create-medusa-app`, you might receive errors during the deployment process as Railway uses NPM by default. To avoid that, you need to configure Nixpacks to either use `yarn` or add the `--legacy-peer-deps` option to `npm install`.

In the root of your Medusa project, add the `nixpacks.toml` file with the following content:

```toml
[phases.setup]
nixPkgs = ['nodejs', 'yarn']

[phases.install]
cmds=['yarn install']
```

---

## Step 2: Create GitHub Repository

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

## Step 3: Deploy to Railway

In this section, you’ll create the PostgreSQL and Redis databases first, then deploy the backend from the GitHub repository. 

### Create the PostgreSQL Database

On the Railway dashboard:

1. Click on the ”New Project**”** button.
2. Choose from the dropdown the ”Provision PostgreSQL” option.

A new database will be created and, after a few seconds, you will be redirected to the project page where you will see the newly-created database.

### Create the Redis Database

In the same project view:

1. Click on the New button.
2. Choose the Database option.
3. Choose Add Redis.

A new Redis database will be added to the project view in a few seconds. Click on it to open the database sidebar.


### Note about Modules

If you use modules that require setting up other resources, make sure to add them at this point. This guide does not cover configurations specific to a module.

### Deploy the Medusa Backend Repository

In the same project view:

1. Click on the New button.
2. Choose the ”GitHub Repo” option.
3. If you still haven't given GitHub permissions to Railway, choose the ”Configure GitHub App” option to do that.
4. Choose the repository from the GitHub Repo dropdown.

:::tip

If the GitHub repositories in the dropdown are stuck on loading and aren't showing, you might need to delete the project and start over. This only happens before you configure your account with GitHub.

:::

It will take the backend a few minutes for the deployment to finish. It may fail since you haven't added the environment variables yet.

### Configure Environment Variables

To configure the environment variables of your Medusa backend:

1. Click on the GitHub repository’s card.
2. Choose the Variables tab.
3. Add the following environment variables:

```bash
PORT=9000
JWT_SECRET=something
COOKIE_SECRET=something
DATABASE_URL=${{postgresql.DATABASE_URL}}
REDIS_URL=${{redis.REDIS_URL}}
DATABASE_TYPE=postgres
```

Notice that the values of `DATABASE_URL` and `REDIS_URL` reference the values from the PostgreSQL and Redis databases you created.

:::warning

It’s highly recommended to use strong, randomly generated secrets for `JWT_SECRET` and `COOKIE_SECRET`.

:::

Make sure to add any other environment variables that are relevant for you here. For example, you can add environment variables related to Medusa admin or your modules.

### Change Start Command

The start command is the command used to run the backend. You’ll change it to run any available migrations, then run the Medusa backend. This way if you create your own migrations or update the Medusa backend, it's guaranteed that these migrations are run first before the backend starts.

To change the start command of your Medusa backend:

1. Click on the GitHub repository’s card.
2. Click on the Settings tab and scroll down to the Deploy section.
3. Paste the following in the Start Command field:

```bash
medusa migrations run && medusa start
```

### Add Domain Name

The last step is to add a domain name to your Medusa backend. To do that:

1. Click on the GitHub repository’s card.
2. Click on the Settings tab and scroll down to the Environment section.
3. Either click on the Custom Domain button to enter your own domain or the Generate Domain button to generate a random domain.

---

## Step 4: Test the Backend

Every change you make to the settings redeploys the backend. You can check the Deployments of the backend by clicking on the GitHub repository’s card and choosing the Deployments tab.

After the backend is redeployed successfully, open the app in your browser using the domain name. For example, you can open the URL `<YOUR_APP_URL>/store/products` which will return the products available on your backend.

:::tip

If you generated a random domain, you can find it by clicking on the GitHub repository’s card → Deployment tab.

:::

### Health Route

You can access `/health` to get health status of your deployed backend.

### Testing the Admin

:::note

Make sure to either set the `autoRebuild` option of the admin plugin to `true` or add its [build](../../admin/configuration.md#build-command-options) command as part of the start command of your backend.

:::

If you deployed the admin dashboard alongside the backend, you can test it by going to `<YOUR_APP_URL>/app`. If you changed the admin path, make sure to change `/app` to the path you've set.

---

## Troubleshooting

If you run into any issues or a problem with your deployed backend, you can check the logs in your Railway container instance by:

1. Click on the GitHub repository’s card.
2. Click on the Deployments tab.
3. Click on the View Logs button.

### Error: connect ENOENT

This error may be thrown by a module that uses Redis. If you see it in your build or deploy logs, make sure that your Redis configurations are correct.

---

## Run Commands on the Backend

To run commands on your backend, you can use [Railway’s CLI tool to run a local shell and execute commands](https://docs.railway.app/develop/cli#local-shell).

For example, you can run commands on the backend to seed the database or create a new user using [Medusa’s CLI tool](../../cli/reference.mdx).

### Create Admin User

You can create an admin user by running the following command in the root of your Medusa project:

```bash
railway run npx medusa user --email admin@medusa-test.com --password supersecret
```

---

## See Also

- [Deploy the Medusa Admin](../admin/index.mdx)
- [Deploy the Storefront](../storefront/index.mdx)
