# Deploying on DigitalOcean App Platform

This is a guide for deploying a Medusa project on DigitalOcean App Platform.

> It is assumed, that you are currently running a local instance of Medusa. If not, check out our [Quickstart](https://docs.medusajs.com/quickstart/quick-start) or use `npx create-medusa-app` to set up your application in a matter of minutes. For the latter, see [this guide](https://docs.medusajs.com/how-to/create-medusa-app) for a small walkthrough.

### 1. Configure Medusa

Before jumping into DigitalOcean, your Medusa application needs to be configured.

#### Update `medusa-config.js`

Instead of using a single environment variable for the database, `DATABASE_URL`, set `DB_*` variables and declare `DATABASE_URL` like so:

```javascript=
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE;

const DATABASE_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

```

Update `module.exports` to include the following:

```javascript=
module.exports = {
  projectConfig: {
    redis_url: REDIS_URL,
    database_url: DATABASE_URL,
    database_type: "postgres",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
    database_extra: { ssl: { rejectUnauthorized: false } }
  },
  plugins,
};
```

#### Update `package.json`

Update `scripts` to have the following:

```json=
...
"scripts": {
    "serve": "medusa start",
    "start": "medusa migrations run && medusa develop",
    "build": "babel src -d dist --extensions \".ts,.js\""
}
...
```

Add a newer version of node to `engines`:

```json=
...
"engines": {
    "node": "14.x"
}
...
```

#### Push changes to your repository

```shell=
git add .
git commit -m "chore: DigitalOcean setup"
git push origin master
```

### 2. [DigitalOcean](https://cloud.digitalocean.com/login)

[Sign in](https://cloud.digitalocean.com/login) to your DigitalOcean Account or [create a new one](https://cloud.digitalocean.com/registrations/new).

### 3. Create an App

Navigate to the top-right dropdown **Create** and select **Apps**.

### 4. Connect you Git repository

Choose **GitHub** or **GitLab** and select the repository that holds your Medusa project. Check **Autodeploy code changes**, if you want DigitalOcean to deploy on every push to your repository.

> It's important, that DigitalOcean is pointing to the directory holding the Medusa store engine as it is only this which that will be deployed (If you followed the quickstart guide this will simply be the created project, and if you used the npx command this will be the backend folder inside of the newly created project).

### 5. Configure environment variables

The default settings for your app should be sufficient. We only need to change environment variables to hold the following:

```shell=
DB_USERNAME=${db.USERNAME}
DB_PASSWORD=${db.PASSWORD}
DB_HOST=${db.HOSTNAME}
DB_PORT=${db.PORT}
DB_DATABASE=${db.DATABASE}
REDIS_URL=${redis.DATABASE_URL}
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret
```

> Make sure to use actual secrets in a production environment

### 6. Set up a Database

Click **Add a Database**. If you named your database instance something different than `db`, make sure your environment variable reflect this. See our use of `db` below.

```shell=
DB_USERNAME=${db.USERNAME}
```

### 7. Give your app a name

Enter a name for your app and select the most suitable region for your setup.

### 8. Finalize the setup

Choose a plan for your App. For just getting started, the Basic plan should be sufficient. For a production environment, the **Pro plan** is recommended.

Finally, launch the app.

### 9. Add a Redis Database

The following steps will add a Redis database to your Medusa setup.

1. Navigate to the top-right dropdown **Create** and select **Databases**
2. Select **Redis**
3. Select the same region you chose for your App
4. Leave VPC Network as it is
5. Choose a name for your Redis Database

Similarly to our other database, if you choose to name Redis something different than `redis`, you should udpdate the environment variable as well. See our use of `redis` below.

```shell=
REDIS_URL=${redis.DATABASE_URL}
```

6.  Create the Redis database for your project

### 10. Configure Redis for your App

1. In the navbar on the left, click **Apps** and select your Medusa App
2. Select **Settings** ➜ **Add component** ➜ **Database**
3. Select **Previously Created DigitalOcean Database**
4. Select the Redis Cluster created in the previous step

### 11. Deploy Medusa

If you haven't already, make sure to rebuild and deploy your Medusa App.

### 12. Try it out!

In DigitalOcean, navigate to your App overview and access your endpoint to try out your new setup.

```
https://your-endpoint.ondigitalocean.app/health
```

### What's next?

You now have an application running on DigitalOcean. This can be scaled and configured to fit your business needs.

Furthermore, you can deploy a Medusa Admin for your application, such that you can start managing your store from an interface.

- [Deploy Admin on Netlify](https://docs.medusajs.com/how-to/deploying-admin-on-netlify)
- Deploy Admin on Gatsby Cloud (Coming soon)
