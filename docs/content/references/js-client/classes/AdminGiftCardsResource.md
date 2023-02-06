# Class: AdminGiftCardsResource

## Hierarchy

- `default`

  ↳ **`AdminGiftCardsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal-9.md#admingiftcardsres)\>

**`Description`**

Creates a gift card

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostGiftCardsReq`](internal-9.AdminPostGiftCardsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal-9.md#admingiftcardsres)\>

#### Defined in

[medusa-js/src/resources/admin/gift-cards.ts:17](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/gift-cards.ts#L17)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

**`Description`**

Deletes a gift card

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Defined in

[medusa-js/src/resources/admin/gift-cards.ts:40](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/gift-cards.ts#L40)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsListRes`](../modules/internal-9.md#admingiftcardslistres)\>

**`Description`**

Lists gift cards

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetGiftCardsParams`](internal-9.AdminGetGiftCardsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsListRes`](../modules/internal-9.md#admingiftcardslistres)\>

#### Defined in

[medusa-js/src/resources/admin/gift-cards.ts:62](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/gift-cards.ts#L62)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal-9.md#admingiftcardsres)\>

**`Description`**

Deletes a gift card

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal-9.md#admingiftcardsres)\>

#### Defined in

[medusa-js/src/resources/admin/gift-cards.ts:51](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/gift-cards.ts#L51)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal-9.md#admingiftcardsres)\>

**`Description`**

Updates a gift card

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostGiftCardsGiftCardReq`](internal-9.AdminPostGiftCardsGiftCardReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal-9.md#admingiftcardsres)\>

#### Defined in

[medusa-js/src/resources/admin/gift-cards.ts:28](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/gift-cards.ts#L28)
