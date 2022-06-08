# Class: GiftCardsResource

## Hierarchy

- `default`

  ↳ **`GiftCardsResource`**

## Methods

### retrieve

▸ **retrieve**(`code`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreGiftCardsRes`](../modules/internal.md#storegiftcardsres)\>

**`description`** Retrieves a single GiftCard

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | code of the gift card |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreGiftCardsRes`](../modules/internal.md#storegiftcardsres)\>

#### Defined in

[packages/medusa-js/src/resources/gift-cards.ts:12](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/gift-cards.ts#L12)
