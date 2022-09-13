# How to Create Migrations

In this document, you’ll learn how to create a [Migration](overview.md) using [Typeorm](https://typeorm.io).

## Create Migration File

To create a migration that makes changes to your Medusa schema, run the following command:

```bash
npx typeorm migration:create -n UserChanged --dir src/migrations
```

:::tip

The migration file must be inside the `src/migrations` directory. When the build command is run, it will be transpiled into the directory `dist/migrations`. The `migrations run` command can only pick up migrations under the `dist/migrations` directory.

:::

This will create the migration file in the path you specify. You can use this without the need to install Typeorm's CLI tool. You can then go ahead and make changes to it as necessary.

:::tip

You can learn more about writing migrations in [Typeorm’s Documentation](https://typeorm.io/migrations).

:::

## Build Files

Before you can run the migrations you need to run the build command to transpile the TypeScript files to JavaScript files:

```bash npm2yarn
npm run build
```

## Run Migration

The last step is to run the migration with the command detailed earlier

```bash
medusa migrations run
```

If you check your database now you should see that the change defined by the migration has been applied successfully.

## What’s Next 🚀

- Learn more about [setting up your development server](../../../tutorial/0-set-up-your-development-environment.mdx).
