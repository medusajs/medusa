# FilterablePriceListProps

Filters to apply on the retrieved price lists.

## Constructors

### constructor

**new FilterablePriceListProps**()

## Properties

### created\_at

 `Optional` **created\_at**: [`DateComparisonOperator`](DateComparisonOperator.md)

Date filters to apply on the price lists' `created_at` date.

#### Defined in

[packages/medusa/src/types/price-list.ts:106](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/price-list.ts#L106)

___

### customer\_groups

 `Optional` **customer\_groups**: `string`[]

Filter price lists by their associated customer groups.

#### Defined in

[packages/medusa/src/types/price-list.ts:84](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/price-list.ts#L84)

___

### deleted\_at

 `Optional` **deleted\_at**: [`DateComparisonOperator`](DateComparisonOperator.md)

Date filters to apply on the price lists' `deleted_at` date.

#### Defined in

[packages/medusa/src/types/price-list.ts:122](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/price-list.ts#L122)

___

### description

 `Optional` **description**: `string`

Description to filter price lists by.

#### Defined in

[packages/medusa/src/types/price-list.ts:91](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/price-list.ts#L91)

___

### id

 `Optional` **id**: `string`

IDs to filter price lists by.

#### Defined in

[packages/medusa/src/types/price-list.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/price-list.ts#L56)

___

### name

 `Optional` **name**: `string`

Name to filter price lists by.

#### Defined in

[packages/medusa/src/types/price-list.ts:77](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/price-list.ts#L77)

___

### q

 `Optional` **q**: `string`

Search terms to search price lists' description, name, and customer group's name.

#### Defined in

[packages/medusa/src/types/price-list.ts:63](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/price-list.ts#L63)

___

### status

 `Optional` **status**: [`PriceListStatus`](../enums/PriceListStatus.md)[]

Statuses to filter price lists by.

#### Defined in

[packages/medusa/src/types/price-list.ts:70](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/price-list.ts#L70)

___

### type

 `Optional` **type**: [`PriceListType`](../enums/PriceListType.md)[]

Types to filter price lists by.

#### Defined in

[packages/medusa/src/types/price-list.ts:98](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/price-list.ts#L98)

___

### updated\_at

 `Optional` **updated\_at**: [`DateComparisonOperator`](DateComparisonOperator.md)

Date filters to apply on the price lists' `updated_at` date.

#### Defined in

[packages/medusa/src/types/price-list.ts:114](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/price-list.ts#L114)
