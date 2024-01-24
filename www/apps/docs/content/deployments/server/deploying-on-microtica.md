---
description: 'Learn step-by-step.'
addHowToData: true
---

# Deploy Your Medusa Backend on Microtica

In this document, you'll learn how to deploy your Medusa backend on your AWS account with Microtica.

:::note

This guide was submitted through a community contribution.

:::

## Overview

[Microtica](https://microtica.com) is a cloud-native delivery platform that enables you to deploy infrastructure and applications to your AWS account, while providing actionable insights to help you optimize resources, performance, & costs. 

Alternatively, you can use this button to deploy the Medusa backend to Microtica directly:

<a href="https://app.microtica.com/templates/new?template=https%3A%2F%2Fraw.githubusercontent.com%2Fmicrotica%2Ftemplates%2Fmaster%2Fmedusa-server%2F.microtica%2Ftemplate.yaml&utm_source=medusa&utm_medium=docs&utm_campaign=medusa" className="img-url">
  <img src="https://microtica.s3.eu-central-1.amazonaws.com/assets/templates/logos/deploy-with-microtica.svg" alt="Deploy with Microtica" className="no-zoom-img" />
</a>

:::note

The Medusa infrastructure will be provisioned on your own AWS account.
You retain full control over your infrastructure and data while getting all the benefits of infrastructure automation.

:::

### What will be provisioned on AWS

Since Microtica deploys on your cloud account, here are the resources that the platform is going to provision in the environment.

- VPC, subnets and networking
- Container infrastructure based on Fargate 
- application load balancer
- persistent storage
- S3 bucket
- Postgres database 
- and Redis (in production mode)

---

## Prerequisites

### Medusa Backend

It is assumed that you already have a Medusa backend installed locally. If you don’t, please follow the [quickstart guide](../../development/backend/install.mdx).

Furthermore, your Medusa backend should be configured to work with PostgreSQL and Redis. You can follow the [Configure your Backend documentation](../../references/medusa_config/interfaces/medusa_config.ConfigModule.mdx) to learn how to do that.

### Needed Accounts

- A [Microtica](https://app.microtica.com/) account. Microtica provides a free plan that you can use.
- An [AWS](https://aws.amazon.com/) account that you’ll connect to Microtica to provision the infrastructure.
- A [GitHub](https://github.com/) account to create a repository to host your backend's codebase.

### Required Tools

- Git’s CLI tool. You can follow [this documentation to learn how to install it for your operating system](../../development/backend/prepare-environment.mdx#git).

---

## Deploy to Microtica

### (Optional) Step 0: Configure the Admin

If you're using the Medusa Admin plugin, you have two options to deploy it: either with the backend or separately.

#### Deploying with the Backend

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

#### Deploying Separately

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

### Step 1: Create/Import a Git repository

Before you can deploy your Medusa backend you need to connect your preferred Git account. Microtica will create a repository on your Git account with a default repo name `medusa-server`. 

If you already have a Medusa backend repository that you want to deploy then you need to perform a couple of changes in your source code. Follow [this tutorial to deploy and existing Medusa Backend app](https://docs.microtica.com/medusa-server?utm_source=medusa&utm_medium=docs&utm_campaign=medusa#xUBRz).

### Step 2: Configure the Template

The second step provides customization possibilities by configuring environment variables.

Add an application name and the admin credentials that will be used to create an initial admin user with which you can later sign in to your Medusa Admin. 

Then, choose whether you want a production Medusa Backend environment or a development one. The production template will provision your managed Relational Database Service (RDS) PostgreSQL and Redis instances.

### Step 3: Connect an AWS account 

In the last step before deployment, select the environment in which you want to deploy the template. An existing default environment called `development` will be preselected here, or you can create a new environment.  

Then, connect your AWS account when prompted. This process takes only a few seconds, so afterward only choose the region you want to deploy in. 

### Step 4: Deploy to AWS

Finally, a deployment summary of what will be provisioned on your AWS account is presented. Click on the "Deploy" button to trigger a deployment of the template and start creating the infrastructure for a Medusa backend.

It will take around ten minutes for the solution to be deployed on your cloud account.

You can follow the build pipeline in real-time by clicking the "View Logs" button. 

Once the build process is complete, a new deployment with the infrastructure resources is triggered. You can follow the logs of the deployment process by clicking the "View deployment" button, and then selecting the deployment from the list. 

---

## Test the Backend

After the deployment is finished, navigate to Resources → [AppName] (Medusa in this example) → Overview. Then, under the Resource Outputs section you should see the "AccessUrl". This is the backend's URL that you can use to access API Routes and test them. You can try getting the list of products using the API Route `<AccessUrl>/store/products`.

### Health Route

You can access `/health` to get health status of your deployed backend.

### Testing the Admin

If you deployed the [admin dashboard with the backend](#deploying-with-the-backend), you can test it by going to `<AccessUrl>/app`. If you changed the admin path, make sure to change `/app` to the path you've set.

---

## Add Environment Variables

The environment variables can be updated, added, or configured after deployment as well. You can access them with `process.env.<VARIABLE NAME>`.

You can read more about the built-in environment variables, as well as how to specify custom environment variables in the Medusa backend runtime [in Microtica documentation](https://docs.microtica.com/medusa-server?utm_source=medusa&utm_medium=docs&utm_campaign=medusa#z8li6). 

---

## Updating your Deployed Backend

Any updates to the backend (for example, updating the Medusa core version) are deployed automatically when changes are committed to the repository. Microtica will handle the entire process of building and deploying your application on your connected AWS account.
