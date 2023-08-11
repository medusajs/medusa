---
description: 'Learn how to prepare and publish your custom module to NPM, then how to install it in the Medusa backend.'
---

# How to Publish a Module

In this document, you'll learn how to prepare and publish your custom module to NPM, then how to install it in the Medusa backend.

## Prerequisites

This guide assumes you've already created a custom module. If not, follow [this guide](./create.mdx) first to create a module.

You also need an [NPM account](https://www.npmjs.com/signup) to publish the module with.

---

## Step 1: Create an NPM Project

If your module isn't located in an NPM project already, you must create one first that will hold your module.

To do that, run the following commands to create a directory and initialize an NPM project in it:

```bash npm2yarn
mkdir my-module
npm init
```

You’ll be asked a couple of questions related to your package, such as its name or license. You can keep the default for now or set them right away.

Once you’re done, you should have a `package.json` created in the directory.

---

## Step 2: Changes to package.json

In your `package.json` file, add or update the following fields:

```json title=package.json
{
  // other fields
  "main": "dist/index.js",
  "publishConfig": {
    "access": "public"
  },
  "files": [
    "dist"
  ],
  "devDependencies": {
    "@medusajs/types": "^0.0.2",
    "cross-env": "^5.2.1",
    "typescript": "^4.4.4"
  },
  "scripts": {
    "watch": "tsc --build --watch",
    "prepare": "cross-env NODE_ENV=production npm run build",
    "build": "tsc --build",
  },
  "dependencies": {
    "@medusajs/modules-sdk": "^0.1.0",
  }
}
```

This adds the necessary dependencies for development and publishing, including the `@medusajs/modules-sdk` package. It also adds the following scripts:

- `build`: can be used to manually build your module.
- `prepare`: can be used to prepare your module for publishing on NPM
- `watch`: (optional, for development) can be used to re-build your module whenever any changes occur without having to manually trigger the `build`.

---

## Step 3: Configure tsconfig.json

If you don't already have a `tsconfig.json` file, create one in the root of your NPM project with the following content:

```json title=tsconfig.json
{
  "compilerOptions": {
    "lib": [
      "es2020"
    ],
    "target": "2020",
    "outDir": "./dist",
    "esModuleInterop": true,
    "declaration": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "sourceMap": true,
    "noImplicitReturns": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "allowJs": true,
    "skipLibCheck": true,
  },
  "include": ["src"],
  "exclude": [
    "dist",
    "./src/**/__tests__",
    "./src/**/__mocks__",
    "./src/**/__fixtures__",
    "node_modules"
  ]
}
```

This allows you to use the recommended TypeScript configurations and sets the output directory to `dist`. This is essential for preparing your module for publishing.

---

## Step 4: Change Module Structure

To ensure that the files are built from the `src` directory to the `dist` directory, make sure to move the module content to a `src` directory inside the new NPM project.

---

## Step 5: Publish and Use Module

This section explains how to publish your module to NPM.

### Run Prepare Command

Before you publish or update your module, make sure to run the `prepare` command defined earlier:

```bash npm2yarn
npm run prepare
```

### Login

In your terminal, log in with your NPM account:

```bash
npm login
```

You’ll be asked to enter your NPM email and password.

### Publish Module Package

Once you’re logged in, you can publish your package with the following command:

```bash
npm publish
```

Your package is then published on NPM and everyone can use it and install it.

### Install Module

To install your published module, you can run the following command on any Medusa backend project:

```bash
npm install module-name
```

Where `module-name` is the name of your module.

### Add Module to medusa-config.js

In `medusa-config.js` on your Medusa backend, add your module to the exported configurations:

```js title=medusa-config.js
module.exports = {
  // ...
  modules: { 
    // ...
    moduleType: {
      resolve: "<module-name>", 
      options: {
        // options if necessary
      },
    },
  },
}
```

Where `<module-name>` is the name of your NPM package.

You can learn more about the available options in the [Create Module documentation](./create.mdx#step-3-reference-module).

### Update Module

To update your module at a later point, you can run the following command to change the NPM version:

```bash
npm version <type>
```

Where `<type>` indicates the type of version update you’re publishing. For example, it can be `major` or `minor`. You can see the [full list of types in NPM’s documentation](https://docs.npmjs.com/cli/v8/commands/npm-version).

Then, publish the new update:

```bash
npm publish
```
