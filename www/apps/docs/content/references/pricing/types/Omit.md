---
displayed_sidebar: pricingReference
---

# Omit

 **Omit**<`T`, `K`\>: [`Pick`](Pick.md)<`T`, [`Exclude`](Exclude.md)<keyof `T`, `K`\>\>

Construct a type with the properties of T except for those in type K.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends keyof `any` |

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1616
