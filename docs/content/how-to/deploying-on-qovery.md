# Deploying on Qovery
This is a guide for deploying a Medusa project to Qovery. Qovery is a CaaS, that provides you with the developer experience of Heroku on top of your AWS account.
> Note: We assume, that you are currently running a local instance of Medusa. If not, check out our [Quickstart](https://docs.medusa-commerce.com/quickstart/quick-start) or [Tutorial](https://docs.medusa-commerce.com/tutorial/set-up-your-development-environment) and get it up and running in 5 minutes.

### 1. Qovery Console
Create an account on [Qovery](https://www.qovery.com/) on their free community plan and jump into the console.

### 2. Setup
- Create a new project and give it a name (e.g. Medusa)
- Create a new environment and give it a name (e.g. `dev`)

### 3. Add your Medusa 
Add a new app to your Qovery environment and connect the Git repository that holds your Medusa project. The port should be 9000, unless something different is specified in your setup.
> If you used our `npx` starter, your repository will most likely hold all components; storefront, admin and backend. Ensure that **Root application path** in Qovery is pointing to your Medusa project (`/backend`).


### 4. Add a database
Navigate to your environment overview and add the databases required by Medusa.
- Add Postgres database version 10, 11 or 12
- Add Redis database version 5 or 6

Afterwards, deploy both databases.
> The Postgres database deployment might throw an error, but we will restart the database after having deployed our Medusa app. This should resolve the issue.

### 5. Configure Medusa

Our Medusa project needs a bit of configuration to fit the needs of Qovery.

#### Update `medusa-config.js`

First, add the Postgres and Redis database url to your `medusa-config.js`. In Qovery, click on your Medusa app in the environment overview. Navigate to environment variables in the sidebar on the left. Among the secret variables you should find your database urls. They shook look something like this:
```javascript=
QOVERY_REDIS_123456789_DATABASE_URL
QOVERY_POSTGRESQL_123456789_DATABASE_URL
```
Add these to your `medusa-config.js`. 
```javascript=
const DATABASE_URL = process.env.QOVERY_POSTGRESQL_123456789_DATABASE_URL
const REDIS_URL= process.env.QOVERY_REDIS_123456789_DATABASE_URL
```
Furthermore, update `module.exports` to include the following:
```javascript=
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
> **IMPORTANT**: We are using the Qovery Community plan, that does not allow SSL connections for the database, so this is disabled. 
> 
> In a production environment, you would need the following in the config:
> `database_extra: { ssl: { rejectUnauthorized: false } }`

#### Add some extra variables
We need to add a couple of more environment variables in Qovery. These are:
```javascript=
JTW_SECRET=something_secret_jwt
COOKIE_SECRET=something_secret_cookie
```

> Make sure to use actual secrets in a production environment.

#### Update `package.json`
Update `scripts` to have the following:
```json=
"scripts": {
    "serve": "medusa start",
    "start": "medusa migrations run && medusa start",
    "prepare": "cross-env NODE_ENV=production npm run build:babel",
    "build:babel": "babel src -d dist --extensions \".ts,.js\""
  }
``` 
#### Push changes to your repository

```shell=
git add .
git commit -m "chore: Qovery setup"
git push
```
### 6. Deploy Medusa
Finally, your app should be deploying to Qovery. If your Postgres database was previously shut down, make sure to redeploy this.

### 6. Try it out!
In Qovery, click on your Medusa app in the environment overview. In the top right you are able to open up your application. Navigate to `https://your-qovery-url.com/health` to ensure, that the app is running.

### What's next?
You now have an application running on Qovery. This can be scaled and configured to fit your business needs. As mentioned, we used the community plan, so this should be upgrade when moving to production.

Furthermore, you can deploy a Medusa Admin for your application, such that you can start managing your store from an interface.

- [Deploy Admin on Netlify](https://hackmd.io/@1cszcoYoSc-3cPnP9sk4oA/deploy-medusa-admin-netlify)
- [Deploy Admin on Gatsby Cloud](https://hackmd.io/@1cszcoYoSc-3cPnP9sk4oA/deploy-medusa-admin-gatsby-cloud)
