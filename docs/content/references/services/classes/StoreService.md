# Class: StoreService

Provides layer to manipulate store settings.

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`StoreService`**

## Constructors

### constructor

• **new StoreService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/store.js:10](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/store.js#L10)

## Methods

### addCurrency

▸ **addCurrency**(`code`): `Promise`<`any`\>

Add a currency to the store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | 3 character ISO currency code |

#### Returns

`Promise`<`any`\>

result after update

#### Defined in

[services/store.js:203](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/store.js#L203)

___

### create

▸ **create**(): `Promise`<`Store`\>

Creates a store if it doesn't already exist.

#### Returns

`Promise`<`Store`\>

the store.

#### Defined in

[services/store.js:52](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/store.js#L52)

___

### decorate

▸ **decorate**(`store`, `fields`, `expandFields?`): `Store`

Decorates a store object.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `store` | `Store` | `undefined` | the store to decorate. |
| `fields` | `string`[] | `undefined` | the fields to include. |
| `expandFields` | `string`[] | `[]` | fields to expand. |

#### Returns

`Store`

return the decorated Store.

#### Defined in

[services/store.js:266](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/store.js#L266)

___

### getDefaultCurrency\_

▸ **getDefaultCurrency_**(`code`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `code` | `any` |
| `name` | `any` |
| `symbol` | `any` |
| `symbol_native` | `any` |

#### Defined in

[services/store.js:92](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/store.js#L92)

___

### removeCurrency

▸ **removeCurrency**(`code`): `Promise`<`any`\>

Removes a currency from the store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | 3 character ISO currency code |

#### Returns

`Promise`<`any`\>

result after update

#### Defined in

[services/store.js:242](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/store.js#L242)

___

### retrieve

▸ **retrieve**(`relations?`): `Promise`<`Store`\>

Retrieve the store settings. There is always a maximum of one store.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `relations` | `string`[] | `[]` | relations to fetch with store |

#### Returns

`Promise`<`Store`\>

the store

#### Defined in

[services/store.js:84](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/store.js#L84)

___

### update

▸ **update**(`update`): `Promise`<`any`\>

Updates a store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `update` | `any` | an object with the update values. |

#### Returns

`Promise`<`any`\>

resolves to the update result.

#### Defined in

[services/store.js:108](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/store.js#L108)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`StoreService`](StoreService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `any` |

#### Returns

[`StoreService`](StoreService.md)

#### Defined in

[services/store.js:31](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/store.js#L31)
