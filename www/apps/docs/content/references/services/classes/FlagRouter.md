# FlagRouter

## Implements

- [`IFlagRouter`](../interfaces/IFlagRouter.md)

## Constructors

### constructor

**new FlagRouter**(`flags`)

#### Parameters

| Name |
| :------ |
| `flags` | Record<`string`, `boolean` \| Record<`string`, `boolean`\>\> |

#### Defined in

packages/utils/dist/feature-flags/utils/flag-router.d.ts:4

## Properties

### flags

 `Private` `Readonly` **flags**: `any`

#### Defined in

packages/utils/dist/feature-flags/utils/flag-router.d.ts:3

## Methods

### isFeatureEnabled

**isFeatureEnabled**(`flag`): `boolean`

Check if a feature flag is enabled.
There are two ways of using this method:
1. `isFeatureEnabled("myFeatureFlag")`
2. `isFeatureEnabled({ myNestedFeatureFlag: "someNestedFlag" })`
We use 1. for top-level feature flags and 2. for nested feature flags. Almost all flags are top-level.
An example of a nested flag is workflows. To use it, you would do:
`isFeatureEnabled({ workflows: Workflows.CreateCart })`

#### Parameters

| Name | Description |
| :------ | :------ |
| `flag` | `string` \| Record<`string`, `string`\> | The flag to check |

#### Returns

`boolean`

-`boolean`: (optional) - Whether the flag is enabled or not

#### Implementation of

[IFlagRouter](../interfaces/IFlagRouter.md).[isFeatureEnabled](../interfaces/IFlagRouter.md#isfeatureenabled)

#### Defined in

packages/utils/dist/feature-flags/utils/flag-router.d.ts:16

___

### listFlags

**listFlags**(): [`FeatureFlagsResponse`](../index.md#featureflagsresponse)

#### Returns

[`FeatureFlagsResponse`](../index.md#featureflagsresponse)

-`FeatureFlagsResponse`: 
	-`key`: 
	-`value`: 

#### Implementation of

[IFlagRouter](../interfaces/IFlagRouter.md).[listFlags](../interfaces/IFlagRouter.md#listflags)

#### Defined in

packages/utils/dist/feature-flags/utils/flag-router.d.ts:30

___

### setFlag

**setFlag**(`key`, `value`): `void`

Sets a feature flag.
Flags take two shapes:
setFlag("myFeatureFlag", true)
setFlag("myFeatureFlag", { nestedFlag: true })
These shapes are used for top-level and nested flags respectively, as explained in isFeatureEnabled.

#### Parameters

| Name | Description |
| :------ | :------ |
| `key` | `string` | The key of the flag to set. |
| `value` | `boolean` \| { `[key: string]`: `boolean`;  } | The value of the flag to set. |

#### Returns

`void`

-`void`: (optional) - void

#### Defined in

packages/utils/dist/feature-flags/utils/flag-router.d.ts:27
