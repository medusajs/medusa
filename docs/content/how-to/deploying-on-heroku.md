---
title: "Deploying on Heroku"
disqus: hackmd
---

# Deploying on Heroku

This is a guide for deploying a Medusa project on Heroku. Heroku is at PaaS that allows you to easily deploy your applications in the cloud.

> Note: We assume, that you are currently running a local instance of Medusa. If not, check out our [Quickstart](https://docs.medusa-commerce.com/quickstart/quick-start) or [Tutorial](https://docs.medusa-commerce.com/tutorial/set-up-your-development-environment) and get it up and running in 5 minutes.

### 1. Install the Heroku CLI

Install Heroku on your machine:

**Ubuntu**

```shell=
sudo snap install --classic heroku
```

**MacOS**

```shell=
brew tap heroku/brew && brew install heroku
```

**Windows**

Download the appropriate installer for your Windows installation:

[64-bit installer](https://cli-assets.heroku.com/heroku-x64.exe)
[32-bit installer](https://cli-assets.heroku.com/heroku-x86.exe)

### 2. Login to Heroku from your CLI

Connect to your Heroku account from your terminal:

```shell=
heroku login
```

> Follow the instructions on your terminal

### 3. Create an app on Heroku

From your Medusa project directory run the following commands to create an app on Heroku and add it as a remote origin.

```shell=
heroku create medusa-test-app
heroku git:remote -a medusa-test-app
```

### 4. Install Postgresql and Redis on Heroku

Medusa requires a Postgres database and a Redis instance to work. These are added through the Heroku CLI using the following commands.

> In this below example, we initialize the resources on free plans. This is not a valid configuration for a production environment.

#### Postgresql

Add a Postgres addon to your Heroku app

```shell=
heroku addons:create heroku-postgresql:hobby-dev
```

You can find more informations, plans and pricing about Heroku Postgres [here](https://elements.heroku.com/addons/heroku-postgresql).

#### Redis To Go

Add a Redis instance to your Heroku app

> The addon `redistogo:nano` is free, but Heroku requires you to add a payment method to proceed.

```shell=
heroku addons:create redistogo:nano
```

You can find more informations, plans and pricing about Redis To Go [here](https://elements.heroku.com/addons/redistogo).

### 5. Configure environment variables on Heroku

Medusa requires a set of environment variables. From you project repository run the following commands:.
```shell=
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret
heroku config:set COOKIE_SECRET=your-super-secret-pt2
heroku config:set NPM_CONFIG_PRODUCTION=false
```
> Make sure to use actual secrets in a production environment.
Additionally, we need to set the buildpack to Node.js

```shell=
heroku buildpacks:set heroku/nodejs
```

#### Configure the Redis URL

The library we use for connecting to Redis, does not allow usernames in the connection string. Therefore, we need to perform the following commands to remove it.
Get the current Redis URL:

```shell=
heroku config:get REDISTOGO_URL
```

You should get something like:

```shell=
redis://redistogo:some_password_123@some.redistogo.com:9660/
```

Remove the username from the Redis URL:

```shell=
redis://r̶e̶d̶i̶s̶t̶o̶g̶o̶:some_password_123@sole.redistogo.com:9660/
```

Set the new environment variable `REDIS_URL`

```shell=
heroku config:set REDIS_URL=redis://:some_password_123@sole.redistogo.com:9660/
```

### 6. Configure Medusa

Before jumping into the deployment, we need to configure Medusa.

#### `medusa-config.js`

Update `REDIS_URL` to use `REDISTOGO_URL` as environment variableÆ

```javascript=
const REDIS_URL = process.env.REDISTOGO_URL || "redis://localhost:6379";
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

#### `package.json`

Update `scripts` to include the following:

```json=
...
"scripts": {
    "serve": "medusa start",
    "start": "medusa develop",
    "heroku-postbuild": "medusa migrations run",
    "prepare": "cross-env NODE_ENV=production npm run build",
    "build": "babel src -d dist --extensions \".ts,.js\""
},
...
```

### 6. Launch you Medusa app

Finally, we need to commit and push our changes to Heroku:

```shell=
git add .
git commit -m "Deploy Medusa App on Heroku"
git push heroku HEAD:master
```

### 7. Inspect your build logs

You can explore your Heroku app build logs using the following command in your project directory.

```shell=
heroku logs -n 500000 --remote heroku --tail
```

### What's next?

You now have a production ready application running on Heroku. This can be scaled and configured to fit your business needs.

Furthermore, you can deploy a Medusa Admin for your application, such that you can start managing your store from an interface.

- Deploy Admin on Netlify (Coming soon)
- Deploy Admin on Gatsby Cloud (Coming soon)
