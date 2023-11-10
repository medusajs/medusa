# FilterableProductProps

Filters to apply on retrieved products.

## Constructors

### constructor

**new FilterableProductProps**()

## Properties

### category\_id

 `Optional` **category\_id**: `string`[]

Filter products by their associated product category's ID.

#### Defined in

[packages/medusa/src/types/product.ts:127](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L127)

___

### collection\_id

 `Optional` **collection\_id**: `string`[]

Filter products by their associated product collection's ID.

#### Defined in

[packages/medusa/src/types/product.ts:64](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L64)

___

### created\_at

 `Optional` **created\_at**: [`DateComparisonOperator`](DateComparisonOperator.md)

Date filters to apply on the products' `created_at` date.

#### Defined in

[packages/medusa/src/types/product.ts:145](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L145)

___

### deleted\_at

 `Optional` **deleted\_at**: [`DateComparisonOperator`](DateComparisonOperator.md)

Date filters to apply on the products' `deleted_at` date.

#### Defined in

[packages/medusa/src/types/product.ts:161](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L161)

___

### description

 `Optional` **description**: `string`

Description to filter products by.

#### Defined in

[packages/medusa/src/types/product.ts:85](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L85)

___

### discount\_condition\_id

 `Optional` **discount\_condition\_id**: `string`

Filter products by their associated discount condition's ID.

#### Defined in

[packages/medusa/src/types/product.ts:120](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L120)

___

### handle

 `Optional` **handle**: `string`

Handle to filter products by.

#### Defined in

[packages/medusa/src/types/product.ts:92](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L92)

___

### id

 `Optional` **id**: `string` \| `string`[]

IDs to filter products by.

#### Defined in

[packages/medusa/src/types/product.ts:36](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L36)

___

### include\_category\_children

 `Optional` **include\_category\_children**: `boolean`

Whether to include product category children in the response.

#### Defined in

[packages/medusa/src/types/product.ts:137](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L137)

___

### is\_giftcard

 `Optional` **is\_giftcard**: `boolean`

Filter products by whether they're gift cards.

#### Defined in

[packages/medusa/src/types/product.ts:100](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L100)

___

### price\_list\_id

 `Optional` **price\_list\_id**: `string`[]

Filter products by their associated price lists' ID.

#### Defined in

[packages/medusa/src/types/product.ts:57](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L57)

___

### q

 `Optional` **q**: `string`

Search term to search products' title, description, variants' title and sku, and collections' title.

#### Defined in

[packages/medusa/src/types/product.ts:43](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L43)

___

### sales\_channel\_id

 `Optional` **sales\_channel\_id**: `string`[]

Filter products by their associated sales channels' ID.

#### Defined in

[packages/medusa/src/types/product.ts:113](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L113)

___

### status

 `Optional` **status**: [`ProductStatus`](../enums/ProductStatus.md)[]

Statuses to filter products by.

#### Defined in

[packages/medusa/src/types/product.ts:50](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L50)

___

### tags

 `Optional` **tags**: `string`[]

Filter products by their associated tags' value.

#### Defined in

[packages/medusa/src/types/product.ts:71](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L71)

___

### title

 `Optional` **title**: `string`

Title to filter products by.

#### Defined in

[packages/medusa/src/types/product.ts:78](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L78)

___

### type\_id

 `Optional` **type\_id**: `string`[]

Filter products by their associated product type's ID.

#### Defined in

[packages/medusa/src/types/product.ts:107](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L107)

___

### updated\_at

 `Optional` **updated\_at**: [`DateComparisonOperator`](DateComparisonOperator.md)

Date filters to apply on the products' `updated_at` date.

#### Defined in

[packages/medusa/src/types/product.ts:153](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L153)
