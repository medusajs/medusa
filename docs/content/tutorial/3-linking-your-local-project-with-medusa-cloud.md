---
title: Linking your local project with Medusa Cloud
---

# Linking your local project with Medusa Cloud

## Introduction

In this part of the tutorial you will learn how to link your local Medusa project to Medusa Cloud. Doing this will enhance you development experience as you will closely mimic how Medusa would work in a production environment. Furthermore, you will be able to easily manage orders and products in your local project directly from Medusa Cloud. Linking Medusa is easily done with the Medusa CLI which you should already be installed when you set up your development environment.

## Creating a Medusa Cloud account and CLI authentication

To link your local project you must first authenticate to Medusa using your CLI. Authenticating with the CLI is done by running:

```shell
medusa login
```

The `login` command will open your browser where you will be presented with the authentication options available. If you already have an account you can simply authenticate and you CLI will automatically be authenticated.

If you don't have an account yet you can easily create one as part of the CLI authentication. First, choose the method that you want to login with we support logging in with GitHub, Google or simple email/password authentication. If choosing GitHub or Google without an existing account you will be taken straight to the sign up form where you can fill in your details and create an account. If you wish to sign up with an email/password combination simply click "Log in with email" and at the bottom of the form click "Sign up". Once you have filled out the sign up form your CLI will be authenticated.

To test that you have successfully authenticated you can run:

```shell
medusa whoami
```

This will print out your account details.

## Linking your local project

Once you have authenticated your CLI for your Medusa Cloud account you are ready to perform local linking. To link your project first naviagate to your project root - where your `medusa-config.js` file is. You can now run the following command:

```shell
medusa link --develop
```

The `link` command will first check that you have authenticated your CLI which we did in the previous step. Then it will perform the local linking, which essentially adds an admin user in the local database specified in `medusa-config.js`. Finally, your browser will open Medusa Cloud to perform the linking there, which tells Medusa Cloud where your local server is running. On successful linking in the browser you will see a confirmation page with a "Go to orders" button. If you click this button you will be taken to an overview of the orders made in your local project.

You should note that the `--develop` flag is optional for the `link` command. If provided it tells the CLI to start up your server after linking is completed; you may leave it out if you'd rather start your server separately.

:::note

For local linking to work you must make sure to have your CORS settings configured correctly. This is done by adding `https://app.medusajs.com` to your `cors_admin` config in `medusa-config.js`.

:::

:::note

If you change the port that your local server is running on you will have to run `medusa link` again. `medusa link` uses your `PORT` environment variable to specify where Medusa Cloud should look for your local server.

:::

## Summary

You are now able to run a local development environment that is nearly identical to a production environment. This is made possible by linking your local project using the `medusa link` command. In Medusa Cloud you will be able to manage your store and test the features you are developing.

### What's next?

You are all set to start developing on your Medusa project. If you haven't already now would be a good time to add a front-end to your Medusa server. We have two starters that you can use to get going:

- [Nextjs Starter](https://github.com/medusajs/nextjs-starter-medusa)
- [Gatsby Starter](https://github.com/medusajs/gatsby-starter-medusa)

The final step to take from here is to deploy your Medusa project. We will cover how this is done in the next part of the tutorial (Coming soon!).
