import { Index, BeforeInsert, Column, Entity } from "typeorm"
import {
  SoftDeletableEntity,
  DbAwareColumn,
  generateEntityId,
} from "@medusajs/medusa"

@Entity()
export class InventoryItem extends SoftDeletableEntity {
  @Index({ unique: true })
  @DbAwareColumn({ type: "text", nullable: true })
  sku: string | null

  @DbAwareColumn({ type: "text", nullable: true })
  origin_country: string | null

  @Column({ type: "int", nullable: true })
  hs_code: number | null

  @DbAwareColumn({ type: "text", nullable: true })
  mid_code: string | null

  @DbAwareColumn({ type: "text", nullable: true })
  material: string | null

  @Column({ type: "int", nullable: true })
  weight: number | null

  @Column({ type: "int", nullable: true })
  length: number | null

  @Column({ type: "int", nullable: true })
  height: number | null

  @Column({ type: "int", nullable: true })
  width: number | null

  @Column({ default: true })
  requires_shipping: boolean

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "iitem")
  }
}
