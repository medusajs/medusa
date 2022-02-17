import _ from "lodash"
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { ulid } from "ulid"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"
import { Image } from "./image"
import { ProductCollection } from "./product-collection"
import { ProductOption } from "./product-option"
import { ProductTag } from "./product-tag"
import { ProductType } from "./product-type"
import { ProductVariant } from "./product-variant"
import { ShippingProfile } from "./shipping-profile"

export enum Status {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

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

  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column({ nullable: true })
  handle: string

  @Column({ default: false })
  is_giftcard: boolean

  @DbAwareColumn({ type: "enum", enum: Status, default: "draft" })
  status: Status

  @ManyToMany(() => Image, { cascade: ["insert"] })
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
    (productOption) => productOption.product
  )
  options: ProductOption[]

  @OneToMany(
    () => ProductVariant,
    (variant) => variant.product,
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
  collection_id: string | null

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

  @Column({ default: true })
  discountable: boolean

  @Column({ nullable: true })
  external_id: string

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
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

/**
 * @schema product
 * title: "Product"
 * description: "Products are a grouping of Product Variants that have common properties such as images and descriptions. Products can have multiple options which define the properties that Product Variants differ by."
 * x-resourceId: product
 * properties:
 *   id:
 *     description: "The id of the Product. This value will be prefixed with `prod_`."
 *     type: string
 *   title:
 *     description: "A title that can be displayed for easy identification of the Product."
 *     type: string
 *   subtitle:
 *     description: "An optional subtitle that can be used to further specify the Product."
 *     type: string
 *   description:
 *     description: "A short description of the Product."
 *     type: string
 *   handle:
 *     description: "A unique identifier for the Product (e.g. for slug structure)."
 *     type: string
 *   is_giftcard:
 *     description: "Whether the Product represents a Gift Card. Products that represent Gift Cards will automatically generate a redeemable Gift Card code once they are purchased."
 *     type: boolean
 *   discountable:
 *     description: "Whether the Product can be discounted. Discounts will not apply to Line Items of this Product when this flag is set to `false`."
 *     type: boolean
 *   images:
 *     description: "Images of the Product"
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/image"
 *   thumbnail:
 *     description: "A URL to an image file that can be used to identify the Product."
 *     type: string
 *   options:
 *     description: "The Product Options that are defined for the Product. Product Variants of the Product will have a unique combination of Product Option Values."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/product_option"
 *   variants:
 *     description: "The Product Variants that belong to the Product. Each will have a unique combination of Product Option Values."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/product_variant"
 *   profile_id:
 *     description: "The id of the Shipping Profile that the Product belongs to. Shipping Profiles have a set of defined Shipping Options that can be used to Fulfill a given set of Products."
 *     type: string
 *   hs_code:
 *     description: "The Harmonized System code of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers."
 *     type: string
 *   origin_country:
 *     description: "The country in which the Product Variant was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers."
 *     type: string
 *   mid_code:
 *     description: "The Manufacturers Identification code that identifies the manufacturer of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers."
 *     type: string
 *   material:
 *     description: "The material and composition that the Product Variant is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers."
 *     type: string
 *   weight:
 *     description: "The weight of the Product Variant. May be used in shipping rate calculations."
 *     type: string
 *   height:
 *     description: "The height of the Product Variant. May be used in shipping rate calculations."
 *     type: string
 *   width:
 *     description: "The width of the Product Variant. May be used in shipping rate calculations."
 *     type: string
 *   length:
 *     description: "The length of the Product Variant. May be used in shipping rate calculations."
 *     type: string
 *   type:
 *     description: "The Product Type of the Product (e.g. \"Clothing\")"
 *     anyOf:
 *       - $ref: "#/components/schemas/product_type"
 *   collection:
 *     description: "The Product Collection that the Product belongs to (e.g. \"SS20\")"
 *     anyOf:
 *       - $ref: "#/components/schemas/product_collection"
 *   tags:
 *     description: "The Product Tags assigned to the Product."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/product_tag"
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: "The date with timezone at which the resource was deleted."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
