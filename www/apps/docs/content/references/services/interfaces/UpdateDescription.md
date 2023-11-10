# UpdateDescription

## Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | [`Document`](Document.md) |

## Properties

### disambiguatedPaths

 `Optional` **disambiguatedPaths**: [`Document`](Document.md)

A document containing additional information about any ambiguous update paths from the update event.  The document
maps the full ambiguous update path to an array containing the actual resolved components of the path.  For example,
given a document shaped like `{ a: { '0': 0 } }`, and an update of `{ $inc: 'a.0' }`, disambiguated paths would look like
the following:

```
  {
    'a.0': ['a', '0']
  }
```

This field is only present when there are ambiguous paths that are updated as a part of the update event and `showExpandedEvents`
is enabled for the change stream.

**Since Server Version**

6.1.0

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5166

___

### removedFields

 `Optional` **removedFields**: `string`[]

An array of field names that were removed from the document.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5136

___

### truncatedArrays

 `Optional` **truncatedArrays**: { `field`: `string` ; `newSize`: `number`  }[]

An array of documents which record array truncations performed with pipeline-based updates using one or more of the following stages:
- $addFields
- $set
- $replaceRoot
- $replaceWith

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5144

___

### updatedFields

 `Optional` **updatedFields**: [`Partial`](../index.md#partial)<`TSchema`\>

A document containing key:value pairs of names of the fields that were
changed, and the new value for those fields.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5132
