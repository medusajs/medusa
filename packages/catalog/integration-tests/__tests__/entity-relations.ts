import { TestDatabase } from "../utils"
import { Catalog } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"

const beforeEach_ = async () => {
  await TestDatabase.setupDatabase()
  return await TestDatabase.forkManager()
}

const afterEach_ = async () => {
  await TestDatabase.clearDatabase()
}

describe("Entity", function () {
  describe("catalog and parent relations", function () {
    let manager: SqlEntityManager

    beforeEach(async () => {
      manager = await beforeEach_()
    })

    afterEach(afterEach_)

    it("should be able to create a catalog and associate parents and apply cascade on remove", async () => {
      const catalogEntry = manager.create(Catalog, {
        id: "prod_1",
        name: "Product",
        data: {
          id: "prod_1",
          title: "Product title",
          description: "description",
        },
      })

      const catalogEntry2 = manager.create(Catalog, {
        id: "prod_2",
        name: "Product",
        data: {
          id: "prod_2",
          title: "Product title",
          description: "description",
        },
      })

      await manager.persistAndFlush([catalogEntry, catalogEntry2])

      catalogEntry2.parents.add(catalogEntry)
      await manager.persistAndFlush(catalogEntry2)

      const catalogEntries = await manager.find(Catalog, {}).then((res) => {
        return JSON.parse(JSON.stringify(res))
      })

      expect(catalogEntries).toEqual([
        {
          data: {
            description: "description",
            id: "prod_1",
            title: "Product title",
          },
          id: "prod_1",
          name: "Product",
          parents: [],
        },
        {
          data: {
            description: "description",
            id: "prod_2",
            title: "Product title",
          },
          id: "prod_2",
          name: "Product",
          parents: [
            {
              data: {
                description: "description",
                id: "prod_1",
                title: "Product title",
              },
              id: "prod_1",
              name: "Product",
              parents: [],
            },
          ],
        },
      ])

      await manager.remove(catalogEntry)
      await manager.flush()

      manager.clear()

      const updateCatalogEntries = await manager
        .find(Catalog, {})
        .then((res) => {
          return JSON.parse(JSON.stringify(res))
        })

      expect(updateCatalogEntries).toEqual([
        {
          data: {
            description: "description",
            id: "prod_2",
            title: "Product title",
          },
          id: "prod_2",
          name: "Product",
        },
      ])
    })

    it("should be able to remove a tuple from the pivot table without deleting the original tuple from catalog", async () => {
      const catalogEntry = manager.create(Catalog, {
        id: "prod_1",
        name: "Product",
        data: {
          id: "prod_1",
          title: "Product title",
          description: "description",
        },
      })

      const catalogEntry2 = manager.create(Catalog, {
        id: "prod_2",
        name: "Product",
        data: {
          id: "prod_2",
          title: "Product title",
          description: "description",
        },
      })

      await manager.persistAndFlush([catalogEntry, catalogEntry2])

      catalogEntry2.parents.add(catalogEntry)
      await manager.persistAndFlush(catalogEntry2)

      const qb = manager.createQueryBuilder("catalog_parents")
      qb.delete().where({ child_id: "prod_2", parent_id: "prod_1" })

      manager.clear()

      const catalogEntries = await manager.find(Catalog, {}).then((res) => {
        return JSON.parse(JSON.stringify(res))
      })

      expect(catalogEntries).toEqual([
        {
          data: {
            description: "description",
            id: "prod_1",
            title: "Product title",
          },
          id: "prod_1",
          name: "Product",
        },
        {
          data: {
            description: "description",
            id: "prod_2",
            title: "Product title",
          },
          id: "prod_2",
          name: "Product",
        },
      ])
    })
  })
})
