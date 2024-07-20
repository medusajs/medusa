import { DALUtils, isDefined, MathBN } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  OnLoad,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"

import { BigNumberRawValue } from "@medusajs/types"
import {
  BigNumber,
  createPsqlIndexStatementHelper,
  generateEntityId,
  MikroOrmBigNumberProperty,
} from "@medusajs/utils"
import { InventoryItem } from "./inventory-item"

const InventoryLevelDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "inventory_level",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const InventoryLevelInventoryItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "inventory_level",
  columns: "inventory_item_id",
  where: "deleted_at IS NOT NULL",
})

const InventoryLevelLocationIdIndex = createPsqlIndexStatementHelper({
  tableName: "inventory_level",
  columns: "location_id",
  where: "deleted_at IS NOT NULL",
})

const InventoryLevelLocationIdInventoryItemIdIndex =
  createPsqlIndexStatementHelper({
    tableName: "inventory_level",
    columns: "location_id",
    where: "deleted_at IS NOT NULL",
  })

@Entity()
@InventoryLevelLocationIdInventoryItemIdIndex.MikroORMIndex()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export class InventoryLevel {
  @PrimaryKey({ columnType: "text" })
  id: string

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

  @InventoryLevelDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @ManyToOne(() => InventoryItem, {
    fieldName: "inventory_item_id",
    type: "text",
    mapToPk: true,
    onDelete: "cascade",
  })
  @InventoryLevelInventoryItemIdIndex.MikroORMIndex()
  inventory_item_id: string

  @InventoryLevelLocationIdIndex.MikroORMIndex()
  @Property({ type: "text" })
  location_id: string

  @MikroOrmBigNumberProperty()
  stocked_quantity: BigNumber | number = 0

  @Property({ columnType: "jsonb" })
  raw_stocked_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty()
  reserved_quantity: BigNumber | number = 0

  @Property({ columnType: "jsonb" })
  raw_reserved_quantity: BigNumberRawValue

  @MikroOrmBigNumberProperty()
  incoming_quantity: BigNumber | number = 0

  @Property({ columnType: "jsonb" })
  raw_incoming_quantity: BigNumberRawValue

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @ManyToOne(() => InventoryItem, {
    persist: false,
  })
  inventory_item: Rel<InventoryItem>

  available_quantity: BigNumber | number | null = null

  @BeforeCreate()
  private beforeCreate(): void {
    this.id = generateEntityId(this.id, "ilev")
    this.inventory_item_id ??= this.inventory_item?.id
  }

  @OnInit()
  private onInit(): void {
    this.id = generateEntityId(this.id, "ilev")
  }

  @OnLoad()
  private onLoad(): void {
    if (isDefined(this.stocked_quantity) && isDefined(this.reserved_quantity)) {
      this.available_quantity = new BigNumber(
        MathBN.sub(this.raw_stocked_quantity, this.raw_reserved_quantity)
      )
    }
  }
}
