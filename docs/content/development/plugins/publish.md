---
description: 'Learn how to publish a Medusa plugin to NPM. This guide lists some check lists to ensure you have implemented before publishing, as well as required steps.'
addHowToData: true
---

# How to Publish a Plugin

In this document, you'll learn how to publish a Medusa plugin to NPM and what are some requirements to keep in mind before publishing. Afterwards, your plugin will be published on the [Medusa Plugins page](https://medusajs.com/plugins/).

## Prerequisites

If you haven't created a plugin yet, please check [this guide to learn how to create a plugin](./create.md).

---

## Prepare the Plugin

### package.json Checklist

Before publishing your plugin, make sure you've set the following fields in your plugin's package.json:

- `name`: The name of your plugin. By convention, all plugin names start with `medusa` followed by a descriptive name of what the plugin does. For example, `medusa-payment-stripe`.
- `description`: A short description of what the plugin does.
- `author`: Your name or your company's name.
- `repository`: This includes details about the repository that holds the source code of the plugin. It's an object that holds the following properties:
  - `type`: Should be `git`.
  - `url`: The URL to the repository (for example, the GitHub repository holding the code of your plugin).
- `keywords`: An array of keywords that are related to the plugin. It's required for all Medusa plugins to use the keywords `medusa-plugin`. Other recommended keywords are:
  - `medusa-plugin-analytics`: For plugins that add analytics functionalities or integrations.
  - `medusa-plugin-cms`: For plugins that add CMS functionalities or integrations.
  - `medusa-plugin-notification`: For plugins that add notification functionalities or integrations.
  - `medusa-plugin-payment`: For plugins that add payment functionalities or integrations.
  - `medusa-plugin-search`: For plugins that add search functionalities or integrations.
  - `medusa-plugin-shipping`: For plugins that add shipping functionalities or integrations.
  - `medusa-plugin-storage`: For plugins that add a file service or storage integration.
  - `medusa-plugin-source`: For plugins that help migrate or import data into Medusa from another platform.
  - `medusa-plugin-storefront`: For storefronts that can be integrated with a Medusa backend.
  - `medusa-plugin-other`: For any other type of plugin.

### Scripts in package.json

Make sure you add the `publish` command to your `scripts` field and make the following change to the `build` command:

```json title=package.json
"build": "babel src --out-dir . --ignore **/__tests__ --extensions \".ts,.js\"",
"prepare": "cross-env NODE_ENV=production npm run build"
```

The `build` command ensures that the plugin's built files are placed as explained in the [plugin structure](./create.md#plugin-structure) section of the Create Plugin documentation.

The `prepare` command facilitates your publishing process. You would typically run this script before publishing your plugin.

This new script requires installing the package `cross-env` as a development dependency:

```bash npm2yarn
npm install --save-dev cross-env
```

### Plugin Structure

Make sure your plugin's structure is as described in the [Create Plugin](./create.md#plugin-structure) documentation. If you've made the changes mentioned in [the above section to the scripts](#scripts-in-packagejson) in `package.json`, you should have the correct structure when you run the `prepare` command.

### NPM Ignore File

Not all files that you use while developing your plugin are necessary to be published.

For example, the files you add in the `src` directory are compiled to the root of the plugin directory before publishing. Then, when a developer installs your plugin, they’ll just be using the files in the root.

So, you can ignore files and directories like `src` from the final published NPM package.

To do that, create the file `.npmignore` with the following content:

```bash title=.npmignore
/lib
node_modules
.DS_store
.env*
/*.js
!index.js
yarn.lock
src
.gitignore
.eslintrc
.babelrc
.prettierrc

# These are files that are included in a
# Medusa project and can be removed from a
# plugin project
medusa-config.js
Dockerfile
medusa-db.sql
develop.sh
```

---

## Publish Plugin

This section explains how to publish your plugin to NPM.

Before you publish a plugin, you must [create an account on NPM](https://www.npmjs.com/signup).

### Run Prepare Command

Before you publish or update your plugin, make sure to run the `prepare` command [defined earlier](#packagejson-checklist):

```bash npm2yarn
npm run prepare
```

### Login

In your terminal, log in with your NPM account:

```bash
npm login
```

You’ll be asked to enter your NPM email and password.

### Publish Plugin Package

Once you’re logged in, you can publish your package with the following command:

```bash
npm publish
```

Your package is then published on NPM and everyone can use it and install it.

### Install Plugin

To install your published plugin, you can run the following command on any Medusa backend project:

```bash npm2yarn
npm install medusa-plugin-custom
```

### Update Plugin

To update your plugin at a later point, you can run the following command to change the NPM version:

```bash
npm version <type>
```

Where `<type>` indicates the type of version update you’re publishing. For example, it can be `major` or `minor`. You can see the [full list of types in NPM’s documentation](https://docs.npmjs.com/cli/v8/commands/npm-version).

Then, publish the new update:

```bash
npm publish
```
