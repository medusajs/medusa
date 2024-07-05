---
description: "In this document, you’ll learn about the directory structure of a Medusa backend. It’ll help you understand the purpose of each file and folder in your Medusa backend project."
---

# Medusa Backend Directory Structure

In this document, you’ll learn about the directory structure of a Medusa backend. It’ll help you understand the purpose of each file and folder in your Medusa backend project.

---

## Root Files

These are files present at the root of your Medusa backend.

### .babelrc.js

Defines Babel’s configurations, which are used when running the `build` command that transpiles files from the `src` directory to the `dist` directory.

### .env

Includes the values of environment variables. This is typically only used in development. In production you should define environment variables based on your hosting provider.

### .env.template

Gives an example of what variables may be included in `.env`.

### .gitignore

Specifies files that shouldn’t be committed to a Git repository.

### .yarnrc.yml

Ensures dependencies are always installed in `node-modules`. This ensures compatibility with pnpm.

### index.js

Defines an entry file, which is useful when starting the Medusa backend with a process manager like pm2.

### medusa-config.js

Defines the Medusa backend’s configurations, including the database configurations, plugins used, modules used, and more.

**Read more:** [Medusa backend configurations](../../references/medusa_config/interfaces/medusa_config.ConfigModule.mdx).

### package.json

Since the Medusa backend is an NPM package, this file defines its information as well as its dependencies. It will also include any new dependencies you install.

### README.md

Provides general information about the Medusa backend.

### tsconfig.admin.json

Defines the TypeScript configurations that are used to transpile admin customization files. So, it only works for files under the [src/admin directory](#admin).

### tsconfig.json

Defines the general TypeScript configurations used to transpile files from the `src` directory to the `dist` directory.

### tsconfig.server.json

Defines the TypeScript configurations that are used to transpile Medusa backend customization files. It works for all files except for the files under the `src/admin` directory.

### tsconfig.spec.json

Defines TypeScript configurations for test files. These are files that either reside under a `__tests__` directory under `src`, or that have a file name ending with one of the following:

- `.test.ts` or `.test.js`
- `.spec.ts` or `.test.js`

### yarn.lock or package-lock.json

An automatically generated file by `yarn` or `npm` that holds the current versions of all dependencies installed to ensure the correct versions are always installed.

If you used the `create-medusa-app` command to install the Medusa backend, it’ll attempt to use `yarn` by default to install the dependencies. If `yarn` is not installed on your machine, it will then fall back to using `npm`.

Based on the package manager used to install the dependencies, either `yarn.lock` or `package-lock.json` will be available, or both.

---

## Root Directories

These are the directories present at the root of your Medusa backend.

### .cache

This directory will only be available if you have the Medusa Admin installed and you’ve already started your Medusa backend at least once before. It holds all cached files related to building the Medusa Admin assets.

### build

This directory will only be available if you have the Medusa Admin installed and you’ve either built your admin files or ran the Medusa backend at least once before. It holds the built files that are used to serve the admin in your browser.

### data

This directory holds a JSON file used to seed your Medusa backend with dummy data which can be useful for demo purposes. The data is seeded automatically if you include the `--seed` option when using either the `create-medusa-app` or `medusa new` commands.

You can also seed the data by running the following command:

```bash npm2yarn
npm run seed
```

### dist

This directory holds the transpiled Medusa backend customizations. This directory may not be available when you first install the Medusa backend. It’ll be available when you run the `build` command or start your Medusa backend with the `dev` command.

The files under this directory are the files that are used in your Medusa backend. So, when you make any changes under `src`, make sure the changes are transpiled into the `dist` directory. If you’re using the `dev` or `medusa develop` commands, this is handled automatically whenever changes occur under the `src` directory.

### node_modules

This directory holds all installed dependencies in your project.

### src

This directory holds all Medusa backend and admin customizations. More details about each subdirectory are included in [this section](#src-subdirectories).

### uploads

This directory holds all file uploads to the Medusa backend. It’s only used if you’re using the [Local File Service plugin](../../plugins/file-service/local.md), which is installed by default.

---

## src Subdirectories

Files under the `src` directory hold the Medusa backend and admin customizations. These files should later be transpiled into the `dist` directory for them to be used during the backend’s runtime.

If any of these directories are not available, you can create them yourself.

### admin

This directory holds all Medusa Admin customizations. The main subdirectories of this directory are:

- `widgets`: Holds all [Medusa Admin widgets](../../admin/widgets.md).
- `routes`: Holds all [Medusa Admin UI routes](../../admin/routes.md).

### api

This directory holds all custom API Routes, which are defined in `route.ts` or `route.js` files. These files can be created in sub-directories of the `api` directory based on the API Route's path.

**Read more:** [API Routes](../api-routes/overview.mdx)

### loaders

This directory holds scripts that run when the Medusa backend starts. For example, the scripts can define a scheduled job.

**Read more:** [Loaders](../loaders/overview.mdx)

### migrations

This directory holds all migration scripts that reflect changes on the database the Medusa backend is connected to.

**Read more:** [Migrations](../entities/migrations/overview.mdx)

### models

This directory holds all custom entities, which represent tables in your database. You can create a new entity, or customize a Medusa entity.

**Read more:** [Entities](../entities/overview.mdx)

### repositories

This directory holds all custom repositories which provide utility methods to access and modify data related to an entity.

**Read more:** [Repositories](../entities/overview.mdx#what-are-repositories)

### services

This directory holds all custom services. Services define utility methods related to an entity or feature that can be used across the Medusa backend’s resources.

**Read more**: [Services](../services/overview.mdx)

### subscribers

This directory holds all custom subscribers. Subscribers listen to emitted events and registers method to handle them.

**Read more:** [Subscribers](../events/subscribers.mdx)
