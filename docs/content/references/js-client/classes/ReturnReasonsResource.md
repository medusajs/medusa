# Class: ReturnReasonsResource

## Hierarchy

- `default`

  ↳ **`ReturnReasonsResource`**

## Methods

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnReasonsListRes`](../modules/internal.md#storereturnreasonslistres)\>

Lists return reasons defined in Medusa Admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnReasonsListRes`](../modules/internal.md#storereturnreasonslistres)\>

#### Defined in

[packages/medusa-js/src/resources/return-reasons.ts:25](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/return-reasons.ts#L25)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnReasonsRes`](../modules/internal.md#storereturnreasonsres)\>

**`description`** Retrieves a single Return Reason

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreReturnReasonsRes`](../modules/internal.md#storereturnreasonsres)\>

#### Defined in

[packages/medusa-js/src/resources/return-reasons.ts:15](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/return-reasons.ts#L15)
