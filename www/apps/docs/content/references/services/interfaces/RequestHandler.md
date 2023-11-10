# RequestHandler

## Type parameters

| Name | Type |
| :------ | :------ |
| `P` | `object` |
| `ResBody` | `object` |
| `ReqBody` | `object` |
| `ReqQuery` | `object` |
| `Locals` | Record<`string`, `any`\> |

## Hierarchy

- [`RequestHandler`](RequestHandler-1.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\>

  ↳ **`RequestHandler`**

## Callable

### RequestHandler

**RequestHandler**(`req`, `res`, `next`): `void`

#### Parameters

| Name |
| :------ |
| `req` | [`Request`](Request-1.md)<`P`, `ResBody`, `ReqBody`, `ReqQuery`, `Locals`\> |
| `res` | [`Response`](Response.md)<`ResBody`, `Locals`, `number`\> |
| `next` | [`NextFunction`](NextFunction.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/@types/express-serve-static-core/index.d.ts:71
