# ExtendedFindConfig

 **ExtendedFindConfig**<`TEntity`\>: [`Omit`](Omit.md)<[`FindOneOptions`](../interfaces/FindOneOptions.md)<`TEntity`\>, ``"where"`` \| ``"relations"`` \| ``"select"``\> \| [`Omit`](Omit.md)<[`FindManyOptions`](../interfaces/FindManyOptions.md)<`TEntity`\>, ``"where"`` \| ``"relations"`` \| ``"select"``\> & { `order?`: [`FindOptionsOrder`](FindOptionsOrder.md)<`TEntity`\> ; `relations?`: [`FindOptionsRelations`](FindOptionsRelations.md)<`TEntity`\> ; `select?`: [`FindOptionsSelect`](FindOptionsSelect.md)<`TEntity`\> ; `skip?`: `number` ; `take?`: `number` ; `where`: [`FindOptionsWhere`](FindOptionsWhere.md)<`TEntity`\> \| [`FindOptionsWhere`](FindOptionsWhere.md)<`TEntity`\>[]  }

#### Type parameters

| Name |
| :------ |
| `TEntity` | `object` |

#### Defined in

packages/types/dist/common/common.d.ts:50
