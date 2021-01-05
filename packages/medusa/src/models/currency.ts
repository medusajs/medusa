import { Entity, Column, Index, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm"

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number

  @PrimaryColumn()
  code: string

  @Column()
  symbol: string

  @Column()
  symbol_native: string

  @Column()
  name: string
}
