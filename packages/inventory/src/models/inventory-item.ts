import { generateEntityId, SoftDeletableEntity } from "@medusajs/utils"
import { BeforeInsert, Column, Entity, Index } from "typeorm"

@Entity()
export class InventoryItem extends SoftDeletableEntity {
  @Index({ unique: true })
  @Column({ type: "text", nullable: true })
  sku: string | null

  @Column({ type: "text", nullable: true })
  origin_country: string | null

  @Column({ type: "text", nullable: true })
  hs_code: string | null

  @Column({ type: "text", nullable: true })
  mid_code: string | null

  @Column({ type: "text", nullable: true })
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

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "iitem")
  }
}
