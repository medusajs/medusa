import { MedusaInternalService } from "../medusa-internal-service"
import { lowerCaseFirst } from "../../common"

const defaultContext = { __type: "MedusaContext" }

class Model {
  static __meta = {
    primaryKeys: ["id"],
  }
}

describe("Internal Module Service Factory", () => {
  const modelRepositoryName = `${lowerCaseFirst(Model.name)}Repository`

  const containerMock = {
    [modelRepositoryName]: {
      transaction: (task) => task(),
      getFreshManager: jest.fn().mockReturnThis(),
      find: jest.fn(),
      findAndCount: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      softDelete: jest.fn(),
      restore: jest.fn(),
      upsert: jest.fn(),
    },
    [`composite${Model.name}Repository`]: {
      transaction: (task) => task(),
      getFreshManager: jest.fn().mockReturnThis(),
      find: jest.fn(),
      findAndCount: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      softDelete: jest.fn(),
      restore: jest.fn(),
      upsert: jest.fn(),
    },
  }

  const IMedusaInternalService = MedusaInternalService<any>(Model)

  describe("Internal Module Service Methods", () => {
    let instance

    beforeEach(() => {
      jest.clearAllMocks()
      instance = new IMedusaInternalService(containerMock)
    })

    it("should throw on update with wrong arguments", async () => {
      const entity = { id: "1", name: "Item" }
      containerMock[modelRepositoryName].find.mockResolvedValueOnce([entity])

      let err = await instance
        // @ts-ignore
        .update("fake_id", { prop: "fake_data" })
        .catch((e) => e)

      expect(err.message).toBe(
        "Unable to update with input: fake_id. Please provide the following input: an object or an array of object to update or { selector: {}, data: {} } or an array of the same."
      )
    })

    it("should throw model id undefined error on retrieve if id is not defined", async () => {
      const err = await instance.retrieve().catch((e) => e)
      expect(err.message).toBe("model - id must be defined")
    })

    it("should throw an error on retrieve if composite key values are not defined", async () => {
      class CompositeModel {
        id: string
        name: string

        static meta = { primaryKeys: ["id", "name"] }
      }

      const compositeIMedusaInternalService =
        MedusaInternalService<any>(CompositeModel)

      const instance = new compositeIMedusaInternalService(containerMock)

      const err = await instance.retrieve().catch((e) => e)
      expect(err.message).toBe("compositeModel - id, name must be defined")
    })

    it("should throw NOT_FOUND error on retrieve if entity not found", async () => {
      containerMock[modelRepositoryName].find.mockResolvedValueOnce([])

      const err = await instance.retrieve("1").catch((e) => e)
      expect(err.message).toBe("Model with id: 1 was not found")
    })

    it("should retrieve entity successfully", async () => {
      const entity = { id: "1", name: "Item" }
      containerMock[modelRepositoryName].find.mockResolvedValueOnce([entity])

      const result = await instance.retrieve("1")
      expect(result).toEqual(entity)
    })

    it("should retrieve entity successfully with composite key", async () => {
      class CompositeModel {
        id: string
        name: string

        static meta = { primaryKeys: ["id", "name"] }
      }

      const compositeIMedusaInternalService =
        MedusaInternalService<any>(CompositeModel)

      const instance = new compositeIMedusaInternalService(containerMock)

      const entity = { id: "1", name: "Item" }
      containerMock[
        `${lowerCaseFirst(CompositeModel.name)}Repository`
      ].find.mockResolvedValueOnce([entity])

      const result = await instance.retrieve({ id: "1", name: "Item" })
      expect(result).toEqual(entity)
    })

    it("should list entities successfully", async () => {
      const entities = [
        { id: "1", name: "Item" },
        { id: "2", name: "Item2" },
      ]
      containerMock[modelRepositoryName].find.mockResolvedValueOnce(entities)

      const result = await instance.list()
      expect(result).toEqual(entities)
    })

    it("should list entities and relation with default ordering successfully", async () => {
      const entities = [
        { id: "1", name: "Item" },
        { id: "2", name: "Item2" },
      ]
      containerMock[modelRepositoryName].find.mockResolvedValueOnce(entities)

      const result = await instance.list(
        {},
        {
          relations: ["relation"],
        }
      )

      expect(result).toEqual(entities)
      expect(containerMock[modelRepositoryName].find).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            populate: ["relation"],
            orderBy: {
              id: "ASC",
            },
          }),
        }),
        expect.any(Object)
      )
    })

    it("should list and count entities successfully", async () => {
      const entities = [
        { id: "1", name: "Item" },
        { id: "2", name: "Item2" },
      ]
      const count = entities.length
      containerMock[modelRepositoryName].findAndCount.mockResolvedValueOnce([
        entities,
        count,
      ])

      const result = await instance.listAndCount()
      expect(result).toEqual([entities, count])
    })

    it("should create entity successfully", async () => {
      const entity = { id: "1", name: "Item" }

      containerMock[modelRepositoryName].find.mockReturnValue([entity])

      containerMock[modelRepositoryName].create.mockImplementation(
        async (entity) => entity
      )

      const result = await instance.create(entity)
      expect(result).toEqual(entity)
    })

    it("should create entities successfully", async () => {
      const entities = [
        { id: "1", name: "Item" },
        { id: "2", name: "Item2" },
      ]

      containerMock[modelRepositoryName].find.mockResolvedValueOnce([entities])

      containerMock[modelRepositoryName].create.mockResolvedValueOnce(entities)

      const result = await instance.create(entities)
      expect(result).toEqual(entities)
    })

    it("should update entity successfully", async () => {
      const updateData = { id: "1", name: "UpdatedItem" }

      containerMock[modelRepositoryName].find.mockResolvedValueOnce([
        updateData,
      ])

      containerMock[modelRepositoryName].update.mockResolvedValueOnce([
        updateData,
      ])

      const result = await instance.update(updateData)
      expect(result).toEqual([updateData])
    })

    it("should update entities successfully", async () => {
      const updateData = { id: "1", name: "UpdatedItem" }
      const entitiesToUpdate = [{ id: "1", name: "Item" }]

      containerMock[modelRepositoryName].find.mockResolvedValueOnce(
        entitiesToUpdate
      )

      containerMock[modelRepositoryName].update.mockResolvedValueOnce([
        { entity: entitiesToUpdate[0], update: updateData },
      ])

      const result = await instance.update({ selector: {}, data: updateData })
      expect(result).toEqual([
        { entity: entitiesToUpdate[0], update: updateData },
      ])
    })

    it("should delete entity successfully", async () => {
      await instance.delete("1")
      expect(containerMock[modelRepositoryName].delete).toHaveBeenCalledWith(
        {
          $or: [
            {
              id: "1",
            },
          ],
        },
        defaultContext
      )
    })

    it("should delete entities successfully", async () => {
      const entitiesToDelete = [{ id: "1", name: "Item" }]
      containerMock[modelRepositoryName].find.mockResolvedValueOnce(
        entitiesToDelete
      )

      await instance.delete({ selector: {} })
      expect(containerMock[modelRepositoryName].delete).toHaveBeenCalledWith(
        {
          $or: [
            {
              id: "1",
            },
          ],
        },
        defaultContext
      )
    })

    it("should prevent from deleting all entities", async () => {
      const entitiesToDelete = [{ id: "1", name: "Item" }]
      containerMock[modelRepositoryName].find.mockResolvedValueOnce(
        entitiesToDelete
      )

      await instance.delete([])
      expect(containerMock[modelRepositoryName].delete).not.toHaveBeenCalled()
    })

    it("should soft delete entity successfully", async () => {
      await instance.softDelete("1")
      expect(
        containerMock[modelRepositoryName].softDelete
      ).toHaveBeenCalledWith("1", defaultContext)
    })

    it("should prevent from soft deleting all data", async () => {
      await instance.softDelete([])
      expect(
        containerMock[modelRepositoryName].softDelete
      ).not.toHaveBeenCalled()
    })

    it("should restore entity successfully", async () => {
      await instance.restore("1")
      expect(containerMock[modelRepositoryName].restore).toHaveBeenCalledWith(
        "1",
        defaultContext
      )
    })
  })
})
