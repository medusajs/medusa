---
displayed_sidebar: pricingReference
---

# ModuleJoinerConfig

 **ModuleJoinerConfig**: [`Omit`](Omit.md)<[`JoinerServiceConfig`](../interfaces/JoinerServiceConfig.md), ``"serviceName"`` \| ``"primaryKeys"`` \| ``"relationships"`` \| ``"extends"``\> & { `databaseConfig?`: { `extraFields?`: [`Record`](Record.md)<`string`, { `defaultValue?`: `string` ; `nullable?`: `boolean` ; `options?`: [`Record`](Record.md)<`string`, `unknown`\> ; `type`: ``"date"`` \| ``"time"`` \| ``"datetime"`` \| ``"bigint"`` \| ``"blob"`` \| ``"uint8array"`` \| ``"array"`` \| ``"enumArray"`` \| ``"enum"`` \| ``"json"`` \| ``"integer"`` \| ``"smallint"`` \| ``"tinyint"`` \| ``"mediumint"`` \| ``"float"`` \| ``"double"`` \| ``"boolean"`` \| ``"decimal"`` \| ``"string"`` \| ``"uuid"`` \| ``"text"``  }\> ; `idPrefix?`: `string` ; `tableName?`: `string`  } ; `extends?`: { `fieldAlias?`: [`Record`](Record.md)<`string`, `string` \| { `forwardArgumentsOnPath`: `string`[] ; `path`: `string`  }\> ; `relationship`: [`ModuleJoinerRelationship`](ModuleJoinerRelationship.md) ; `serviceName`: `string`  }[] ; `isLink?`: `boolean` ; `isReadOnlyLink?`: `boolean` ; `linkableKeys?`: [`Record`](Record.md)<`string`, `string`\> ; `primaryKeys?`: `string`[] ; `relationships?`: [`ModuleJoinerRelationship`](ModuleJoinerRelationship.md)[] ; `schema?`: `string` ; `serviceName?`: `string`  }

#### Defined in

[packages/types/src/modules-sdk/index.ts:132](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/modules-sdk/index.ts#L132)
