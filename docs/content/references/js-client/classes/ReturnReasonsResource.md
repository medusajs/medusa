# Class: ReturnReasonsResource

## Hierarchy

- `default`

  ↳ **`ReturnReasonsResource`**

## Methods

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnReasonsListRes`](../modules/internal-40.md#storereturnreasonslistres)\>

Lists return reasons defined in Medusa Admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnReasonsListRes`](../modules/internal-40.md#storereturnreasonslistres)\>

#### Defined in

[medusa-js/src/resources/return-reasons.ts:25](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/return-reasons.ts#L25)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnReasonsRes`](../modules/internal-40.md#storereturnreasonsres)\>

**`Description`**

Retrieves a single Return Reason

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnReasonsRes`](../modules/internal-40.md#storereturnreasonsres)\>

#### Defined in

[medusa-js/src/resources/return-reasons.ts:15](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/return-reasons.ts#L15)
