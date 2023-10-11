# Namespace: internal

## Classes

- [AdminDeleteProductsFromCollectionReq](../classes/internal-3.AdminDeleteProductsFromCollectionReq.md)
- [AdminGetCollectionsPaginationParams](../classes/internal-3.AdminGetCollectionsPaginationParams.md)
- [AdminGetCollectionsParams](../classes/internal-3.AdminGetCollectionsParams.md)
- [AdminPostCollectionsCollectionReq](../classes/internal-3.AdminPostCollectionsCollectionReq.md)
- [AdminPostCollectionsReq](../classes/internal-3.AdminPostCollectionsReq.md)
- [AdminPostProductsToCollectionReq](../classes/internal-3.AdminPostProductsToCollectionReq.md)

## Type Aliases

### AdminCollectionsListRes

Ƭ **AdminCollectionsListRes**: [`PaginatedResponse`](internal-2.md#paginatedresponse) & { `collections`: [`ProductCollection`](../classes/internal.ProductCollection.md)[]  }

#### Defined in

medusa/dist/api/routes/admin/collections/index.d.ts:8

___

### AdminCollectionsRes

Ƭ **AdminCollectionsRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `collection` | [`ProductCollection`](../classes/internal.ProductCollection.md) |

#### Defined in

medusa/dist/api/routes/admin/collections/index.d.ts:12

___

### DeleteResponse

Ƭ **DeleteResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deleted` | `boolean` |
| `id` | `string` |
| `object` | `string` |

#### Defined in

medusa/dist/types/common.d.ts:65
