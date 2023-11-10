# RequestHandler

## Type parameters

| Name | Type |
| :------ | :------ |
| `P` | `object` |
| `ResBody` | `object` |
| `ReqBody` | `object` |
| `ReqQuery` | `object` |
| `LocalsObj` | Record<`string`, `any`\> |

## Hierarchy

- **`RequestHandler`**

  ↳ [`RequestHandler`](RequestHandler.md)

  ↳ [`IRouter`](IRouter.md)

## Callable

### RequestHandler

**RequestHandler**(`req`, `res`, `next`): `void`

#### Parameters

| Name |
| :------ |
| `req` | [`Request`](Request-1.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `LocalsObj`\> |
| `res` | [`Response`](Response.md)<`ResBody`, `LocalsObj`, `number`\> |
| `next` | [`NextFunction`](NextFunction.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:71
