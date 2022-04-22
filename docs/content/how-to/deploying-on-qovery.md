# Deploying on Qovery

This is a guide for deploying a Medusa project to Qovery. Qovery is a Continuous Deployment Platform, that provides you with the developer experience of Heroku on top of your cloud provider (e.g. AWS, DigitalOcean).

:::note

We assume, that you are currently running a local instance of Medusa. If not, check out our [Quickstart](https://docs.medusajs.com/quickstart/quick-start) or use `npx create-medusa-app` to set up your application in a matter of minutes. For the latter, see [this guide](https://docs.medusajs.com/how-to/create-medusa-app) for a small walkthrough.

:::

### 1. Qovery Console

Create an account on [Qovery](https://www.qovery.com/) on their free community plan and jump into the console.

### 2. Setup

Create a project and an environment.

### 3. Add your Medusa app

Add a new app to your Qovery environment and connect the Git repository that holds your Medusa project. In your application settings, set the port to 9000 unless something else is specified in your setup.

:::note

If you used our `npx` starter, your repository will most likely hold all components; storefront, admin and backend. Ensure that **Root application path** in Qovery is pointing to your Medusa project (`/backend`).

:::

### 4. Add a database

Navigate to your environment overview and add the databases required by Medusa.

- Add Postgres database version 10, 11 or 12
- Add Redis database version 5 or 6

### 5. Configure Medusa

Our Medusa project needs a bit of configuration to fit the needs of Qovery.

#### Update `medusa-config.js`

First, add the Postgres and Redis database url to your `medusa-config.js`. In Qovery, click on your Medusa app in the environment overview. Navigate to environment variables in the sidebar on the left. Among the secret variables you should find your database urls. They should look something like this:

```bash
QOVERY_REDIS_123456789_DATABASE_URL
QOVERY_POSTGRESQL_123456789_DATABASE_URL
```

Add these to your `medusa-config.js`.

```js
const DATABASE_URL = process.env.QOVERY_POSTGRESQL_123456789_DATABASE_URL
const REDIS_URL= process.env.QOVERY_REDIS_123456789_DATABASE_URL
```

Furthermore, update `module.exports` to include the following:

```js
module.exports = {
  projectConfig: {
    redis_url: REDIS_URL,
    database_url: DATABASE_URL,
    database_type: "postgres",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
    database_extra: { }
  },
  plugins,
};
```

:::caution IMPORTANT

We are using the Qovery community plan, that does not allow SSL connections for the database, so this is disabled.

In a production environment, you would need the following in the config:
 `database_extra: { ssl: { rejectUnauthorized: false } }`

:::

#### Add some extra variables

We need to add a couple of more environment variables in Qovery. Add the following variables in your Console with an application scope:

```bash
JTW_SECRET=something_secret_jwt
COOKIE_SECRET=something_secret_cookie
```

:::note

Make sure to use actual secrets in a production environment.

:::

#### Update `package.json`

Update `scripts` to the following:

```json
"scripts": {
    "serve": "medusa start",
    "start": "medusa migrations run && medusa start",
    "prepare": "npm run build",
    "build": "babel src -d dist --extensions \".ts,.js\""
  },
```

### 6. Deploy Medusa

Finally, deploy your Redis and Postgres followed by your Medusa application.

#### Deploy databases

In your environment overview in Qovery, deploy your databases one after the other. Only when these are deployed, proceed to next step.

#### Push changes to your repository

To initialise your first build Qovery, simply commit and push your changes.

```bash
git add .
git commit -m "chore: Qovery setup"
git push origin main
```

### 6. Try it out!

In Qovery, click on your Medusa app in the environment overview. In the top right you are able to open up your application. Navigate to `/health` to ensure, that the app is running.

### What's next?

You now have an application running on Qovery. This can be scaled and configured to fit your business needs. As mentioned, we used the community plan, so this should be upgraded when moving to production.

Furthermore, you can deploy Medusa Admin for your application, such that you can start managing your store from an interface.

- [Deploy Admin on Netlify](https://docs.medusajs.com/how-to/deploying-admin-on-netlify)
- Deploy Admin on Gatsby Cloud (Coming soon)
