import {
  createLinksWorkflow,
  createLinksWorkflowId,
  dismissLinksWorkflow,
  dismissLinksWorkflowId,
  updateLinksWorkflow,
  updateLinksWorkflowId,
} from "@medusajs/core-flows"
import { Modules } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils/dist"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ getContainer, api, dbConnection }) => {
    describe("Workflows: Common", () => {
      let appContainer
      let product
      let variant

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, getContainer())

        product = (
          await api.post(
            "/admin/products",
            {
              title: "product 1",
              variants: [
                {
                  title: "variant 1",
                  prices: [{ currency_code: "usd", amount: 100 }],
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        variant = product.variants[0]
      })

      describe("createLinksWorkflow", () => {
        describe("compensation", () => {
          it("should dismiss links when step throws an error", async () => {
            const workflow = createLinksWorkflow(appContainer)
            const workflowId = createLinksWorkflowId
            const inventoryItem = (
              await api.post(
                `/admin/inventory-items`,
                { sku: "12345" },
                adminHeaders
              )
            ).data.inventory_item

            workflow.appendAction("throw", workflowId, {
              invoke: async function failStep() {
                throw new Error(`Fail`)
              },
            })

            const { errors } = await workflow.run({
              input: [
                {
                  [Modules.PRODUCT]: { variant_id: variant.id },
                  [Modules.INVENTORY]: { inventory_item_id: inventoryItem.id },
                  data: { required_quantity: 10 },
                },
              ],
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Fail`,
                }),
              },
            ])

            const updatedVariant = (
              await api.get(
                `/admin/products/${product.id}/variants/${variant.id}?fields=inventory_items.inventory.*,inventory_items.*`,
                adminHeaders
              )
            ).data.variant

            expect(updatedVariant.inventory_items).toHaveLength(0)
          })
        })
      })

      describe("updateLinksWorkflow", () => {
        describe("compensation", () => {
          it("should revert link data when step throws an error", async () => {
            const workflow = updateLinksWorkflow(appContainer)
            const workflowId = updateLinksWorkflowId
            const originalQuantity = 5
            const newQuantity = 10
            const inventoryItem = (
              await api.post(
                `/admin/inventory-items`,
                { sku: "12345" },
                adminHeaders
              )
            ).data.inventory_item

            await api.post(
              `/admin/products/${product.id}/variants/${variant.id}/inventory-items`,
              {
                inventory_item_id: inventoryItem.id,
                required_quantity: originalQuantity,
              },
              adminHeaders
            )

            workflow.appendAction("throw", workflowId, {
              invoke: async function failStep() {
                throw new Error(`Fail`)
              },
            })

            const { errors } = await workflow.run({
              input: [
                {
                  [Modules.PRODUCT]: { variant_id: variant.id },
                  [Modules.INVENTORY]: { inventory_item_id: inventoryItem.id },
                  data: { required_quantity: newQuantity },
                },
              ],
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Fail`,
                }),
              },
            ])

            const updatedVariant = (
              await api.get(
                `/admin/products/${product.id}/variants/${variant.id}?fields=inventory_items.inventory.*,inventory_items.*`,
                adminHeaders
              )
            ).data.variant

            expect(updatedVariant.inventory_items).toEqual([
              expect.objectContaining({
                required_quantity: originalQuantity,
              }),
            ])
          })

          it("should throw an error when a link is not found", async () => {
            const workflow = updateLinksWorkflow(appContainer)
            const workflowId = updateLinksWorkflowId

            workflow.appendAction("throw", workflowId, {
              invoke: async function failStep() {
                throw new Error(`Fail`)
              },
            })

            const { errors } = await workflow.run({
              input: [
                {
                  [Modules.PRODUCT]: { variant_id: variant.id },
                  [Modules.INVENTORY]: {
                    inventory_item_id: "does-not-exist-id",
                  },
                  data: { required_quantity: 10 },
                },
              ],
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "update-links-step",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Could not find all existing links from data`,
                }),
              },
            ])
          })
        })
      })

      describe("dismissLinksWorkflow", () => {
        describe("compensation", () => {
          it("should recreate dismissed links when step throws an error", async () => {
            const originalQuantity = 10
            const workflow = dismissLinksWorkflow(appContainer)
            const workflowId = dismissLinksWorkflowId
            const inventoryItem = (
              await api.post(
                `/admin/inventory-items`,
                { sku: "12345" },
                adminHeaders
              )
            ).data.inventory_item

            await api.post(
              `/admin/products/${product.id}/variants/${variant.id}/inventory-items`,
              {
                inventory_item_id: inventoryItem.id,
                required_quantity: originalQuantity,
              },
              adminHeaders
            )

            workflow.appendAction("throw", workflowId, {
              invoke: async function failStep() {
                throw new Error(`Fail`)
              },
            })

            const { errors } = await workflow.run({
              input: [
                {
                  [Modules.PRODUCT]: { variant_id: variant.id },
                  [Modules.INVENTORY]: { inventory_item_id: inventoryItem.id },
                },
              ],
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Fail`,
                }),
              },
            ])

            const updatedVariant = (
              await api.get(
                `/admin/products/${product.id}/variants/${variant.id}?fields=inventory_items.inventory.*,inventory_items.*`,
                adminHeaders
              )
            ).data.variant

            expect(updatedVariant.inventory_items).toEqual([
              expect.objectContaining({
                required_quantity: originalQuantity,
              }),
            ])
          })

          it("should pass dismiss step if link not found if next step throws error", async () => {
            const workflow = dismissLinksWorkflow(appContainer)
            const workflowId = dismissLinksWorkflowId

            workflow.appendAction("throw", workflowId, {
              invoke: async function failStep() {
                throw new Error(`Fail`)
              },
            })

            const { errors } = await workflow.run({
              input: [
                {
                  [Modules.PRODUCT]: { variant_id: variant.id },
                  [Modules.INVENTORY]: {
                    inventory_item_id: "does-not-exist-id",
                  },
                },
              ],
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Fail`,
                }),
              },
            ])

            const updatedVariant = (
              await api.get(
                `/admin/products/${product.id}/variants/${variant.id}?fields=inventory_items.inventory.*,inventory_items.*`,
                adminHeaders
              )
            ).data.variant

            expect(updatedVariant.inventory_items).toEqual([])
          })
        })
      })
    })
  },
})
