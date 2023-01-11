# Migrations

In this document, you'll learn what Migrations are in Medusa.

:::note

Medusa’s Migrations do not work with SQLite databases. They are intended to be used with PostgreSQL databases, which is the recommended Database for your Medusa production server.

:::

## What are Migrations

Migrations are scripts that are used to make additions or changes to your database schema. In Medusa, they are essential for both when you first install your server and for subsequent server upgrades later on.

When you first create your Medusa server, the database schema used must have all the tables necessary for the server to run.

When a new Medusa version introduces changes to the database schema, you'll have to run migrations to apply them to your own database.

:::tip

Migrations are used to apply changes to the database schema. However, there are some version updates of Medusa that require updating the data in your database to fit the new schema. Those are specific to each version and you should check out the version under Upgrade Guides for details on the steps.

:::

---

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

---

## See Also

- [Create a migration](index.md)
- [Set up your development environment](../../../tutorial/set-up-your-development-environment)
