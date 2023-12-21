import { PromotionType } from "@medusajs/types"
import { PromotionUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Enum,
  Index,
  OnInit,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"
import ApplicationMethod from "./application-method"

type OptionalFields = "is_automatic"
type OptionalRelations = "application_method"
@Entity()
export default class Promotion {
  [OptionalProps]?: OptionalFields | OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  @Index({ name: "IDX_promotion_code" })
  @Unique({
    name: "IDX_promotion_code_unique",
    properties: ["code"],
  })
  code: string

  @Property({ columnType: "boolean", default: false })
  is_automatic?: boolean = false

  @Index({ name: "IDX_promotion_type" })
  @Enum(() => PromotionUtils.PromotionType)
  type: PromotionType

  @OneToOne({
    entity: () => ApplicationMethod,
    mappedBy: (am) => am.promotion,
  })
  application_method: ApplicationMethod

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at?: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "promo")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "promo")
  }
}
