import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"

@Entity()
export class FulfillmentProvider {
  @PrimaryColumn()
  id: string

  @Column({ default: true })
  is_installed: boolean
}
