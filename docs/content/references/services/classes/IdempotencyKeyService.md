# Class: IdempotencyKeyService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`IdempotencyKeyService`**

## Constructors

### constructor

• **new IdempotencyKeyService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/idempotency-key.js:8](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/idempotency-key.js#L8)

## Methods

### create

▸ **create**(`payload`): `Promise`<`IdempotencyKeyModel`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `any` |  |

#### Returns

`Promise`<`IdempotencyKeyModel`\>

#### Defined in

[services/idempotency-key.js:52](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/idempotency-key.js#L52)

___

### initializeRequest

▸ **initializeRequest**(`headerKey`, `reqMethod`, `reqParams`, `reqPath`): `Promise`<`IdempotencyKeyModel`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headerKey` | `string` |  |
| `reqMethod` | `string` |  |
| `reqParams` | `string` |  |
| `reqPath` | `string` |  |

#### Returns

`Promise`<`IdempotencyKeyModel`\>

#### Defined in

[services/idempotency-key.js:26](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/idempotency-key.js#L26)

___

### lock

▸ **lock**(`idempotencyKey`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/idempotency-key.js:90](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/idempotency-key.js#L90)

___

### retrieve

▸ **retrieve**(`idempotencyKey`): `Promise`<`IdempotencyKeyModel`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` |  |

#### Returns

`Promise`<`IdempotencyKeyModel`\>

#### Defined in

[services/idempotency-key.js:73](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/idempotency-key.js#L73)

___

### update

▸ **update**(`idempotencyKey`, `update`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` |  |
| `update` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/idempotency-key.js:117](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/idempotency-key.js#L117)

___

### workStage

▸ **workStage**(`idempotencyKey`, `func`): `IdempotencyKeyModel`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` |  |
| `func` | `Function` |  |

#### Returns

`IdempotencyKeyModel`

#### Defined in

[services/idempotency-key.js:144](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/idempotency-key.js#L144)
