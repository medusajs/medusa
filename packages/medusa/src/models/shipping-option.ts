import {
  Entity,
  Check,
  Index,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"

import { ShippingProfile } from "./shipping-profile"
import { Region } from "./region"
import { FulfillmentProvider } from "./fulfillment-provider"
import { ShippingOptionRequirement } from "./shipping-option-requirement"

export enum ShippingOptionPriceType {
  FLAT_RATE = "flat_rate",
  CALCULATED = "calculated",
}

@Check(`"amount" >= 0`)
@Entity()
export class ShippingOption {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Index()
  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region

  @Index()
  @Column()
  profile_id: string

  @ManyToOne(() => ShippingProfile)
  @JoinColumn({ name: "profile_id" })
  profile: ShippingProfile

  @Index()
  @Column()
  provider_id: string

  @ManyToOne(() => FulfillmentProvider)
  @JoinColumn({ name: "provider_id" })
  provider: FulfillmentProvider

  @Column({ type: "enum", enum: ShippingOptionPriceType })
  price_type: ShippingOptionPriceType

  @Column({ type: "int", nullable: true })
  amount: number

  @Column({ default: false })
  is_return: boolean

  @Column({ default: false })
  admin_only: boolean

  @OneToMany(
    () => ShippingOptionRequirement,
    req => req.shipping_option,
    { cascade: ["insert"] }
  )
  requirements: ShippingOptionRequirement[]

  @Column({ type: "jsonb" })
  data: any

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
    this.id = `so_${id}`
  }
}
