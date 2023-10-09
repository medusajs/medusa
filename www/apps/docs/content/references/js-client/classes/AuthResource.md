# Class: AuthResource

## Hierarchy

- `default`

  ↳ **`AuthResource`**

## Methods

### authenticate

▸ **authenticate**(`payload`, `customHeaders?`): `ResponsePromise`<`StoreAuthRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `StorePostAuthReq` | authentication payload |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreAuthRes`\>

**`Description`**

Authenticates a customer using email and password combination

#### Defined in

[auth.ts:18](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/auth.ts#L18)

___

### deleteSession

▸ **deleteSession**(`customHeaders?`): `ResponsePromise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`void`\>

**`Description`**

Removes authentication session

#### Defined in

[auth.ts:27](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/auth.ts#L27)

___

### exists

▸ **exists**(`email`, `customHeaders?`): `ResponsePromise`<`StoreGetAuthEmailRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreGetAuthEmailRes`\>

**`Description`**

Check if email exists

#### Defined in

[auth.ts:49](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/auth.ts#L49)

___

### getSession

▸ **getSession**(`customHeaders?`): `ResponsePromise`<`StoreAuthRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StoreAuthRes`\>

**`Description`**

Retrieves an authenticated session
Usually used to check if authenticated session is alive.

#### Defined in

[auth.ts:38](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/auth.ts#L38)

___

### getToken

▸ **getToken**(`payload`, `customHeaders?`): `ResponsePromise`<`StoreBearerAuthRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `StorePostAuthReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StoreBearerAuthRes`\>

**`Description`**

Retrieves a new JWT access token

#### Defined in

[auth.ts:60](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/auth.ts#L60)
