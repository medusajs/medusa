import { generateEntityId, SoftDeletableEntity } from "@medusajs/utils"
import { BeforeInsert, Column, Entity, Index } from "typeorm"

@Entity()
export class ReservationItem extends SoftDeletableEntity {
  @Index()
  @Column({ type: "text", nullable: true })
  line_item_id: string | null

  @Index()
  @Column({ type: "text" })
  inventory_item_id: string

  @Index()
  @Column({ type: "text" })
  location_id: string

  @Column()
  quantity: number

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "resitem")
  }
}
