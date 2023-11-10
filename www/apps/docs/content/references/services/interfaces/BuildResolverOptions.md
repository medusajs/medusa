# BuildResolverOptions

Builder resolver options.

## Type parameters

| Name |
| :------ |
| `T` | `object` |

## Hierarchy

- [`ResolverOptions`](ResolverOptions.md)<`T`\>

- [`DisposableResolverOptions`](DisposableResolverOptions.md)<`T`\>

  ↳ **`BuildResolverOptions`**

## Properties

### dispose

 `Optional` **dispose**: [`Disposer`](../types/Disposer.md)<`T`\>

#### Inherited from

[DisposableResolverOptions](DisposableResolverOptions.md).[dispose](DisposableResolverOptions.md#dispose)

#### Defined in

node_modules/awilix/lib/resolvers.d.ts:42

___

### injectionMode

 `Optional` **injectionMode**: [`InjectionModeType`](../types/InjectionModeType.md)

Resolution mode.

#### Defined in

node_modules/awilix/lib/resolvers.d.ts:79

___

### injector

 `Optional` **injector**: [`InjectorFunction`](../types/InjectorFunction.md)

Injector function to provide additional parameters.

#### Defined in

node_modules/awilix/lib/resolvers.d.ts:83

___

### lifetime

 `Optional` **lifetime**: [`LifetimeType`](../types/LifetimeType.md)

Lifetime setting.

#### Inherited from

[DisposableResolverOptions](DisposableResolverOptions.md).[lifetime](DisposableResolverOptions.md#lifetime)

#### Defined in

node_modules/awilix/lib/resolvers.d.ts:66

___

### name

 `Optional` **name**: `string`

Only used for inline configuration with `loadModules`.

#### Inherited from

[DisposableResolverOptions](DisposableResolverOptions.md).[name](DisposableResolverOptions.md#name)

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

[DisposableResolverOptions](DisposableResolverOptions.md).[register](DisposableResolverOptions.md#register)

#### Defined in

node_modules/awilix/lib/resolvers.d.ts:70
