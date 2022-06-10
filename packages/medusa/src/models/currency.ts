import { Column, Entity, PrimaryColumn } from "typeorm"

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

/**
 * @schema currency
 * title: "Currency"
 * description: "Currency"
 * x-resourceId: currency
 * properties:
 *  code:
 *    description: "The 3 character ISO code for the currency."
 *    type: string
 *  symbol:
 *    description: "The symbol used to indicate the currency."
 *    type: string
 *  symbol_native:
 *    description: "The native symbol used to indicate the currency."
 *    type: string
 *  name:
 *    description: "The written name of the currency"
 *    type: string
 */
