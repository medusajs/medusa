---
description: 'Learn step-by-step.'
addHowToData: true
---

# Deploy Your Medusa Backend to DigitalOcean Apps

In this document, you'll learn how to deploy your Medusa backend to a DigitalOcean App.

DigitalOcean is a reliable hosting provider that provides different ways to host websites and servers. One way to host a backend is using their DigitalOcean App Platform.

## Prerequisites

### Medusa Backend

It is assumed that you already have a Medusa backend installed locally. If you don’t, please follow the [quickstart guide](../../create-medusa-app.mdx).

Furthermore, your Medusa backend should be configured to work with PostgreSQL and Redis. You can follow the [Configure your Backend documentation](../../references/medusa_config/interfaces/medusa_config.ConfigModule.mdx) to learn how to do that.

### Needed Accounts

- A [DigitalOcean](https://cloud.digitalocean.com/registrations/new) account. You need to provide a payment method on sign up.
- A [GitHub](https://github.com/) account to create a repository to host your Medusa backend’s codebase.

:::tip

If you want to use another Git Provider supported by DigitalOcean, it’s possible to follow along with this guide but you’ll have to perform the equivalent steps in your Git Provider.

:::

### Required Tools

- Git’s CLI tool. You can follow [this documentation to learn how to install it for your operating system](../../development/backend/prepare-environment.mdx#git).

---

## Changes to package.json

Change the `start` script in `package.json` to the following:

```json
"start": "medusa migrations run && medusa start"
```

This ensures that Migrations are run every time the Medusa backend is restarted.

---

## Changes to medusa-config.js

In `medusa-config.js`, the `DATABASE_URL` variable is set to the environment variable `DATABASE_URL`. This needs to be changed as DigitalOcean provides the different details of the database connection separately.

Replace the previous declaration of `DATABASE_URL` in `medusa-config.js` with the following:

```js title="medusa-config.js"
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_DATABASE = process.env.DB_DATABASE

const DATABASE_URL = 
  `postgres://${DB_USERNAME}:${DB_PASSWORD}` + 
  `@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
```

In addition, you must add to `projectConfig` in the exported object a new property `database_extra`:

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    // ...
    database_extra: { ssl: { rejectUnauthorized: false } },
  },
}
```

Also, if you're planning on using scheduled jobs, you need to set the `redis_url` configurations:

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    // ...
    redis_url: process.env.REDIS_URL,
  },
}
```

---

## Changes to .gitignore

Your `.gitignore` may have `yarn.lock` and `package-lock.json` in it. If so, remove both or one of them to ensure they're committed with your code. Otherwise, you may face build errors after deployment.

---

## (Optional) Configure the Admin

If you're using the Medusa Admin plugin, you have two options to deploy it: either with the backend or separately.

### Deploying with the Backend

To deploy the admin with the backend:

1. Your chosen plan must offer at least 2GB of RAM.
2. Enable the [autoRebuild option](../../admin/configuration.mdx#plugin-options) of the admin plugin:

```js title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      // other options...
    },
  },
]
```

Alternatively, you can use a GitHub action to build the admin as explained [here](../index.mdx#deploy-admin-through-github-action).

### Deploying Separately

If you choose to deploy the admin separately, disable the admin plugin's [serve option](../../admin/configuration.mdx#plugin-options):

```js title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      // only enable `serve` in development
      // you may need to add the NODE_ENV variable
      // manually
      serve: process.env.NODE_ENV === "development",
      // other options...
    },
  },
]
```

This ensures that the admin isn't built or served in production. You can also change `@medusajs/admin` dependency to be a dev dependency in `package.json`.

You can alternatively remove the admin plugin for the plugins array.

:::tip

Refer to the [admin deployment guides on how to deploy the admin separately](../admin/index.mdx).

:::

---

## (Optional) Use Production Modules

If you're using development modules, such as the Local Event Bus or the In-Memory Cache Modules, it's highly recommended to use a production module instead.

Medusa provides a [Redis Event Bus](../../development/events/modules/redis.md) and a [Redis Cache Module](../../development/cache/modules/redis.md) that you can install and configure. Alternatively, you can use custom modules that integrate other services for these functionalities.

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
git branch -M <BRANCH>
```

Where:

- `<GITHUB_URL>` is the URL you just copied.
- `<BRANCH>` is the name of your default branch. Typically, it's either `main` or `master`. If you're unsure, you can find it on the repository's main page.

Then, add, commit, and push the changes into the repository:

```bash
git add .
git commit -m "initial commit"
git push origin <BRANCH>
```

Where, `<BRANCH>` is the default repository branch.

After pushing the changes, you can find the files in your GitHub repository.

---

## Deploy to DigitalOcean App

After logging into your account, click on the Create button at the top right, then choose Apps.

### Choose Repository

In the Create App page, choose GitHub from the Service Provider list.

If you haven’t given DigitalOcean access before, click on Manage Access under Source Code. You’ll then be redirected to GitHub to give DigitalOcean access.

Once DigitalOcean has access to your GitHub account, you should see a Repository input. Click on it and search for the repository you created earlier.

Additional inputs will show up to choose the Branch, Source Directory, and Autodeploy options.

If you host your Medusa backend in a monorepo, you should change the Source Directory to the directory the backend is available in the repository. Otherwise, it can be left as is.

Once you’re done, click Next to move on to the next step.

### Specify Web Service Resources

In the next step, you’ll see the resources to create.

:::note

If you have a Dockerfile available in the backend’s codebase, you’ll have two resources showing. You can remove it by clicking on the trash icon at the right of the resource.

:::

Click on the Edit button next to the Web Service, and ensure the following information is set correctly:

- Resource Type is set to Node.js
- HTTP Port is set to 9000
- HTTP Request Routes is set to `/`

Once you've set up everything correctly, click the Back button at the end of the form.

### Specify Database Resources

On the same page, expand the Add Resources section, choose Database, then click Add.

In the new page, you’ll be shown a PostgreSQL database to be created. Notice that it’s important to choose a name that you’ll remember as you’ll need the name in next steps. You can leave the name as is if it’s not necessary to change it.

Once you’re done, click Create and Attach. You’ll be redirected back to the previous page with the database added to the resources.

Once you’re done, click Next to move on to the next step.

### Set Environment Variables

In this section, you’ll add environment variables that are essential to your Medusa backend.

You should see two ways to add environment variables: Global or specific to the Web Service.

Click Edit on the second row to add environment variables specific to the Web Service. Add the following environment variables:

```bash
DB_USERNAME=${db.USERNAME}
DB_PASSWORD=${db.PASSWORD}
DB_HOST=${db.HOSTNAME}
DB_PORT=${db.PORT}
DB_DATABASE=${db.DATABASE}
REDIS_URL=${redis.DATABASE_URL}
JWT_SECRET=secret
COOKIE_SECRET=secret
NPM_CONFIG_PRODUCTION=false
YARN_PRODUCTION=false
NODE_ENV=production
```

:::warning

It’s highly recommended to use strong, randomly generated secrets for `JWT_SECRET` and `COOKIE_SECRET`.

:::

Notice how for database environment variables you access the values from the database you created earlier `db`. If you changed the name of the database, you must change `db` here to the name you supplied to the PostgreSQL database.

Another thing to note here is that you added a `REDIS_URL` environment variable that uses a `redis` resource to retrieve the URL. Redis is necessary if you're using Scheduled Jobs and if you're using Redis modules, such as the Redis Event Bus module. You’ll be creating the Redis resource in a later section.

If you're using modules that require setting other environment variables, make sure to set them here. You can also add them later.

Once you’re done click Save, then click Next to proceed to the next section.

### Finalize App

In the next section, you’ll be shown the app info and the region it will be deployed to. You can leave it all as is or make changes if you find it necessary.

Once you’re done, click Next to go to the next step.

In the final step, you can see a review of everything you created. If everything looks good, scroll down and click Create Resource.

### Create Redis Resource

While the backend is being deployed, you can create the Redis resource. To do that:

1. Click the Create button at the top right and choose Database from the dropdown.
2. In the new page under Choose a database engine, choose Redis.
3. Scroll down to the “Choose a unique database cluster name” input. Since you used the name `redis` in the `REDIS_URL` environment variables, change the value to `redis` here.
4. Once you’re done, click on Create Database Cluster.

### Attach Redis Database

Once the Redis database is created, you need to attach it to your app. To do that:

1. Go back to the App you created earlier by choose Apps in the sidebar then clicking on the App name.
2. Click at the white Create button at the top right and choose Create/Attach Database.
3. In the new page, click on the Previously Created DigitalOcean Database radio button. Then, under Database Cluster select the Redis database you just created.
4. Once you’re done click Attach Database. This will add the Redis database to the list of resources of your App and will trigger a redeploy of the App.

### Change Health Check Settings

By default, DigitalOcean will perform a health check immediately as the app runs. However, the Medusa backend requires some initial load-time before it's ready for a health check.

So, you must delay the app's health check to enure that the deployment doesn't fail. To do that:

1. On your app's page, click on the Settings page.
2. From the tabs before the settings section, choose the name of your web service resource.
3. Scroll down and find the "Health Checks" section, then click on "Edit" next to it.
4. In the section that opens, expand the "Show Advanced Parameters" section.
5. Find the "Initial Delay (s)" input and set its value to `300`.
6. Once done, click on the Save button.

This will redeploy your app, which should finish successfully.

---

## Test your Backend

Once the redeployment is complete, copy the URL of the App which can be found under the App’s name.

Then, go to `<YOUR_APP_URL>/store/products`. If the deployment was successful, you should receive a JSON response.

### Health Route

You can access `/health` to get health status of your deployed backend.

### Testing the Admin

If you deployed the [admin dashboard with the backend](#deploying-with-the-backend), you can test it by going to `<YOUR_APP_URL>/app`. If you changed the admin path, make sure to change `/app` to the path you've set.

---

## Troubleshooting

If errors occur in your deployment, you can find the logs by going to the Activity tab in your DigitalOcean App.

### ERROR: Failed to build / Project does not contain a package manager

If you find this error in your logs, make sure to remove `yarn.lock` or `package-lock.json` from the `.gitignore` file in your project, then commit the changes.

---

## Run Commands on Your Backend

To run commands on your backend, you can access the console on the App’s page by choosing the Console tab. This opens a console in your browser where you can run commands on your backend.

For example, you can run the following command to create a new admin user:

```bash
npx medusa user --email <EMAIL> --password <PASSWORD>
```

Make sure to replace `<EMAIL>` and `<PASSWORD>` with the credentials you want to give the user.

---

## Add Environment Variables

You’ll likely need to add environment variables later such as Admin Cross-Origin Resource Sharing (CORS) and Store CORS variables.

To add environment variables, on the App’s page click on Settings and choose the Web Service component.

Then, scroll down and find Environment Variables. You can expand the environment variables by clicking Edit on the right. Here, you can edit, add, and remove environment variables.

Once you click Save, the environment variables will be saved and a redeployment will be triggered.

---

## See Also

- [Deploy the Medusa Admin](../admin/index.mdx).
- [Deploy the Storefront](../storefront/index.mdx).
