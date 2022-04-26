# Migrations

In this document, you’ll learn about what Migrations are, their purpose, how you can run them, and how you can create your own Migrations.

:::note

Medusa’s Migrations do not work with SQLite databases. They are intended to be used with [PostgreSQL databases](../../tutorial/0-set-up-your-development-environment.md#postgresql), which is the recommended Database for your Medusa production server.

:::

## Overview

Migrations in Medusa are scripts that are used to make additions or changes to your database schema. They are essential for both when you first install your server and for subsequent server upgrades later on.

When you first install your Medusa server, the database schema used must have all the tables necessary for the server to run. This is automatically done when you run the `seed` command which also seeds your database with dummy data:

```bash npm2yarn
npm run seed
```

When a new Medusa version requires changes to your database schema, it will introduce new migration scripts that must run before using the upgraded version. Not running the necessary migrations for a new update will result in a lot of unexpected behaviors and inconsistencies.

:::tip

To check whether a new version has any new migrations make sure to check out our Upgrade Guide documentation for the specific version.

:::

## How to Run Migrations

Using the [Medusa CLI](../../tutorial/0-set-up-your-development-environment.md#medusa-cli) tool, you can run migrations with the following command:

```bash
medusa migrations run
```

This will check for any migrations necessary and run them on your server.

## How to Create Migrations

In this section, you’ll learn how to create your own migrations using [Typeorm](https://typeorm.io). This will allow you to modify Medusa’s predefined tables or create your own tables.

### Install Typeorm CLI

Start by installing the Typeorm CLI:

```bash npm2yarn
npm install typeorm -g
```

### Initialize Typeorm

Then, initialize typeorm in your project:

```bash
typeorm init
```

This will create a bunch of files, but, most importantly, it will create the file `src/data-source.ts` which holds details related to your database connection:

```tsx
import "reflect-metadata"

import { DataSource } from "typeorm"
import { User } from './entity/User';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "<DATABASE_HOST>",
    port: <DATABASE_POST>,
    username: "<DATABASE_USERNAME>",
    password: "<DATABASE_PASSWORD>",
    database: "<DATABASE_NAME>",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
```

Make sure to replace `<DATABASE_HOST>`, `<DATABASE_PORT>`, `<DATABASE_USERNAME>`, `<DATABASE_PASSWORD>`, and `<DATABASE_NAME>` with the details about your PostgreSQL database.

Notice how Typeorm created a `User` demo entity, imported it into `src/data-source.ts`, and passed it to the `entities` property array for `DataSource`. You need to include your entities here when you create them.

You also need to pass migrations later on in the `migrations` array as well.

### Modify package.json

This step is optional but can be helpful. Typeorm’s CLI only works with JavaScript files. So, you’ll constantly need to build your entities, migrations, and data source as you make changes to transpire your TypeScript files to JavaScript files. Otherwise, errors will occur when using Typeorm’s CLI.

:::caution

If you choose to not follow along with this section, make sure to run the following command after every change you make in the TypeScript files:

```bash npm2yarn
npm run build
```

:::

So, to avoid the need to run the `build` command each time, add the following script in `package.json`:

```json
"watch-build": "npm run build -- --watch",
```

Now, you can just run the `watch-build` script:

```json
npm run watch-build
```

Keep this script running in the back as you follow along with this guide and whenever you create your own migrations. It will take care of transpiling the TypeScript to JavaScript for you whenever you make any changes.

### Create Migration

There are two approaches to creating migrations: creating blank migrations or generating migrations from entities. This section covers creating blank migrations. If you want to check how to generate migrations from entities you can [skip to the next section](#generate-migration).

To create a blank migration where you can manually define the changes in the database using SQL queries use the following command:

```bash
typeorm migration:create src/migrations/<MIGRATION_NAME>
```

Where `<MIGRATION_NAME>` is the class name of your migration. For example, `UserChanged`. Typeorm will then attach the current timestamp to the name you provide when it creates the migration.

The migration created is a skeleton migration. You can then go ahead and make changes to it as necessary.

If you create a migration, you can skip over Generate Migration to [Add Migration to Data Source](#add-migration-to-data-source).

### Generate Migration

Alternatively, you can generate a migration from an entity. This eliminates additional steps if you’re creating your entities as well as creating migrations.

This guide will make use of the `User` entity created by default but you can create an entity using Typeorm’s CLI tool with the following command:

```bash
typeorm entity:create src/entity/<NAME>
```

Where `<NAME>` is the class name of your entity. For example, `User`.

In the file of the entity, you can either create a new entity that would create a new table in the database or modify Medusa’s existing entities which would modify the existing tables in the database.

This is an example of a User entity that extends Medusa’s User entity to add a new column to it:

```tsx
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { User as MedusaUser } from '@medusajs/medusa';

@Entity()
export class User extends MedusaUser {

    @Column({
        nullable: true
    })
    additional_notes: string;

}
```

:::caution

When you add a new column to an existing entity, make sure to either provide a default value or set it nullable. Otherwise, the migration would throw an error if there are existing rows in the table you’re modifying.

:::

Next, pass the entity you created into the `src/data-source.ts` file in the `entities` property array as explained earlier:

```tsx
import { User } from './entity/User'

export const AppDataSource = new DataSource({
    //...
    entities: [User],
})
```

Finally, generate the migration from the entity:

```bash
typeorm migration:generate -d dist/data-source.js src/migrations/UserChanged
```

Notice that you need to pass the JavaScript Data Source as the value of the option `-d`. After that, you pass the path to the file to be created. This will create a TypeScript migration file with the changes you made in the entity prefilled.

:::tip

Before running this command you need to either already have the `watch-build` command running or run the `build` command after each step mentioned above.

:::

### Add Migration to Data Source

Just like you added the entity to the data source, you need to import the new migration in the data source and pass it to the `migrations` property array passed to `DataSource` in `src/data-source.ts`:

```tsx
import { UserChanged1650892326657 } from "./migrations/1650892326657-UserChanged";

export const AppDataSource = new DataSource({
    ...
    migrations: [UserChanged1650892326657],
})
```

:::tip

Each migration has a different timestamp attached to its class and file names. So, even if you’ve been following along with this tutorial you need to replace the name of the migration class with the name of your own migration class and file.

:::

### Run Migration

The last step is to run the migrations:

```bash
typeorm migration:run -d dist/data-source.js
```

This command also expects the data source path to be passed as an option as well.

:::tip

Before running this command you need to either already have the `watch-build` command running or run the `build` command after each step mentioned above.

:::

If you check your database now you should see that the change defined by the migration has been applied successfully.

## What’s Next 🚀

- Learn more about [setting up your development server](../../tutorial/0-set-up-your-development-environment.md).
