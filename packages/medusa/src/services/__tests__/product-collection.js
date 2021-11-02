import { IdMap, MockRepository, MockManager } from "medusa-test-utils"
import ProductCollectionService from "../product-collection"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function () {
    return this
  },
}

describe("ProductCollectionService", () => {
  describe("retrieve", () => {
    const productCollectionRepository = MockRepository({
      findOne: (query) => {
        if (query.where.id === "non-existing") {
          return Promise.resolve(undefined)
        }
        return Promise.resolve({ id: IdMap.getId("bathrobe") })
      },
    })

    const productCollectionService = new ProductCollectionService({
      manager: MockManager,
      productCollectionRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully retrieves a product collection", async () => {
      const result = await productCollectionService.retrieve(
        IdMap.getId("bathrobe")
      )

      expect(productCollectionRepository.findOne).toHaveBeenCalledTimes(1)
      expect(productCollectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("bathrobe") },
      })

      expect(result.id).toEqual(IdMap.getId("bathrobe"))
    })

    it("fails on non-existing product collection id", async () => {
      try {
        await productCollectionService.retrieve("non-existing")
      } catch (error) {
        expect(error.message).toBe(
          `Product collection with id: non-existing was not found`
        )
      }
    })
  })

  describe("create", () => {
    const productCollectionRepository = MockRepository({
      findOne: (query) => Promise.resolve({ id: IdMap.getId("bathrobe") }),
    })

    const productCollectionService = new ProductCollectionService({
      manager: MockManager,
      productCollectionRepository,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully creates a product collection", async () => {
      await productCollectionService.create({ title: "bathrobe" })

      expect(productCollectionRepository.create).toHaveBeenCalledTimes(1)
      expect(productCollectionRepository.create).toHaveBeenCalledWith({
        title: "bathrobe",
      })
    })

    it("emits event when creating a product collection", async () => {
      await productCollectionService.create({ title: "bathrobe" })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "product-collection.created",
        expect.any(Object)
      )
    })
  })

  describe("update", () => {
    const productCollectionRepository = MockRepository({
      findOne: (query) => {
        if (query.where.id === "non-existing") {
          return Promise.resolve(undefined)
        }
        return Promise.resolve({ id: IdMap.getId("bathrobe") })
      },
    })

    const productCollectionService = new ProductCollectionService({
      manager: MockManager,
      productCollectionRepository,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully updates a product collection", async () => {
      await productCollectionService.update(IdMap.getId("bathrobe"), {
        title: "bathrobes",
      })

      expect(productCollectionRepository.save).toHaveBeenCalledTimes(1)
      expect(productCollectionRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("bathrobe"),
        title: "bathrobes",
      })
    })

    it("emits event on update", async () => {
      await productCollectionService.update(IdMap.getId("bathrobe"), {
        title: "bathrobes",
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "product-collection.updated",
        expect.any(Object)
      )
    })

    it("fails on non-existing product collection", async () => {
      try {
        await productCollectionService.update(IdMap.getId("test"), {
          title: "bathrobes",
        })
      } catch (error) {
        expect(error.message).toBe(
          `Product collection with id: ${IdMap.getId("test")} was not found`
        )
      }
    })
  })

  describe("delete", () => {
    const productCollectionRepository = MockRepository({
      findOne: (query) => {
        if (query.where.id === "non-existing") {
          return Promise.resolve(undefined)
        }
        return Promise.resolve({ id: IdMap.getId("bathrobe") })
      },
    })

    const productCollectionService = new ProductCollectionService({
      manager: MockManager,
      productCollectionRepository,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully removes a product collection", async () => {
      await productCollectionService.delete(IdMap.getId("bathrobe"))

      expect(productCollectionRepository.softRemove).toHaveBeenCalledTimes(1)
      expect(productCollectionRepository.softRemove).toHaveBeenCalledWith({
        id: IdMap.getId("bathrobe"),
      })
    })

    it("succeeds idempotently", async () => {
      const result = await productCollectionService.delete(IdMap.getId("test"))
      expect(result).toBe(undefined)
    })

    it("emits delete event correctly", async () => {
      await productCollectionService.delete(IdMap.getId("test"))
      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "product-collection.deleted",
        expect.any(Object)
      )
    })
  })
})
