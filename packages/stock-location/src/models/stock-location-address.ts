import { generateEntityId } from "@medusajs/utils"
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity()
export class StockLocationAddress {
  @PrimaryColumn()
  id: string

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date | null

  @Column({ type: "text" })
  address_1: string

  @Column({ type: "text", nullable: true })
  address_2: string | null

  @Column({ type: "text", nullable: true })
  company: string | null

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
