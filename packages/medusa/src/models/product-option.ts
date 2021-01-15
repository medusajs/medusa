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
import { ulid } from "ulid"

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

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `opt_${id}`
  }
}
