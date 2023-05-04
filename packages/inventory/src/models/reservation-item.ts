import { BeforeInsert, Column, Entity, Index } from "typeorm"
import { SoftDeletableEntity, generateEntityId } from "@medusajs/utils"

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

  @Column({ type: "text", nullable: true })
  external_id: string | null

  @Column({ type: "text", nullable: true })
  description: string | null

  @Column({ type: "text", nullable: true })
  created_by: string | null

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "resitem")
  }
}
