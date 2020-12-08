import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Column,
  PrimaryColumn,
  JoinColumn,
} from "typeorm"
import randomize from "randomatic"

import { Product } from "./product"
import { ProductOptionValue } from "./product-option-value"

@Entity()
export class ProductOption {
  @PrimaryColumn()
  id: string

  @Column()
  title: string

  @OneToMany(
    () => ProductOptionValue,
    value => value.option
  )
  values: ProductOptionValue

  @ManyToOne(
    () => Product,
    product => product.options
  )
  @JoinColumn({ name: "product_id" })
  product: Product

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 16)
    this.id = `opt_${id}`
  }
}
