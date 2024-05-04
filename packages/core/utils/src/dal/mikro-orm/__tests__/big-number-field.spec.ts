import { BigNumberRawValue } from "@medusajs/types"
import { Entity, MikroORM, PrimaryKey } from "@mikro-orm/core"
import { BigNumber } from "../../../totals/big-number"
import { MikroOrmBigNumberProperty } from "../big-number-field"

@Entity()
class TestAmount {
  @PrimaryKey()
  id: string

  @MikroOrmBigNumberProperty()
  amount: BigNumber | number

  raw_amount: BigNumberRawValue

  @MikroOrmBigNumberProperty({ nullable: true })
  nullable_amount: BigNumber | number | null = null

  raw_nullable_amount: BigNumberRawValue | null = null
}

describe("@MikroOrmBigNumberProperty", () => {
  let orm!: MikroORM

  beforeEach(async () => {
    orm = await MikroORM.init({
      entities: [TestAmount],
      dbName: "test",
      type: "postgresql",
    })
  })

  afterEach(async () => {
    await orm.close()
  })

  it("should correctly assign and update BigNumber values", () => {
    const testAmount = new TestAmount()

    expect(testAmount.amount).toBeUndefined()
    expect(testAmount.raw_amount).toBeUndefined()

    testAmount.amount = 100

    expect(testAmount.amount).toEqual(100)
    expect(testAmount.raw_amount).toEqual({
      value: "100",
      precision: 20,
    })

    try {
      ;(testAmount as any).amount = null
    } catch (e) {
      expect(e.message).toEqual(
        "Invalid BigNumber value: null. Should be one of: string, number, BigNumber (bignumber.js), BigNumberRawValue"
      )
    }

    testAmount.nullable_amount = null
    expect(testAmount.nullable_amount).toEqual(null)
    // Update the amount

    testAmount.amount = 200

    expect(testAmount.amount).toEqual(200)
    expect(testAmount.raw_amount).toEqual({
      value: "200",
      precision: 20,
    })

    // Update with big number

    testAmount.amount = new BigNumber(300, { precision: 5 })

    expect(testAmount.amount).toEqual(300)
    expect(testAmount.raw_amount).toEqual({ value: "300", precision: 5 })
  })
})
