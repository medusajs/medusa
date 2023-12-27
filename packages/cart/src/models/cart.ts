import { generateEntityId } from "@medusajs/utils"
import { BeforeCreate, Entity, OnInit, PrimaryKey, Property } from "@mikro-orm/core"

@Entity()
export default class Cart {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  region_id: string

  @Property({ columnType: "text" })
  customer_id: string

  @Property({ columnType: "text" })
  sales_channel_id: string

  @Property({ columnType: "text" })
  email: string

  @Property({ columnType: "text" })
  currency_code: string

  @Property({ columnType: "text" })
  shipping_address: string

  
  



  - shipping_address
  - billing_address
  
  // - items: CartLineItem[]
  // - shipping_methods: CartShippingMethod[]
  
  - compare_at_item_total // computed
  - compare_at_item_subtotal // computed
  - compare_at_item_tax_total // computed
  
  - original_total // computed
  - original_subtotal // computed
  - original_tax_total // computed
  - original_item_total // computed
  - original_item_subtotal // computed
  - original_item_tax_total // computed
  - original_shipping_total // computed
  - original_shipping_subtotal // computed
  - original_shipping_tax_total // computed
  
  - total // computed
  - subtotal // computed
  - tax_total // computed
  - item_total // computed
  - item_subtotal // computed
  - item_tax_total // computed
  - shipping_total // computed
  - shipping_subtotal // computed
  - shipping_tax_total // computed
  - discount_total // computed
  - discount_tax_total // computed

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at?: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "cart")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cart")
  }
}
