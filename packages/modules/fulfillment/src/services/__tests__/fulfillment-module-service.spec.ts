import FulfillmentModuleService from "../fulfillment-module-service"

describe("FulfillmentModuleService", () => {
  describe("cancelFulfillment", () => {
    const createService = (
      fulfillment,
      Service: typeof FulfillmentModuleService = FulfillmentModuleService
    ) => {
      const fulfillmentService = {
        retrieve: jest.fn().mockResolvedValue(fulfillment),
        update: jest.fn().mockImplementation(async (data) => ({
          ...fulfillment,
          ...data,
        })),
      }
      const fulfillmentProviderService = {
        cancelFulfillment: jest.fn().mockResolvedValue({}),
      }
      const service = new Service(
        {
          fulfillmentService,
          fulfillmentProviderService,
          baseRepository: {
            getFreshManager: jest.fn().mockReturnValue({}),
            serialize: jest.fn().mockImplementation(async (data) => data),
          },
        } as any,
        {} as any
      )

      return { service, fulfillmentService, fulfillmentProviderService }
    }

    it.each(["shipped", "delivered"])(
      "should reject an already %s fulfillment by default",
      async (state) => {
        const { service, fulfillmentService, fulfillmentProviderService } =
          createService({ id: "ful_1", [`${state}_at`]: new Date() })

        await expect(service.cancelFulfillment("ful_1")).rejects.toThrow(
          `Fulfillment with id ful_1 already ${state}`
        )
        expect(
          fulfillmentProviderService.cancelFulfillment
        ).not.toHaveBeenCalled()
        expect(fulfillmentService.update).not.toHaveBeenCalled()
      }
    )

    it.each(["shipped", "delivered"])(
      "should allow a subclass to cancel an already %s fulfillment",
      async (state) => {
        class CustomFulfillmentService extends FulfillmentModuleService {
          static canCancelFulfillmentOrThrow = jest.fn(() => true)
        }

        const fulfillment = {
          id: "ful_1",
          provider_id: "custom-provider",
          data: { external_id: "external_1" },
          [`${state}_at`]: new Date(),
        }
        const { service, fulfillmentProviderService } = createService(
          fulfillment,
          CustomFulfillmentService
        )

        const result = await service.cancelFulfillment(fulfillment.id)

        expect(
          CustomFulfillmentService.canCancelFulfillmentOrThrow
        ).toHaveBeenCalledWith(fulfillment)
        expect(
          fulfillmentProviderService.cancelFulfillment
        ).toHaveBeenCalledWith(fulfillment.provider_id, fulfillment.data)
        expect(result.canceled_at).toEqual(expect.any(Date))
      }
    )

    it("should respect a subclass's custom cancellation restriction", async () => {
      class CustomFulfillmentService extends FulfillmentModuleService {
        protected static canCancelFulfillmentOrThrow(): boolean {
          throw new Error("Cancellation is disabled")
        }
      }

      const { service, fulfillmentService, fulfillmentProviderService } =
        createService({ id: "ful_1" }, CustomFulfillmentService)

      await expect(service.cancelFulfillment("ful_1")).rejects.toThrow(
        "Cancellation is disabled"
      )
      expect(
        fulfillmentProviderService.cancelFulfillment
      ).not.toHaveBeenCalled()
      expect(fulfillmentService.update).not.toHaveBeenCalled()
    })
  })
})
