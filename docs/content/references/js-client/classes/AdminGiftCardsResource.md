# Class: AdminGiftCardsResource

## Hierarchy

- `default`

  ↳ **`AdminGiftCardsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal.md#admingiftcardsres)\>

**`description`** Creates a gift card

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostGiftCardsReq`](internal.AdminPostGiftCardsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal.md#admingiftcardsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/gift-cards.ts:17](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/gift-cards.ts#L17)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

**`description`** Deletes a gift card

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

#### Defined in

[packages/medusa-js/src/resources/admin/gift-cards.ts:36](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/gift-cards.ts#L36)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsListRes`](../modules/internal.md#admingiftcardslistres)\>

**`description`** Lists gift cards

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetGiftCardsParams`](internal.AdminGetGiftCardsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsListRes`](../modules/internal.md#admingiftcardslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/gift-cards.ts:52](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/gift-cards.ts#L52)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal.md#admingiftcardsres)\>

**`description`** Deletes a gift card

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal.md#admingiftcardsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/gift-cards.ts:44](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/gift-cards.ts#L44)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal.md#admingiftcardsres)\>

**`description`** Updates a gift card

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostGiftCardsGiftCardReq`](internal.AdminPostGiftCardsGiftCardReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGiftCardsRes`](../modules/internal.md#admingiftcardsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/gift-cards.ts:25](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/gift-cards.ts#L25)
