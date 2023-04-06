import { generateEntityId, SoftDeletableEntity } from "@medusajs/utils"
import { BeforeInsert, Column, Entity, Index } from "typeorm"

@Entity()
@Index(["inventory_item_id", "location_id"], { unique: true })
export class InventoryLevel extends SoftDeletableEntity {
  @Index()
  @Column({ type: "text" })
  inventory_item_id: string

  @Index()
  @Column({ type: "text" })
  location_id: string

  @Column({ default: 0 })
  stocked_quantity: number

  @Column({ default: 0 })
  reserved_quantity: number

  @Column({ default: 0 })
  incoming_quantity: number

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ilev")
  }
}
