import { BigNumberRawValue } from "@medusajs/types"
import {
  BigNumber,
  MikroOrmBigNumberProperty,
  Searchable,
} from "@medusajs/utils"
import { Entity, PrimaryKey, Property } from "@mikro-orm/core"

@Entity({ tableName: "currency" })
class Currency {
  @Searchable()
  @PrimaryKey({ columnType: "text" })
  code!: string

  @Property({ columnType: "text" })
  symbol: string

  @Property({ columnType: "text" })
  symbol_native: string

  @Searchable()
  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "int", default: 0 })
  decimal_digits: number

  @MikroOrmBigNumberProperty({ default: 0 })
  rounding: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_rounding: BigNumberRawValue

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Date
}

export default Currency
