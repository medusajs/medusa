import { createOrderCreditLinesWorkflow } from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IOrderModuleService, OrderDTO } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { createOrderFixture, prepareDataFixtures } from "./__fixtures__"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ getContainer }) => {
    let container

    beforeAll(() => {
      container = getContainer()
    })

    describe("createOrderCreditLinesWorkflow", () => {
      let order: OrderDTO
      let service: IOrderModuleService

      beforeEach(async () => {
        const fixtures = await prepareDataFixtures({
          container,
        })

        order = await createOrderFixture({
          container,
          product: fixtures.product,
          location: fixtures.location,
          inventoryItem: fixtures.inventoryItem,
          customer: fixtures.customer,
        })

        service = container.resolve(Modules.ORDER)
      })

      it("should return only newly created credit lines with created_in_version metadata", async () => {
        // First execution - create first credit line
        const { result: firstResult } = await createOrderCreditLinesWorkflow(
          container
        ).run({
          input: {
            id: order.id,
            credit_lines: [
              {
                amount: 5,
                reference: "order",
                reference_id: order.id,
              },
            ],
          },
        })

        expect(firstResult).toHaveLength(1)
        expect(firstResult[0]).toEqual(
          expect.objectContaining({
            amount: 5,
            reference: "order",
            reference_id: order.id,
            metadata: expect.objectContaining({
              created_in_version: 2, // First change bumps to version 2
            }),
          })
        )

        const firstCreditLineId = firstResult[0].id

        // Second execution - create second credit line
        const { result: secondResult } = await createOrderCreditLinesWorkflow(
          container
        ).run({
          input: {
            id: order.id,
            credit_lines: [
              {
                amount: 3,
                reference: "order",
                reference_id: order.id,
              },
            ],
          },
        })

        // Should only return the newly created credit line, not the first one
        expect(secondResult).toHaveLength(1)
        expect(secondResult[0]).toEqual(
          expect.objectContaining({
            amount: 3,
            reference: "order",
            reference_id: order.id,
            metadata: expect.objectContaining({
              created_in_version: 3, // Second change bumps to version 3
            }),
          })
        )

        // Verify the second result does not include the first credit line
        expect(secondResult[0].id).not.toBe(firstCreditLineId)

        // Verify total credit lines in the order
        const updatedOrder = await service.retrieveOrder(order.id, {
          relations: ["credit_lines"],
        })

        expect(updatedOrder.credit_lines).toHaveLength(2)

        // Verify each credit line has correct created_in_version
        const creditLineVersions = updatedOrder.credit_lines!.map(
          (cl: any) => cl.metadata?.created_in_version
        )
        expect(creditLineVersions).toContain(2)
        expect(creditLineVersions).toContain(3)
      })

      it("should return multiple credit lines when created in single execution", async () => {
        const { result } = await createOrderCreditLinesWorkflow(container).run({
          input: {
            id: order.id,
            credit_lines: [
              {
                amount: 3,
                reference: "order",
                reference_id: order.id,
              },
              {
                amount: 2,
                reference: "custom",
                reference_id: "custom_123",
              },
            ],
          },
        })

        expect(result).toHaveLength(2)

        // All credit lines from same execution should have same created_in_version
        const versions = result.map((cl) => cl.metadata?.created_in_version)
        expect(versions).toEqual([2, 2])
      })
    })
  },
})
