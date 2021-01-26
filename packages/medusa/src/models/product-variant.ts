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
import { ulid } from "ulid"

import { Product } from "./product"
import { MoneyAmount } from "./money-amount"
import { ProductOptionValue } from "./product-option-value"

@Entity()
export class ProductVariant {
  @PrimaryColumn()
  id: string

  @Column()
  title: string

  @Column()
  product_id: string

  @ManyToOne(
    () => Product,
    product => product.variants,
    { eager: true }
  )
  @JoinColumn({ name: "product_id" })
  product: Product

  @OneToMany(
    () => MoneyAmount,
    ma => ma.variant,
    { cascade: true }
  )
  prices: MoneyAmount[]

  @Column({ nullable: true })
  @Index({ unique: true })
  sku: string

  @Index({ unique: true })
  @Column({ nullable: true })
  barcode: string

  @Index({ unique: true })
  @Column({ nullable: true })
  ean: string

  @Index({ unique: true })
  @Column({ nullable: true })
  upc: string

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

  @Column({ type: "int", nullable: true })
  weight: number

  @Column({ type: "int", nullable: true })
  length: number

  @Column({ type: "int", nullable: true })
  height: number

  @Column({ type: "int", nullable: true })
  width: number

  @OneToMany(
    () => ProductOptionValue,
    optionValue => optionValue.variant,
    { cascade: true }
  )
  options: ProductOptionValue[]

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
    this.id = `variant_${id}`
  }
}
