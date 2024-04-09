---
description: 'Learn how to create a migration in Medusa. This guide explains how to write and run migrations.'
addHowToData: true
---

# How to Create Migrations

In this document, you’ll learn how to create a [Migration](./overview.mdx) using [Typeorm](https://typeorm.io) in Medusa.

## Step 1: Create Migration File

There are two ways to create a migration file: create and write its content manually, or create and generate its content.

If you're creating a custom entity, then it's recommended to generate the migration file. However, if you're extending an entity from Medusa's core, then you should create and write the migration manually.

### Option 1: Generate Migration File

:::warning

Generating migration files for extended entities may cause unexpected errors. It's highly recommended to write them manually instead.

:::

Typeorm provides a `migration:generate` command that allows you to pass it a Typeorm [DataSource](https://typeorm.io/data-source). The `DataSource` includes database connection details, as well as the path to your custom entities.

Start by creating the file `datasource.js` in the root of your Medusa backend project with the following content:

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

Finally, run the following command to generate a migration for your custom entity:

```bash
npx typeorm migration:generate -d datasource.js src/migrations/PostCreate
```

This will generate the migration file in the path you specify, where `PostCreate` is just an example of the name of the migration to create. The migration file must be inside the `src/migrations` directory. When you run the build command, it will be transpiled into the `dist/migrations` directory.

The `migrations run` command can only pick up migrations under the `dist/migrations` directory on a Medusa backend. This applies to migrations created in a Medusa backend, and not in a Medusa plugin. For plugins, check out the [Plugin's Structure section](../../plugins/create.mdx).

You can now continue to [step 2](#step-2-build-files) of this guide.

### Option 2: Write Migration File

With this option, you'll use Typeorm's CLI tool to create the migration file, but you'll write the content yourself.

Run the following command in the root directory of your Medusa backend project:

```bash
npx typeorm migration:create src/migrations/PostCreate
```

This will create the migration file in the path you specify, where `PostCreate` is just an example of the name of the migration to create. The migration file must be inside the `src/migrations` directory. When you run the build command, it will be transpiled into the `dist/migrations` directory.

The `migrations run` command can only pick up migrations under the `dist/migrations` directory on a Medusa backend. This applies to migrations created in a Medusa backend, and not in a Medusa plugin. For plugins, check out the [Plugin's Structure section](../../plugins/create.mdx).

If you open the file, you'll find `up` and `down` methods. The `up` method is used to reflect the changes on the database. The `down` method is used to revert the changes, which will be executed if the `npx medusa migrations revert` command is used.

In each of the `up` and `down` methods, you can write the migration either with [SQL syntax](https://www.postgresql.org/docs/current/sql-syntax.html), or using the [migration API](https://typeorm.io/migrations#using-migration-api-to-write-migrations).

For example:

<!-- eslint-disable max-len -->

```ts
import { MigrationInterface, QueryRunner } from "typeorm"

export class AddAuthorsAndPosts1690876698954 implements MigrationInterface {
  name = "AddAuthorsAndPosts1690876698954"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "post" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "author_id" character varying NOT NULL, "authorId" character varying, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`)
    await queryRunner.query(`CREATE TABLE "author" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "image" character varying, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`)
    await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`)
    await queryRunner.query(`DROP TABLE "author"`)
    await queryRunner.query(`DROP TABLE "post"`)
  }
}
```

### Migration Name

If the `name` attribute isn't available in the generated migration, an error may occur while running the migration. To avoid this, make sure to add it manually and set its value to the class's name:

<!-- eslint-disable max-len -->

```ts
export class AddAuthorsAndPosts1690876698954 implements MigrationInterface {
  name = "AddAuthorsAndPosts1690876698954"

  // ...
}
```

---

## Step 2: Build Files

Before you can run the migrations, you need to run the build command to transpile the TypeScript files to JavaScript files:

```bash npm2yarn
npm run build
```

---

## Step 3: Run Migration

The last step is to run the migration with the command detailed earlier

```bash
npx medusa migrations run
```

If you check your database now you should see that the change defined by the migration has been applied successfully.

---

## See Also

- [Create a Plugin](../../plugins/create.mdx)
