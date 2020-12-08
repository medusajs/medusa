import {
  Entity,
  Index,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import randomize from "randomatic"

import { Product } from "./product"
import { MoneyAmount } from "./money-amount"
import { ProductOptionValue } from "./product-option-value"

@Entity()
export class ProductVariant {
  @PrimaryColumn()
  id: string

  @Column()
  title: string

  @ManyToOne(
    () => Product,
    product => product.variants
  )
  @JoinColumn({ name: "product_id" })
  product: Product

  @OneToMany(
    () => MoneyAmount,
    ma => ma.product_variant
  )
  prices: MoneyAmount[]

  @Index({ unique: true })
  @Column({ nullable: true })
  sku: string

  @Index({ unique: true })
  @Column({ nullable: true })
  barcode: string

  @Column({ type: "int" })
  inventory_quantity: number

  @Column({ default: false })
  allow_backorder: boolean

  @Column({ default: true })
  manage_inventory: boolean

  @Column({ nullable: true })
  hs_code: string

  @Column({ nullable: true })
  origin_country: string

  @Column({ nullable: true })
  mid_code: string

  @Column({ nullable: true })
  material: string

  @OneToMany(
    () => ProductOptionValue,
    optionValue => optionValue.variant
  )
  options: ProductOptionValue[]

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
    this.id = `variant_${id}`
  }
}
