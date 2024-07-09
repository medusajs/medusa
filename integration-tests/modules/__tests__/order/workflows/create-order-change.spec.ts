import { createOrderChangeWorkflow } from "@medusajs/core-flows"
import { OrderDTO } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createOrderFixture, prepareDataFixtures } from "./__fixtures__"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  env: { MEDUSA_FF_MEDUSA_V2: true },
  testSuite: ({ getContainer }) => {
    let container

    beforeAll(() => {
      container = getContainer()
    })

    describe("Order change workflows", () => {
      let order: OrderDTO

      describe("createOrderChangeWorkflow", () => {
        beforeEach(async () => {
          const fixtures = await prepareDataFixtures({
            container,
          })

          order = await createOrderFixture({
            container,
            product: fixtures.product,
            location: fixtures.location,
            inventoryItem: fixtures.inventoryItem,
          })
        })

        it("should successfully create an order change", async () => {
          const { result } = await createOrderChangeWorkflow(container).run({
            input: {
              order_id: order.id,
            },
          })

          expect(result).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              order_id: order.id,
            })
          )
        })
      })
    })
  },
})
