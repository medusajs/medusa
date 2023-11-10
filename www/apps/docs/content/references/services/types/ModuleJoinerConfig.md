# ModuleJoinerConfig

 **ModuleJoinerConfig**: [`Omit`](Omit.md)<[`JoinerServiceConfig`](../interfaces/JoinerServiceConfig.md), ``"serviceName"`` \| ``"primaryKeys"`` \| ``"relationships"`` \| ``"extends"``\> & { `databaseConfig?`: { `extraFields?`: Record<`string`, { `defaultValue?`: `string` ; `nullable?`: `boolean` ; `options?`: Record<`string`, `unknown`\> ; `type`: ``"date"`` \| ``"time"`` \| ``"datetime"`` \| ``"bigint"`` \| ``"blob"`` \| ``"uint8array"`` \| ``"array"`` \| ``"enumArray"`` \| ``"enum"`` \| ``"json"`` \| ``"integer"`` \| ``"smallint"`` \| ``"tinyint"`` \| ``"mediumint"`` \| ``"float"`` \| ``"double"`` \| ``"boolean"`` \| ``"decimal"`` \| ``"string"`` \| ``"uuid"`` \| ``"text"``  }\> ; `idPrefix?`: `string` ; `tableName?`: `string`  } ; `extends?`: { `fieldAlias?`: Record<`string`, `string` \| { `forwardArgumentsOnPath`: `string`[] ; `path`: `string`  }\> ; `relationship`: [`ModuleJoinerRelationship`](ModuleJoinerRelationship.md) ; `serviceName`: `string`  }[] ; `isLink?`: `boolean` ; `isReadOnlyLink?`: `boolean` ; `linkableKeys?`: Record<`string`, `string`\> ; `primaryKeys?`: `string`[] ; `relationships?`: [`ModuleJoinerRelationship`](ModuleJoinerRelationship.md)[] ; `schema?`: `string` ; `serviceName?`: `string`  }

#### Defined in

packages/types/dist/modules-sdk/index.d.ts:104
