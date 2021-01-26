import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Currency {
  @PrimaryColumn()
  code: string

  @Column()
  symbol: string

  @Column()
  symbol_native: string

  @Column()
  name: string
}
