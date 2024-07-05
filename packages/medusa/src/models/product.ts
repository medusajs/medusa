import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Relation,
} from "typeorm"

import _ from "lodash"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils"
import { DbAwareColumn } from "../utils/db-aware-column"
import { FeatureFlagDecorators } from "../utils/feature-flag-decorators"
import { Image } from "./image"
import { ProductCategory } from "./product-category"
import { ProductCollection } from "./product-collection"
import { ProductOption } from "./product-option"
import { ProductTag } from "./product-tag"
import { ProductType } from "./product-type"
import { ProductVariant } from "./product-variant"
import { SalesChannel } from "./sales-channel"
import { ShippingProfile } from "./shipping-profile"

/**
 * @enum
 *
 * The status of a product.
 */
export enum ProductStatus {
  /**
   * The product is a draft. It's not viewable by customers.
   */
  DRAFT = "draft",
  /**
   * The product is proposed, but not yet published.
   */
  PROPOSED = "proposed",
  /**
   * The product is published.
   */
  PUBLISHED = "published",
  /**
   * The product is rejected. It's not viewable by customers.
   */
  REJECTED = "rejected",
}

@Entity()
export class Product extends SoftDeletableEntity {
  @Column()
  title: string

  @Column({ type: "text", nullable: true })
  subtitle: string | null

  @Column({ type: "text", nullable: true })
  description: string | null

  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column({ type: "text", nullable: true })
  handle: string | null

  @Column({ default: false })
  is_giftcard: boolean

  @DbAwareColumn({ type: "enum", enum: ProductStatus, default: "draft" })
  status: ProductStatus

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
  images: Relation<Image>[]

  @Column({ type: "text", nullable: true })
  thumbnail: string | null

  @OneToMany(() => ProductOption, (productOption) => productOption.product)
  options: Relation<ProductOption>[]

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: Relation<ProductVariant>[]

  @ManyToMany(() => ProductCategory, { cascade: ["remove", "soft-remove"] })
  @JoinTable({
    name: "product_category_product",
    joinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_category_id",
      referencedColumnName: "id",
    },
  })
  categories: Relation<ProductCategory>[]

  profile_id: string

  profile: Relation<ShippingProfile>

  @ManyToMany(() => ShippingProfile, {
    cascade: ["remove", "soft-remove"],
  })
  @JoinTable({
    name: "product_shipping_profile",
    joinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "profile_id",
      referencedColumnName: "id",
    },
  })
  profiles: Relation<ShippingProfile>[]

  @Column({ type: "int", nullable: true })
  weight: number | null

  @Column({ type: "int", nullable: true })
  length: number | null

  @Column({ type: "int", nullable: true })
  height: number | null

  @Column({ type: "int", nullable: true })
  width: number | null

  @Column({ type: "text", nullable: true })
  hs_code: string | null

  @Column({ type: "text", nullable: true })
  origin_country: string | null

  @Column({ type: "text", nullable: true })
  mid_code: string | null

  @Column({ type: "text", nullable: true })
  material: string | null

  @Column({ type: "text", nullable: true })
  collection_id: string | null

  @ManyToOne(() => ProductCollection)
  @JoinColumn({ name: "collection_id" })
  collection: Relation<ProductCollection>

  @Column({ type: "text", nullable: true })
  type_id: string | null

  @ManyToOne(() => ProductType)
  @JoinColumn({ name: "type_id" })
  type: Relation<ProductType>

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
  tags: Relation<ProductTag>[]

  @Column({ default: true })
  discountable: boolean

  @Column({ type: "text", nullable: true })
  external_id: string | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @FeatureFlagDecorators("sales_channels", [
    ManyToMany(() => SalesChannel, { cascade: ["remove", "soft-remove"] }),
    JoinTable({
      name: "product_sales_channel",
      joinColumn: {
        name: "product_id",
        referencedColumnName: "id",
      },
      inverseJoinColumn: {
        name: "sales_channel_id",
        referencedColumnName: "id",
      },
    }),
  ])
  sales_channels: Relation<SalesChannel>[]

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "prod")

    if (!this.handle) {
      this.handle = _.kebabCase(this.title)
    }

    if (this.profile_id) {
      this.profiles = [{ id: this.profile_id }] as ShippingProfile[]
    }
  }

  /**
   * @apiIgnore
   */
  @BeforeUpdate()
  private beforeUpdate(): void {
    if (this.profile_id) {
      this.profiles = [{ id: this.profile_id }] as ShippingProfile[]
    }
  }

  /**
   * @apiIgnore
   */
  @AfterLoad()
  private afterLoad(): void {
    if (this.profiles) {
      this.profile = this.profiles[this.profiles.length - 1]!
      this.profile_id = this.profile?.id
    }
  }
}

/**
 * @schema Product
 * title: "Product"
 * description: "A product is a saleable item that holds general information such as name or description. It must include at least one Product Variant, where each product variant defines different options to purchase the product with (for example, different sizes or colors). The prices and inventory of the product are defined on the variant level."
 * type: object
 * required:
 *   - collection_id
 *   - created_at
 *   - deleted_at
 *   - description
 *   - discountable
 *   - external_id
 *   - handle
 *   - height
 *   - hs_code
 *   - id
 *   - is_giftcard
 *   - length
 *   - material
 *   - metadata
 *   - mid_code
 *   - origin_country
 *   - profile_id
 *   - status
 *   - subtitle
 *   - type_id
 *   - thumbnail
 *   - title
 *   - updated_at
 *   - weight
 *   - width
 * properties:
 *   id:
 *     description: The product's ID
 *     type: string
 *     example: prod_01G1G5V2MBA328390B5AXJ610F
 *   title:
 *     description: A title that can be displayed for easy identification of the Product.
 *     type: string
 *     example: Medusa Coffee Mug
 *   subtitle:
 *     description: An optional subtitle that can be used to further specify the Product.
 *     nullable: true
 *     type: string
 *   description:
 *     description: A short description of the Product.
 *     nullable: true
 *     type: string
 *     example: Every programmer's best friend.
 *   handle:
 *     description: A unique identifier for the Product (e.g. for slug structure).
 *     nullable: true
 *     type: string
 *     example: coffee-mug
 *   is_giftcard:
 *     description: Whether the Product represents a Gift Card. Products that represent Gift Cards will automatically generate a redeemable Gift Card code once they are purchased.
 *     type: boolean
 *     default: false
 *   status:
 *     description: The status of the product
 *     type: string
 *     enum:
 *       - draft
 *       - proposed
 *       - published
 *       - rejected
 *     default: draft
 *   images:
 *     description: The details of the product's images.
 *     type: array
 *     x-expandable: "images"
 *     items:
 *       $ref: "#/components/schemas/Image"
 *   thumbnail:
 *     description: A URL to an image file that can be used to identify the Product.
 *     nullable: true
 *     type: string
 *     format: uri
 *   options:
 *     description: The details of the Product Options that are defined for the Product. The product's variants will have a unique combination of values of the product's options.
 *     type: array
 *     x-expandable: "options"
 *     items:
 *       $ref: "#/components/schemas/ProductOption"
 *   variants:
 *     description: The details of the Product Variants that belong to the Product. Each will have a unique combination of values of the product's options.
 *     type: array
 *     x-expandable: "variants"
 *     items:
 *       $ref: "#/components/schemas/ProductVariant"
 *   categories:
 *     description: The details of the product categories that this product belongs to.
 *     type: array
 *     x-expandable: "categories"
 *     x-featureFlag: "product_categories"
 *     items:
 *       $ref: "#/components/schemas/ProductCategory"
 *   profile_id:
 *     description: The ID of the shipping profile that the product belongs to. The shipping profile has a set of defined shipping options that can be used to fulfill the product.
 *     type: string
 *     example: sp_01G1G5V239ENSZ5MV4JAR737BM
 *   profile:
 *     description: The details of the shipping profile that the product belongs to. The shipping profile has a set of defined shipping options that can be used to fulfill the product.
 *     x-expandable: "profile"
 *     nullable: true
 *     $ref: "#/components/schemas/ShippingProfile"
 *   profiles:
 *     description: Available if the relation `profiles` is expanded.
 *     nullable: true
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ShippingProfile"
 *   weight:
 *     description: The weight of the Product Variant. May be used in shipping rate calculations.
 *     nullable: true
 *     type: number
 *     example: null
 *   length:
 *     description: The length of the Product Variant. May be used in shipping rate calculations.
 *     nullable: true
 *     type: number
 *     example: null
 *   height:
 *     description: The height of the Product Variant. May be used in shipping rate calculations.
 *     nullable: true
 *     type: number
 *     example: null
 *   width:
 *     description: The width of the Product Variant. May be used in shipping rate calculations.
 *     nullable: true
 *     type: number
 *     example: null
 *   hs_code:
 *     description: The Harmonized System code of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     nullable: true
 *     type: string
 *     example: null
 *   origin_country:
 *     description: The country in which the Product Variant was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     nullable: true
 *     type: string
 *     example: null
 *   mid_code:
 *     description: The Manufacturers Identification code that identifies the manufacturer of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     nullable: true
 *     type: string
 *     example: null
 *   material:
 *     description: The material and composition that the Product Variant is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     nullable: true
 *     type: string
 *     example: null
 *   collection_id:
 *     description: The ID of the product collection that the product belongs to.
 *     nullable: true
 *     type: string
 *     example: pcol_01F0YESBFAZ0DV6V831JXWH0BG
 *   collection:
 *     description: The details of the product collection that the product belongs to.
 *     x-expandable: "collection"
 *     nullable: true
 *     $ref: "#/components/schemas/ProductCollection"
 *   type_id:
 *     description: The ID of the product type that the product belongs to.
 *     nullable: true
 *     type: string
 *     example: ptyp_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   type:
 *     description: The details of the product type that the product belongs to.
 *     x-expandable: "type"
 *     nullable: true
 *     $ref: "#/components/schemas/ProductType"
 *   tags:
 *     description: The details of the product tags used in this product.
 *     type: array
 *     x-expandable: "type"
 *     items:
 *       $ref: "#/components/schemas/ProductTag"
 *   discountable:
 *     description: Whether the Product can be discounted. Discounts will not apply to Line Items of this Product when this flag is set to `false`.
 *     type: boolean
 *     default: true
 *   external_id:
 *     description: The external ID of the product
 *     nullable: true
 *     type: string
 *     example: null
 *   sales_channels:
 *     description: The details of the sales channels this product is available in.
 *     type: array
 *     x-expandable: "sales_channels"
 *     items:
 *       $ref: "#/components/schemas/SalesChannel"
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
