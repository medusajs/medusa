import { BigNumberRawValue, DAL } from "@medusajs/types"
import { BigNumber, MikroOrmBigNumberProperty } from "@medusajs/utils"
import { OptionalProps, PrimaryKey, Property } from "@mikro-orm/core"

type OptionalAdjustmentLineProps = DAL.EntityDateColumns

/**
 * As per the Mikro ORM docs, superclasses should use the abstract class definition
 * Source: https://mikro-orm.io/docs/inheritance-mapping
 */
export default abstract class AdjustmentLine {
  [OptionalProps]: OptionalAdjustmentLineProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text", nullable: true })
  description: string | null = null

  @Property({
    columnType: "text",
    nullable: true,
  })
  promotion_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  code: string | null = null

  @MikroOrmBigNumberProperty()
  amount: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_amount: BigNumberRawValue

  @Property({ columnType: "text", nullable: true })
  provider_id: string | null = null

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
