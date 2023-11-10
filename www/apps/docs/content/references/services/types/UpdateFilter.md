# UpdateFilter

 **UpdateFilter**<`TSchema`\>: { `$addToSet?`: [`SetFields`](SetFields.md)<`TSchema`\> ; `$bit?`: [`OnlyFieldsOfType`](OnlyFieldsOfType.md)<`TSchema`, [`NumericType`](NumericType.md) \| `undefined`, { `and`: [`IntegerType`](IntegerType.md)  } \| { `or`: [`IntegerType`](IntegerType.md)  } \| { `xor`: [`IntegerType`](IntegerType.md)  }\> ; `$currentDate?`: [`OnlyFieldsOfType`](OnlyFieldsOfType.md)<`TSchema`, `Date` \| [`Timestamp`](../classes/Timestamp.md), ``true`` \| { `$type`: ``"date"`` \| ``"timestamp"``  }\> ; `$inc?`: [`OnlyFieldsOfType`](OnlyFieldsOfType.md)<`TSchema`, [`NumericType`](NumericType.md) \| `undefined`\> ; `$max?`: [`MatchKeysAndValues`](MatchKeysAndValues.md)<`TSchema`\> ; `$min?`: [`MatchKeysAndValues`](MatchKeysAndValues.md)<`TSchema`\> ; `$mul?`: [`OnlyFieldsOfType`](OnlyFieldsOfType.md)<`TSchema`, [`NumericType`](NumericType.md) \| `undefined`\> ; `$pop?`: [`OnlyFieldsOfType`](OnlyFieldsOfType.md)<`TSchema`, `ReadonlyArray`<`any`\>, ``1`` \| ``-1``\> ; `$pull?`: [`PullOperator`](PullOperator.md)<`TSchema`\> ; `$pullAll?`: [`PullAllOperator`](PullAllOperator.md)<`TSchema`\> ; `$push?`: [`PushOperator`](PushOperator.md)<`TSchema`\> ; `$rename?`: Record<`string`, `string`\> ; `$set?`: [`MatchKeysAndValues`](MatchKeysAndValues.md)<`TSchema`\> ; `$setOnInsert?`: [`MatchKeysAndValues`](MatchKeysAndValues.md)<`TSchema`\> ; `$unset?`: [`OnlyFieldsOfType`](OnlyFieldsOfType.md)<`TSchema`, `any`, ``""`` \| ``true`` \| ``1``\>  } & [`Document`](../interfaces/Document.md)

#### Type parameters

| Name |
| :------ |
| `TSchema` | `object` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5169
