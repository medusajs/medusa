# OIDCRequestFunction

 **OIDCRequestFunction**: (`principalName`: `string`, `serverResult`: [`OIDCMechanismServerStep1`](../interfaces/OIDCMechanismServerStep1.md), `timeout`: `AbortSignal` \| `number`) => `Promise`<[`OIDCRequestTokenResult`](../interfaces/OIDCRequestTokenResult.md)\>

#### Type declaration

(`principalName`, `serverResult`, `timeout`): `Promise`<[`OIDCRequestTokenResult`](../interfaces/OIDCRequestTokenResult.md)\>

##### Parameters

| Name |
| :------ |
| `principalName` | `string` |
| `serverResult` | [`OIDCMechanismServerStep1`](../interfaces/OIDCMechanismServerStep1.md) |
| `timeout` | `AbortSignal` \| `number` |

##### Returns

`Promise`<[`OIDCRequestTokenResult`](../interfaces/OIDCRequestTokenResult.md)\>

-`Promise`: 
	-`accessToken`: 
	-`expiresInSeconds`: (optional) 
	-`refreshToken`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4307
