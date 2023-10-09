# Class: AdminGiftCardsResource

## Hierarchy

- `default`

  ↳ **`AdminGiftCardsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminGiftCardsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostGiftCardsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminGiftCardsRes`\>

**`Description`**

Creates a gift card

#### Defined in

[admin/gift-cards.ts:17](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/gift-cards.ts#L17)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

**`Description`**

Deletes a gift card

#### Defined in

[admin/gift-cards.ts:40](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/gift-cards.ts#L40)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminGiftCardsListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetGiftCardsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminGiftCardsListRes`\>

**`Description`**

Lists gift cards

#### Defined in

[admin/gift-cards.ts:62](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/gift-cards.ts#L62)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminGiftCardsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminGiftCardsRes`\>

**`Description`**

Deletes a gift card

#### Defined in

[admin/gift-cards.ts:51](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/gift-cards.ts#L51)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminGiftCardsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostGiftCardsGiftCardReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminGiftCardsRes`\>

**`Description`**

Updates a gift card

#### Defined in

[admin/gift-cards.ts:28](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/gift-cards.ts#L28)
