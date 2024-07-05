import { generateEntityId } from "@medusajs/utils"
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { InventoryItem } from "./inventory-item"

@Entity()
@Index(["inventory_item_id", "location_id"], { unique: true })
export class InventoryLevel {
  @PrimaryColumn()
  id: string

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date | null

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

  @ManyToOne(() => InventoryItem)
  @JoinColumn({ name: "inventory_item_id" })
  inventory_item: InventoryItem

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ilev")
  }
}
