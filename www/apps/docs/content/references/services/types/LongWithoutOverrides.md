# LongWithoutOverrides

 **LongWithoutOverrides**: (`low`: `unknown`, `high?`: `number` \| `boolean`, `unsigned?`: `boolean`) => { [P in Exclude<keyof Long, TimestampOverrides\\>]: Long[P] }

#### Type declaration

(`low`, `high?`, `unsigned?`)

##### Parameters

| Name |
| :------ |
| `low` | `unknown` |
| `high?` | `number` \| `boolean` |
| `unsigned?` | `boolean` |

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:783
