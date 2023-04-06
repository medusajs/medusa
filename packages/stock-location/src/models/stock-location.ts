import { generateEntityId, SoftDeletableEntity } from "@medusajs/utils"
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm"
import { StockLocationAddress } from "./stock-location-address"

@Entity()
export class StockLocation extends SoftDeletableEntity {
  @Column({ type: "text" })
  name: string

  @Index()
  @Column({ type: "text", nullable: true })
  address_id: string | null

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
