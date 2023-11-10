# AwilixContainer

The container returned from createContainer has some methods and properties.
 AwilixContainer

## Type parameters

| Name | Type |
| :------ | :------ |
| `Cradle` | `object` |

## Properties

### cache

 `Readonly` **cache**: `Map`<`string` \| `symbol`, [`CacheEntry`](CacheEntry.md)<`any`\>\>

Resolved modules cache.

#### Defined in

node_modules/awilix/lib/container.d.ts:26

___

### cradle

 `Readonly` **cradle**: `Cradle`

The proxy injected when using `PROXY` injection mode.
Can be used as-is.

#### Defined in

node_modules/awilix/lib/container.d.ts:18

___

### options

 **options**: [`ContainerOptions`](ContainerOptions.md)

Options the container was configured with.

#### Defined in

node_modules/awilix/lib/container.d.ts:13

___

### registrations

 `Readonly` **registrations**: [`RegistrationHash`](../types/RegistrationHash.md)

Getter for the rolled up registrations that merges the container family tree.

#### Defined in

node_modules/awilix/lib/container.d.ts:22

## Methods

### build

**build**<`T`\>(`targetOrResolver`, `opts?`): `T`

Given a resolver, class or function, builds it up and returns it.
Does not cache it, this means that any lifetime configured in case of passing
a resolver will not be used.

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `targetOrResolver` | [`ClassOrFunctionReturning`](../types/ClassOrFunctionReturning.md)<`T`\> \| [`Resolver`](Resolver.md)<`T`\> |
| `opts?` | [`BuildResolverOptions`](BuildResolverOptions.md)<`T`\> |

#### Returns

`T`

#### Defined in

node_modules/awilix/lib/container.d.ts:105

___

### createScope

**createScope**<`T`\>(): [`AwilixContainer`](AwilixContainer.md)<`Cradle` & `T`\>

Creates a scoped container with this one as the parent.

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Returns

[`AwilixContainer`](AwilixContainer.md)<`Cradle` & `T`\>

-`AwilixContainer`: 
	-``Cradle` & `T``: (optional) 

#### Defined in

node_modules/awilix/lib/container.d.ts:30

___

### dispose

**dispose**(): `Promise`<`void`\>

Disposes this container and it's children, calling the disposer
on all disposable registrations and clearing the cache.
Only applies to registrations with `SCOPED` or `SINGLETON` lifetime.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/awilix/lib/container.d.ts:111

___

### getRegistration

**getRegistration**<`K`\>(`name`): ``null`` \| [`Resolver`](Resolver.md)<`Cradle`[`K`]\>

Recursively gets a registration by name if it exists in the
current container or any of its' parents.

| Name | Type |
| :------ | :------ |
| `K` | `string` \| `number` \| `symbol` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `K` | {string \| symbol} The registration name. |

#### Returns

``null`` \| [`Resolver`](Resolver.md)<`Cradle`[`K`]\>

-```null`` \| Resolver<`Cradle`[`K`]\>`: (optional) 

#### Defined in

node_modules/awilix/lib/container.d.ts:89

**getRegistration**<`T`\>(`name`): ``null`` \| [`Resolver`](Resolver.md)<`T`\>

Recursively gets a registration by name if it exists in the
current container or any of its' parents.

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `string` \| `symbol` | {string \| symbol} The registration name. |

#### Returns

``null`` \| [`Resolver`](Resolver.md)<`T`\>

-```null`` \| Resolver<T\>`: (optional) 

#### Defined in

node_modules/awilix/lib/container.d.ts:96

___

### hasRegistration

**hasRegistration**(`name`): `boolean`

Checks if the registration with the given name exists.

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `string` \| `symbol` | The name of the registration to resolve. |

#### Returns

`boolean`

-`boolean`: (optional) Whether or not the registration exists.

#### Defined in

node_modules/awilix/lib/container.d.ts:82

___

### inspect

**inspect**(`depth`, `opts?`): `string`

Used by `util.inspect`.

#### Parameters

| Name |
| :------ |
| `depth` | `number` |
| `opts?` | `any` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/awilix/lib/container.d.ts:34

___

### loadModules

**loadModules**<`ESM`\>(`globPatterns`, `options?`): `ESM` extends ``false`` ? [`AwilixContainer`](AwilixContainer.md)<`Cradle`\> : `Promise`<[`AwilixContainer`](AwilixContainer.md)<`Cradle`\>\>

Binds `lib/loadModules` to this container, and provides
real implementations of it's dependencies.

Additionally, any modules using the `dependsOn` API
will be resolved.

| Name | Type |
| :------ | :------ |
| `ESM` | `boolean` |

#### Parameters

| Name |
| :------ |
| `globPatterns` | (`string` \| [`GlobWithOptions`](../types/GlobWithOptions.md))[] |
| `options?` | [`LoadModulesOptions`](LoadModulesOptions.md)<`ESM`\> |

#### Returns

`ESM` extends ``false`` ? [`AwilixContainer`](AwilixContainer.md)<`Cradle`\> : `Promise`<[`AwilixContainer`](AwilixContainer.md)<`Cradle`\>\>

-``ESM` extends ``false`` ? [`AwilixContainer`](AwilixContainer.md)<`Cradle`\> : `Promise`<[`AwilixContainer`](AwilixContainer.md)<`Cradle`\>\>`: (optional) 

**See**

src/load-modules.ts documentation.

#### Defined in

node_modules/awilix/lib/container.d.ts:44

___

### register

**register**<`T`\>(`name`, `registration`): [`AwilixContainer`](AwilixContainer.md)<`Cradle`\>

Adds a single registration that using a pre-constructed resolver.

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `name` | `string` \| `symbol` |
| `registration` | [`Resolver`](Resolver.md)<`T`\> |

#### Returns

[`AwilixContainer`](AwilixContainer.md)<`Cradle`\>

-`AwilixContainer`: 

#### Defined in

node_modules/awilix/lib/container.d.ts:48

**register**(`nameAndRegistrationPair`): [`AwilixContainer`](AwilixContainer.md)<`Cradle`\>

Pairs resolvers to registration names and registers them.

#### Parameters

| Name |
| :------ |
| `nameAndRegistrationPair` | [`NameAndRegistrationPair`](NameAndRegistrationPair.md)<`Cradle`\> |

#### Returns

[`AwilixContainer`](AwilixContainer.md)<`Cradle`\>

-`AwilixContainer`: 

#### Defined in

node_modules/awilix/lib/container.d.ts:52

___

### resolve

**resolve**<`K`\>(`name`, `resolveOptions?`): `Cradle`[`K`]

Resolves the registration with the given name.

| Name | Type |
| :------ | :------ |
| `K` | `string` \| `number` \| `symbol` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `K` | The name of the registration to resolve. |
| `resolveOptions?` | [`ResolveOptions`](ResolveOptions.md) |

#### Returns

`Cradle`[`K`]

-``Cradle`[`K`]`: (optional) Whatever was resolved.

#### Defined in

node_modules/awilix/lib/container.d.ts:62

**resolve**<`T`\>(`name`, `resolveOptions?`): `T`

Resolves the registration with the given name.

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `string` \| `symbol` | The name of the registration to resolve. |
| `resolveOptions?` | [`ResolveOptions`](ResolveOptions.md) |

#### Returns

`T`

#### Defined in

node_modules/awilix/lib/container.d.ts:72
