---
displayed_sidebar: jsClientSidebar
---

# Class: AdminGiftCardsResource

## Hierarchy

- `default`

  ↳ **`AdminGiftCardsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal-8.internal.md#admingiftcardsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostGiftCardsReq`](internal-8.internal.AdminPostGiftCardsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal-8.internal.md#admingiftcardsres)\>

**`Description`**

Creates a gift card

#### Defined in

[packages/medusa-js/src/resources/admin/gift-cards.ts:17](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/gift-cards.ts#L17)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

**`Description`**

Deletes a gift card

#### Defined in

[packages/medusa-js/src/resources/admin/gift-cards.ts:40](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/gift-cards.ts#L40)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminGiftCardsListRes`](../modules/internal-8.internal.md#admingiftcardslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetGiftCardsParams`](internal-8.internal.AdminGetGiftCardsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminGiftCardsListRes`](../modules/internal-8.internal.md#admingiftcardslistres)\>

**`Description`**

Lists gift cards

#### Defined in

[packages/medusa-js/src/resources/admin/gift-cards.ts:62](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/gift-cards.ts#L62)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal-8.internal.md#admingiftcardsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal-8.internal.md#admingiftcardsres)\>

**`Description`**

Deletes a gift card

#### Defined in

[packages/medusa-js/src/resources/admin/gift-cards.ts:51](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/gift-cards.ts#L51)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal-8.internal.md#admingiftcardsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostGiftCardsGiftCardReq`](internal-8.internal.AdminPostGiftCardsGiftCardReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal-8.internal.md#admingiftcardsres)\>

**`Description`**

Updates a gift card

#### Defined in

[packages/medusa-js/src/resources/admin/gift-cards.ts:28](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/gift-cards.ts#L28)
