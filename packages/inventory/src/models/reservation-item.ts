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
export class ReservationItem {
  @PrimaryColumn()
  id: string

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date | null

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
