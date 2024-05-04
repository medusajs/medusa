import { BigNumberRawValue } from "@medusajs/types"
import {BigNumber, MikroOrmBigNumberProperty} from "@medusajs/utils"
import { PrimaryKey, Property } from "@mikro-orm/core"

/**
 * As per the Mikro ORM docs, superclasses should use the abstract class definition
 * Source: https://mikro-orm.io/docs/inheritance-mapping
 */
export default abstract class TaxLine {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text", nullable: true })
  description?: string | null

  @Property({
    columnType: "text",
    nullable: true,
  })
  tax_rate_id?: string | null

  @Property({ columnType: "text" })
  code: string

  @MikroOrmBigNumberProperty()
  rate: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_rate: BigNumberRawValue

  @Property({ columnType: "text", nullable: true })
  provider_id?: string | null

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
