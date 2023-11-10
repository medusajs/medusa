# RequestQueryFields

Request parameters used to configure and paginate retrieved data.

## Properties

### expand

 `Optional` **expand**: `string`

{@inheritDoc FindParams.expand}

#### Defined in

[packages/medusa/src/types/common.ts:122](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/common.ts#L122)

___

### fields

 `Optional` **fields**: `string`

{@inheritDoc FindParams.fields}

#### Defined in

[packages/medusa/src/types/common.ts:126](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/common.ts#L126)

___

### limit

 `Optional` **limit**: `number`

{@inheritDoc FindPaginationParams.limit}

#### Defined in

[packages/medusa/src/types/common.ts:134](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/common.ts#L134)

___

### offset

 `Optional` **offset**: `number`

{@inheritDoc FindPaginationParams.offset}

#### Defined in

[packages/medusa/src/types/common.ts:130](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/common.ts#L130)

___

### order

 `Optional` **order**: `string`

The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.

#### Defined in

[packages/medusa/src/types/common.ts:138](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/common.ts#L138)
