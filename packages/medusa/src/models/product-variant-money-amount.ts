import { BeforeInsert, Column, Entity, Index } from "typeorm"
import { DbAwareColumn, generateEntityId } from "../utils"
import { SoftDeletableEntity } from "../interfaces"

@Entity()
export class ProductVariantMoneyAmount extends SoftDeletableEntity {
  @Index()
  @Column({ unique: true })
  money_amount_id: string

  @Index()
  @Column()
  variant_id: string

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pvma_")
  }
}
