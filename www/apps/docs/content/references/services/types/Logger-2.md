# Logger

 **Logger**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activity` | (`message`: `string`, `config?`: `any`) => `void` |
| `debug` | (`message`: `any`) => `void` |
| `error` | (`messageOrError`: `any`, `error?`: `any`) => `void` |
| `failure` | (`activityId`: `any`, `message`: `any`) => `void` |
| `info` | (`message`: `any`) => `void` |
| `log` | (...`args`: `any`) => `void` |
| `panic` | (`data`: `any`) => `void` |
| `progress` | (`activityId`: `any`, `message`: `any`) => `void` |
| `setLogLevel` | (`level`: `string`) => `void` |
| `shouldLog` | (`level`: `string`) => `void` |
| `success` | (`activityId`: `any`, `message`: `any`) => `void` |
| `unsetLogLevel` | () => `void` |
| `warn` | (`message`: `any`) => `void` |

#### Defined in

[packages/medusa/src/types/global.ts:33](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/global.ts#L33)
