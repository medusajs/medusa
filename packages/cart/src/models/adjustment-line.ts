import { DAL } from "@medusajs/types"
import { OptionalProps, PrimaryKey, Property } from "@mikro-orm/core"

type OptionalAdjustmentLineProps = DAL.SoftDeletableEntityDateColumns

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

  @Property({ columnType: "text", nullable: true })
  code: string | null = null

  @Property({ columnType: "numeric", serializer: Number })
  amount: number

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
