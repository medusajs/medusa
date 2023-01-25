---
description: 'Learn what entities are in the Medusa server. There are entities in the Medusa server, and developers can create custom entities.'
---

# Entities

In this document, you'll learn what Entities are in Medusa.

## What are Entities

Entities in medusa represent tables in the database as classes. An example of this would be the `Order` entity which represents the `order` table in the database. Entities provide a uniform way of defining and interacting with data retrieved from the database.

Aside from Medusa’s core entities, you can also create your own entities to use in your Medusa server. Custom entities are TypeScript or JavaScript files located in the `src/models` directory of your Medusa server.

Entities are TypeScript files and they are based on [Typeorm’s Entities](https://typeorm.io/entities) and use Typeorm decorators.

---

## Base Entities

All entities must extend either the `BaseEntity` or `SoftDeletableEntity` classes. The `BaseEntity` class holds common columns including the `id`, `created_at`, and `updated_at` columns.

The `SoftDeletableEntity` class extends the `BaseEntity` class and adds another column `deleted_at`. If an entity can be soft deleted, meaning that a row in it can appear to the user as deleted but still be available in the database, it should extend `SoftDeletableEntity`.

---

## See Also

- [Create an entity](./index.md)
- [Entities' reference](../../../references/entities/classes/Address.md)