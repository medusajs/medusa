---
description: 'Learn step-by-step.'
addHowToData: true
---

# Deploy Your Medusa Backend to DigitalOcean Apps

In this document, you'll learn how to deploy your Medusa backend to a DigitalOcean App.

DigitalOcean is a reliable hosting provider that provides different ways to host websites and servers. One way to host a backend is using their DigitalOcean App Platform.

## Prerequisites

### Medusa Backend

It is assumed that you already have a Medusa backend installed locally. If you don’t, please follow the [quickstart guide](../../development/backend/install.mdx).

Furthermore, your Medusa backend should be configured to work with PostgreSQL and Redis. You can follow the [Configure your Backend documentation](../../development/backend/configurations.md) to learn how to do that.

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

This ensures that Migrations are run everytime the Medusa backend is restarted.

---

## Changes to medusa-config.js

In `medusa-config.js`, the `DATABASE_URL` variable is set to the environment variable `DATABASE_URL`. This needs to be changed as DigitalOcean provides the different details of the database connection separately.

Replace the previous declaration of `DATABASE_URL` in `medusa-config.js` with the following:

```js
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

```js
module.exports = {
  projectConfig: {
    // ...
    database_extra: { ssl: { rejectUnauthorized: false } },
  },
}
```

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

Where `<GITHUB_URL>` is the URL you just copied.

Then, add, commit, and push the changes into the repository:

```bash
git add .
git commit -m "initial commit"
git push
```

After pushing the changes, you can find the files in your GitHub repository.

---

## Deploy to DigitalOcean App

After logging into your account, click on the Create button at the top right, then choose App.

![Click Create button then choose Apps](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002030/Medusa%20Docs/Digital%20Ocean/PQgPZ0q_xntr2i.png)

### Choose Repository

In the Create App page, choose GitHub from the Service Provider list.

![Choose GitHub from list of providers](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002043/Medusa%20Docs/Digital%20Ocean/nBY9wGE_zyy1e6.png)

If you haven’t given DigitalOcean access before, click on Manage Access under Source Code. You’ll then be redirected to GitHub to give DigitalOcean access.

Once DigitalOcean have access to your GitHub account, you should see a Repository input. Click on it and search for the repository you created earlier.

Additional inputs will show up to choose the Branch, Source Directory, and Autodeploy options.

![Enter master for Branch input, backslash for Source Directory, and check Autodeploy](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002055/Medusa%20Docs/Digital%20Ocean/kjk9E2B_qpwrx4.png)

If you host your Medusa backend in a monorepo, you should change the Source Directory to the directory the backend is available in the repository. Otherwise, it can be left as is.

Once you’re done, click Next to move on to the next step.

### Specify Web Service Resources

In the next step, you’ll see the resources to create.

![List of resources showing a docker resource and web service resource](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002067/Medusa%20Docs/Digital%20Ocean/6TlpWB9_wfppc7.png)

If you have a Dockerfile available in the backend’s codebase (which is available by default), you’ll have two resources showing. You can remove it by clicking on the trash icon at the right of the resource.

By default, DigitalOcean hosts the web service in a sub-path of the domain name of the created App. To change it to the root of the domain, click on the edit icon at the right of the Web Service resource.

Then, scroll to HTTP Request Routes and expand it by clicking on Edit at its right. Change the value of the Routes input to `/`.

![Enter backslash for Routes](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002076/Medusa%20Docs/Digital%20Ocean/ta0jHh4_ddcz3r.png)

Once you’re done click Save. You’ll be taken back to the Resources page.

### Specify Database Resources

On the same page, expand the Add Resources section, choose Database, then click Add.

![Choose Database](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002090/Medusa%20Docs/Digital%20Ocean/MfK9E8o_ensfu0.png)

In the new page, you’ll be shown a PostgreSQL database to be created. Notice that it’s important to choose a name that you’ll remember as you’ll need the name in next steps. You can leave the name as is if it’s not necessary to change it.

![Enter db for Choose Name input](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002099/Medusa%20Docs/Digital%20Ocean/jYxENhr_wxkspz.png)

Once you’re done, click Create and Attach. You’ll be redirected back to the previous page with the database added to the resources.

![Database showing in the list of resources with web service](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002109/Medusa%20Docs/Digital%20Ocean/jNZ7rxg_msmgbz.png)

Once you’re done, click Next to move on to the next step.

### Set Environment Variables

In this section, you’ll add environment variables that are essential to your Medusa backend.

You should see two ways to add environment variables: Global or specific to the Web Service.

![Global environment variables and web service environment variables](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002118/Medusa%20Docs/Digital%20Ocean/VOYykPT_qoili6.png)

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
NODE_ENV=production
```

:::caution

It’s highly recommended to use strong, randomly generated secrets for `JWT_SECRET` and `COOKIE_SECRET`.

:::

Notice how for database environment variables you access the values from the database you created earlier `db`. If you changed the name of the database, you must change `db` here to the name you supplied to the PostgreSQL database.

Another thing to note here is that you added a `REDIS_URL` environment variable that uses a `redis` resource to retrieve the URL. You’ll be creating this resource in a later section.

:::note

If you're using modules that require setting environment variables, make sure to set them here. You can also add them later. For example, if you're using the Redis Event Bus module, you can set the environment variable for it here or use the same `REDIS_URL` variable. Your module may also require setting up other resources than those explained in this guide so make sure to add them as well.

:::

Once you’re done click Save.

### Finalize App

In the next section, you’ll be shown the app info and the region it will be deployed to. You can leave it all as is or make changes if you find it necessary.

![App info and region details](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002128/Medusa%20Docs/Digital%20Ocean/XVS0yej_kwmaim.png)

Once you’re done, click Next to go to the next step.

In the final step, you can see a review of everything you created. If everything looks good, scroll down and click Create Resource.

### Create Redis Resource

While the backend is being deployed, you can create the Redis resource.

Click the Create button at the top right and choose Database from the dropdown.

![Click Create then choose Databases](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002138/Medusa%20Docs/Digital%20Ocean/8BzUzuO_bhwcpd.png)

In the new page under Choose a database engine, choose Redis.

![For the Choose a database engine input choose Redis](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002149/Medusa%20Docs/Digital%20Ocean/lninWzJ_joycrd.png)

Then, scroll down to the “Choose a name” input. Since you used the name `redis` in the `REDIS_URL` environment variables, change the value to `redis` here.

![For the choose a name input set the value to redis](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002158/Medusa%20Docs/Digital%20Ocean/E81Qc4l_gid9qa.png)

Once you’re done, click on Create Database Cluster.

### Attach Redis Database

Once the Redis database is created go back to the App you created earlier by choose Apps in the sidebar then clicking on the App name.

Click at the white Create button at the top right and choose Create/Attach Database.

![Click at the create button and choose create/attach database](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002168/Medusa%20Docs/Digital%20Ocean/jdh702G_fjssat.png)

In the new page, click on the Previously Created DigitalOcean Database radio button. Then, under Database Cluster select the Redis database you just created.

![Choose Previously Created DigitalOcean Database then under Database Cluster choose redis](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002177/Medusa%20Docs/Digital%20Ocean/aBJ2z0B_yzwpym.png)

Once you’re done click Attach Database. This will add the Redis database to the list of resources of your App and will trigger a redeploy of the App.

---

## Test your Backend

Once the redeployment is complete, copy the URL of the App which can be found under the App’s name.

![Copy URL under the app name](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002186/Medusa%20Docs/Digital%20Ocean/i3ws777_ooknst.png)

Then, go to `<YOUR_APP_URL>/store/products`. If the deployment was successful, you should receive a JSON response.

![JSON response with list of products](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002196/Medusa%20Docs/Digital%20Ocean/5xTdMbY_pqwyzy.png)

---

## Run Commands on Your Backend

To run commands on your backend, you can access the console on the App’s page by choosing the Console tab. This opens a console in your browser where you can run commands on your backend.

For example, you can run the following commands to create a new admin user:

```bash
npm install @medusajs/medusa-cli -g
medusa user --email <EMAIL> --password <PASSWORD>
```

Make sure to replace `<EMAIL>` and `<PASSWORD>` with the credentials you want to give the user.

![Console in the DigitalOcean App](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002204/Medusa%20Docs/Digital%20Ocean/9RMfD4C_u0mdqs.png)

---

## Add Environment Variables

You’ll likely need to add environment variables later such as Admin Cross-Origin Resource Sharing (CORS) and Store CORS variables.

To add environment variables, on the App’s page click on Settings and choose the Web Service component.

![Choose the Settings tab then choose the web service container](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002217/Medusa%20Docs/Digital%20Ocean/qLPARaV_ocit6w.png)

Then, scroll down and find Environment Variables. You can expand the environment variables by clicking Edit on the right. Here, you can edit, add, and remove environment variables.

![Expand the Environment Variables section by clicking edit](https://res.cloudinary.com/dza7lstvk/image/upload/v1668002227/Medusa%20Docs/Digital%20Ocean/4x6JGjX_wzltiq.png)

Once you click Save, the environment variables will be saved and a redeployment will be triggered.

---

## See Also

- [Deploy the Medusa Admin](../admin/index.mdx).
- [Deploy the Storefront](../storefront/index.mdx).
