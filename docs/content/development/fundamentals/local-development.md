---
description: 'Learn how to perform local development in the Medusa monorepo. This includes how to use the dev CLI tool and perform unit, integration, and plugin tests.'
---

# Local Development of Medusa Backend and Monorepo

In this document, you’ll learn how to customize Medusa’s core and run tests.

## Overview

As an open-source platform, Medusa’s core can be completely customized.

Whether you want to implement something differently, introduce a new future as part of Medusa’s core or any of the other packages, or contribute to Medusa, this guide helps you learn how to run Medusa’s integration tests, as well as test your own Medusa core in a local backend.

### Medusa Repository Overview

[Medusa’s repository on GitHub](https://github.com/medusajs/medusa) includes all packages related to Medusa under the [`packages` directory](https://github.com/medusajs/medusa/tree/master/packages). This includes the [core Medusa package](https://github.com/medusajs/medusa/tree/master/packages/medusa), the [JS Client](https://github.com/medusajs/medusa/tree/master/packages/medusa-js), the CLI tools, and much more.

All the packages are part of a [Yarn workspace](https://classic.yarnpkg.com/lang/en/docs/workspaces/). So, when you run a command in the root of the project, such as `yarn build`, it goes through all registered packages in the workspace under the `packages` directory and runs the `build` command in each of those packages.

---

## Prerequisites

### Yarn

When using and developing with the Medusa repository, it’s highly recommended that you use [Yarn](https://yarnpkg.com/getting-started/install) to avoid any errors or issues.

### Fork and Clone Medusa’s Repository

To customize Medusa’s core or contribute to it, you must first [fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and then [clone](https://docs.github.com/en/get-started/quickstart/fork-a-repo#cloning-your-forked-repository) the [GitHub repository](https://github.com/medusajs/medusa).

### Install Dependencies and Build Packages

In the directory of the forked GitHub repository, run the following commands to install necessary dependencies then build all packages in the repository:

```bash
yarn install
yarn build
```

### Medusa’s Dev CLI tool

Medusa provides a CLI tool to be used for development. This tool facilitates testing your local installment and changes to Medusa’s core without having to publish the changes to NPM.

To install Medusa’s dev CLI tool:

```bash npm2yarn
npm install medusa-dev-cli -g
```

### Set the Location of the Medusa Repository

In the directory of your forked GitHub repository, run the following command to specify to the dev CLI tool the location of your Medusa repository:

```bash
medusa-dev --set-path-to-repo `pwd`
```

---

## Run Tests in the Repository

In this section, you’ll learn how to run tests in the Medusa repository. This is helpful after you customize any of Medusa’s packages and want to make sure everything is still working as expected.

### Set System Environment Variables

Before you can run the tests, make sure you set the following system environment variables:

```bash
DB_HOST=<YOUR_DB_HOST>
DB_USERNAME=<YOUR_DB_USERNAME>
DB_PASSWORD=<YOUR_PASSWORD>
```

### Run Unit Tests

To run unit tests in all packages in the Medusa repository, run the following command in the root directory of the repository:

```bash
yarn test
```

This runs the `test` script defined in the `package.json` file of each package under the `packages` directory.

Alternatively, if you want to run the unit tests in a specific package, you can run the `test` command in the directory of that package.

For example, to run the unit tests of the Medusa core:

```bash
cd packages/medusa
yarn test
```

### Run API Integration Tests

API integration tests are used to test out Medusa’s core endpoints.

To run the API integration tests, run the following command in the root directory of the repository:

```bash
yarn test:integration:api
```

### Run Plugin Integration Tests

Plugin integration tests are used to test out Medusa’s official plugins, which are also stored in the `packages` directory in the repository.

To run the plugin integration tests, run the following command in the root directory of the repository:

```bash
yarn test:integration:plugins
```

---

## Test in a Local Backend

Using Medusa’s dev CLI tool, you can test any changes you make to Medusa’s packages in a local backend installation. This eliminates the need to publish these packages on NPM publicly to be able to use them.

Medusa’s dev CLI tool scans and finds the Medusa packages used in your Medusa backend. Then, it copies the files of these packages from the `packages` directory in the Medusa repository into the `node_modules` directory of your Medusa backend.

:::info

Medusa’s Dev CLI tool uses the [path you specified earlier](#set-the-location-of-the-medusa-repository) to copy the files of the packages.

:::

### Copy Files to Local Backend

To test in a local backend:

1. Change to the directory of the backend you want to test your changes in:

```bash
cd medusa-backend
```

2\. Run the following command to copy the files from the `packages` directory of your Medusa repository into `node_modules`:

```bash
medusa-dev
```

By default, Medusa’s dev CLI runs in watch mode. So, it copies the files when you first run it. Then, whenever you make changes in the `dist` directory of the packages in the Medusa repository, it copies the changed files again.

### Watch and Compile Changes

While the above command is running, it's recommended to run the `watch` command inside the directory of every package you're making changes to.

The combination of these two commands running at the same time will compile the package into the `dist` directory of the package, then copy the compiled changes into your local backend.

For example, if you're making changes in the `medusa` package, run the following command inside the directory of the `medusa` package:

```bash title=packages/medusa
yarn watch
```

Make sure the `medusa-dev` command is also running to copy the changes automatically.

Alternatively, you can manually run the `build` command every time you want to compile the changes:

```bash title=packages/medusa
yarn build
```

### CLI Options

Here are some options you can use to customize how Medusa’s dev CLI tool works:

- `--scan-once` or `-s`: Copies files only one time then stops processing. If you make any changes after running the command with this option, you have to run the command again.

```bash
medusa-dev -s
```

- `--quiet` or `-q`: Disables showing any output.

```bash
medusa-dev -q
```

- `--packages`: Only copies specified packages. It accepts at least one package name. Package names are separated by a space.

```bash
medusa-dev --packages @medusajs/medusa-cli medusa-file-minio
```

---

## See Also

- [Create a Plugin](../plugins/create.md)
- [Contribution Guidelines](https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md)
