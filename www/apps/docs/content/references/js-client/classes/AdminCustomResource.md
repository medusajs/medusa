# Class: AdminCustomResource

## Hierarchy

- `default`

  ↳ **`AdminCustomResource`**

## Methods

### delete

▸ **delete**<`TResponse`\>(`path`, `options?`, `customHeaders?`): `ResponsePromise`<`TResponse`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResponse` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | `RequestOptions` |
| `customHeaders?` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`TResponse`\>

#### Defined in

[admin/custom.ts:47](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/custom.ts#L47)

___

### get

▸ **get**<`TQuery`, `TResponse`\>(`path`, `query?`, `options?`, `customHeaders?`): `ResponsePromise`<`TResponse`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TQuery` | extends `Record`<`string`, `any`\> |
| `TResponse` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `query?` | `TQuery` |
| `options?` | `RequestOptions` |
| `customHeaders?` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`TResponse`\>

#### Defined in

[admin/custom.ts:8](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/custom.ts#L8)

___

### post

▸ **post**<`TPayload`, `TResponse`\>(`path`, `payload?`, `options?`, `customHeaders?`): `ResponsePromise`<`TResponse`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TPayload` | extends `Record`<`string`, `any`\> |
| `TResponse` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `payload?` | `TPayload` |
| `options?` | `RequestOptions` |
| `customHeaders?` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`TResponse`\>

#### Defined in

[admin/custom.ts:30](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/custom.ts#L30)
