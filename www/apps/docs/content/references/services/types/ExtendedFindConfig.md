# ExtendedFindConfig

 **ExtendedFindConfig**<`TEntity`\>: [`Omit`](Omit.md)<[`FindOneOptions`](../interfaces/FindOneOptions.md)<`TEntity`\>, ``"where"`` \| ``"relations"`` \| ``"select"``\> \| [`Omit`](Omit.md)<[`FindManyOptions`](../interfaces/FindManyOptions.md)<`TEntity`\>, ``"where"`` \| ``"relations"`` \| ``"select"``\> & { `order?`: [`FindOptionsOrder`](FindOptionsOrder.md)<`TEntity`\> ; `relations?`: [`FindOptionsRelations`](FindOptionsRelations.md)<`TEntity`\> ; `select?`: [`FindOptionsSelect`](FindOptionsSelect.md)<`TEntity`\> ; `skip?`: `number` ; `take?`: `number` ; `where`: [`FindOptionsWhere`](FindOptionsWhere.md)<`TEntity`\> \| [`FindOptionsWhere`](FindOptionsWhere.md)<`TEntity`\>[]  }

#### Type parameters

| Name |
| :------ |
| `TEntity` | `object` |

#### Defined in

[packages/medusa/src/types/common.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/common.ts#L56)
