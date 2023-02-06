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

## metadata Attribute

Most entities in Medusa have a `metadata` attribute. This attribute is an object that can be used to store custom data related to that entity. In the database, this attribute is stored as a [JSON Binary (JSONB)](https://www.postgresql.org/docs/current/datatype-json.html#JSON-CONTAINMENT) column. On retrieval, the attribute is parsed into an object.

Some example use cases for the `metadata` attribute include:

- Store an external ID of an entity related to a third-party integartion.
- Store product customization such as personalization options.

### Add and Update Metadata

You can add or update metadata entities either through the REST APIs or through create and update methods in the entity's respective service.

In the [admin REST APIs](/api/admin), you'll find that in create or update requests of some entities you can also set the `metadata`.

In services, there are typically `create` or `update` methods that allow you to set or update the metadata.

If you want to add a property to the `metadata` object or update a property in the `metadata` object, you can pass the `metadata` object with the properties you want to add or update in it. For example:

```json
{
  // other data
  "metadata": {
    "is_b2b": true
  }
}
```

If you want to remove a property from the `metadata` object, you can pass the `metadata` object with the property you want to delete. The property should have an empty string value. For example:

```json
{
  // other data
  "metadata": {
    "is_b2b": "" // this deletes the `is_b2b` property from `metadata`
  }
}
```

---

## See Also

- [Create an entity](./index.md)
- [Entities' reference](../../../references/entities/classes/Address.md)