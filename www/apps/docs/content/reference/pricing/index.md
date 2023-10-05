---
displayed_sidebar: modules
---

# Pricing Module Reference Reference

## Interfaces

- [AddPricesDTO](interfaces/AddPricesDTO.md)
- [AddRulesDTO](interfaces/AddRulesDTO.md)
- [BaseFilterable](interfaces/BaseFilterable.md)
- [CalculatedPriceSetDTO](interfaces/CalculatedPriceSetDTO.md)
- [Context](interfaces/Context.md)
- [CreateCurrencyDTO](interfaces/CreateCurrencyDTO.md)
- [CreateMoneyAmountDTO](interfaces/CreateMoneyAmountDTO.md)
- [CreatePriceRuleDTO](interfaces/CreatePriceRuleDTO.md)
- [CreatePriceSetDTO](interfaces/CreatePriceSetDTO.md)
- [CreatePriceSetMoneyAmountRulesDTO](interfaces/CreatePriceSetMoneyAmountRulesDTO.md)
- [CreatePricesDTO](interfaces/CreatePricesDTO.md)
- [CreateRuleTypeDTO](interfaces/CreateRuleTypeDTO.md)
- [CurrencyDTO](interfaces/CurrencyDTO.md)
- [FilterableCurrencyProps](interfaces/FilterableCurrencyProps.md)
- [FilterableMoneyAmountProps](interfaces/FilterableMoneyAmountProps.md)
- [FilterablePriceRuleProps](interfaces/FilterablePriceRuleProps.md)
- [FilterablePriceSetMoneyAmountRulesProps](interfaces/FilterablePriceSetMoneyAmountRulesProps.md)
- [FilterablePriceSetProps](interfaces/FilterablePriceSetProps.md)
- [FilterableRuleTypeProps](interfaces/FilterableRuleTypeProps.md)
- [FindConfig](interfaces/FindConfig.md)
- [IPricingModuleService](interfaces/IPricingModuleService.md)
- [JoinerServiceConfig](interfaces/JoinerServiceConfig.md)
- [JoinerServiceConfigAlias](interfaces/JoinerServiceConfigAlias.md)
- [MoneyAmountDTO](interfaces/MoneyAmountDTO.md)
- [PriceRuleDTO](interfaces/PriceRuleDTO.md)
- [PriceSetDTO](interfaces/PriceSetDTO.md)
- [PriceSetMoneyAmountDTO](interfaces/PriceSetMoneyAmountDTO.md)
- [PriceSetMoneyAmountRulesDTO](interfaces/PriceSetMoneyAmountRulesDTO.md)
- [PricingContext](interfaces/PricingContext.md)
- [PricingFilters](interfaces/PricingFilters.md)
- [RemovePriceSetRulesDTO](interfaces/RemovePriceSetRulesDTO.md)
- [RuleTypeDTO](interfaces/RuleTypeDTO.md)
- [UpdateCurrencyDTO](interfaces/UpdateCurrencyDTO.md)
- [UpdateMoneyAmountDTO](interfaces/UpdateMoneyAmountDTO.md)
- [UpdatePriceRuleDTO](interfaces/UpdatePriceRuleDTO.md)
- [UpdatePriceSetDTO](interfaces/UpdatePriceSetDTO.md)
- [UpdatePriceSetMoneyAmountRulesDTO](interfaces/UpdatePriceSetMoneyAmountRulesDTO.md)
- [UpdateRuleTypeDTO](interfaces/UpdateRuleTypeDTO.md)

## Type Aliases

### Exclude

 **Exclude**<`T`, `U`\>: `T` extends `U` ? `never` : `T`

Exclude from T those types that are assignable to U

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1597

___

### JoinerRelationship

 **JoinerRelationship**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `alias` | `string` | - |
| `args?` | [`Record`](index.md#record)<`string`, `any`\> | Extra arguments to pass to the remoteFetchData callback |
| `foreignKey` | `string` | - |
| `inverse?` | `boolean` | In an inverted relationship the foreign key is on the other service and the primary key is on the current service |
| `isInternalService?` | `boolean` | If true, the relationship is an internal service from the medusa core TODO: Remove when there are no more "internal" services |
| `isList?` | `boolean` | Force the relationship to return a list |
| `primaryKey` | `string` | - |
| `serviceName` | `string` | - |

#### Defined in

[packages/types/src/joiner/index.ts:1](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/joiner/index.ts#L1)

___

### ModuleJoinerConfig

 **ModuleJoinerConfig**: [`Omit`](index.md#omit)<[`JoinerServiceConfig`](interfaces/JoinerServiceConfig.md), ``"serviceName"`` \| ``"primaryKeys"`` \| ``"relationships"`` \| ``"extends"``\> & { `databaseConfig?`: { `extraFields?`: [`Record`](index.md#record)<`string`, { `defaultValue?`: `string` ; `nullable?`: `boolean` ; `options?`: [`Record`](index.md#record)<`string`, `unknown`\> ; `type`: ``"date"`` \| ``"time"`` \| ``"datetime"`` \| ``"bigint"`` \| ``"blob"`` \| ``"uint8array"`` \| ``"array"`` \| ``"enumArray"`` \| ``"enum"`` \| ``"json"`` \| ``"integer"`` \| ``"smallint"`` \| ``"tinyint"`` \| ``"mediumint"`` \| ``"float"`` \| ``"double"`` \| ``"boolean"`` \| ``"decimal"`` \| ``"string"`` \| ``"uuid"`` \| ``"text"``  }\> ; `idPrefix?`: `string` ; `tableName?`: `string`  } ; `extends?`: { `fieldAlias?`: [`Record`](index.md#record)<`string`, `string` \| { `forwardArgumentsOnPath`: `string`[] ; `path`: `string`  }\> ; `relationship`: [`ModuleJoinerRelationship`](index.md#modulejoinerrelationship) ; `serviceName`: `string`  }[] ; `isLink?`: `boolean` ; `isReadOnlyLink?`: `boolean` ; `linkableKeys?`: [`Record`](index.md#record)<`string`, `string`\> ; `primaryKeys?`: `string`[] ; `relationships?`: [`ModuleJoinerRelationship`](index.md#modulejoinerrelationship)[] ; `schema?`: `string` ; `serviceName?`: `string`  }

#### Defined in

[packages/types/src/modules-sdk/index.ts:132](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/modules-sdk/index.ts#L132)

___

### ModuleJoinerRelationship

 **ModuleJoinerRelationship**: [`JoinerRelationship`](index.md#joinerrelationship) & { `deleteCascade?`: `boolean` ; `isInternalService?`: `boolean`  }

#### Defined in

[packages/types/src/modules-sdk/index.ts:212](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/modules-sdk/index.ts#L212)

___

### Omit

 **Omit**<`T`, `K`\>: [`Pick`](index.md#pick)<`T`, [`Exclude`](index.md#exclude)<keyof `T`, `K`\>\>

Construct a type with the properties of T except for those in type K.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends keyof `any` |

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1607

___

### Pick

 **Pick**<`T`, `K`\>: { [P in K]: T[P] }

From T, pick a set of properties whose keys are in the union K

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends keyof `T` |

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1583

___

### Record

 **Record**<`K`, `T`\>: { [P in K]: T }

Construct a type with a set of properties K of type T

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `any` |
| `T` | `T` |

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1590
