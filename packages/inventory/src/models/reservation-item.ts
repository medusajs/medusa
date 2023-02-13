import { Index, BeforeInsert, Column, Entity } from "typeorm"
import { SoftDeletableEntity, generateEntityId, DbAwareColumn } from "@medusajs/medusa"


export enum ReservationType {
  INTERNAL = "internal",
  EXTERNAL = "external",
}

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

  @DbAwareColumn({ type: "enum", enum: ReservationType, default: ReservationType.INTERNAL })
  type: ReservationType

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "resitem")
  }
}
