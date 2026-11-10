import { getOrdersListWorkflow } from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { OrderDTO } from "@medusajs/types"
import { createOrderFixture, prepareDataFixtures } from "./__fixtures__"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ getContainer }) => {
    let container

    beforeAll(() => {
      container = getContainer()
    })

    describe("Get orders list workflow", () => {
      let order: OrderDTO

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

      it("should not return items when they are not requested", async () => {
        const { result } = await getOrdersListWorkflow(container).run({
          input: {
            fields: ["id"],
            variables: { skip: 0, take: 10 },
          },
        })

        const { rows } = result as { rows: OrderDTO[] }

        expect(rows).toHaveLength(1)
        expect(rows[0].id).toEqual(order.id)
        expect(rows[0]).not.toHaveProperty("items")
        expect(rows[0]).toEqual(
          expect.objectContaining({
            payment_status: "not_paid",
            fulfillment_status: "not_fulfilled",
          })
        )
      })

      it("should not return items when only totals are requested", async () => {
        const { result } = await getOrdersListWorkflow(container).run({
          input: {
            fields: ["id", "total", "item_total"],
          },
        })

        const rows = result as OrderDTO[]

        expect(rows).toHaveLength(1)
        expect(rows[0]).not.toHaveProperty("items")
        expect(rows[0].total).toBeDefined()
      })

      it.each([["items.*"], ["*items"], ["items.id"]])(
        "should return items when requested with %s",
        async (field) => {
          const { result } = await getOrdersListWorkflow(container).run({
            input: {
              fields: ["id", field],
            },
          })

          const rows = result as OrderDTO[]

          expect(rows).toHaveLength(1)
          expect(rows[0].items).toEqual([
            expect.objectContaining({ id: order.items![0].id }),
          ])
        }
      )
    })
  },
})
