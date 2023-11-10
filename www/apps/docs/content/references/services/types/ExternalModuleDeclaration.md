# ExternalModuleDeclaration

 **ExternalModuleDeclaration**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `alias?` | `string` | If multiple modules are registered with the same key, the alias can be used to differentiate them |
| `definition?` | [`ModuleDefinition`](ModuleDefinition.md) | - |
| `main?` | `boolean` | If the module is the main module for the key when multiple ones are registered |
| `options?` | Record<`string`, `unknown`\> | - |
| `scope` | [`EXTERNAL`](../index.md#external) | - |
| `server?` | { `keepAlive`: `boolean` ; `type`: ``"http"`` ; `url`: `string`  } | - |
| `server.keepAlive` | `boolean` | - |
| `server.type` | ``"http"`` | - |
| `server.url` | `string` | - |

#### Defined in

packages/types/dist/modules-sdk/index.d.ts:33
