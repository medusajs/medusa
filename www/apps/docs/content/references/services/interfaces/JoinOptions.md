# JoinOptions

Used to specify what entity relations should be loaded.

Example:
 const options: JoinOptions = {
    alias: "photo",
    leftJoin: {
        author: "photo.author",
        categories: "categories",
        user: "categories.user",
        profile: "user.profile"
    },
    innerJoin: {
        author: "photo.author",
        categories: "categories",
        user: "categories.user",
        profile: "user.profile"
    },
    leftJoinAndSelect: {
        author: "photo.author",
        categories: "categories",
        user: "categories.user",
        profile: "user.profile"
    },
    innerJoinAndSelect: {
        author: "photo.author",
        categories: "categories",
        user: "categories.user",
        profile: "user.profile"
    }
};

**Deprecated**

## Properties

### alias

 **alias**: `string`

Alias of the main entity.

#### Defined in

node_modules/typeorm/find-options/JoinOptions.d.ts:39

___

### innerJoin

 `Optional` **innerJoin**: `object`

Object where each key represents the INNER JOIN alias,
and the corresponding value represents the relation path.

This method does not select the columns of the joined table.

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

node_modules/typeorm/find-options/JoinOptions.d.ts:73

___

### innerJoinAndSelect

 `Optional` **innerJoinAndSelect**: `object`

Object where each key represents the INNER JOIN alias,
and the corresponding value represents the relation path.

The columns of the joined table are included in the selection.

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

node_modules/typeorm/find-options/JoinOptions.d.ts:55

___

### leftJoin

 `Optional` **leftJoin**: `object`

Object where each key represents the LEFT JOIN alias,
and the corresponding value represents the relation path.

This method does not select the columns of the joined table.

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

node_modules/typeorm/find-options/JoinOptions.d.ts:64

___

### leftJoinAndSelect

 `Optional` **leftJoinAndSelect**: `object`

Object where each key represents the LEFT JOIN alias,
and the corresponding value represents the relation path.

The columns of the joined table are included in the selection.

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

node_modules/typeorm/find-options/JoinOptions.d.ts:46
