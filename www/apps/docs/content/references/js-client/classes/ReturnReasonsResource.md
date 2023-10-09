# Class: ReturnReasonsResource

## Hierarchy

- `default`

  ↳ **`ReturnReasonsResource`**

## Methods

### list

▸ **list**(`customHeaders?`): `ResponsePromise`<`StoreReturnReasonsListRes`\>

Lists return reasons defined in Medusa Admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StoreReturnReasonsListRes`\>

#### Defined in

[return-reasons.ts:25](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/return-reasons.ts#L25)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`StoreReturnReasonsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreReturnReasonsRes`\>

**`Description`**

Retrieves a single Return Reason

#### Defined in

[return-reasons.ts:15](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/return-reasons.ts#L15)
