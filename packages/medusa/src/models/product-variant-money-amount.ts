import { BeforeInsert, Column, Entity, Index } from "typeorm"
import { generateEntityId } from "../utils"
import { SoftDeletableEntity } from "../interfaces"

@Entity()
export class ProductVariantMoneyAmount extends SoftDeletableEntity {
  @Index("idx_product_variant_money_amount_money_amount_id_unique", {
    unique: true,
  })
  @Column()
  money_amount_id: string

  @Index("idx_product_variant_money_amount_variant_id")
  @Column()
  variant_id: string

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pvma_")
  }
}
