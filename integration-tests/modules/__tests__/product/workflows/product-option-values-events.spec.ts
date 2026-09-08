import {
  deleteProductOptionValuesWorkflow,
  updateProductOptionValuesWorkflow,
} from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IEventBusModuleService, IProductModuleService } from "@medusajs/types"
import { Modules, ProductOptionValueWorkflowEvents } from "@medusajs/utils"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Workflows: Product option values events", () => {
      let appContainer
      let service: IProductModuleService
      let eventBusService: IEventBusModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        service = appContainer.resolve(Modules.PRODUCT)
        eventBusService = appContainer.resolve(Modules.EVENT_BUS)
      })

      const getEmittedEventNames = (emitSpy: jest.SpyInstance) =>
        emitSpy.mock.calls.flatMap(([events]) =>
          (Array.isArray(events) ? events : [events]).map((e) => e.name)
        )

      // Global options must have unique titles, so each test creates its own.
      const createOptionValue = async (title: string) => {
        const option = await service.createProductOptions({
          title,
          values: ["S", "M"],
        })

        const [optionValue] = await service.listProductOptionValues({
          option_id: option.id,
        })

        return optionValue
      }

      it("should emit product-option-value.updated when a product option value is updated", async () => {
        const optionValue = await createOptionValue("Update Size")

        const emitSpy = jest.spyOn(eventBusService, "emit")

        await updateProductOptionValuesWorkflow(appContainer).run({
          input: {
            id: optionValue.id,
            update: { value: "Small" },
          },
          throwOnError: true,
        })

        expect(getEmittedEventNames(emitSpy)).toContain(
          ProductOptionValueWorkflowEvents.UPDATED
        )

        emitSpy.mockRestore()
      })

      it("should emit product-option-value.deleted when a product option value is deleted", async () => {
        const optionValue = await createOptionValue("Delete Size")

        const emitSpy = jest.spyOn(eventBusService, "emit")

        await deleteProductOptionValuesWorkflow(appContainer).run({
          input: { ids: [optionValue.id] },
          throwOnError: true,
        })

        expect(getEmittedEventNames(emitSpy)).toContain(
          ProductOptionValueWorkflowEvents.DELETED
        )

        emitSpy.mockRestore()
      })
    })
  },
})
