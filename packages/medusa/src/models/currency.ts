import { Entity, Column, Index, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm"

@Entity()
export class Currency {
  @PrimaryColumn()
  id: number

  @Column()
  code: string

  @Column()
  symbol: string

  @Column()
  symbol_native: string

  @Column()
  name: string
}
