import StoreService from "../store"
import { StoreModelMock } from "../../models/__mocks__/store"
import { IdMap } from "medusa-test-utils"

describe("StoreService", () => {
  describe("retrieve", () => {
    const storeService = new StoreService({
      storeModel: StoreModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("retrieves store", async () => {
      await storeService.retrieve()

      expect(StoreModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(StoreModelMock.findOne).toHaveBeenCalledWith()
    })
  })

  describe("update", () => {
    const storeService = new StoreService({
      storeModel: StoreModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("retrieves store", async () => {
      await storeService.update({
        name: "New Name",
        currencies: ["DKK", "sek", "uSd"],
      })

      expect(StoreModelMock.findOne).toHaveBeenCalledTimes(1)

      expect(StoreModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(StoreModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("store") },
        {
          $set: {
            name: "New Name",
            currencies: ["DKK", "SEK", "USD"],
          },
        },
        { runValidators: true }
      )
    })

    it("fails if currency not ok", async () => {
      await expect(
        storeService.update({
          currencies: ["notacurrence"],
        })
      ).rejects.toThrow("Invalid currency NOTACURRENCE")

      expect(StoreModelMock.findOne).toHaveBeenCalledTimes(1)
    })
  })

  describe("addCurrency", () => {
    const storeService = new StoreService({
      storeModel: StoreModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("retrieves store", async () => {
      await storeService.addCurrency("sek")

      expect(StoreModelMock.findOne).toHaveBeenCalledTimes(1)

      expect(StoreModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(StoreModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("store") },
        {
          $push: { currencies: "SEK" },
        }
      )
    })

    it("fails if currency not ok", async () => {
      await expect(storeService.addCurrency("notacurrence")).rejects.toThrow(
        "Invalid currency NOTACURRENCE"
      )

      expect(StoreModelMock.findOne).toHaveBeenCalledTimes(1)
    })

    it("fails if currency already existis", async () => {
      await expect(storeService.addCurrency("DKK")).rejects.toThrow(
        "Currency already added"
      )

      expect(StoreModelMock.findOne).toHaveBeenCalledTimes(1)
    })
  })

  describe("removeCurrency", () => {
    const storeService = new StoreService({
      storeModel: StoreModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("retrieves store", async () => {
      await storeService.removeCurrency("sek")

      expect(StoreModelMock.findOne).toHaveBeenCalledTimes(1)

      expect(StoreModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(StoreModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("store") },
        {
          $pull: { currencies: "SEK" },
        }
      )
    })
  })
})
