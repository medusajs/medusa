# Migrations

In this document, you’ll learn about what Migrations are, their purpose, how you can run them, and how you can create your own Migrations.

:::note

Medusa’s Migrations do not work with SQLite databases. They are intended to be used with PostgreSQL databases, which is the recommended Database for your Medusa production server.

:::

## Overview

Migrations are scripts that are used to make additions or changes to your database schema. In Medusa, they are essential for both when you first install your server and for subsequent server upgrades later on.

When you first create your Medusa server, the database schema used must have all the tables necessary for the server to run.

When a new Medusa version introduces changes to the database schema, you'll have to run migrations to apply them to your own database.

:::tip

Migrations are used to apply changes to the database schema. However, there are some version updates of Medusa that require updating the data in your database to fit the new schema. Those are specific to each version and you should check out the version under Upgrade Guides for details on the steps.

:::

## How to Run Migrations

Migrations in Medusa can be done in one of two ways:

### Migrate Command

Using the Medusa CLI tool, you can run migrations with the following command:

```bash
medusa migrations run
```

This will check for any migrations that contain changes to your database schema that aren't applied yet and run them on your server.

### Seed Command

Seeding is the process of filling your database with data that is either essential or for testing and demo purposes. In Medusa, the `seed` command will run the migrations to your database if necessary before it seeds your database with dummy data.

You can use the following command to seed your database:

```bash npm2yarn
npm run seed
```

This will use the underlying `seed` command provided by Medusa's CLI to seed your database with data from the file `data/seed.json` on your Medusa server.

## How to Create Migrations

In this section, you’ll learn how to create your own migrations using [Typeorm](https://typeorm.io). This will allow you to modify Medusa’s predefined tables or create your own tables.

### Create Migration

To create a migration that makes changes to your Medusa schema, run the following command:

```bash
npx typeorm migration:create -n src/path/to/UserChanged
```

:::tip

The migration file should be inside the src directory to make sure it is built when the build command is run next.

:::

This will create the migration file in the path you specify. You can use this without the need to install Typeorm's CLI tool. You can then go ahead and make changes to it as necessary.

:::tip

You can learn more about writing migrations in [Typeorm’s Documentation](https://typeorm.io/migrations).

:::

### Build Files

Before you can run the migrations you need to run the build command to transpile the TypeScript files to JavaScript files:

```bash npm2yarn
npm run build
```

### Run Migration

The last step is to run the migration with the command detailed earlier

```bash
medusa migrations run
```

If you check your database now you should see that the change defined by the migration has been applied successfully.

## What’s Next 🚀

- Learn more about [setting up your development server](/tutorial/set-up-your-development-environment).
