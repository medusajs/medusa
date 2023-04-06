---
description: 'Learn how to create a migration in Medusa. This guide explains how to write and run migrations.'
addHowToData: true
---

# How to Create Migrations

In this document, you’ll learn how to create a [Migration](./overview.mdx) using [Typeorm](https://typeorm.io) in Medusa.

## Step 1: Create Migration File

To create a migration that makes changes to your Medusa schema, run the following command:

```bash
npx typeorm migration:create -n UserChanged --dir src/migrations
```

This will create the migration file in the path you specify. You can use this without the need to install Typeorm's CLI tool. You can then go ahead and make changes to it as necessary.

The migration file must be inside the `src/migrations` directory. When you run the build command, it will be transpiled into the directory `dist/migrations`. The `migrations run` command can only pick up migrations under the `dist/migrations` directory on a Medusa backend. This applies to migrations created in a Medusa backend, and not in a Medusa plugin. For plugins, check out the [Plugin's Structure section](../../plugins/create.md).

<details>
  <summary>Generating Migrations for Entities</summary>

  You can alternatively use Typeorm's `generate` command to generate a Migration file from existing entity classes. As of v1.8, Medusa uses Typeorm v0.3.x. You have to create a [DataSource](https://typeorm.io/data-source) first before using the `migration:generate` command.

  For example, create the file `datasource.js` in the root of your Medusa server with the following content:

  ```js
  const { DataSource } = require("typeorm")
  
  const AppDataSource = new DataSource({
    type: "postgres",
    port: 5432,
    username: "<YOUR_DB_USERNAME>",
    password: "<YOUR_DB_PASSWORD>",
    database: "<YOUR_DB_NAME>",
    entities: [
      "dist/models/*.js",
    ],
    migrations: [
      "dist/migrations/*.js",
    ],
  })

  module.exports = {
    datasource: AppDataSource,
  }
  ```

  Make sure to replace `<YOUR_DB_USERNAME>`, `<YOUR_DB_PASSWORD>`, and `<YOUR_DB_NAME>` with the necessary values for your database connection.

  Then, after creating your entity, run the `build` command:

  ```bash npm2yarn
  npm run build
  ```

  Finally, run the following command to generate a Migration for your new entity:

  ```bash
  npx typeorm migration:generate -d datasource.js src/migrations/PostCreate
  ```

  Where `PostCreate` is just an example of the name of the migration to generate. The migration will then be generated in `src/migrations/<TIMESTAMP>-PostCreate.ts`. You can then skip to step 3 of this guide.
</details>

---

## Step 2: Write Migration File

The migration file contains the necessary commands to create the database columns, foreign keys, and more.

You can learn more about writing the migration file in You can learn more about writing migrations in [Typeorm’s Documentation](https://typeorm.io/migrations).

---

## Step 3: Build Files

Before you can run the migrations you need to run the build command to transpile the TypeScript files to JavaScript files:

```bash npm2yarn
npm run build
```

---

## Step 4: Run Migration

The last step is to run the migration with the command detailed earlier

```bash
medusa migrations run
```

If you check your database now you should see that the change defined by the migration has been applied successfully.

---

## See Also

- [Create a Plugin](../../plugins/create.md)
