import { Searchable, generateEntityId } from "@medusajs/utils"
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
import { StockLocationAddress } from "./stock-location-address"

@Entity()
export class StockLocation {
  @PrimaryColumn()
  id: string

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date | null

  @Searchable()
  @Column({ type: "text" })
  name: string

  @Index()
  @Column({ type: "text", nullable: true })
  address_id: string | null

  @Searchable()
  @ManyToOne(() => StockLocationAddress)
  @JoinColumn({ name: "address_id" })
  address: StockLocationAddress | null

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sloc")
  }
}
