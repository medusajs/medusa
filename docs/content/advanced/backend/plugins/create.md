# Create a Plugin

In this document, you’ll learn how to create a plugin and publish it. If you’re interested to learn more about what plugins are and where to find available official and community plugins, check out the [overview document](overview.md).

## Prerequisites

This guide uses the Medusa CLI throughout different steps. If you don’t have the Medusa CLI installed you can install it with the following command:

```bash npm2yarn
npm install @medusajs/medusa-cli -g
```

## Initialize Project

The recommended way to create a plugin is using the Medusa CLI. Run the following command to create a new Medusa project:

```bash
medusa new medusa-plugin-custom
```

Where `medusa-plugin-custom` is the name of the plugin you’re creating. In Medusa, plugins are named based on their functionalities.

By convention, all plugin names start with `medusa` followed by a descriptive name of what the plugin does. For example, the Stripe plugin is named `medusa-payment-stripe`.

### Rename Project Name

Update the `name` field in the `package.json` file to the name of your plugin. This should be the same name that you chose when running the `medusa new` command.

### Project Structure

The command above creates a new directory `medusa-plugin-custom` that holds essentially the same codebase you would have for a Medusa server. This is because a plugin has the same directory structure as a Medusa server.

Under the `src` directory is where the code of your plugin resides. After running the previous command, you should have at least 3 directories inside the `src` directory:

- `api` is where you can add custom endpoints.
- `services` is where you can add custom services.
- `subscribers` is where you can add custom subscribers.

You can also add more directories and files to your plugin including:

- `src/models` for adding custom entities or extending existing entities.
- `src/migrations` for migrations that make changes to the database schema.

## Change Dependencies in package.json

A basic Medusa server installed with the `medusa new` command has dependencies similar to this:

```json
"dependencies": {
  "@medusajs/medusa": "^1.3.1",
  "@medusajs/medusa-cli": "^1.3.0",
  "medusa-fulfillment-manual": "^1.1.31",
  "medusa-interfaces": "^1.3.0",
  "medusa-payment-manual": "^1.0.16",
  "medusa-payment-stripe": "^1.1.38",
  "typeorm": "^0.2.36"
},
"devDependencies": {
  "@babel/cli": "^7.14.3",
  "@babel/core": "^7.14.3",
  "@babel/preset-typescript": "^7.14.5",
  "babel-preset-medusa-package": "^1.1.19"
}
```

For a plugin, a lot of these dependencies are not necessary or should be labeled as [peer dependencies](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies). Therefore, it’s important to make changes to the dependencies of your plugin.

The recommended change is the following:

```json
"peerDependencies": {
  "@medusajs/medusa": "^1.3.1",
  "medusa-interfaces": "^1.3.0",
  "typeorm": "^0.2.36"
},
"devDependencies": {
  "@babel/cli": "^7.14.3",
  "@babel/core": "^7.14.3",
  "@babel/preset-typescript": "^7.14.5",
  "babel-preset-medusa-package": "^1.1.19",
}
```

The packages `@medusajs/medusa` and `medusa-interfaces` act as peer dependencies. They’ll be installed while you develop your package, and they are required when your plugin is installed in another NPM project.

You remove the packages `medusa-fulfillment-manual`, `medusa-payment-manual`, and `medusa-payment-stripe` as they are fulfillment and payment plugins necessary for a Medusa server, but not for a plugin.

Additionally, you remove `@medusajs/medusa-cli` as you don’t need to use the Medusa CLI while developing a plugin.

Once you’re done making these changes, re-run the install command to update your `node_modules` directory:

```bash npm2yarn
npm install
```

## Recommended Changes in package.json

This section includes recommended changes to your `package.json`. You can skip any of these changes if you don’t find them necessary to your plugin.

### Change Basic Info

`package.json` holds information that further describes the package or the author that created the package. It is recommended to make the following changes:

- `description`: Change this to a sentence that describes what your plugin does.
- `author`: Your name and email.
- `repository`: The repository that holds your plugin’s codebase.
- `keywords`: This should hold the keywords that are related to your plugin. It’s recommended that all plugins use the keywords `medusa-plugin` or `medusa`.

### Change scripts

A basic Medusa installation comes with the following scripts:

```json
"scripts": {
  "seed": "medusa seed -f ./data/seed.json",
  "build": "babel src -d dist --extensions \".ts,.js\"",
  "start": "medusa develop"
}
```

The `seed` and `start` scripts are not necessary for plugin development so you can remove them.

It’s also recommended to add the `watch` script that automatically compiles your files if they are changed:

```json
"watch": "babel -w src --out-dir . --ignore **/__tests__"
```

This is helpful when testing the plugin.

:::note

Testing the plugin is covered in a later section.

:::

Another recommended script is the `prepare` script that builds your files under a “production” environment:

```json
"prepare": "cross-env NODE_ENV=production npm run build"
```

You would typically run this script before publishing your plugin.

This script requires installing the package `cross-env` as a development dependency:

```bash npm2yarn
npm install --save-dev cross-env
```

## Develop your Plugin

Now, You can start developing your plugin. This can include adding services, endpoints, entities, or anything that is relevant to your plugin.

This guide does not cover how to create each of those files or components. If you’re interested in learning how to do that, you can check out these guides:

- How to create endpoints for [storefront](../endpoints/add-storefront.md) and [admin](../endpoints/add-admin.md)
- How to [create a service](../services/create-service.md)
- How to [create a subscriber](../subscribers/create-subscriber.md)
- How to create an entity
- How to [create a migration](../migrations.md)

## Add Plugin Configuration

Plugins often allow developers that will later use them to enter their own configuration. For example, you can allow developers to specify the API key of a service you’re integrating.

To pass a plugin its configurations on a Medusa server, you have to add it to the `plugins` array in `medusa-config.js`:

```jsx
const plugins = [
  //...
  {
    resolve: `medusa-plugin-custom`,
    options: {
      name: "My Store",
    },
  },
]
```

Then, you can have access to your plugin configuration in the constructor of services in your plugin:

```jsx
//In a service in your plugin
constructor({}, options) {
  //options contains plugin configurations
  this.name = options.name
}
```

You can also have access to the configurations in endpoints in your plugin:

```jsx
//in an endpoint in your plugin
export default (rootDirectory, options) => {
  //options contain the plugin configurations
  const router = Router()

  router.get("/hello-world", (req, res) => {
    res.json({
      message: `Welcome to ${options.name ? options.name : "Medusa"}!`,
    })
  })

  return router
}
```

:::tip

Make sure to include in the README of your plugin the configurations that can be passed to a plugin.

:::

## Test Your Plugin

While you develop your plugin, you’ll need to test it on an actual Medusa server. This can be done by using the [npm link](https://docs.npmjs.com/cli/v8/commands/npm-link) command.

In the root of your plugin directory, run the following command:

```bash npm2yarn
npm link
```

Then, change to the directory of the Medusa server you want to test the plugin on and run the following command:

```bash npm2yarn
npm link medusa-plugin-custom
```

Where `medusa-plugin-custom` is the package name of your plugin.

After linking to your plugin in a local Medusa server, either run the `build` or `watch` commands in your plugin directory:

```bash npm2yarn
# in the directory of the plugin
npm run watch
```

:::tip

If you’re running the `watch` command, you don’t need to run the `build` command every time you make a change to your plugin.

:::

Then, add your plugin into the array of plugins in `medusa-config.js`:

```jsx
const plugins = [
  //...
  {
    resolve: `medusa-plugin-custom`,
    //if your plugin has configurations
    options: {
      name: "My Store",
    },
  },
]
```

:::note

If your plugin has migrations, you must run them before you start the server. Check out the [Migrations guide](../migrations.md#run-migration) for more details.

:::

Finally, start your server and test your plugin’s functionalities:

```bash npm2yarn
npm run start
```

### Troubleshoot Errors

#### Error: The class must be a valid service implementation

Please make sure that your plugin is following the correct structure. If the error persists then please try the following fix:

```bash npm2yarn
cd <SERVER_PATH>/node_modules/medusa-interfaces
npm link
cd <PLUGIN_PATH>
rm -rf node_modules/medusa-interfaces
npm link medusa-interfaces
npm link
cd <SERVER_PATH>
npm link your-plugin
```

Where `<SERVER_PATH>` is the path to your Medusa server and `<PLUGIN_PATH>` is the path to your plugin.

This links the `medusa-interfaces` package from your `medusa-backend` to your plugin directory and then links your plugin to your `medusa-backend`.

#### APIs not loading

If the APIs you added to your Medussa server are not loading then please try the following steps:

```bash npm2yarn
cd <PLUGIN_PATH>
rm -rf node_modules
cd <SERVER_PATH>/node_modules/<PLUGIN_NAME>
npm install
cd <PLUGIN_PATH>
npm build
cd <SERVER_PATH>
npm start
```

Where `<SERVER_PATH>` is the path to your Medusa server, `<PLUGIN_PATH>` is the path to your plugin and `<PLUGIN_NAME>` is the name of your plugin as it is in your plugin `package.json` file.

:::note

It is safe to ignore any `cross-env: command not found` error you may receive.

:::

## NPM Ignore File

Not all files that you use while developing your plugin are necessary to be published.

For example, the files you add in the `src` directory are compiled to a `dist` directory before publishing. Then, when a developer installs your plugin, they’ll just be using the files under the `dist` directory.

So, you can ignore files and directories like `src` from the final published NPM package.

To do that, create the file `.npmignore` with the following content:

```bash
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

#These are files that are included in a
#Medusa project and can be removed from a
#plugin project
medusa-config.js
Dockerfile
medusa-db.sql
develop.sh
```

## Publish Plugin

Once you’re done developing your plugin you can publish the package on NPM’s registry so that other developers can benefit from it and use it.

Before you publish a plugin, you must [create an account on NPM](https://www.npmjs.com/signup).

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

### Update Plugin

To update your plugin at a later point, you can run the following command to change the NPM version:

```bash
npm version <type>
```

Where `<type>` indicates the type of version update you’re publishing. For example, it can be `major` or `minor`.

You can see the [full list of types in NPM’s documentation](https://docs.npmjs.com/cli/v8/commands/npm-version).

Then, publish the new update:

```bash
npm publish
```

## Add Plugin to Medusa’s Repository

All officially-supported plugins are available in the [`packages` directory of the Medusa GitHub repository](https://github.com/medusajs/medusa/tree/master/packages).

If you’re interested in adding your plugin, you need to create a new pull request (PR) where you add your plugin inside the `packages` directory. Our team will then review your plugin, and if it’s approved the PR will be merged and your plugin will be available on Medusa’s repository.

:::note

Before contributing to the Medusa repository, please check out the [contribution guidelines](https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md).

:::

## Install a Plugin

To install any published plugin, you can run the following command on any Medusa server project:

```bash npm2yarn
npm install medusa-plugin-custom
```

## What’s Next 🚀

- Check out [available Services in Medusa](references/services/../../../../../references/services/classes/AuthService.md) that you can use in your plugin.
- Check out [available events](../subscribers/events-list.md) that you can listen to in Subscribers.
- Check out [available official plugins](https://github.com/medusajs/medusa/tree/master/packages).
