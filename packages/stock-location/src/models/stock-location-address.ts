import { BeforeInsert, Column, Entity, Index } from "typeorm"
import { SoftDeletableEntity, generateEntityId } from "@medusajs/medusa"

@Entity()
export class StockLocationAddress extends SoftDeletableEntity {
  @Column({ type: "text" })
  address_1: string

  @Column({ type: "text", nullable: true })
  address_2: string | null

  @Column({ type: "text", nullable: true })
  city: string | null

  @Index()
  @Column({ type: "text" })
  country_code: string

  @Column({ type: "text", nullable: true })
  phone: string | null

  @Column({ type: "text", nullable: true })
  province: string | null

  @Column({ type: "text", nullable: true })
  postal_code: string | null

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "laddr")
  }
}
