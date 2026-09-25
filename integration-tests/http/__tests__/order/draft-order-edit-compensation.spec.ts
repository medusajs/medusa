import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  ContainerRegistrationKeys,
  MedusaError,
  OrderStatus,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  WorkflowResponse,
  createStep,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import {
  beginOrderEditOrderWorkflow,
  confirmDraftOrderEditWorkflow,
  createOrderWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  orderEditUpdateItemQuantityWorkflow,
} from "@medusajs/core-flows"

jest.setTimeout(120000)

// query.graph returns totals as BigNumber instances; coerce for numeric assertions.
const num = (value) => Number(value)

const failStep = createStep("draft-order-edit-compensation-fail", async () => {
  throw new MedusaError(MedusaError.Types.INVALID_DATA, "deliberate failure")
  // eslint-disable-next-line no-unreachable
  return new StepResponse(undefined)
})

const confirmThenFailWorkflow = createWorkflow(
  "draft-order-edit-confirm-then-fail",
  (input: { order_id: string }) => {
    confirmDraftOrderEditWorkflow.runAsStep({
      input: { order_id: input.order_id, confirmed_by: "user_123" },
    })
    failStep()
    return new WorkflowResponse(input)
  }
)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Draft order edit confirmation compensation", () => {
      let query

      beforeAll(() => {
        query = getContainer().resolve(ContainerRegistrationKeys.QUERY)
      })

      const seedDraftOrder = async () => {
        const container = getContainer()

        const {
          result: [region],
        } = await createRegionsWorkflow(container).run({
          input: {
            regions: [{ name: "IT", currency_code: "eur", countries: ["it"] }],
          },
        })

        const {
          result: [salesChannel],
        } = await createSalesChannelsWorkflow(container).run({
          input: { salesChannelsData: [{ name: "Draft order edits" }] },
        })

        const { result: order } = await createOrderWorkflow(container).run({
          input: {
            region_id: region.id,
            sales_channel_id: salesChannel.id,
            currency_code: "eur",
            email: "test@medusajs.com",
            is_draft_order: true,
            status: OrderStatus.DRAFT,
            items: [{ title: "Test item", quantity: 1, unit_price: 10 }],
          },
        })

        return order
      }

      const readState = async (orderId: string) => {
        const {
          data: [order],
        } = await query.graph({
          entity: "order",
          fields: ["version", "total", "items.id", "items.quantity"],
          filters: { id: orderId },
        })

        const { data: changes } = await query.graph({
          entity: "order_change",
          fields: ["status", "version"],
          filters: { order_id: orderId },
        })

        return { order, changes }
      }

      it("reopens an order change that was confirmed without any actions", async () => {
        const container = getContainer()
        const order = await seedDraftOrder()

        await beginOrderEditOrderWorkflow(container).run({
          input: { order_id: order.id },
        })

        const { transaction } = await confirmThenFailWorkflow(container).run({
          input: { order_id: order.id },
          throwOnError: false,
        })

        expect(transaction.getState()).toBe("reverted")

        const { changes } = await readState(order.id)
        expect(changes).toEqual([
          expect.objectContaining({ status: "pending", version: 2 }),
        ])

        // The reopened change is still active, so the edit can be retried.
        await expect(
          confirmDraftOrderEditWorkflow(container).run({
            input: { order_id: order.id, confirmed_by: "user_123" },
          })
        ).resolves.toBeTruthy()
      })

      it("keeps the applied order version intact when a later empty change is compensated", async () => {
        const container = getContainer()
        const order = await seedDraftOrder()

        await beginOrderEditOrderWorkflow(container).run({
          input: { order_id: order.id },
        })
        await orderEditUpdateItemQuantityWorkflow(container).run({
          input: {
            order_id: order.id,
            items: [{ id: order.items![0].id, quantity: 5 }],
          },
        })
        await confirmDraftOrderEditWorkflow(container).run({
          input: { order_id: order.id, confirmed_by: "user_123" },
        })

        const applied = await readState(order.id)
        expect(applied.order.version).toBe(2)
        expect(num(applied.order.total)).toBe(50)

        await beginOrderEditOrderWorkflow(container).run({
          input: { order_id: order.id },
        })
        await confirmThenFailWorkflow(container).run({
          input: { order_id: order.id },
          throwOnError: false,
        })

        const after = await readState(order.id)

        expect(after.order.version).toBe(2)
        expect(num(after.order.total)).toBe(50)
        expect(after.order.items).toHaveLength(1)
        expect(num(after.order.items[0].quantity)).toBe(5)
        expect(after.changes).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ status: "confirmed", version: 2 }),
            expect.objectContaining({ status: "pending", version: 3 }),
          ])
        )
      })
    })
  },
})
