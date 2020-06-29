import mongoose from "mongoose"
import { IdMap } from "medusa-test-utils"
import RegionService from "../region"
import { RegionModelMock } from "../../models/__mocks__/region"
import { PaymentProviderServiceMock } from "../__mocks__/payment-provider"
import { FulfillmentProviderServiceMock } from "../__mocks__/fulfillment-provider"
import { StoreServiceMock } from "../__mocks__/store"

describe("RegionService", () => {
  describe("create", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully creates a new region", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        storeService: StoreServiceMock,
      })

      await regionService.create({
        name: "Denmark",
        currency_code: "dkk",
        tax_rate: 0.25,
        countries: ["DK"],
      })

      expect(RegionModelMock.create).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.create).toHaveBeenCalledWith({
        name: "Denmark",
        currency_code: "DKK",
        tax_rate: 0.25,
        countries: ["DK"],
      })
    })

    it("create with payment/fulfillment providers", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        paymentProviderService: PaymentProviderServiceMock,
        fulfillmentProviderService: FulfillmentProviderServiceMock,
        storeService: StoreServiceMock,
      })

      await regionService.create({
        name: "Denmark",
        currency_code: "dkk",
        tax_rate: 0.25,
        countries: ["DK"],
        payment_providers: ["default_provider"],
        fulfillment_providers: ["default_provider"],
      })

      expect(PaymentProviderServiceMock.retrieveProvider).toHaveBeenCalledTimes(
        1
      )
      expect(PaymentProviderServiceMock.retrieveProvider).toHaveBeenCalledWith(
        "default_provider"
      )

      expect(
        FulfillmentProviderServiceMock.retrieveProvider
      ).toHaveBeenCalledTimes(1)
      expect(
        FulfillmentProviderServiceMock.retrieveProvider
      ).toHaveBeenCalledWith("default_provider")

      expect(RegionModelMock.create).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.create).toHaveBeenCalledWith({
        name: "Denmark",
        currency_code: "DKK",
        tax_rate: 0.25,
        countries: ["DK"],
        payment_providers: ["default_provider"],
        fulfillment_providers: ["default_provider"],
      })
    })
  })

  describe("retrieve", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully retrieves a region", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
      })

      await regionService.retrieve(IdMap.getId("region-se"))

      expect(RegionModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("region-se"),
      })
    })
  })

  describe("validateFields_", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("throws on invalid currency code", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        paymentProviderService: PaymentProviderServiceMock,
        fulfillmentProviderService: FulfillmentProviderServiceMock,
        storeService: StoreServiceMock,
      })

      await expect(
        regionService.validateFields_({ currency_code: "1cw" })
      ).rejects.toThrow("Invalid currency code")
    })

    it("throws on invalid country code", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        paymentProviderService: PaymentProviderServiceMock,
        fulfillmentProviderService: FulfillmentProviderServiceMock,
      })

      await expect(
        regionService.validateFields_({ countries: ["ddd"] })
      ).rejects.toThrow("Invalid country code")
    })

    it("throws on in use country code", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        paymentProviderService: PaymentProviderServiceMock,
        fulfillmentProviderService: FulfillmentProviderServiceMock,
      })

      await expect(
        regionService.validateFields_({ countries: ["se"] })
      ).rejects.toThrow(
        "Sweden already exists in Sweden, delete it in that region before adding it"
      )
    })

    it("throws on invalid tax_rate", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        paymentProviderService: PaymentProviderServiceMock,
        fulfillmentProviderService: FulfillmentProviderServiceMock,
      })

      await expect(
        regionService.validateFields_({ tax_rate: 12 })
      ).rejects.toThrow("The tax_rate must be between 0 and 1")
    })

    it("throws on metadata", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        paymentProviderService: PaymentProviderServiceMock,
        fulfillmentProviderService: FulfillmentProviderServiceMock,
      })

      await expect(
        regionService.validateFields_({ metadata: { key: "Valie" } })
      ).rejects.toThrow("Please use setMetadata")
    })

    it("throws on unknown payment providers", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        paymentProviderService: PaymentProviderServiceMock,
        fulfillmentProviderService: FulfillmentProviderServiceMock,
      })

      await expect(
        regionService.validateFields_({ payment_providers: ["hi"] })
      ).rejects.toThrow("Provider Not Found")
    })

    it("throws on unknown fulfillment providers", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        paymentProviderService: PaymentProviderServiceMock,
        fulfillmentProviderService: FulfillmentProviderServiceMock,
      })

      await expect(
        regionService.validateFields_({ fulfillment_providers: ["hi"] })
      ).rejects.toThrow("Provider Not Found")
    })
  })

  describe("update", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully updates a region", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        paymentProviderService: PaymentProviderServiceMock,
        fulfillmentProviderService: FulfillmentProviderServiceMock,
        storeService: StoreServiceMock,
      })

      await regionService.update(IdMap.getId("region-se"), {
        name: "New Name",
        currency_code: "gbp",
        tax_rate: 0.25,
        countries: ["DK", "se"],
        payment_providers: ["default_provider"],
        fulfillment_providers: ["default_provider"],
      })

      expect(PaymentProviderServiceMock.retrieveProvider).toHaveBeenCalledTimes(
        1
      )
      expect(PaymentProviderServiceMock.retrieveProvider).toHaveBeenCalledWith(
        "default_provider"
      )

      expect(
        FulfillmentProviderServiceMock.retrieveProvider
      ).toHaveBeenCalledTimes(1)
      expect(
        FulfillmentProviderServiceMock.retrieveProvider
      ).toHaveBeenCalledWith("default_provider")

      expect(RegionModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("region-se"),
        },
        {
          $set: {
            name: "New Name",
            currency_code: "GBP",
            tax_rate: 0.25,
            countries: ["DK", "SE"],
            payment_providers: ["default_provider"],
            fulfillment_providers: ["default_provider"],
          },
        }
      )
    })
  })

  describe("delete", () => {
    beforeAll(() => {
      jest.clearAllMocks()
    })

    it("successfully deletes", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
      })

      await regionService.delete(IdMap.getId("region-se"))

      expect(RegionModelMock.deleteOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.deleteOne).toHaveBeenCalledWith({
        _id: IdMap.getId("region-se"),
      })
    })
  })

  describe("addCountry", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully adds to the countries array", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
      })

      await regionService.addCountry(IdMap.getId("region-se"), "dk")

      expect(RegionModelMock.findOne).toHaveBeenCalledTimes(2)
      expect(RegionModelMock.findOne).toHaveBeenCalledWith({
        countries: "DK",
      })
      expect(RegionModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("region-se"),
      })

      expect(RegionModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("region-se"),
        },
        {
          $push: { countries: "DK" },
        }
      )
    })

    it("resolves if exists", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
      })

      await regionService.addCountry(IdMap.getId("region-se"), "SE")

      expect(RegionModelMock.findOne).toHaveBeenCalledTimes(2)
      expect(RegionModelMock.findOne).toHaveBeenCalledWith({
        countries: "SE",
      })
      expect(RegionModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("region-se"),
      })

      expect(RegionModelMock.updateOne).toHaveBeenCalledTimes(0)
    })
  })

  describe("removeCountry", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully removes country", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
      })

      await regionService.removeCountry(IdMap.getId("region-se"), "dk")

      expect(RegionModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("region-se"),
        },
        {
          $pull: { countries: "DK" },
        }
      )
    })
  })

  describe("addPaymentProvider", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully adds to the countries array", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        paymentProviderService: PaymentProviderServiceMock,
      })

      await regionService.addPaymentProvider(
        IdMap.getId("region-se"),
        "default_provider"
      )

      expect(RegionModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("region-se"),
      })

      expect(PaymentProviderServiceMock.retrieveProvider).toHaveBeenCalledTimes(
        1
      )
      expect(PaymentProviderServiceMock.retrieveProvider).toHaveBeenCalledWith(
        "default_provider"
      )

      expect(RegionModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("region-se"),
        },
        {
          $push: { payment_providers: "default_provider" },
        }
      )
    })

    it("resolves if exists", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        paymentProviderService: PaymentProviderServiceMock,
      })

      await regionService.addPaymentProvider(
        IdMap.getId("region-se"),
        "sweden_provider"
      )

      expect(RegionModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("region-se"),
      })

      expect(RegionModelMock.updateOne).toHaveBeenCalledTimes(0)
    })
  })

  describe("addFulfillmentProvider", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully adds to the fulfillment_provider array", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        fulfillmentProviderService: FulfillmentProviderServiceMock,
      })

      await regionService.addFulfillmentProvider(
        IdMap.getId("region-se"),
        "default_provider"
      )

      expect(RegionModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("region-se"),
      })

      expect(
        FulfillmentProviderServiceMock.retrieveProvider
      ).toHaveBeenCalledTimes(1)
      expect(
        FulfillmentProviderServiceMock.retrieveProvider
      ).toHaveBeenCalledWith("default_provider")

      expect(RegionModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("region-se"),
        },
        {
          $push: { fulfillment_providers: "default_provider" },
        }
      )
    })

    it("resolves if exists", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
        fulfillmentProviderService: FulfillmentProviderServiceMock,
      })

      await regionService.addFulfillmentProvider(
        IdMap.getId("region-se"),
        "sweden_provider"
      )

      expect(RegionModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("region-se"),
      })

      expect(RegionModelMock.updateOne).toHaveBeenCalledTimes(0)
    })
  })

  describe("removePaymentProvider", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("removes payment provider", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
      })

      await regionService.removePaymentProvider(
        IdMap.getId("region-se"),
        "sweden_provider"
      )

      expect(RegionModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("region-se"),
      })

      expect(RegionModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("region-se"),
        },
        {
          $pull: { payment_providers: "sweden_provider" },
        }
      )
    })
  })

  describe("removeFulfillmentProvider", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("removes fulfillment provider", async () => {
      const regionService = new RegionService({
        regionModel: RegionModelMock,
      })

      await regionService.removeFulfillmentProvider(
        IdMap.getId("region-se"),
        "sweden_provider"
      )

      expect(RegionModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("region-se"),
      })

      expect(RegionModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(RegionModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("region-se"),
        },
        {
          $pull: { fulfillment_providers: "sweden_provider" },
        }
      )
    })
  })
})
