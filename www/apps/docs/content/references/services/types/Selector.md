# Selector

 **Selector**<`TEntity`\>: { [key in keyof TEntity]?: TEntity[key] \| TEntity[key][] \| DateComparisonOperator \| StringComparisonOperator \| NumericalComparisonOperator \| FindOperator<TEntity[key][] \| string \| string[]\\> }

#### Type parameters

| Name |
| :------ |
| `TEntity` | `object` |

#### Defined in

[packages/medusa/src/types/common.ts:73](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/common.ts#L73)
