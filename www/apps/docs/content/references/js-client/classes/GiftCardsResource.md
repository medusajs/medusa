---
displayed_sidebar: jsClientSidebar
---

# Class: GiftCardsResource

## Hierarchy

- `default`

  ↳ **`GiftCardsResource`**

## Methods

### retrieve

▸ **retrieve**(`code`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreGiftCardsRes`](../modules/internal-8.internal.md#storegiftcardsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | code of the gift card |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreGiftCardsRes`](../modules/internal-8.internal.md#storegiftcardsres)\>

**`Description`**

Retrieves a single GiftCard

#### Defined in

[packages/medusa-js/src/resources/gift-cards.ts:12](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/gift-cards.ts#L12)
