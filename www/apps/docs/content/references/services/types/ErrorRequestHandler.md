# ErrorRequestHandler

 **ErrorRequestHandler**<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `LocalsObj`\>: (`err`: `any`, `req`: [`Request`](../interfaces/Request-1.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `LocalsObj`\>, `res`: [`Response`](../interfaces/Response.md)<`ResBody`, `LocalsObj`\>, `next`: [`NextFunction`](../interfaces/NextFunction.md)) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | `object` |
| `ResBody` | `object` |
| `ReqBody` | `object` |
| `ReqQuery` | `object` |
| `LocalsObj` | Record<`string`, `any`\> |

#### Type declaration

(`err`, `req`, `res`, `next`): `void`

##### Parameters

| Name |
| :------ |
| `err` | `any` |
| `req` | [`Request`](../interfaces/Request-1.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `LocalsObj`\> |
| `res` | [`Response`](../interfaces/Response.md)<`ResBody`, `LocalsObj`\> |
| `next` | [`NextFunction`](../interfaces/NextFunction.md) |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:78
