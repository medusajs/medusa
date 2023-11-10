# CreateProductInput

 **CreateProductInput**: `Object`

Service Level DTOs

#### Type declaration

| Name | Type |
| :------ | :------ |
| `categories?` | [`CreateProductProductCategoryInput`](CreateProductProductCategoryInput.md)[] \| ``null`` |
| `collection_id?` | `string` |
| `description?` | `string` |
| `discountable?` | `boolean` |
| `external_id?` | `string` \| ``null`` |
| `handle?` | `string` |
| `height?` | `number` |
| `hs_code?` | `string` |
| `images?` | `string`[] |
| `is_giftcard?` | `boolean` |
| `length?` | `number` |
| `material?` | `string` |
| `metadata?` | Record<`string`, `unknown`\> |
| `mid_code?` | `string` |
| `options?` | [`CreateProductProductOption`](CreateProductProductOption.md)[] |
| `origin_country?` | `string` |
| `profile_id?` | `string` |
| `sales_channels?` | [`CreateProductProductSalesChannelInput`](CreateProductProductSalesChannelInput.md)[] \| ``null`` |
| `status?` | [`ProductStatus`](../enums/ProductStatus.md) |
| `subtitle?` | `string` |
| `tags?` | [`CreateProductProductTagInput`](CreateProductProductTagInput.md)[] |
| `thumbnail?` | `string` |
| `title` | `string` |
| `type?` | [`CreateProductProductTypeInput`](CreateProductProductTypeInput.md) |
| `variants?` | [`CreateProductProductVariantInput`](CreateProductProductVariantInput.md)[] |
| `weight?` | `number` |
| `width?` | `number` |

#### Defined in

[packages/medusa/src/types/product.ts:178](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/product.ts#L178)
