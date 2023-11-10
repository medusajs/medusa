# FlatArray

 **FlatArray**<`Arr`, `Depth`\>: { `done`: `Arr` ; `recur`: `Arr` extends `ReadonlyArray`<infer InnerArr\> ? [`FlatArray`](FlatArray.md)<`InnerArr`, [``-1``, ``0``, ``1``, ``2``, ``3``, ``4``, ``5``, ``6``, ``7``, ``8``, ``9``, ``10``, ``11``, ``12``, ``13``, ``14``, ``15``, ``16``, ``17``, ``18``, ``19``, ``20``][`Depth`]\> : `Arr`  }[`Depth` extends ``-1`` ? ``"done"`` : ``"recur"``]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Arr` | `object` |
| `Depth` | `number` |

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2019.array.d.ts:19
