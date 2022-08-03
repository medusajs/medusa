# Class: CustomerGroupService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`CustomerGroupService`**

## Constructors

### constructor

• **new CustomerGroupService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `CustomerGroupConstructorProps` |

#### Overrides

BaseService.constructor

#### Defined in

[services/customer-group.ts:31](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer-group.ts#L31)

## Properties

### customerGroupRepository\_

• `Private` **customerGroupRepository\_**: typeof `CustomerGroupRepository`

#### Defined in

[services/customer-group.ts:27](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer-group.ts#L27)

___

### customerService\_

• `Private` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[services/customer-group.ts:29](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer-group.ts#L29)

___

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[services/customer-group.ts:25](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer-group.ts#L25)

## Methods

### addCustomers

▸ **addCustomers**(`id`, `customerIds`): `Promise`<`CustomerGroup`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `customerIds` | `string` \| `string`[] |  |

#### Returns

`Promise`<`CustomerGroup`\>

#### Defined in

[services/customer-group.ts:113](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer-group.ts#L113)

___

### create

▸ **create**(`group`): `Promise`<`CustomerGroup`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `group` | `Object` |  |
| `group.created_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |
| `group.customers?` | (`undefined` \| { email?: string \| undefined; first\_name?: string \| undefined; last\_name?: string \| undefined; billing\_address\_id?: string \| null \| undefined; billing\_address?: { customer\_id?: string \| null \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 10 more ...; updated\_at?: { ...; } \| undef...)[] | - |
| `group.deleted_at?` | ``null`` \| { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |
| `group.id?` | `string` | - |
| `group.metadata?` | { [x: string]: unknown; } | - |
| `group.name?` | `string` | - |
| `group.price_lists?` | (`undefined` \| { name?: string \| undefined; description?: string \| undefined; type?: PriceListType \| undefined; status?: PriceListStatus \| undefined; starts\_at?: { ...; } \| ... 1 more ... \| undefined; ... 6 more ...; updated\_at?: { ...; } \| undefined; })[] | - |
| `group.updated_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |

#### Returns

`Promise`<`CustomerGroup`\>

#### Defined in

[services/customer-group.ts:86](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer-group.ts#L86)

___

### delete

▸ **delete**(`groupId`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `groupId` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/customer-group.ts:194](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer-group.ts#L194)

___

### list

▸ **list**(`selector?`, `config`): `Promise`<`CustomerGroup`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableCustomerGroupProps` |  |
| `config` | `FindConfig`<`CustomerGroup`\> |  |

#### Returns

`Promise`<`CustomerGroup`[]\>

#### Defined in

[services/customer-group.ts:217](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer-group.ts#L217)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config`): `Promise`<[`CustomerGroup`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableCustomerGroupProps` |  |
| `config` | `FindConfig`<`CustomerGroup`\> |  |

#### Returns

`Promise`<[`CustomerGroup`[], `number`]\>

#### Defined in

[services/customer-group.ts:236](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer-group.ts#L236)

___

### removeCustomer

▸ **removeCustomer**(`id`, `customerIds`): `Promise`<`CustomerGroup`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `customerIds` | `string` \| `string`[] |  |

#### Returns

`Promise`<`CustomerGroup`\>

#### Defined in

[services/customer-group.ts:271](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer-group.ts#L271)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`CustomerGroup`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `config` | `Object` |

#### Returns

`Promise`<`CustomerGroup`\>

#### Defined in

[services/customer-group.ts:62](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer-group.ts#L62)

___

### update

▸ **update**(`customerGroupId`, `update`): `Promise`<`CustomerGroup`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerGroupId` | `string` |  |
| `update` | `CustomerGroupUpdate` |  |

#### Returns

`Promise`<`CustomerGroup`[]\>

#### Defined in

[services/customer-group.ts:162](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer-group.ts#L162)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`CustomerGroupService`](CustomerGroupService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `EntityManager` |

#### Returns

[`CustomerGroupService`](CustomerGroupService.md)

#### Defined in

[services/customer-group.ts:46](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer-group.ts#L46)
