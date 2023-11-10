# NameFormatter

 **NameFormatter**: (`name`: `string`, `descriptor`: [`LoadedModuleDescriptor`](../interfaces/LoadedModuleDescriptor.md)) => `string`

#### Type declaration

(`name`, `descriptor`): `string`

Takes in the filename of the module being loaded as well as the module descriptor,
and returns a string which is used to register the module in the container.

`descriptor.name` is the same as `name`.

##### Parameters

| Name |
| :------ |
| `name` | `string` |
| `descriptor` | [`LoadedModuleDescriptor`](../interfaces/LoadedModuleDescriptor.md) |

##### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/awilix/lib/load-modules.d.ts:34
