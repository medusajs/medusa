import { IOrderModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { Modules } from "@medusajs/utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IOrderModuleService>({
  moduleName: Modules.ORDER,
  testSuite: ({ service }) => {
    describe("Order Module Service - Returns", () => {
      it("should create return reasons", async function () {
        const reason = await service.createReturnReasons({
          value: "test",
          label: "label test",
          description: "description test",
        })

        expect(reason).toEqual({
          id: expect.any(String),
          value: "test",
          label: "label test",
          description: "description test",
          return_reason_children: [],
          metadata: null,
          deleted_at: null,
        })
      })

      it("should create return reasons with parent", async function () {
        const reason = await service.createReturnReasons({
          value: "test",
          label: "label test",
          description: "description test",
        })

        const reason2 = await service.createReturnReasons({
          value: "test 2.0",
          label: "child",
          parent_return_reason_id: reason.id,
        })
        const reason3 = await service.createReturnReasons({
          value: "test 3.0",
          label: "child 3",
          parent_return_reason_id: reason.id,
        })

        const getChild = await service.retrieveReturnReason(reason2.id, {
          relations: ["parent_return_reason"],
        })
        expect(getChild).toEqual(
          expect.objectContaining({
            id: reason2.id,
            value: "test 2.0",
            label: "child",
            parent_return_reason_id: reason.id,
            parent_return_reason: expect.objectContaining({
              id: reason.id,
              value: "test",
              label: "label test",
              description: "description test",
              parent_return_reason_id: null,
            }),
          })
        )

        const getParent = await service.retrieveReturnReason(reason.id, {
          relations: ["return_reason_children"],
        })
        expect(getParent).toEqual(
          expect.objectContaining({
            id: reason.id,
            value: "test",
            label: "label test",
            description: "description test",
            return_reason_children: [
              expect.objectContaining({
                id: reason2.id,
                value: "test 2.0",
                label: "child",
                parent_return_reason_id: reason.id,
              }),
              expect.objectContaining({
                id: reason3.id,
                value: "test 3.0",
                label: "child 3",
                parent_return_reason_id: reason.id,
              }),
            ],
          })
        )
      })
    })
  },
})
