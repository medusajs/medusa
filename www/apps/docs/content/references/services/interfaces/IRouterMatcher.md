# IRouterMatcher

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `object` |
| `Method` | ``"all"`` \| ``"get"`` \| ``"post"`` \| ``"put"`` \| ``"delete"`` \| ``"patch"`` \| ``"options"`` \| ``"head"`` |

## Callable

### IRouterMatcher

**IRouterMatcher**<`Route`, `P`, `ResBody`, `ReqBody`, `ReqQuery`, `LocalsObj`\>(`path`, `...handlers`): `T`

| Name | Type |
| :------ | :------ |
| `Route` | `string` |
| `P` | `object` |
| `ResBody` | `object` |
| `ReqBody` | `object` |
| `ReqQuery` | `object` |
| `LocalsObj` | Record<`string`, `any`\> |

#### Parameters

| Name |
| :------ |
| `path` | `Route` |
| `...handlers` | [`RequestHandler`](RequestHandler-1.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `LocalsObj`\>[] |

#### Returns

`T`

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:131

### IRouterMatcher

**IRouterMatcher**<`Path`, `P`, `ResBody`, `ReqBody`, `ReqQuery`, `LocalsObj`\>(`path`, `...handlers`): `T`

| Name | Type |
| :------ | :------ |
| `Path` | `string` |
| `P` | `object` |
| `ResBody` | `object` |
| `ReqBody` | `object` |
| `ReqQuery` | `object` |
| `LocalsObj` | Record<`string`, `any`\> |

#### Parameters

| Name |
| :------ |
| `path` | `Path` |
| `...handlers` | [`RequestHandlerParams`](../index.md#requesthandlerparams)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `LocalsObj`\>[] |

#### Returns

`T`

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:146

### IRouterMatcher

**IRouterMatcher**<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `LocalsObj`\>(`path`, `...handlers`): `T`

| Name | Type |
| :------ | :------ |
| `P` | `object` |
| `ResBody` | `object` |
| `ReqBody` | `object` |
| `ReqQuery` | `object` |
| `LocalsObj` | Record<`string`, `any`\> |

#### Parameters

| Name |
| :------ |
| `path` | [`PathParams`](../index.md#pathparams) |
| `...handlers` | [`RequestHandler`](RequestHandler-1.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `LocalsObj`\>[] |

#### Returns

`T`

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:161

### IRouterMatcher

**IRouterMatcher**<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `LocalsObj`\>(`path`, `...handlers`): `T`

| Name | Type |
| :------ | :------ |
| `P` | `object` |
| `ResBody` | `object` |
| `ReqBody` | `object` |
| `ReqQuery` | `object` |
| `LocalsObj` | Record<`string`, `any`\> |

#### Parameters

| Name |
| :------ |
| `path` | [`PathParams`](../index.md#pathparams) |
| `...handlers` | [`RequestHandlerParams`](../index.md#requesthandlerparams)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `LocalsObj`\>[] |

#### Returns

`T`

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:173

### IRouterMatcher

**IRouterMatcher**(`path`, `subApplication`): `T`

#### Parameters

| Name |
| :------ |
| `path` | [`PathParams`](../index.md#pathparams) |
| `subApplication` | [`Application`](Application.md)<Record<`string`, `any`\>\> |

#### Returns

`T`

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:185
