# RequestListener

 **RequestListener**<`Request`, `Response`\>: (`req`: [`InstanceType`](InstanceType.md)<`Request`\>, `res`: [`InstanceType`](InstanceType.md)<`Response`\> & { `req`: [`InstanceType`](InstanceType.md)<`Request`\>  }) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Request` | typeof [`IncomingMessage`](../classes/IncomingMessage.md) |
| `Response` | typeof [`ServerResponse`](../classes/ServerResponse.md) |

#### Type declaration

(`req`, `res`): `void`

##### Parameters

| Name |
| :------ |
| `req` | [`InstanceType`](InstanceType.md)<`Request`\> |
| `res` | [`InstanceType`](InstanceType.md)<`Response`\> & { `req`: [`InstanceType`](InstanceType.md)<`Request`\>  } |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/http.d.ts:315
