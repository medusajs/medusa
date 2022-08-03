import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import RegionService from "../region"
import {
  EventBusService,
  FulfillmentProviderService,
  PaymentProviderService,
  StoreService,
} from "../index"
import { CreateRegionInput } from "../../types/region"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function () {
    return this
  },
} as unknown as EventBusService

describe("RegionService", () => {
  const regionRepository = MockRepository({})

  const ppRepository = MockRepository({
    findOne: (query) => {
      if (query.where.id === "should_fail") {
        return Promise.resolve(undefined)
      }
      return Promise.resolve({
        id: "default_provider",
      })
    },
  })
  const fpRepository = MockRepository({
    findOne: (query) => {
      if (query.where.id === "should_fail") {
        return Promise.resolve(undefined)
      }
      return Promise.resolve({
        id: "default_provider",
      })
    },
  })
  const countryRepository = MockRepository({
    findOne: (query) => {
      if (query.where.iso_2 === "dk") {
        return Promise.resolve({
          id: IdMap.getId("dk"),
          name: "Denmark",
          display_name: "Denmark",
          region_id: IdMap.getId("dk-reg"),
        })
      }
      return Promise.resolve({
        id: IdMap.getId("test-country"),
        name: "World",
      })
    },
  })

  const currencyRepository = MockRepository({
    findOne: () => Promise.resolve({ code: "usd" }),
  })

  const storeService = {
    withTransaction: function () {
      return this
    },
    retrieve: () => {
      return {
        id: IdMap.getId("test-store"),
        currencies: [{ code: "dkk" }, { code: "usd" }, { code: "eur" }],
      }
    },
  } as unknown as StoreService

  const taxProviderRepository = MockRepository({})

  const fulfillmentProviderService = {} as FulfillmentProviderService

  const paymentProviderService = {} as PaymentProviderService

  describe("create", () => {
    const regionService = new RegionService({
      manager: MockManager,
      eventBusService,
      fulfillmentProviderRepository: fpRepository,
      paymentProviderRepository: ppRepository,
      currencyRepository,
      regionRepository,
      countryRepository,
      storeService,
      fulfillmentProviderService,
      taxProviderRepository,
      paymentProviderService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully creates a new region", async () => {
      await regionService.create({
        name: "World",
        currency_code: "USD",
        tax_rate: 0.25,
        countries: ["US"],
      } as CreateRegionInput)

      expect(regionRepository.create).toHaveBeenCalledTimes(1)
      expect(regionRepository.create).toHaveBeenCalledWith({
        name: "World",
        currency_code: "usd",
        currency: {
          code: "usd",
        },
        tax_rate: 0.25,
        countries: [{ id: IdMap.getId("test-country"), name: "World" }],
      })
    })

    it("throws if country already is in region", async () => {
      try {
        await regionService.create({
          name: "World",
          currency_code: "EUR",
          tax_rate: 0.25,
          countries: ["DK"],
        } as CreateRegionInput)
      } catch (error) {
        expect(error.message).toBe(
          `Denmark already exists in region ${IdMap.getId("dk-reg")}`
        )
      }
    })

    it("successfully creates with payment- and fulfillmentproviders", async () => {
      await regionService.create({
        name: "World",
        currency_code: "usd",
        tax_rate: 0.25,
        countries: ["US"],
        payment_providers: ["default_provider"],
        fulfillment_providers: ["default_provider"],
      })

      expect(ppRepository.findOne).toHaveBeenCalledTimes(1)
      expect(fpRepository.findOne).toHaveBeenCalledTimes(1)

      expect(regionRepository.create).toHaveBeenCalledTimes(1)
      expect(regionRepository.create).toHaveBeenCalledWith({
        name: "World",
        tax_rate: 0.25,
        currency_code: "usd",
        currency: {
          code: "usd",
        },
        countries: [{ id: IdMap.getId("test-country"), name: "World" }],
        payment_providers: [{ id: "default_provider" }],
        fulfillment_providers: [{ id: "default_provider" }],
      })
    })

    it("throws on invalid payment provider", async () => {
      try {
        await regionService.create({
          name: "World",
          currency_code: "EUR",
          tax_rate: 0.25,
          countries: ["US"],
          payment_providers: ["should_fail"],
        } as CreateRegionInput)
      } catch (error) {
        expect(error.message).toBe("Payment provider not found")
      }
    })

    it("throws on invalid fulfillment provider", async () => {
      try {
        await regionService.create({
          name: "World",
          currency_code: "EUR",
          tax_rate: 0.25,
          countries: ["US"],
          fulfillment_providers: ["should_fail"],
        } as CreateRegionInput)
      } catch (error) {
        expect(error.message).toBe("Fulfillment provider not found")
      }
    })
  })

  describe("retrieve", () => {
    const regionService = new RegionService({
      manager: MockManager,
      eventBusService,
      regionRepository,
      fulfillmentProviderService,
      taxProviderRepository,
      paymentProviderService,
      fulfillmentProviderRepository: fpRepository,
      paymentProviderRepository: ppRepository,
      currencyRepository,
      countryRepository,
      storeService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully retrieves a region", async () => {
      await regionService.retrieve(IdMap.getId("region"))

      expect(regionRepository.findOne).toHaveBeenCalledTimes(1)
      expect(regionRepository.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("region") },
      })
    })
  })

  describe("validateFields_", () => {
    const regionService = new RegionService({
      manager: MockManager,
      eventBusService,
      regionRepository,
      fulfillmentProviderService,
      taxProviderRepository,
      paymentProviderService,
      fulfillmentProviderRepository: fpRepository,
      paymentProviderRepository: ppRepository,
      currencyRepository,
      countryRepository,
      storeService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("throws on invalid country code", async () => {
      await expect(
        regionService.validateFields_({
          countries: ["ddd"],
        } as CreateRegionInput)
      ).rejects.toThrow("Invalid country code")
    })

    it("throws on in use country code", async () => {
      await expect(
        regionService.validateFields_({
          countries: ["DK"],
        } as CreateRegionInput)
      ).rejects.toThrow(
        `Denmark already exists in region ${IdMap.getId("dk-reg")}`
      )
    })

    it("throws on unknown payment providers", async () => {
      await expect(
        regionService.validateFields_({
          payment_providers: ["should_fail"],
        } as CreateRegionInput)
      ).rejects.toThrow("Payment provider not found")
    })

    it("throws on unknown fulfillment providers", async () => {
      await expect(
        regionService.validateFields_({
          fulfillment_providers: ["should_fail"],
        } as CreateRegionInput)
      ).rejects.toThrow("Fulfillment provider not found")
    })
  })

  describe("update", () => {
    const regionRepository = MockRepository({
      findOne: () => Promise.resolve({ id: IdMap.getId("test-region") }),
    })

    const regionService = new RegionService({
      manager: MockManager,
      eventBusService,
      regionRepository,
      fulfillmentProviderService,
      taxProviderRepository,
      paymentProviderService,
      fulfillmentProviderRepository: fpRepository,
      paymentProviderRepository: ppRepository,
      currencyRepository,
      countryRepository,
      storeService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully updates a region", async () => {
      await regionService.update(IdMap.getId("test-region"), {
        name: "New Name",
        currency_code: "eur",
        tax_rate: 0.25,
        countries: ["US"],
        payment_providers: ["default_provider"],
        fulfillment_providers: ["default_provider"],
      })

      expect(ppRepository.findOne).toHaveBeenCalledTimes(1)
      expect(fpRepository.findOne).toHaveBeenCalledTimes(1)

      expect(regionRepository.save).toHaveBeenCalledTimes(1)
      expect(regionRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("test-region"),
        name: "New Name",
        currency_code: "eur",
        tax_rate: 0.25,
        countries: [{ id: IdMap.getId("test-country"), name: "World" }],
        payment_providers: [{ id: "default_provider" }],
        fulfillment_providers: [{ id: "default_provider" }],
      })
    })
  })

  describe("delete", () => {
    const regionRepository = MockRepository({
      findOne: () =>
        Promise.resolve({
          id: IdMap.getId("region"),
          countries: [{ id: "us" }],
        }),
    })
    const countryRepository = MockRepository({
      findOne: () => Promise.resolve(),
    })

    const regionService = new RegionService({
      manager: MockManager,
      eventBusService,
      regionRepository,
      fulfillmentProviderService,
      taxProviderRepository,
      paymentProviderService,
      fulfillmentProviderRepository: fpRepository,
      paymentProviderRepository: ppRepository,
      currencyRepository,
      countryRepository,
      storeService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully deletes", async () => {
      await regionService.delete(IdMap.getId("region"))

      expect(regionRepository.softRemove).toHaveBeenCalledTimes(1)
      expect(regionRepository.softRemove).toHaveBeenCalledWith({
        id: IdMap.getId("region"),
        countries: [{ id: "us" }],
      })
    })
  })

  describe("addCountry", () => {
    const regionRepository = MockRepository({
      findOne: (query) => {
        if (query.where.id === IdMap.getId("region-with-country")) {
          return Promise.resolve({
            id: IdMap.getId("region-with-country"),
            countries: [
              { id: IdMap.getId("dk"), name: "Denmark", iso_2: "DK" },
            ],
          })
        }
        return Promise.resolve({ id: IdMap.getId("region") })
      },
    })
    const countryRepository = MockRepository({
      findOne: (query) => {
        if (query.where.iso_2 === "dk") {
          return Promise.resolve({
            id: IdMap.getId("dk"),
            name: "Denmark",
            iso_2: "DK",
          })
        }
        return Promise.resolve({
          id: IdMap.getId("test-country"),
          name: "World",
        })
      },
    })

    const regionService = new RegionService({
      manager: MockManager,
      eventBusService,
      regionRepository,
      fulfillmentProviderService,
      taxProviderRepository,
      paymentProviderService,
      fulfillmentProviderRepository: fpRepository,
      paymentProviderRepository: ppRepository,
      currencyRepository,
      countryRepository,
      storeService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully adds to the countries array", async () => {
      await regionService.addCountry(IdMap.getId("region"), "us")

      expect(regionRepository.findOne).toHaveBeenCalledTimes(1)
      expect(regionRepository.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("region") },
        relations: ["countries"],
      })

      expect(regionRepository.save).toHaveBeenCalledTimes(1)
      expect(regionRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("region"),
        countries: [{ id: IdMap.getId("test-country"), name: "World" }],
      })
    })

    it("resolves if exists", async () => {
      await regionService.addCountry(IdMap.getId("region-with-country"), "DK")

      expect(regionRepository.findOne).toHaveBeenCalledTimes(1)
      expect(regionRepository.save).toHaveBeenCalledTimes(0)
    })
  })

  describe("removeCountry", () => {
    const regionRepository = MockRepository({
      findOne: (query) => {
        return Promise.resolve({
          id: IdMap.getId("region"),
          countries: [{ id: IdMap.getId("dk"), name: "Denmark", iso_2: "dk" }],
        })
      },
    })

    const regionService = new RegionService({
      manager: MockManager,
      eventBusService,
      regionRepository,
    } as any)

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully removes country", async () => {
      await regionService.removeCountry(IdMap.getId("region"), "dk")

      expect(regionRepository.save).toHaveBeenCalledTimes(1)
      expect(regionRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("region"),
        countries: [],
      })
    })
  })

  describe("addPaymentProvider", () => {
    const regionRepository = MockRepository({
      findOne: () =>
        Promise.resolve({
          id: IdMap.getId("region"),
          payment_providers: [{ id: "sweden_provider" }],
        }),
    })

    const regionService = new RegionService({
      manager: MockManager,
      eventBusService,
      regionRepository,
      fulfillmentProviderService,
      taxProviderRepository,
      paymentProviderService,
      fulfillmentProviderRepository: fpRepository,
      paymentProviderRepository: ppRepository,
      currencyRepository,
      countryRepository,
      storeService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully adds payment provider", async () => {
      await regionService.addPaymentProvider(
        IdMap.getId("region"),
        "default_provider"
      )

      expect(regionRepository.findOne).toHaveBeenCalledTimes(1)
      expect(ppRepository.findOne).toHaveBeenCalledTimes(1)

      expect(regionRepository.save).toHaveBeenCalledTimes(1)
      expect(regionRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("region"),
        payment_providers: [
          { id: "sweden_provider" },
          { id: "default_provider" },
        ],
      })
    })

    it("resolves if exists", async () => {
      await regionService.addPaymentProvider(
        IdMap.getId("region"),
        "sweden_provider"
      )

      expect(regionRepository.findOne).toHaveBeenCalledTimes(1)
      expect(regionRepository.save).toHaveBeenCalledTimes(0)
    })
  })

  describe("addFulfillmentProvider", () => {
    const regionRepository = MockRepository({
      findOne: () =>
        Promise.resolve({
          id: IdMap.getId("region"),
          fulfillment_providers: [{ id: "sweden_provider" }],
        }),
    })
    const fpRepository = MockRepository({
      findOne: (query) => {
        if (query.where.id === "should_fail") {
          return Promise.resolve(undefined)
        }
        return Promise.resolve({
          id: "default_provider",
        })
      },
    })

    const regionService = new RegionService({
      manager: MockManager,
      eventBusService,
      regionRepository,
      fulfillmentProviderService,
      taxProviderRepository,
      paymentProviderService,
      fulfillmentProviderRepository: fpRepository,
      paymentProviderRepository: ppRepository,
      currencyRepository,
      countryRepository,
      storeService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully adds payment provider", async () => {
      await regionService.addFulfillmentProvider(
        IdMap.getId("region"),
        "default_provider"
      )

      expect(regionRepository.findOne).toHaveBeenCalledTimes(1)
      expect(fpRepository.findOne).toHaveBeenCalledTimes(1)

      expect(regionRepository.save).toHaveBeenCalledTimes(1)
      expect(regionRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("region"),
        fulfillment_providers: [
          { id: "sweden_provider" },
          { id: "default_provider" },
        ],
      })
    })

    it("resolves if exists", async () => {
      await regionService.addFulfillmentProvider(
        IdMap.getId("region"),
        "sweden_provider"
      )

      expect(regionRepository.findOne).toHaveBeenCalledTimes(1)
      expect(regionRepository.save).toHaveBeenCalledTimes(0)
    })
  })

  describe("removePaymentProvider", () => {
    const regionRepository = MockRepository({
      findOne: () =>
        Promise.resolve({
          id: IdMap.getId("region"),
          payment_providers: [{ id: "sweden_provider" }],
        }),
    })

    const regionService = new RegionService({
      manager: MockManager,
      eventBusService,
      regionRepository,
    } as any)

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("removes payment provider", async () => {
      await regionService.removePaymentProvider(
        IdMap.getId("region"),
        "sweden_provider"
      )

      expect(regionRepository.findOne).toHaveBeenCalledTimes(1)

      expect(regionRepository.save).toHaveBeenCalledTimes(1)
      expect(regionRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("region"),
        payment_providers: [],
      })
    })
  })

  describe("removeFulfillmentProvider", () => {
    const regionRepository = MockRepository({
      findOne: () =>
        Promise.resolve({
          id: IdMap.getId("region"),
          fulfillment_providers: [{ id: "sweden_provider" }],
        }),
    })

    const regionService = new RegionService({
      manager: MockManager,
      eventBusService,
      regionRepository,
    } as any)

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("removes payment provider", async () => {
      await regionService.removeFulfillmentProvider(
        IdMap.getId("region"),
        "sweden_provider"
      )

      expect(regionRepository.findOne).toHaveBeenCalledTimes(1)

      expect(regionRepository.save).toHaveBeenCalledTimes(1)
      expect(regionRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("region"),
        fulfillment_providers: [],
      })
    })
  })
})
