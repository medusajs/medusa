import { Index, Unique, BeforeInsert, Column, Entity } from "typeorm"
import {
  SoftDeletableEntity,
  DbAwareColumn,
  generateEntityId,
} from "@medusajs/medusa"

@Entity()
export class ReservationItem extends SoftDeletableEntity {
  @Index()
  @DbAwareColumn({ type: "text" })
  item_id: string

  @Index()
  @DbAwareColumn({ type: "text" })
  location_id: string

  @Column()
  quantity: number

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "resitem")
  }
}
