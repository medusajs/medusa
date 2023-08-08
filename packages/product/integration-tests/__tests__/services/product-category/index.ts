import { SqlEntityManager } from "@mikro-orm/postgresql"

import { ProductCategory } from "@models"
import { ProductCategoryRepository } from "@repositories"
import { ProductCategoryService } from "@services"

import { createProductCategories } from "../../../__fixtures__/product-category"
import { productCategoriesData, productCategoriesRankData } from "../../../__fixtures__/product-category/data"
import { TestDatabase } from "../../../utils"

jest.setTimeout(30000)

describe("Product category Service", () => {
  let service: ProductCategoryService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let productCategories!: ProductCategory[]

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()

    const productCategoryRepository = new ProductCategoryRepository({
      manager: repositoryManager,
    })

    service = new ProductCategoryService<ProductCategory>({
      productCategoryRepository,
    })
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("list", () => {
    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      productCategories = await createProductCategories(
        testManager,
        productCategoriesData
      )
    })

    it("lists all product categories", async () => {
      const productCategoryResults = await service.list(
        {},
        {
          select: ["id", "parent_category_id"],
        }
      )

      expect(productCategoryResults).toEqual([
        expect.objectContaining({
          id: "category-0",
          parent_category_id: null,
        }),
        expect.objectContaining({
          id: "category-1",
          parent_category: expect.objectContaining({
            id: "category-0",
          }),
        }),
        expect.objectContaining({
          id: "category-1-a",
          parent_category: expect.objectContaining({
            id: "category-1",
          }),
        }),
        expect.objectContaining({
          id: "category-1-b",
          parent_category: expect.objectContaining({
            id: "category-1",
          }),
        }),
        expect.objectContaining({
          id: "category-1-b-1",
          parent_category: expect.objectContaining({
            id: "category-1-b",
          }),
        }),
      ])
    })

    it("scopes product categories by parent_category_id", async () => {
      let productCategoryResults = await service.list(
        { parent_category_id: null },
        {
          select: ["id"],
        }
      )

      expect(productCategoryResults).toEqual([
        expect.objectContaining({
          id: "category-0",
        }),
      ])

      productCategoryResults = await service.list({
        parent_category_id: "category-0",
      })

      expect(productCategoryResults).toEqual([
        expect.objectContaining({
          id: "category-1",
        }),
      ])

      productCategoryResults = await service.list({
        parent_category_id: ["category-1-b", "category-0"],
      })

      expect(productCategoryResults).toEqual([
        expect.objectContaining({
          id: "category-1",
        }),
        expect.objectContaining({
          id: "category-1-b-1",
        }),
      ])
    })

    it("includes the entire list of descendants when include_descendants_tree is true", async () => {
      const productCategoryResults = await service.list(
        {
          parent_category_id: null,
          include_descendants_tree: true,
        },
        {
          select: ["id", "handle"],
        }
      )

      const serializedObject = JSON.parse(
        JSON.stringify(productCategoryResults)
      )

      expect(serializedObject).toEqual([
        expect.objectContaining({
          id: "category-0",
          handle: "category-0",
          mpath: "category-0.",
          parent_category_id: null,
          parent_category: null,
          category_children: [
            expect.objectContaining({
              id: "category-1",
              handle: "category-1",
              mpath: "category-0.category-1.",
              parent_category_id: "category-0",
              parent_category: "category-0",
              category_children: [
                expect.objectContaining({
                  id: "category-1-a",
                  handle: "category-1-a",
                  mpath: "category-0.category-1.category-1-a.",
                  parent_category_id: "category-1",
                  parent_category: "category-1",
                  category_children: [],
                }),
                expect.objectContaining({
                  id: "category-1-b",
                  handle: "category-1-b",
                  mpath: "category-0.category-1.category-1-b.",
                  parent_category_id: "category-1",
                  parent_category: "category-1",
                  category_children: [
                    expect.objectContaining({
                      id: "category-1-b-1",
                      handle: "category-1-b-1",
                      mpath:
                        "category-0.category-1.category-1-b.category-1-b-1.",
                      parent_category_id: "category-1-b",
                      parent_category: "category-1-b",
                      category_children: [],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ])
    })

    it("scopes children when include_descendants_tree is true", async () => {
      const productCategoryResults = await service.list(
        {
          parent_category_id: null,
          include_descendants_tree: true,
          is_internal: false,
        },
        {
          select: ["id", "handle"],
        }
      )

      const serializedObject = JSON.parse(
        JSON.stringify(productCategoryResults)
      )

      expect(serializedObject).toEqual([
        expect.objectContaining({
          id: "category-0",
          handle: "category-0",
          mpath: "category-0.",
          parent_category_id: null,
          parent_category: null,
          category_children: [
            expect.objectContaining({
              id: "category-1",
              handle: "category-1",
              mpath: "category-0.category-1.",
              parent_category_id: "category-0",
              parent_category: "category-0",
              category_children: [
                expect.objectContaining({
                  id: "category-1-a",
                  handle: "category-1-a",
                  mpath: "category-0.category-1.category-1-a.",
                  parent_category_id: "category-1",
                  parent_category: "category-1",
                  category_children: [],
                }),
              ],
            }),
          ],
        }),
      ])
    })
  })

  describe("retrieve", () => {
    const categoryOneId = "category-1"

    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      productCategories = await createProductCategories(
        testManager,
        productCategoriesData
      )
    })

    it("should return category for the given id", async () => {
      const productCategoryResults = await service.retrieve(
        categoryOneId,
      )

      expect(productCategoryResults).toEqual(
        expect.objectContaining({
          id:  categoryOneId
        })
      )
    })

    it("should throw an error when category with id does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('ProductCategory with id: does-not-exist was not found')
    })

    it("should throw an error when an id is not provided", async () => {
      let error

      try {
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"productCategoryId" must be defined')
    })

    it("should return category based on config select param", async () => {
      const productCategoryResults = await service.retrieve(
        categoryOneId,
        {
          select: ["id", "parent_category_id"],
        }
      )

      expect(productCategoryResults).toEqual(
        expect.objectContaining({
          id:  categoryOneId,
          parent_category_id: "category-0",
        })
      )
    })

    it("should return category based on config relation param", async () => {
      const productCategoryResults = await service.retrieve(
        categoryOneId,
        {
          select: ["id", "parent_category_id"],
          relations: ["parent_category"]
        }
      )

      expect(productCategoryResults).toEqual(
        expect.objectContaining({
          id:  categoryOneId,
          category_children: [
            expect.objectContaining({
              id: 'category-1-a',
            }),
            expect.objectContaining({
              id: 'category-1-b',
            })
          ],
          parent_category: expect.objectContaining({
            id: "category-0"
          })
        })
      )
    })
  })

  describe("listAndCount", () => {
    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      productCategories = await createProductCategories(
        testManager,
        productCategoriesData
      )
    })

    it("should return categories and count based on take and skip", async () => {
      let results = await service.listAndCount(
        {},
        {
          take: 1,
        }
      )

      expect(results[1]).toEqual(5)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: "category-0",
        }),
      ])

      results = await service.listAndCount(
        {},
        {
          take: 1,
          skip: 1
        }
      )

      expect(results[1]).toEqual(5)
      expect(results[0]).toEqual([
        expect.objectContaining({
          id: "category-1",
        }),
      ])
    })

    it("should return all product categories and count", async () => {
      const productCategoryResults = await service.listAndCount(
        {},
        {
          select: ["id", "parent_category_id"],
          relations: ["parent_category"],
        }
      )

      expect(productCategoryResults[1]).toEqual(5)
      expect(productCategoryResults[0]).toEqual([
        expect.objectContaining({
          id: "category-0",
          parent_category: null
        }),
        expect.objectContaining({
          id: "category-1",
          parent_category: expect.objectContaining({
            id: "category-0",
          }),
        }),
        expect.objectContaining({
          id: "category-1-a",
          parent_category: expect.objectContaining({
            id: "category-1",
          }),
        }),
        expect.objectContaining({
          id: "category-1-b",
          parent_category: expect.objectContaining({
            id: "category-1",
          }),
        }),
        expect.objectContaining({
          id: "category-1-b-1",
          parent_category: expect.objectContaining({
            id: "category-1-b",
          }),
        }),
      ])
    })

    it("should only return categories that are scoped by parent_category_id", async () => {
      let productCategoryResults = await service.listAndCount(
        { parent_category_id: null },
        {
          select: ["id"],
        }
      )

      expect(productCategoryResults[1]).toEqual(1)
      expect(productCategoryResults[0]).toEqual([
        expect.objectContaining({
          id: "category-0",
        }),
      ])

      productCategoryResults = await service.listAndCount({
        parent_category_id: "category-0",
      })

      expect(productCategoryResults[1]).toEqual(1)
      expect(productCategoryResults[0]).toEqual([
        expect.objectContaining({
          id: "category-1",
        }),
      ])

      productCategoryResults = await service.listAndCount({
        parent_category_id: ["category-1-b", "category-0"],
      })

      expect(productCategoryResults[1]).toEqual(2)
      expect(productCategoryResults[0]).toEqual([
        expect.objectContaining({
          id: "category-1",
        }),
        expect.objectContaining({
          id: "category-1-b-1",
        }),
      ])
    })

    it("should includes descendants when include_descendants_tree is true", async () => {
      const productCategoryResults = await service.listAndCount(
        {
          parent_category_id: null,
          include_descendants_tree: true,
        },
        {
          select: ["id", "handle"],
        }
      )

      expect(productCategoryResults[1]).toEqual(1)

      const serializedObject = JSON.parse(
        JSON.stringify(productCategoryResults[0])
      )

      expect(serializedObject).toEqual([
        expect.objectContaining({
          id: "category-0",
          handle: "category-0",
          mpath: "category-0.",
          parent_category_id: null,
          parent_category: null,
          category_children: [
            expect.objectContaining({
              id: "category-1",
              handle: "category-1",
              mpath: "category-0.category-1.",
              parent_category_id: "category-0",
              parent_category: "category-0",
              category_children: [
                expect.objectContaining({
                  id: "category-1-a",
                  handle: "category-1-a",
                  mpath: "category-0.category-1.category-1-a.",
                  parent_category_id: "category-1",
                  parent_category: "category-1",
                  category_children: [],
                }),
                expect.objectContaining({
                  id: "category-1-b",
                  handle: "category-1-b",
                  mpath: "category-0.category-1.category-1-b.",
                  parent_category_id: "category-1",
                  parent_category: "category-1",
                  category_children: [
                    expect.objectContaining({
                      id: "category-1-b-1",
                      handle: "category-1-b-1",
                      mpath:
                        "category-0.category-1.category-1-b.category-1-b-1.",
                      parent_category_id: "category-1-b",
                      parent_category: "category-1-b",
                      category_children: [],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ])
    })

    it("should filter out children when include_descendants_tree is true", async () => {
      const productCategoryResults = await service.listAndCount(
        {
          parent_category_id: null,
          include_descendants_tree: true,
          is_internal: false,
        },
        {
          select: ["id", "handle"],
        }
      )

      expect(productCategoryResults[1]).toEqual(1)

      const serializedObject = JSON.parse(
        JSON.stringify(productCategoryResults[0])
      )

      expect(serializedObject).toEqual([
        expect.objectContaining({
          id: "category-0",
          handle: "category-0",
          mpath: "category-0.",
          parent_category_id: null,
          parent_category: null,
          category_children: [
            expect.objectContaining({
              id: "category-1",
              handle: "category-1",
              mpath: "category-0.category-1.",
              parent_category_id: "category-0",
              parent_category: "category-0",
              category_children: [
                expect.objectContaining({
                  id: "category-1-a",
                  handle: "category-1-a",
                  mpath: "category-0.category-1.category-1-a.",
                  parent_category_id: "category-1",
                  parent_category: "category-1",
                  category_children: [],
                }),
              ],
            }),
          ],
        }),
      ])
    })
  })

  describe("create", () => {
    it("should create a category successfully", async () => {
      await service.create({
        name: "New Category",
        parent_category_id: null,
      })

      const [productCategory] = await service.list({
        name: "New Category"
      }, {
        select: ["name", "rank"]
      })

      expect(productCategory).toEqual(
        expect.objectContaining({
          name: "New Category",
          rank: "0",
        })
      )
    })

    it("should append rank from an existing category depending on parent", async () => {
      await service.create({
        name: "New Category",
        parent_category_id: null,
        rank: 0
      })

      await service.create({
        name: "New Category 2",
        parent_category_id: null,
      })

      const [productCategoryNew] = await service.list({
        name: "New Category 2"
      }, {
        select: ["name", "rank"]
      })

      expect(productCategoryNew).toEqual(
        expect.objectContaining({
          name: "New Category 2",
          rank: "1",
        })
      )

      await service.create({
        name: "New Category 2.1",
        parent_category_id: productCategoryNew.id,
      })

      const [productCategoryWithParent] = await service.list({
        name: "New Category 2.1"
      }, {
        select: ["name", "rank", "parent_category_id"]
      })

      expect(productCategoryWithParent).toEqual(
        expect.objectContaining({
          name: "New Category 2.1",
          parent_category_id: productCategoryNew.id,
          rank: "0",
        })
      )
    })
  })

  describe("update", () => {
    let productCategoryZero
    let productCategoryOne
    let productCategoryTwo
    let productCategoryZeroZero
    let productCategoryZeroOne
    let productCategoryZeroTwo
    let categories

    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      categories = await createProductCategories(
        testManager,
        productCategoriesRankData
      )

      productCategoryZero = categories[0]
      productCategoryOne = categories[1]
      productCategoryTwo = categories[2]
      productCategoryZeroZero = categories[3]
      productCategoryZeroOne = categories[4]
      productCategoryZeroTwo = categories[5]
    })

    it("should update the name of the category successfully", async () => {
      await service.update(productCategoryZero.id, {
        name: "New Category"
      })

      const productCategory = await service.retrieve(productCategoryZero.id, {
        select: ["name"]
      })

      expect(productCategory.name).toEqual("New Category")
    })

    it("should throw an error when an id does not exist", async () => {
      let error

      try {
        await service.update("does-not-exist", {
          name: "New Category"
        })
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(`ProductCategory not found ({ id: 'does-not-exist' })`)
    })

    it("should reorder rank successfully in the same parent", async () => {
      await service.update(productCategoryTwo.id, {
        rank: 0,
      })

      const productCategories = await service.list({
        parent_category_id: null
      }, {
        select: ["name", "rank"]
      })

      expect(productCategories).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: productCategoryTwo.id,
            rank: "0",
          }),
          expect.objectContaining({
            id: productCategoryZero.id,
            rank: "1",
          }),
          expect.objectContaining({
            id: productCategoryOne.id,
            rank: "2",
          })
        ])
      )
    })

    it("should reorder rank successfully when changing parent", async () => {
      await service.update(productCategoryTwo.id, {
        rank: 0,
        parent_category_id: productCategoryZero.id
      })

      const productCategories = await service.list({
        parent_category_id: productCategoryZero.id
      }, {
        select: ["name", "rank"]
      })

      expect(productCategories).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: productCategoryTwo.id,
            rank: "0",
          }),
          expect.objectContaining({
            id: productCategoryZeroZero.id,
            rank: "1",
          }),
          expect.objectContaining({
            id: productCategoryZeroOne.id,
            rank: "2",
          }),
          expect.objectContaining({
            id: productCategoryZeroTwo.id,
            rank: "3",
          })
        ])
      )
    })

    it("should reorder rank successfully when changing parent and in first position", async () => {
      await service.update(productCategoryTwo.id, {
        rank: 0,
        parent_category_id: productCategoryZero.id
      })

      const productCategories = await service.list({
        parent_category_id: productCategoryZero.id
      }, {
        select: ["name", "rank"]
      })

      expect(productCategories).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: productCategoryTwo.id,
            rank: "0",
          }),
          expect.objectContaining({
            id: productCategoryZeroZero.id,
            rank: "1",
          }),
          expect.objectContaining({
            id: productCategoryZeroOne.id,
            rank: "2",
          }),
          expect.objectContaining({
            id: productCategoryZeroTwo.id,
            rank: "3",
          })
        ])
      )
    })
  })

  describe("delete", () => {
    let productCategoryZero
    let productCategoryOne
    let productCategoryTwo
    let categories

    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      categories = await createProductCategories(
        testManager,
        productCategoriesRankData
      )

      productCategoryZero = categories[0]
      productCategoryOne = categories[1]
      productCategoryTwo = categories[2]
    })

    it("should throw an error when an id does not exist", async () => {
      let error

      try {
        await service.delete("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(`ProductCategory not found ({ id: 'does-not-exist' })`)
    })

    it("should throw an error when it has children", async () => {
      let error

      try {
        await service.delete(productCategoryZero.id)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(`Deleting ProductCategory (category-0-0) with category children is not allowed`)
    })

    it("should reorder siblings rank successfully on deleting", async () => {
      await service.delete(productCategoryOne.id)

      const productCategories = await service.list({
        parent_category_id: null
      }, {
        select: ["id", "rank"]
      })

      expect(productCategories).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: productCategoryZero.id,
            rank: "0",
          }),
          expect.objectContaining({
            id: productCategoryTwo.id,
            rank: "1",
          })
        ])
      )
    })
  })
})
