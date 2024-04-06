import { decorateCartTotals } from "../../totals"

describe("Total calculation", function () {
  it("should calculate carts with items + taxes, ", function () {
    const cart = {
      items: [
        {
          unit_price: 30,
          quantity: 2,
          tax_lines: [
            {
              rate: 10,
            },
          ],
          adjustments: [
            {
              amount: 0,
            },
          ],
        },
        {
          unit_price: 5,
          quantity: 1,
          tax_lines: [
            {
              rate: 50,
            },
          ],
        },
      ],
    }
    console.log(JSON.stringify(decorateCartTotals(cart), null, 2))

    //expect(JSON.stringify(decorateCartTotals(cart))).toEqual(JSON.stringify(42))
  })
})
