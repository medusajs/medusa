const baseRepoMock = {
  serialize: jest.fn().mockImplementation((item) => item),
  transaction: (task) => task("transactionManager"),
  getFreshManager: jest.fn().mockReturnThis(),
}

const defaultContext = { __type: "MedusaContext", manager: baseRepoMock }
const defaultTransactionContext = {
  __type: "MedusaContext",
  transactionManager: "transactionManager",
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

  const abstractModuleService = abstractModuleServiceFactory<
    MainModelMock,
    {
      OtherModelMock1: {
        dto: any
        singular: "OtherModelMock1"
        plural: "OtherModelMock1s"
      }
      OtherModelMock2: {
        dto: any
        singular: "OtherModelMock2"
        plural: "OtherModelMock2s"
      }
    }
  >(MainModelMock, {
    OtherModelMock1,
    OtherModelMock2,
  })

  describe("Main Model Methods", () => {
    let instance

    beforeEach(() => {
      jest.clearAllMocks()
      instance = new abstractModuleService(containerMock)
    })

    it("should have retrieve method", async () => {
      const result = await instance.retrieve("1")
      expect(result).toEqual({ id: "1", name: "Item" })
      expect(containerMock.mainModelMockService.retrieve).toHaveBeenCalledWith(
        "1",
        undefined,
        defaultContext
      )
    })

    it("should have list method", async () => {
      const result = await instance.list()
      expect(result).toEqual([{ id: "1", name: "Item" }])
      expect(containerMock.mainModelMockService.list).toHaveBeenCalledWith(
        {},
        {},
        defaultContext
      )
    })

    it("should have delete method", async () => {
      await instance.delete("1")
      expect(containerMock.mainModelMockService.delete).toHaveBeenCalledWith(
        ["1"],
        defaultTransactionContext
      )
    })

    it("should have softDelete method", async () => {
      const result = await instance.softDelete("1")
      expect(result).toEqual({})
      expect(
        containerMock.mainModelMockService.softDelete
      ).toHaveBeenCalledWith(["1"], defaultTransactionContext)
    })

    it("should have restore method", async () => {
      const result = await instance.restore("1")
      expect(result).toEqual({})
      expect(containerMock.mainModelMockService.restore).toHaveBeenCalledWith(
        ["1"],
        defaultTransactionContext
      )
    })

    it("should have delete method with selector", async () => {
      await instance.delete({ selector: { id: "1" } })
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
      instance = new abstractModuleService(containerMock)
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
})
