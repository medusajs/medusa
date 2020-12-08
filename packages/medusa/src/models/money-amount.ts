import {
  Entity,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import randomize from "randomatic"

import { ProductVariant } from "./product-variant"
import { ShippingOption } from "./shipping-option"

@Entity()
export class MoneyAmount {
  @PrimaryColumn()
  id: string

  @Column()
  currency: string

  @Column({ type: "int" })
  amount: number

  @RelationId((ma: MoneyAmount) => ma.product_variant)
  variant_id: string

  @ManyToOne(() => ProductVariant)
  product_variant: ProductVariant

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 10)
    this.id = `ma_${id}`
  }
}
