# WithRequiredProperty

 **WithRequiredProperty**<`T`, `K`\>: `T` & { [Property in K]-?: T[Property] }

Utility type used to remove some optional attributes (coming from K) from a type T

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `object` |
| `K` | keyof `T` |

#### Defined in

[packages/medusa/src/types/common.ts:31](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/types/common.ts#L31)
