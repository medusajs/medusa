import { mikroOrmUpdateDeletedAtRecursively } from "../utils"
import { MikroORM } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  DeepRecursiveEntity1,
  DeepRecursiveEntity2,
  DeepRecursiveEntity3,
  DeepRecursiveEntity4,
  Entity1,
  Entity2,
  InternalCircularDependencyEntity1,
  RecursiveEntity1,
  RecursiveEntity2,
} from "../__fixtures__/utils"

jest.mock("@mikro-orm/core", () => ({
  ...jest.requireActual("@mikro-orm/core"),
  wrap: jest.fn().mockImplementation((entity) => ({
    ...entity,
    init: jest.fn().mockResolvedValue(entity),
    __helper: {
      isInitialized: jest.fn().mockReturnValue(true),
    },
  })),
}))

describe("mikroOrmUpdateDeletedAtRecursively", () => {
  describe("using circular cascading", () => {
    let orm!: MikroORM

    beforeEach(async () => {
      orm = await MikroORM.init({
        entities: [
          Entity1,
          Entity2,
          RecursiveEntity1,
          RecursiveEntity2,
          DeepRecursiveEntity1,
          DeepRecursiveEntity2,
          DeepRecursiveEntity3,
          DeepRecursiveEntity4,
          InternalCircularDependencyEntity1,
        ],
        dbName: "test",
        type: "postgresql",
      })
    })

    afterEach(async () => {
      await orm.close()
    })

    it("should successfully mark the entities deleted_at recursively", async () => {
      const manager = orm.em.fork() as SqlEntityManager
      const entity1 = new Entity1({ id: "1", deleted_at: null })
      const entity2 = new Entity2({
        id: "2",
        deleted_at: null,
        entity1: entity1,
      })
      entity1.entity2.add(entity2)

      const deletedAt = new Date()
      await mikroOrmUpdateDeletedAtRecursively(manager, [entity1], deletedAt)

      expect(entity1.deleted_at).toEqual(deletedAt)
      expect(entity2.deleted_at).toEqual(deletedAt)
    })

    it("should successfully mark the entities deleted_at recursively with internal parent/child relation", async () => {
      const manager = orm.em.fork() as SqlEntityManager
      const entity1 = new InternalCircularDependencyEntity1({
        id: "1",
        deleted_at: null,
      })

      const childEntity1 = new InternalCircularDependencyEntity1({
        id: "2",
        deleted_at: null,
        parent: entity1,
      })

      const deletedAt = new Date()
      await mikroOrmUpdateDeletedAtRecursively(manager, [entity1], deletedAt)

      expect(entity1.deleted_at).toEqual(deletedAt)
      expect(childEntity1.deleted_at).toEqual(deletedAt)
    })

    it("should throw an error when a circular dependency is detected", async () => {
      const manager = orm.em.fork() as SqlEntityManager
      const entity1 = new RecursiveEntity1({ id: "1", deleted_at: null })
      const entity2 = new RecursiveEntity2({
        id: "2",
        deleted_at: null,
        entity1: entity1,
      })

      await expect(
        mikroOrmUpdateDeletedAtRecursively(manager, [entity2], new Date())
      ).rejects.toThrow(
        "Unable to soft delete the entity1. Circular dependency detected: RecursiveEntity2 -> entity1 -> RecursiveEntity1 -> entity2 -> RecursiveEntity2"
      )
    })

    it("should throw an error when a circular dependency is detected even at a deeper level", async () => {
      const manager = orm.em.fork() as SqlEntityManager
      const entity1 = new DeepRecursiveEntity1({ id: "1", deleted_at: null })
      const entity3 = new DeepRecursiveEntity3({
        id: "3",
        deleted_at: null,
        entity1: entity1,
      })
      const entity2 = new DeepRecursiveEntity2({
        id: "2",
        deleted_at: null,
        entity1: entity1,
        entity3: entity3,
      })
      const entity4 = new DeepRecursiveEntity4({
        id: "4",
        deleted_at: null,
        entity1: entity1,
      })

      await expect(
        mikroOrmUpdateDeletedAtRecursively(manager, [entity1], new Date())
      ).rejects.toThrow(
        "Unable to soft delete the entity2. Circular dependency detected: DeepRecursiveEntity1 -> entity2 -> DeepRecursiveEntity2 -> entity3 -> DeepRecursiveEntity3 -> entity1 -> DeepRecursiveEntity1"
      )

      await expect(
        mikroOrmUpdateDeletedAtRecursively(manager, [entity2], new Date())
      ).rejects.toThrow(
        "Unable to soft delete the entity3. Circular dependency detected: DeepRecursiveEntity2 -> entity3 -> DeepRecursiveEntity3 -> entity1 -> DeepRecursiveEntity1 -> entity2 -> DeepRecursiveEntity2"
      )

      await mikroOrmUpdateDeletedAtRecursively(manager, [entity4], new Date())
      expect(entity4.deleted_at).not.toBeNull()
      expect(entity1.deleted_at).toBeNull()
      expect(entity2.deleted_at).toBeNull()
      expect(entity3.deleted_at).toBeNull()
    })
  })
})
