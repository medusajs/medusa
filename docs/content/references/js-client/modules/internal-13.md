# Namespace: internal

## Classes

- [AdminPostOrderEditsEditLineItemsLineItemReq](../classes/internal-13.AdminPostOrderEditsEditLineItemsLineItemReq.md)
- [AdminPostOrderEditsEditLineItemsReq](../classes/internal-13.AdminPostOrderEditsEditLineItemsReq.md)
- [AdminPostOrderEditsOrderEditReq](../classes/internal-13.AdminPostOrderEditsOrderEditReq.md)
- [AdminPostOrderEditsReq](../classes/internal-13.AdminPostOrderEditsReq.md)
- [GetOrderEditsOrderEditParams](../classes/internal-13.GetOrderEditsOrderEditParams.md)
- [GetOrderEditsParams](../classes/internal-13.GetOrderEditsParams.md)

## Type Aliases

### AdminOrderEditItemChangeDeleteRes

Ƭ **AdminOrderEditItemChangeDeleteRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deleted` | `boolean` |
| `id` | `string` |
| `object` | ``"item_change"`` |

#### Defined in

medusa/dist/api/routes/admin/order-edits/index.d.ts:12

___

### AdminOrderEditsListRes

Ƭ **AdminOrderEditsListRes**: [`PaginatedResponse`](internal-2.md#paginatedresponse) & { `order_edits`: [`OrderEdit`](../classes/internal.OrderEdit.md)[]  }

#### Defined in

medusa/dist/api/routes/admin/order-edits/index.d.ts:8

___

### AdminOrderEditsRes

Ƭ **AdminOrderEditsRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `order_edit` | [`OrderEdit`](../classes/internal.OrderEdit.md) |

#### Defined in

medusa/dist/api/routes/admin/order-edits/index.d.ts:5

## Variables

### GetOrderEditsParams\_base

• `Const` **GetOrderEditsParams\_base**: [`"/home/runner/work/medusa/medusa/packages/medusa/dist/types/global"`](internal-7.__home_runner_work_medusa_medusa_packages_medusa_dist_types_global_.md)

#### Defined in

medusa/dist/api/routes/admin/order-edits/list-order-edit.d.ts:71
