# InternalModuleDeclaration

 **InternalModuleDeclaration**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `alias?` | `string` | If multiple modules are registered with the same key, the alias can be used to differentiate them |
| `definition?` | [`ModuleDefinition`](ModuleDefinition.md) | - |
| `dependencies?` | `string`[] | - |
| `main?` | `boolean` | If the module is the main module for the key when multiple ones are registered |
| `options?` | Record<`string`, `unknown`\> | - |
| `resolve?` | `string` | - |
| `resources` | [`MODULE_RESOURCE_TYPE`](../enums/MODULE_RESOURCE_TYPE.md) | - |
| `scope` | [`INTERNAL`](../index.md#internal) | - |

#### Defined in

packages/types/dist/modules-sdk/index.d.ts:17
