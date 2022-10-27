# Namespace: internal

## Classes

- [AdminGetProductsParams](../classes/internal-18.AdminGetProductsParams.md)
- [AdminPostProductsProductMetadataReq](../classes/internal-18.AdminPostProductsProductMetadataReq.md)
- [AdminPostProductsProductOptionsOption](../classes/internal-18.AdminPostProductsProductOptionsOption.md)
- [AdminPostProductsProductOptionsReq](../classes/internal-18.AdminPostProductsProductOptionsReq.md)
- [AdminPostProductsProductReq](../classes/internal-18.AdminPostProductsProductReq.md)
- [AdminPostProductsProductVariantsReq](../classes/internal-18.AdminPostProductsProductVariantsReq.md)
- [AdminPostProductsProductVariantsVariantReq](../classes/internal-18.AdminPostProductsProductVariantsVariantReq.md)
- [AdminPostProductsReq](../classes/internal-18.AdminPostProductsReq.md)
- [FilterableProductProps](../classes/internal-18.FilterableProductProps.md)
- [ProductOptionReq](../classes/internal-18.ProductOptionReq.md)
- [ProductSalesChannelReq](../classes/internal-18.ProductSalesChannelReq.md)
- [ProductTagReq](../classes/internal-18.ProductTagReq.md)
- [ProductTypeReq](../classes/internal-18.ProductTypeReq.md)
- [ProductVariantOptionReq](../classes/internal-18.ProductVariantOptionReq.md)
- [ProductVariantOptionReq](../classes/internal-18.ProductVariantOptionReq-1.md)
- [ProductVariantOptionReq](../classes/internal-18.ProductVariantOptionReq-2.md)
- [ProductVariantOptionReq](../classes/internal-18.ProductVariantOptionReq-3.md)
- [ProductVariantPricesCreateReq](../classes/internal-18.ProductVariantPricesCreateReq.md)
- [ProductVariantPricesUpdateReq](../classes/internal-18.ProductVariantPricesUpdateReq.md)
- [ProductVariantReq](../classes/internal-18.ProductVariantReq.md)
- [ProductVariantReq](../classes/internal-18.ProductVariantReq-1.md)

## Type Aliases

### AdminProductsDeleteOptionRes

Ƭ **AdminProductsDeleteOptionRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deleted` | `boolean` |
| `object` | ``"option"`` |
| `option_id` | `string` |
| `product` | [`Product`](../classes/internal.Product.md) |

#### Defined in

medusa/dist/api/routes/admin/products/index.d.ts:13

___

### AdminProductsDeleteRes

Ƭ **AdminProductsDeleteRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deleted` | `boolean` |
| `id` | `string` |
| `object` | ``"product"`` |

#### Defined in

medusa/dist/api/routes/admin/products/index.d.ts:25

___

### AdminProductsDeleteVariantRes

Ƭ **AdminProductsDeleteVariantRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deleted` | `boolean` |
| `object` | ``"product-variant"`` |
| `product` | [`Product`](../classes/internal.Product.md) |
| `variant_id` | `string` |

#### Defined in

medusa/dist/api/routes/admin/products/index.d.ts:19

___

### AdminProductsListRes

Ƭ **AdminProductsListRes**: [`PaginatedResponse`](internal-2.md#paginatedresponse) & { `products`: ([`PricedProduct`](internal-18.md#pricedproduct) \| [`Product`](../classes/internal.Product.md))[]  }

#### Defined in

medusa/dist/api/routes/admin/products/index.d.ts:30

___

### AdminProductsListTagsRes

Ƭ **AdminProductsListTagsRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tags` | [`ProductTag`](../classes/internal.ProductTag.md)[] |

#### Defined in

medusa/dist/api/routes/admin/products/index.d.ts:36

___

### AdminProductsListTypesRes

Ƭ **AdminProductsListTypesRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `types` | [`ProductType`](../classes/internal.ProductType.md)[] |

#### Defined in

medusa/dist/api/routes/admin/products/index.d.ts:33

___

### AdminProductsRes

Ƭ **AdminProductsRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `product` | [`Product`](../classes/internal.Product.md) |

#### Defined in

medusa/dist/api/routes/admin/products/index.d.ts:39

___

### PricedProduct

Ƭ **PricedProduct**: `Omit`<`Partial`<[`Product`](../classes/internal.Product.md)\>, ``"variants"``\> & { `variants`: [`PricedVariant`](internal-18.md#pricedvariant)[]  }

#### Defined in

medusa/dist/types/pricing.d.ts:31

___

### PricedVariant

Ƭ **PricedVariant**: `Partial`<[`ProductVariant`](../classes/internal.ProductVariant.md)\> & [`ProductVariantPricing`](internal-18.md#productvariantpricing)

#### Defined in

medusa/dist/types/pricing.d.ts:30

___

### ProductVariantPricing

Ƭ **ProductVariantPricing**: { `calculated_price`: `number` \| ``null`` ; `calculated_price_includes_tax?`: `boolean` \| ``null`` ; `calculated_price_type?`: `string` \| ``null`` ; `original_price`: `number` \| ``null`` ; `original_price_includes_tax?`: `boolean` \| ``null`` ; `prices`: [`MoneyAmount`](../classes/internal.MoneyAmount.md)[]  } & [`TaxedPricing`](internal-18.md#taxedpricing)

#### Defined in

medusa/dist/types/pricing.d.ts:4

___

### TaxServiceRate

Ƭ **TaxServiceRate**: `Object`

The tax rate object as configured in Medusa. These may have an unspecified
numerical rate as they may be used for lookup purposes in the tax provider
plugin.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code` | `string` \| ``null`` |
| `name` | `string` |
| `rate?` | `number` \| ``null`` |

#### Defined in

medusa/dist/types/tax-service.d.ts:6

___

### TaxedPricing

Ƭ **TaxedPricing**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `calculated_price_incl_tax` | `number` \| ``null`` |
| `calculated_tax` | `number` \| ``null`` |
| `original_price_incl_tax` | `number` \| ``null`` |
| `original_tax` | `number` \| ``null`` |
| `tax_rates` | [`TaxServiceRate`](internal-18.md#taxservicerate)[] \| ``null`` |

#### Defined in

medusa/dist/types/pricing.d.ts:12
