import { Entity, Column, Index, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number

  @Index({ unique: true })
  @Column()
  code: string

  @Column()
  symbol: string

  @Column()
  symbol_native: string

  @Column()
  name: string
}
