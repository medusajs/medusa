import { BigNumberRawValue } from "@medusajs/types"
import { BigNumber, MikroOrmBigNumberProperty } from "@medusajs/utils"
import { Entity, PrimaryKey, Property } from "@mikro-orm/core"

@Entity({ tableName: "currency" })
class Currency {
  @PrimaryKey({ columnType: "text" })
  code!: string

  @Property({ columnType: "text" })
  symbol: string

  @Property({ columnType: "text" })
  symbol_native: string

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "int", default: 0 })
  decimal_digits: number

  @MikroOrmBigNumberProperty({ default: 0 })
  rounding: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_rounding: BigNumberRawValue
}

export default Currency
