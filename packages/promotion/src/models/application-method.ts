import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  ApplicationMethodType,
} from "@medusajs/types"
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
} from "@mikro-orm/core"
import Promotion from "./promotion"

type OptionalFields = "value" | "max_quantity" | "allocation"
@Entity()
export default class ApplicationMethod {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "numeric", nullable: true, serializer: Number })
  value?: number

  @Property({ columnType: "numeric", nullable: true, serializer: Number })
  max_quantity?: number

  @Index({ name: "IDX_application_method_type" })
  @Enum(() => PromotionUtils.ApplicationMethodType)
  type: ApplicationMethodType

  @Index({ name: "IDX_application_method_target_type" })
  @Enum(() => PromotionUtils.ApplicationMethodTargetType)
  target_type: ApplicationMethodTargetType

  @Index({ name: "IDX_application_method_allocation" })
  @Enum({
    items: () => PromotionUtils.ApplicationMethodAllocation,
    nullable: true,
  })
  allocation?: ApplicationMethodAllocation

  @OneToOne({
    entity: () => Promotion,
  })
  promotion: Promotion

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
    this.id = generateEntityId(this.id, "app_method")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "promo")
  }
}
