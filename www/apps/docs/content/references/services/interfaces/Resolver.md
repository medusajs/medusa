# Resolver

A resolver object returned by asClass(), asFunction() or asValue().

## Type parameters

| Name |
| :------ |
| `T` | `object` |

## Hierarchy

- [`ResolverOptions`](ResolverOptions.md)<`T`\>

  ↳ **`Resolver`**

## Properties

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

## Methods

### resolve

**resolve**<`U`\>(`container`): `T`

| Name | Type |
| :------ | :------ |
| `U` | `object` |

#### Parameters

| Name |
| :------ |
| `container` | [`AwilixContainer`](AwilixContainer.md)<`U`\> |

#### Returns

`T`

#### Defined in

node_modules/awilix/lib/resolvers.d.ts:21
