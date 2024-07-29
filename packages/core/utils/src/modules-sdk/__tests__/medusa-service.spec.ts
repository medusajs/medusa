import { MedusaService } from "../medusa-service"
import { model } from "../../dml"

const baseRepoMock = {
  serialize: jest.fn().mockImplementation((item) => item),
  transaction: (task) => task("transactionManager"),
  getFreshManager: jest.fn().mockReturnThis(),
}

const defaultContext = { __type: "MedusaContext", manager: baseRepoMock }
const defaultTransactionContext = {
  __type: "MedusaContext",
  manager: baseRepoMock,
}

describe("Abstract Module Service Factory", () => {
  const containerMock = {
    baseRepository: baseRepoMock,
    mainModelMockRepository: baseRepoMock,
    otherModelMock1Repository: baseRepoMock,
    otherModelMock2Repository: baseRepoMock,
    mainModelMockService: {
      retrieve: jest.fn().mockResolvedValue({ id: "1", name: "Item" }),
      list: jest.fn().mockResolvedValue([{ id: "1", name: "Item" }]),
      delete: jest.fn().mockResolvedValue(undefined),
      softDelete: jest.fn().mockResolvedValue([[], {}]),
      restore: jest.fn().mockResolvedValue([[], {}]),
    },
    otherModelMock1Service: {
      retrieve: jest.fn().mockResolvedValue({ id: "1", name: "Item" }),
      list: jest.fn().mockResolvedValue([{ id: "1", name: "Item" }]),
      delete: jest.fn().mockResolvedValue(undefined),
      softDelete: jest.fn().mockResolvedValue([[], {}]),
      restore: jest.fn().mockResolvedValue([[], {}]),
    },
    otherModelMock2Service: {
      retrieve: jest.fn().mockResolvedValue({ id: "1", name: "Item" }),
      list: jest.fn().mockResolvedValue([{ id: "1", name: "Item" }]),
      delete: jest.fn().mockResolvedValue(undefined),
      softDelete: jest.fn().mockResolvedValue([[], {}]),
      restore: jest.fn().mockResolvedValue([[], {}]),
    },
  }

  class MainModelMock {}
  class OtherModelMock1 {}
  class OtherModelMock2 {}

  const medusaService = MedusaService({
    MainModelMock,
    OtherModelMock1,
    OtherModelMock2,
  })

  describe("Main Model Methods", () => {
    let instance: InstanceType<typeof medusaService>

    beforeEach(() => {
      jest.clearAllMocks()
      instance = new medusaService(containerMock)
    })

    it("should have retrieve method", async () => {
      const result = await instance.retrieveMainModelMock("1")
      expect(result).toEqual({ id: "1", name: "Item" })
      expect(containerMock.mainModelMockService.retrieve).toHaveBeenCalledWith(
        "1",
        undefined,
        defaultContext
      )
    })

    it("should have list method", async () => {
      const result = await instance.listMainModelMocks()
      expect(result).toEqual([{ id: "1", name: "Item" }])
      expect(containerMock.mainModelMockService.list).toHaveBeenCalledWith(
        {},
        {},
        defaultContext
      )
    })

    it("should have delete method", async () => {
      await instance.deleteMainModelMocks("1")
      expect(containerMock.mainModelMockService.delete).toHaveBeenCalledWith(
        ["1"],
        defaultTransactionContext
      )
    })

    it("should have softDelete method", async () => {
      const result = await instance.softDeleteMainModelMocks("1")
      expect(result).toEqual({})
      expect(
        containerMock.mainModelMockService.softDelete
      ).toHaveBeenCalledWith(["1"], defaultTransactionContext)
    })

    it("should have restore method", async () => {
      const result = await instance.restoreMainModelMocks("1")
      expect(result).toEqual({})
      expect(containerMock.mainModelMockService.restore).toHaveBeenCalledWith(
        ["1"],
        defaultTransactionContext
      )
    })

    it("should have delete method with selector", async () => {
      await instance.deleteMainModelMocks({ selector: { id: "1" } })
      expect(containerMock.mainModelMockService.delete).toHaveBeenCalledWith(
        [{ selector: { id: "1" } }],
        defaultTransactionContext
      )
    })
  })

  describe("Other Models Methods", () => {
    let instance

    beforeEach(() => {
      jest.clearAllMocks()
      instance = new medusaService(containerMock)
    })

    it("should have retrieve method for other models", async () => {
      const result = await instance.retrieveOtherModelMock1("1")
      expect(result).toEqual({ id: "1", name: "Item" })
      expect(
        containerMock.otherModelMock1Service.retrieve
      ).toHaveBeenCalledWith("1", undefined, defaultContext)
    })

    it("should have list method for other models", async () => {
      const result = await instance.listOtherModelMock1s()
      expect(result).toEqual([{ id: "1", name: "Item" }])
      expect(containerMock.otherModelMock1Service.list).toHaveBeenCalledWith(
        {},
        {},
        defaultContext
      )
    })

    it("should have delete method for other models", async () => {
      await instance.deleteOtherModelMock1s("1")
      expect(containerMock.otherModelMock1Service.delete).toHaveBeenCalledWith(
        ["1"],
        defaultTransactionContext
      )
    })

    it("should have softDelete method for other models", async () => {
      const result = await instance.softDeleteOtherModelMock1s("1")
      expect(result).toEqual({})
      expect(
        containerMock.otherModelMock1Service.softDelete
      ).toHaveBeenCalledWith(["1"], defaultTransactionContext)
    })

    it("should have restore method for other models", async () => {
      const result = await instance.restoreOtherModelMock1s("1")
      expect(result).toEqual({})
      expect(containerMock.otherModelMock1Service.restore).toHaveBeenCalledWith(
        ["1"],
        defaultTransactionContext
      )
    })

    it("should have delete method for other models with selector", async () => {
      await instance.deleteOtherModelMock1s({ selector: { id: "1" } })
      expect(containerMock.otherModelMock1Service.delete).toHaveBeenCalledWith(
        [{ selector: { id: "1" } }],
        defaultTransactionContext
      )
    })
  })

  describe("Custom configuration using DML", () => {
    const containerMock = {
      baseRepository: baseRepoMock,
      mainModelMockRepository: baseRepoMock,
      otherModelMock1Repository: baseRepoMock,
      otherModelMock2Repository: baseRepoMock,
      houseService: {
        retrieve: jest.fn().mockResolvedValue({ id: "1", name: "Item" }),
        list: jest.fn().mockResolvedValue([{ id: "1", name: "Item" }]),
        delete: jest.fn().mockResolvedValue(undefined),
        softDelete: jest.fn().mockResolvedValue([[], {}]),
        restore: jest.fn().mockResolvedValue([[], {}]),
      },
      carService: {
        retrieve: jest.fn().mockResolvedValue({ id: "1", name: "Item" }),
        list: jest.fn().mockResolvedValue([{ id: "1", name: "Item" }]),
        delete: jest.fn().mockResolvedValue(undefined),
        softDelete: jest.fn().mockResolvedValue([[], {}]),
        restore: jest.fn().mockResolvedValue([[], {}]),
      },
      userService: {
        retrieve: jest.fn().mockResolvedValue({ id: "1", name: "Item" }),
        list: jest.fn().mockResolvedValue([{ id: "1", name: "Item" }]),
        delete: jest.fn().mockResolvedValue(undefined),
        softDelete: jest.fn().mockResolvedValue([[], {}]),
        restore: jest.fn().mockResolvedValue([[], {}]),
      },
    }

    const MockModel = model.define("user", {
      id: model.id().primaryKey(),
    })
    const MockModel2 = model.define("car", {
      id: model.id().primaryKey(),
    })
    const MockModel3 = model.define("house", {
      id: model.id().primaryKey(),
    })

    const medusaService = MedusaService({
      MockModel,
      MockModel2,
      MockModel3,
    })

    let instance: InstanceType<typeof medusaService>

    beforeEach(() => {
      jest.clearAllMocks()
      instance = new medusaService(containerMock)
    })

    it("should have the correct methods name while resolving the correct underlying service representation of target models", async () => {
      const prototype = Object.getPrototypeOf(instance)

      expect(prototype).toHaveProperty("retrieveMockModel")
      expect(prototype).toHaveProperty("listMockModels")
      expect(prototype).toHaveProperty("listAndCountMockModels")
      expect(prototype).toHaveProperty("createMockModels")
      expect(prototype).toHaveProperty("updateMockModels")
      expect(prototype).toHaveProperty("deleteMockModels")
      expect(prototype).toHaveProperty("softDeleteMockModels")

      expect(prototype).toHaveProperty("retrieveMockModel2")
      expect(prototype).toHaveProperty("listMockModel2s")
      expect(prototype).toHaveProperty("listAndCountMockModel2s")
      expect(prototype).toHaveProperty("createMockModel2s")
      expect(prototype).toHaveProperty("updateMockModel2s")
      expect(prototype).toHaveProperty("deleteMockModel2s")
      expect(prototype).toHaveProperty("softDeleteMockModel2s")

      expect(prototype).toHaveProperty("retrieveMockModel3")
      expect(prototype).toHaveProperty("listMockModel3s")
      expect(prototype).toHaveProperty("listAndCountMockModel3s")
      expect(prototype).toHaveProperty("createMockModel3s")
      expect(prototype).toHaveProperty("updateMockModel3s")
      expect(prototype).toHaveProperty("deleteMockModel3s")
      expect(prototype).toHaveProperty("softDeleteMockModel3s")

      let result = await instance.retrieveMockModel("1")
      expect(result).toEqual({ id: "1", name: "Item" })
      expect(containerMock.userService.retrieve).toHaveBeenCalledWith(
        "1",
        undefined,
        defaultContext
      )

      result = await instance.retrieveMockModel2("1")
      expect(result).toEqual({ id: "1", name: "Item" })
      expect(containerMock.carService.retrieve).toHaveBeenCalledWith(
        "1",
        undefined,
        defaultContext
      )

      result = await instance.retrieveMockModel3("1")
      expect(result).toEqual({ id: "1", name: "Item" })
      expect(containerMock.houseService.retrieve).toHaveBeenCalledWith(
        "1",
        undefined,
        defaultContext
      )
    })
  })
})
