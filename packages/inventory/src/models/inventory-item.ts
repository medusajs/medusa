import { generateEntityId } from "@medusajs/utils"
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { InventoryLevel } from "./inventory-level"

@Entity()
export class InventoryItem {
  @PrimaryColumn()
  id: string

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date | null

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

  @Column({ type: "text", nullable: true })
  description: string | null

  @Column({ type: "text", nullable: true })
  title: string | null

  @Column({ type: "text", nullable: true })
  thumbnail: string | null

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @OneToMany(
    () => InventoryLevel,
    (inventoryLevel) => inventoryLevel.inventory_item
  )
  inventory_levels!: InventoryLevel[]

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "iitem")
  }
}
