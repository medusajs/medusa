import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { BaseEntity } from "./_base"
import { ulid } from "ulid"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"
import { Customer } from "./customer"
import { PriceList } from "./price-list"

@Entity()
export class CustomerGroup extends BaseEntity {
  prefixId = "cgrp"

  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column()
  name: string

  @ManyToMany(() => Customer, (customer) => customer.groups, {
    onDelete: "CASCADE",
  })
  customers: Customer[]

  @ManyToMany(() => PriceList, (priceList) => priceList.customer_groups, {
    onDelete: "CASCADE",
  })
  price_lists: PriceList[]
}
