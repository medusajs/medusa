import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"

@Entity()
export class PaymentProvider {
  @PrimaryColumn()
  id: string

  @Column({ default: true })
  is_installed: boolean
}
