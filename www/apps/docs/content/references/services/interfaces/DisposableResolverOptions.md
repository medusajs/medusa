# DisposableResolverOptions

Options for disposable resolvers.

## Type parameters

| Name |
| :------ |
| `T` | `object` |

## Hierarchy

- [`ResolverOptions`](ResolverOptions.md)<`T`\>

  ↳ **`DisposableResolverOptions`**

  ↳↳ [`BuildResolverOptions`](BuildResolverOptions.md)

## Properties

### dispose

 `Optional` **dispose**: [`Disposer`](../types/Disposer.md)<`T`\>

#### Defined in

node_modules/awilix/lib/resolvers.d.ts:42

___

### lifetime

 `Optional` **lifetime**: [`LifetimeType`](../types/LifetimeType.md)

Lifetime setting.

#### Inherited from

[ResolverOptions](ResolverOptions.md).[lifetime](ResolverOptions.md#lifetime)

#### Defined in

node_modules/awilix/lib/resolvers.d.ts:66

___

### name

 `Optional` **name**: `string`

Only used for inline configuration with `loadModules`.

#### Inherited from

[ResolverOptions](ResolverOptions.md).[name](ResolverOptions.md#name)

#### Defined in

node_modules/awilix/lib/resolvers.d.ts:62

___

### register

 `Optional` **register**: (...`args`: `any`[]) => [`Resolver`](Resolver.md)<`T`\>

#### Type declaration

(`...args`): [`Resolver`](Resolver.md)<`T`\>

Registration function to use. Only used for inline configuration with `loadModules`.

##### Parameters

| Name |
| :------ |
| `...args` | `any`[] |

##### Returns

[`Resolver`](Resolver.md)<`T`\>

-`Resolver`: 

#### Inherited from

[ResolverOptions](ResolverOptions.md).[register](ResolverOptions.md#register)

#### Defined in

node_modules/awilix/lib/resolvers.d.ts:70
