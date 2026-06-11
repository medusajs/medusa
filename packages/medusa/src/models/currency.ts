import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  exchange_rate: number;

  constructor(code: string, name: string, exchange_rate: number) {
    this.code = code;
    this.name = name;
    this.exchange_rate = exchange_rate;
  }
}