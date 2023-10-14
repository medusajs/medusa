---
displayed_sidebar: jsClientSidebar
---

# Class: FlagRouter

[internal](../modules/internal-8.md).FlagRouter

## Implements

- [`IFlagRouter`](../interfaces/internal-8.IFlagRouter.md)

## Properties

### flags

• `Private` `Readonly` **flags**: `any`

#### Defined in

packages/utils/dist/feature-flags/utils/flag-router.d.ts:3

## Methods

### isFeatureEnabled

▸ **isFeatureEnabled**(`flag`): `boolean`

Check if a feature flag is enabled.
There are two ways of using this method:
1. `isFeatureEnabled("myFeatureFlag")`
2. `isFeatureEnabled({ myNestedFeatureFlag: "someNestedFlag" })`
We use 1. for top-level feature flags and 2. for nested feature flags. Almost all flags are top-level.
An example of a nested flag is workflows. To use it, you would do:
`isFeatureEnabled({ workflows: Workflows.CreateCart })`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `flag` | `string` \| [`Record`](../modules/internal.md#record)<`string`, `string`\> | The flag to check |

#### Returns

`boolean`

- Whether the flag is enabled or not

#### Implementation of

[IFlagRouter](../interfaces/internal-8.IFlagRouter.md).[isFeatureEnabled](../interfaces/internal-8.IFlagRouter.md#isfeatureenabled)

#### Defined in

packages/utils/dist/feature-flags/utils/flag-router.d.ts:16

___

### listFlags

▸ **listFlags**(): [`FeatureFlagsResponse`](../modules/internal-8.md#featureflagsresponse-1)

#### Returns

[`FeatureFlagsResponse`](../modules/internal-8.md#featureflagsresponse-1)

#### Implementation of

[IFlagRouter](../interfaces/internal-8.IFlagRouter.md).[listFlags](../interfaces/internal-8.IFlagRouter.md#listflags)

#### Defined in

packages/utils/dist/feature-flags/utils/flag-router.d.ts:30

___

### setFlag

▸ **setFlag**(`key`, `value`): `void`

Sets a feature flag.
Flags take two shapes:
setFlag("myFeatureFlag", true)
setFlag("myFeatureFlag", { nestedFlag: true })
These shapes are used for top-level and nested flags respectively, as explained in isFeatureEnabled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key of the flag to set. |
| `value` | `boolean` \| { `[key: string]`: `boolean`;  } | The value of the flag to set. |

#### Returns

`void`

- void

#### Defined in

packages/utils/dist/feature-flags/utils/flag-router.d.ts:27
