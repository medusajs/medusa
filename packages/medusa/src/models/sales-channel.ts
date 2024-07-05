import {
  BeforeInsert,
  Column,
  JoinTable,
  ManyToMany,
  OneToMany,
  Relation,
} from "typeorm"

import { MedusaV2Flag } from "@medusajs/utils"
import { SoftDeletableEntity } from "../interfaces"
import { DbAwareColumn, generateEntityId } from "../utils"
import {
  FeatureFlagDecorators,
  FeatureFlagEntity,
} from "../utils/feature-flag-decorators"
import { Cart } from "./cart"
import { Order } from "./order"
import { Product } from "./product"
import { PublishableApiKey } from "./publishable-api-key"
import { SalesChannelLocation } from "./sales-channel-location"

@FeatureFlagEntity("sales_channels")
export class SalesChannel extends SoftDeletableEntity {
  @Column()
  name: string

  @Column({ type: "varchar", nullable: true })
  description: string | null

  @Column({ default: false })
  is_disabled: boolean

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @ManyToMany(() => Product)
  @JoinTable({
    name: "product_sales_channel",
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
    joinColumn: {
      name: "sales_channel_id",
      referencedColumnName: "id",
    },
  })
  products: Relation<Product>[]

  @FeatureFlagDecorators(MedusaV2Flag.key, [
    ManyToMany(() => Cart),
    JoinTable({
      name: "cart_sales_channel",
      joinColumn: {
        name: "sales_channel_id",
        referencedColumnName: "id",
      },
      inverseJoinColumn: {
        name: "cart_id",
        referencedColumnName: "id",
      },
    }),
  ])
  carts: Relation<Cart>[]

  @FeatureFlagDecorators(MedusaV2Flag.key, [
    ManyToMany(() => Order),
    JoinTable({
      name: "order_sales_channel",
      joinColumn: {
        name: "sales_channel_id",
        referencedColumnName: "id",
      },
      inverseJoinColumn: {
        name: "order_id",
        referencedColumnName: "id",
      },
    }),
  ])
  orders: Relation<Order>[]

  @ManyToMany(() => PublishableApiKey)
  @JoinTable({
    name: "publishable_api_key_sales_channel",
    inverseJoinColumn: {
      name: "publishable_key_id",
      referencedColumnName: "id",
    },
    joinColumn: {
      name: "sales_channel_id",
      referencedColumnName: "id",
    },
  })
  publishableKeys: Relation<PublishableApiKey>[]

  @OneToMany(
    () => SalesChannelLocation,
    (scLocation) => scLocation.sales_channel,
    {
      cascade: ["soft-remove", "remove"],
    }
  )
  locations: Relation<SalesChannelLocation>[]

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sc")
  }
}

/**
 * @schema SalesChannel
 * title: "Sales Channel"
 * description: "A Sales Channel is a method a business offers its products for purchase for the customers. For example, a Webshop can be a sales channel, and a mobile app can be another."
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - description
 *   - id
 *   - is_disabled
 *   - name
 *   - updated_at
 * properties:
 *  id:
 *    description: The sales channel's ID
 *    type: string
 *    example: sc_01G8X9A7ESKAJXG2H0E6F1MW7A
 *  name:
 *    description: The name of the sales channel.
 *    type: string
 *    example: Market
 *  description:
 *    description: The description of the sales channel.
 *    nullable: true
 *    type: string
 *    example: Multi-vendor market
 *  is_disabled:
 *    description: Specify if the sales channel is enabled or disabled.
 *    type: boolean
 *    default: false
 *  locations:
 *    description: The details of the stock locations related to the sales channel.
 *    type: array
 *    x-expandable: "locations"
 *    items:
 *      $ref: "#/components/schemas/SalesChannelLocation"
 *  created_at:
 *    description: The date with timezone at which the resource was created.
 *    type: string
 *    format: date-time
 *  updated_at:
 *    description: The date with timezone at which the resource was updated.
 *    type: string
 *    format: date-time
 *  deleted_at:
 *    description: The date with timezone at which the resource was deleted.
 *    nullable: true
 *    type: string
 *    format: date-time
 *  metadata:
 *    description: An optional key-value map with additional details
 *    nullable: true
 *    type: object
 *    example: {car: "white"}
 *    externalDocs:
 *      description: "Learn about the metadata attribute, and how to delete and update it."
 *      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 *  carts:
 *    description: The associated carts.
 *    type: array
 *    nullable: true
 *    x-expandable: "carts"
 *    x-featureFlag: "medusa_v2"
 *    items:
 *      $ref: "#/components/schemas/Cart"
 *  orders:
 *    description: The associated orders.
 *    type: array
 *    nullable: true
 *    x-expandable: "orders"
 *    x-featureFlag: "medusa_v2"
 *    items:
 *      $ref: "#/components/schemas/Order"
 *  publishableKeys:
 *    description: The associated publishable API keys.
 *    type: array
 *    nullable: true
 *    x-expandable: "publishableKeys"
 *    items:
 *      $ref: "#/components/schemas/PublishableApiKey"
 */
