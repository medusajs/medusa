import { BeforeInsert, Column, Entity, Index, ManyToMany } from "typeorm"
import { BaseEntity } from "./_base"
import { Customer } from "./customer"
import { PriceList } from "./price-list"

@Entity()
export class CustomerGroup extends BaseEntity {
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

  @BeforeInsert()
  private beforeInsert(): void {
    this.generateId('cgrp')
  }
}
