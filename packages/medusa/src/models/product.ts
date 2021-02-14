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
import { ProductCollection } from "./product-collection"
import { ProductOption } from "./product-option"
import { ProductTag } from "./product-tag"
import { ProductType } from "./product-type"
import { ProductVariant } from "./product-variant"
import { ShippingProfile } from "./shipping-profile"
import _ from "lodash"

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

  @Column({ nullable: true })
  collection_id: string

  @ManyToOne(() => ProductCollection)
  @JoinColumn({ name: "collection_id" })
  collection: ProductCollection

  @Column({ nullable: true })
  type_id: string

  @ManyToOne(() => ProductType)
  @JoinColumn({ name: "type_id" })
  type: ProductType

  @ManyToMany(() => ProductTag)
  @JoinTable({
    name: "product_tags",
    joinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_tag_id",
      referencedColumnName: "id",
    },
  })
  tags: ProductTag[]

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

    if (!this.handle) {
      this.handle = _.kebabCase(this.title)
    }
  }
}
