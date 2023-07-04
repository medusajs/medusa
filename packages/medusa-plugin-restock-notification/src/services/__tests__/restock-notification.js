import { MockManager, MockRepository } from "medusa-test-utils"
import RestockNotificationService from "../restock-notification"

describe("RestockNotificationService", () => {
  const RestockNotificationModel = MockRepository({
    findOne: (q) => {
      if (q.where.variant_id === "variant_1234") {
        return Promise.resolve({
          variant_id: "variant_1234",
          emails: ["test@tesmail.com"],
        })
      }
      if (q.where.variant_id === "variant_outofstock") {
        return Promise.resolve({
          variant_id: "variant_outofstock",
          emails: ["test@tesmail.com"],
        })
      }
      if (q.where.variant_id === "variant_low_inventory") {
        return Promise.resolve({
          variant_id: "variant_low_inventory",
          email: ["test@tesmail.com"],
        })
      }
      return Promise.resolve()
    },
  })

  const ProductVariantService = {
    retrieve: (id) => {
      if (id === "variant_instock") {
        return {
          id,
          inventory_quantity: 10,
        }
      }
      if (id === "variant_1234") {
        return {
          id,
          inventory_quantity: 10,
        }
      }
      if (id === "variant_low_inventory") {
        return {
          id,
          inventory_quantity: 2,
        }
      }

      return {
        id,
        inventory_quantity: 0,
      }
    },
  }

  const EventBusService = {
    emit: jest.fn(),
    withTransaction: function () {
      return this
    },
  }

  describe("retrieve", () => {
    const restockNotiService = new RestockNotificationService({
      manager: MockManager,
      productVariantService: ProductVariantService,
      restockNotificationModel: RestockNotificationModel,
      eventBusService: EventBusService,
    })

    it("successfully retrieves", async () => {
      jest.clearAllMocks()

      const result = await restockNotiService.retrieve("variant_1234")

      expect(result).toEqual({
        variant_id: "variant_1234",
        emails: ["test@tesmail.com"],
      })
    })

    it("successfully retrieves with empty response", async () => {
      jest.clearAllMocks()

      const result = await restockNotiService.retrieve("variant_non")

      expect(result).toEqual(undefined)
    })
  })

  describe("addEmail", () => {
    const restockNotiService = new RestockNotificationService({
      manager: MockManager,
      productVariantService: ProductVariantService,
      restockNotificationModel: RestockNotificationModel,
      eventBusService: EventBusService,
    })

    it("successfully adds email to non-existing noti", async () => {
      jest.clearAllMocks()

      await restockNotiService.addEmail("variant_test", "seb@med-test.com")

      expect(RestockNotificationModel.create).toHaveBeenCalledTimes(1)
      expect(RestockNotificationModel.create).toHaveBeenCalledWith({
        variant_id: "variant_test",
        emails: ["seb@med-test.com"],
      })

      expect(RestockNotificationModel.save).toHaveBeenCalledTimes(1)
    })

    it("successfully adds email to existing noti", async () => {
      jest.clearAllMocks()

      await restockNotiService.addEmail("variant_1234", "seb@med-test.com")

      expect(RestockNotificationModel.save).toHaveBeenCalledTimes(1)
      expect(RestockNotificationModel.save).toHaveBeenCalledWith({
        variant_id: "variant_1234",
        emails: ["test@tesmail.com", "seb@med-test.com"],
      })
    })

    it("fails to add if in stock", async () => {
      jest.clearAllMocks()

      await expect(
        restockNotiService.addEmail("variant_instock", "seb@med-test.com")
      ).rejects.toThrow(
        "You cannot sign up for restock notifications on a product that is not sold out"
      )
    })
  })

  describe("triggerRestock", () => {
    afterEach(() => {
      jest.useRealTimers()
    })

    it("trigger delay default to 0", async () => {
      const restockNotiService = new RestockNotificationService({
        manager: MockManager,
        productVariantService: ProductVariantService,
        restockNotificationModel: RestockNotificationModel,
        eventBusService: EventBusService,
      })

      restockNotiService.restockExecute = jest.fn()
      restockNotiService.triggerRestock("variant_test")
      expect(restockNotiService.restockExecute).toHaveBeenCalledTimes(1)
    })

    it("trigger delay 10", async () => {
      const restockNotiService = new RestockNotificationService(
        {
          manager: MockManager,
          productVariantService: ProductVariantService,
          restockNotificationModel: RestockNotificationModel,
          eventBusService: EventBusService,
        },
        { trigger_delay: 10 }
      )

      restockNotiService.restockExecute = jest.fn()

      restockNotiService.triggerRestock("variant_test")

      expect(EventBusService.emit).toHaveBeenCalledTimes(1)
      expect(EventBusService.emit).toHaveBeenCalledWith(
        "restock-notification.execute",
        { variant_id: "variant_test" },
        { delay: 10 }
      )
    })
  })

  describe("restockExecute", () => {
    const restockNotiService = new RestockNotificationService({
      manager: MockManager,
      productVariantService: ProductVariantService,
      restockNotificationModel: RestockNotificationModel,
      eventBusService: EventBusService,
    })

    it("non-existing noti does nothing", async () => {
      jest.clearAllMocks()

      await expect(restockNotiService.restockExecute("variant_test")).resolves
    })

    it("existing noti but out of stock does nothing", async () => {
      jest.clearAllMocks()

      await expect(restockNotiService.restockExecute("variant_outofstock"))
        .resolves
    })

    it("existing noti emits and deletes", async () => {
      jest.clearAllMocks()

      await restockNotiService.restockExecute("variant_1234")

      expect(EventBusService.emit).toHaveBeenCalledTimes(1)
      expect(EventBusService.emit).toHaveBeenCalledWith(
        "restock-notification.restocked",
        {
          variant_id: "variant_1234",
          emails: ["test@tesmail.com"],
        }
      )

      expect(RestockNotificationModel.delete).toHaveBeenCalledTimes(1)
      expect(RestockNotificationModel.delete).toHaveBeenCalledWith(
        "variant_1234"
      )
    })

    it("options inventory_required takes precedence if given", async () => {
      jest.clearAllMocks()
      const service = new RestockNotificationService(
        {
          manager: MockManager,
          productVariantService: ProductVariantService,
          restockNotificationModel: RestockNotificationModel,
          eventBusService: EventBusService,
        },
        { inventory_required: 5 }
      )

      await service.restockExecute("variant_1234")

      expect(EventBusService.emit).toHaveBeenCalledTimes(1)
      expect(EventBusService.emit).toHaveBeenCalledWith(
        "restock-notification.restocked",
        {
          variant_id: "variant_1234",
          emails: ["test@tesmail.com"],
        }
      )
      expect(RestockNotificationModel.delete).toHaveBeenCalledTimes(1)
      expect(RestockNotificationModel.delete).toHaveBeenCalledWith(
        "variant_1234"
      )
    })
    it("Inventory requires 5, wont emit when called with variant inventory 2", async () => {
      jest.clearAllMocks()
      const service = new RestockNotificationService(
        {
          manager: MockManager,
          productVariantService: ProductVariantService,
          restockNotificationModel: RestockNotificationModel,
          eventBusService: EventBusService,
        },
        { inventory_required: 5 }
      )

      await service.restockExecute("variant_low_inventory")

      expect(EventBusService.emit).toHaveBeenCalledTimes(0)
      expect(RestockNotificationModel.delete).toHaveBeenCalledTimes(0)
    })
  })
})
