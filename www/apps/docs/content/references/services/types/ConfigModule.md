# ConfigModule

 **ConfigModule**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `featureFlags` | Record<`string`, `boolean` \| `string`\> |
| `modules?` | Record<`string`, `boolean` \| [`Partial`](Partial.md)<[`InternalModuleDeclaration`](InternalModuleDeclaration.md) \| [`ExternalModuleDeclaration`](ExternalModuleDeclaration.md)\>\> |
| `plugins` | ({ `options`: Record<`string`, `unknown`\> ; `resolve`: `string`  } \| `string`)[] |
| `projectConfig` | [`ProjectConfigOptions`](ProjectConfigOptions.md) |

#### Defined in

packages/types/dist/common/config-module.d.ts:39
