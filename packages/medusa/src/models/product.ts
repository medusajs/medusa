import {
  Entity,
  Index,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"

import { Image } from "./image"
import { ProductOption } from "./product-option"
import { ProductVariant } from "./product-variant"
import { ShippingProfile } from "./shipping-profile"

@Entity()
export class Product {
  @PrimaryColumn()
  id: string

  @Column()
  title: string

  @Column({ nullable: true })
  subtitle: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  tags: string

  @Index({ unique: true })
  @Column({ nullable: true })
  handle: string

  @Column({ default: false })
  is_giftcard: boolean

  @ManyToMany(() => Image)
  @JoinTable({
    name: "product_images",
    joinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "image_id",
      referencedColumnName: "id",
    },
  })
  images: Image[]

  @Column({ nullable: true })
  thumbnail: string

  @OneToMany(
    () => ProductOption,
    productOption => productOption.product
  )
  options: ProductOption[]

  @OneToMany(
    () => ProductVariant,
    variant => variant.product,
    { cascade: true }
  )
  variants: ProductVariant[]

  @Index()
  @Column()
  profile_id: string

  @ManyToOne(() => ShippingProfile)
  @JoinColumn({ name: "profile_id" })
  profile: ShippingProfile

  @Column({ type: "int", nullable: true })
  weight: number

  @Column({ type: "int", nullable: true })
  length: number

  @Column({ type: "int", nullable: true })
  height: number

  @Column({ type: "int", nullable: true })
  width: number

  @Column({ nullable: true })
  hs_code: string

  @Column({ nullable: true })
  origin_country: string

  @Column({ nullable: true })
  mid_code: string

  @Column({ nullable: true })
  material: string

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
    this.id = `prod_${id}`
  }
}
