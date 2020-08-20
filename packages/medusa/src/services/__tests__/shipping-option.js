import mongoose from "mongoose"
import { IdMap } from "medusa-test-utils"
import ShippingOptionService from "../shipping-option"
import { ShippingOptionModelMock } from "../../models/__mocks__/shipping-option"
import { RegionServiceMock, regions } from "../__mocks__/region"
import { TotalsServiceMock } from "../__mocks__/totals"
import {
  FulfillmentProviderServiceMock,
  DefaultProviderMock,
} from "../__mocks__/fulfillment-provider"

describe("ShippingOptionService", () => {
  describe("retrieve", () => {
    describe("successfully get profile", () => {
      let res
      beforeAll(async () => {
        const optionService = new ShippingOptionService({
          shippingOptionModel: ShippingOptionModelMock,
        })

        res = await optionService.retrieve(IdMap.getId("validId"))
      })

      afterAll(() => {
        jest.clearAllMocks()
      })

      it("calls model layer findOne", () => {
        expect(ShippingOptionModelMock.findOne).toHaveBeenCalledTimes(1)
        expect(ShippingOptionModelMock.findOne).toHaveBeenCalledWith({
          _id: IdMap.getId("validId"),
        })
      })

      it("returns correct product", () => {
        expect(res.name).toEqual("Default Option")
      })
    })

    describe("query fail", () => {
      let res
      beforeAll(async () => {
        const optionService = new ShippingOptionService({
          shippingOptionModel: ShippingOptionModelMock,
        })

        await optionService.retrieve(IdMap.getId("failId")).catch(err => {
          res = err
        })
      })

      afterAll(() => {
        jest.clearAllMocks()
      })

      it("calls model layer findOne", () => {
        expect(ShippingOptionModelMock.findOne).toHaveBeenCalledTimes(1)
        expect(ShippingOptionModelMock.findOne).toHaveBeenCalledWith({
          _id: IdMap.getId("failId"),
        })
      })

      it("model query throws error", () => {
        expect(res.name).toEqual("not_found")
      })
    })
  })

  describe("setMetadata", () => {
    const optionService = new ShippingOptionService({
      shippingOptionModel: ShippingOptionModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = mongoose.Types.ObjectId()
      await optionService.setMetadata(`${id}`, "metadata", "testMetadata")

      expect(ShippingOptionModelMock.updateOne).toBeCalledTimes(1)
      expect(ShippingOptionModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { "metadata.metadata": "testMetadata" } }
      )
    })

    it("throw error on invalid key type", async () => {
      const id = mongoose.Types.ObjectId()

      expect(() => optionService.setMetadata(`${id}`, 1234, "nono")).toThrow(
        "Key type is invalid. Metadata keys must be strings"
      )
    })

    it("throws error on invalid optionId type", async () => {
      expect(() =>
        optionService.setMetadata("fakeProfileId", 1234, "nono")
      ).toThrow("The shippingOptionId could not be casted to an ObjectId")
    })
  })

  describe("update", () => {
    const optionService = new ShippingOptionService({
      shippingOptionModel: ShippingOptionModelMock,
      fulfillmentProviderService: FulfillmentProviderServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = IdMap.getId("validId")

      await optionService.update(`${id}`, { name: "new title" })

      expect(ShippingOptionModelMock.updateOne).toBeCalledTimes(1)
      expect(ShippingOptionModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { name: "new title" } },
        { runValidators: true }
      )
    })

    it("sets requirements", async () => {
      const requirements = [
        {
          type: "min_subtotal",
          value: 1,
        },
      ]

      await optionService.update(IdMap.getId("validId"), { requirements })

      expect(ShippingOptionModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(ShippingOptionModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("validId") },
        { $set: { requirements } },
        { runValidators: true }
      )
    })

    it("fails on invalid req", async () => {
      const requirements = [
        {
          type: "_",
          value: 2,
        },
        {
          type: "min_subtotal",
          value: 1,
        },
      ]

      await expect(
        optionService.update(IdMap.getId("validId"), { requirements })
      ).rejects.toThrow(
        "Requirement type must be one of min_subtotal, max_subtotal"
      )
    })

    it("fails on duplicate reqs", async () => {
      const requirements = [
        {
          type: "min_subtotal",
          value: 2,
        },
        {
          type: "min_subtotal",
          value: 1,
        },
      ]

      await expect(
        optionService.update(IdMap.getId("validId"), { requirements })
      ).rejects.toThrow("Only one requirement of each type is allowed")
    })

    it("sets flat rate price", async () => {
      await optionService.update(IdMap.getId("validId"), {
        price: {
          type: "flat_rate",
          amount: 100,
        },
      })

      expect(ShippingOptionModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(ShippingOptionModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("validId"),
      })

      expect(ShippingOptionModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(ShippingOptionModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("validId") },
        { $set: { price: { type: "flat_rate", amount: 100 } } },
        { runValidators: true }
      )
    })

    it("sets calculated price", async () => {
      await optionService.update(IdMap.getId("validId"), {
        price: {
          type: "calculated",
        },
      })

      expect(ShippingOptionModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(ShippingOptionModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("validId"),
      })

      expect(DefaultProviderMock.canCalculate).toHaveBeenCalledTimes(1)
      expect(DefaultProviderMock.canCalculate).toHaveBeenCalledWith({
        id: "bonjour",
      })

      expect(ShippingOptionModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(ShippingOptionModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("validId") },
        { $set: { price: { type: "calculated" } } },
        { runValidators: true }
      )
    })

    it("fails on invalid type", async () => {
      await expect(
        optionService.update(IdMap.getId("validId"), {
          price: {
            type: "non",
          },
        })
      ).rejects.toThrow("The price must be of type flat_rate or calculated")
    })

    it("fails if provider cannot calculate", async () => {
      await expect(
        optionService.update(IdMap.getId("noCalc"), {
          price: {
            type: "calculated",
          },
        })
      ).rejects.toThrow(
        "The fulfillment provider cannot calculate prices for this option"
      )
    })

    it("throw error on invalid shipping id type", async () => {
      await expect(
        optionService.update(19314235, { name: "new title" })
      ).rejects.toThrow(
        "The shippingOptionId could not be casted to an ObjectId"
      )
    })

    it("throws error when trying to update metadata", async () => {
      const id = IdMap.getId("validId")
      await expect(
        optionService.update(`${id}`, { metadata: { key: "value" } })
      ).rejects.toThrow("Use setMetadata to update metadata fields")
    })

    it("throws error when trying to update region_id", async () => {
      const id = IdMap.getId("validId")
      await expect(
        optionService.update(`${id}`, { region_id: "id" })
      ).rejects.toThrow("Region and Provider cannot be updated after creation")
    })

    it("throws error when trying to update region_id", async () => {
      const id = IdMap.getId("validId")
      await expect(
        optionService.update(`${id}`, { region_id: "id" })
      ).rejects.toThrow("Region and Provider cannot be updated after creation")
    })

    it("throws error when trying to update provider_id", async () => {
      const id = IdMap.getId("validId")
      await expect(
        optionService.update(`${id}`, { provider_id: "id" })
      ).rejects.toThrow("Region and Provider cannot be updated after creation")
    })
  })

  describe("delete", () => {
    const optionService = new ShippingOptionService({
      shippingOptionModel: ShippingOptionModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("deletes the option successfully", async () => {
      await optionService.delete(IdMap.getId("validId"))

      expect(ShippingOptionModelMock.deleteOne).toBeCalledTimes(1)
      expect(ShippingOptionModelMock.deleteOne).toBeCalledWith({
        _id: IdMap.getId("validId"),
      })
    })

    it("is idempotent", async () => {
      await optionService.delete(IdMap.getId("delete"))

      expect(ShippingOptionModelMock.deleteOne).toBeCalledTimes(0)
    })
  })

  describe("addRequirement", () => {
    const optionService = new ShippingOptionService({
      shippingOptionModel: ShippingOptionModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("add product to profile successfully", async () => {
      await optionService.addRequirement(IdMap.getId("validId"), {
        type: "max_subtotal",
        value: 10,
      })

      expect(ShippingOptionModelMock.findOne).toBeCalledTimes(1)
      expect(ShippingOptionModelMock.findOne).toBeCalledWith({
        _id: IdMap.getId("validId"),
      })

      expect(ShippingOptionModelMock.updateOne).toBeCalledTimes(1)
      expect(ShippingOptionModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("validId") },
        {
          $push: {
            requirements: {
              type: "max_subtotal",
              value: 10,
            },
          },
        }
      )
    })

    it("fails if type exists", async () => {
      await expect(
        optionService.addRequirement(IdMap.getId("validId"), {
          type: "min_subtotal",
          value: 100,
        })
      ).rejects.toThrow("A requirement with type: min_subtotal already exists")

      expect(ShippingOptionModelMock.updateOne).toBeCalledTimes(0)
    })
  })

  describe("removeRequirement", () => {
    const optionService = new ShippingOptionService({
      shippingOptionModel: ShippingOptionModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("remove requirement successfully", async () => {
      await optionService.removeRequirement(
        IdMap.getId("validId"),
        "requirement_id"
      )

      expect(ShippingOptionModelMock.findOne).toBeCalledTimes(1)
      expect(ShippingOptionModelMock.findOne).toBeCalledWith({
        _id: IdMap.getId("validId"),
      })

      expect(ShippingOptionModelMock.updateOne).toBeCalledTimes(1)
      expect(ShippingOptionModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("validId") },
        { $pull: { requirements: { _id: "requirement_id" } } }
      )
    })

    it("is idempotent", async () => {
      await optionService.removeRequirement(IdMap.getId("validId"), "something")

      expect(ShippingOptionModelMock.findOne).toBeCalledTimes(1)
      expect(ShippingOptionModelMock.findOne).toBeCalledWith({
        _id: IdMap.getId("validId"),
      })

      expect(ShippingOptionModelMock.updateOne).toBeCalledTimes(0)
    })
  })

  describe("create", () => {
    const optionService = new ShippingOptionService({
      shippingOptionModel: ShippingOptionModelMock,
      fulfillmentProviderService: FulfillmentProviderServiceMock,
      regionService: RegionServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("creates a shipping option", async () => {
      const option = {
        name: "Test Option",
        provider_id: "default_provider",
        data: {
          id: "new",
        },
        region_id: IdMap.getId("region-france"),
        requirements: [
          {
            type: "min_subtotal",
            value: 1,
          },
        ],
        price: {
          type: "flat_rate",
          amount: 13,
        },
      }

      await optionService.create(option)

      expect(RegionServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(RegionServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("region-france")
      )

      expect(
        FulfillmentProviderServiceMock.retrieveProvider
      ).toHaveBeenCalledTimes(1)
      expect(
        FulfillmentProviderServiceMock.retrieveProvider
      ).toHaveBeenCalledWith("default_provider")

      expect(DefaultProviderMock.validateOption).toHaveBeenCalledTimes(1)
      expect(DefaultProviderMock.validateOption).toHaveBeenCalledWith({
        id: "new",
      })

      expect(ShippingOptionModelMock.create).toHaveBeenCalledTimes(1)
      expect(ShippingOptionModelMock.create).toHaveBeenCalledWith(option)
    })

    it("fails if region doesn't have fulfillment provider", async () => {
      const option = {
        name: "Test Option",
        provider_id: "testshipper",
        data: {
          id: "new",
        },
        region_id: IdMap.getId("region-france"),
        requirements: [
          {
            type: "min_subtotal",
            value: 1,
          },
        ],
        price: {
          type: "flat_rate",
          amount: 13,
        },
      }

      await expect(optionService.create(option)).rejects.toThrow(
        "The fulfillment provider is not available in the provided region"
      )
    })

    it("fails if fulfillment provider cannot validate", async () => {
      const option = {
        name: "Test Option",
        provider_id: "default_provider",
        data: {
          id: "bno",
        },
        region_id: IdMap.getId("region-france"),
        price: {
          type: "flat_rate",
          amount: 13,
        },
      }

      await expect(optionService.create(option)).rejects.toThrow(
        "The fulfillment provider cannot validate the shipping option"
      )
    })

    it("fails if requirement is not validated", async () => {
      const option = {
        name: "Test Option",
        provider_id: "default_provider",
        data: {
          id: "new",
        },
        requirements: [
          {
            type: "_subtotal",
            value: 100,
          },
        ],
        region_id: IdMap.getId("region-france"),
        price: {
          type: "flat_rate",
          amount: 13,
        },
      }

      await expect(optionService.create(option)).rejects.toThrow(
        "Requirement type must be one of min_subtotal, max_subtotal"
      )
    })

    it("fails if price is not validated", async () => {
      const option = {
        name: "Test Option",
        provider_id: "default_provider",
        data: {
          id: "new",
        },
        region_id: IdMap.getId("region-france"),
        price: {
          type: "nonon",
          amount: 13,
        },
      }

      await expect(optionService.create(option)).rejects.toThrow(
        "The price must be of type flat_rate or calculated"
      )
    })
  })

  describe("setRequirements", () => {
    const optionService = new ShippingOptionService({
      shippingOptionModel: ShippingOptionModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })
  })

  describe("validateCartOption", () => {
    const optionService = new ShippingOptionService({
      shippingOptionModel: ShippingOptionModelMock,
      totalsService: TotalsServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("validates", async () => {
      const cart = {
        region_id: IdMap.getId("fr-region"),
        subtotal: 400,
      }

      const res = await optionService.validateCartOption(
        IdMap.getId("validId"),
        cart
      )

      expect(res).toEqual({
        _id: IdMap.getId("validId"),
        name: "Default Option",
        region_id: IdMap.getId("fr-region"),
        provider_id: "default_provider",
        data: {
          id: "bonjour",
        },
        requirements: [
          {
            _id: "requirement_id",
            type: "min_subtotal",
            value: 100,
          },
        ],
        price: 10,
      })
    })

    it("fails on invalid req", async () => {
      const cart = {
        region_id: IdMap.getId("nomatch"),
      }

      await expect(
        optionService.validateCartOption(IdMap.getId("validId"), cart)
      ).rejects.toThrow(
        "The shipping option is not available in the cart's region"
      )
    })

    it("fails if reqs are not satisfied", async () => {
      const cart = {
        region_id: IdMap.getId("fr-region"),
        subtotal: 2,
      }

      await expect(
        optionService.validateCartOption(IdMap.getId("validId"), cart)
      ).rejects.toThrow(
        "The Cart does not satisfy the shipping option's requirements"
      )
    })
  })
})
