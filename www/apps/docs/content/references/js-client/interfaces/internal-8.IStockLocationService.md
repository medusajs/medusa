---
displayed_sidebar: jsClientSidebar
---

# Interface: IStockLocationService

[internal](../modules/internal-8.md).IStockLocationService

## Methods

### \_\_joinerConfig

▸ **__joinerConfig**(): [`ModuleJoinerConfig`](../modules/internal-8.md#modulejoinerconfig)

#### Returns

[`ModuleJoinerConfig`](../modules/internal-8.md#modulejoinerconfig)

#### Defined in

packages/types/dist/stock-location/service.d.ts:6

___

### create

▸ **create**(`input`, `context?`): `Promise`<[`StockLocationDTO`](../modules/internal-8.md#stocklocationdto)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`CreateStockLocationInput`](../modules/internal-8.md#createstocklocationinput) |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`StockLocationDTO`](../modules/internal-8.md#stocklocationdto)\>

#### Defined in

packages/types/dist/stock-location/service.d.ts:10

___

### delete

▸ **delete**(`id`, `context?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/types/dist/stock-location/service.d.ts:12

___

### list

▸ **list**(`selector`, `config?`, `context?`): `Promise`<[`StockLocationDTO`](../modules/internal-8.md#stocklocationdto)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`FilterableStockLocationProps`](../modules/internal-8.md#filterablestocklocationprops) |
| `config?` | [`FindConfig`](internal-8.FindConfig.md)<[`StockLocationDTO`](../modules/internal-8.md#stocklocationdto)\> |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`StockLocationDTO`](../modules/internal-8.md#stocklocationdto)[]\>

#### Defined in

packages/types/dist/stock-location/service.d.ts:7

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`, `context?`): `Promise`<[[`StockLocationDTO`](../modules/internal-8.md#stocklocationdto)[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`FilterableStockLocationProps`](../modules/internal-8.md#filterablestocklocationprops) |
| `config?` | [`FindConfig`](internal-8.FindConfig.md)<[`StockLocationDTO`](../modules/internal-8.md#stocklocationdto)\> |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[[`StockLocationDTO`](../modules/internal-8.md#stocklocationdto)[], `number`]\>

#### Defined in

packages/types/dist/stock-location/service.d.ts:8

___

### retrieve

▸ **retrieve**(`id`, `config?`, `context?`): `Promise`<[`StockLocationDTO`](../modules/internal-8.md#stocklocationdto)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `config?` | [`FindConfig`](internal-8.FindConfig.md)<[`StockLocationDTO`](../modules/internal-8.md#stocklocationdto)\> |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`StockLocationDTO`](../modules/internal-8.md#stocklocationdto)\>

#### Defined in

packages/types/dist/stock-location/service.d.ts:9

___

### update

▸ **update**(`id`, `input`, `context?`): `Promise`<[`StockLocationDTO`](../modules/internal-8.md#stocklocationdto)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `input` | [`UpdateStockLocationInput`](../modules/internal-8.md#updatestocklocationinput) |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`StockLocationDTO`](../modules/internal-8.md#stocklocationdto)\>

#### Defined in

packages/types/dist/stock-location/service.d.ts:11
