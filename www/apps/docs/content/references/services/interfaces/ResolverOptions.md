# ResolverOptions

The options when registering a class, function or value.

## Type parameters

| Name |
| :------ |
| `T` | `object` |

## Hierarchy

- **`ResolverOptions`**

  ↳ [`Resolver`](Resolver.md)

  ↳ [`BuildResolverOptions`](BuildResolverOptions.md)

  ↳ [`DisposableResolverOptions`](DisposableResolverOptions.md)

## Properties

### lifetime

 `Optional` **lifetime**: [`LifetimeType`](../index.md#lifetimetype)

Lifetime setting.

#### Defined in

node_modules/awilix/lib/resolvers.d.ts:66

___

### name

 `Optional` **name**: `string`

Only used for inline configuration with `loadModules`.

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

#### Defined in

node_modules/awilix/lib/resolvers.d.ts:70
