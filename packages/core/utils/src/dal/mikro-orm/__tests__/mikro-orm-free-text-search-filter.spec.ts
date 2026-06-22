import { MikroORM } from "@medusajs/deps/mikro-orm/core"
import { defineConfig } from "@medusajs/deps/mikro-orm/postgresql"
import { SearchableEntity1, SearchableEntity2 } from "../__fixtures__/utils"
import { mikroOrmFreeTextSearchFilterOptionsFactory } from "../mikro-orm-free-text-search-filter"

describe("mikroOrmFreeTextSearchFilterOptionsFactory", () => {
  let orm

  beforeEach(async () => {
    orm = await MikroORM.init(
      defineConfig({
        entities: [SearchableEntity1, SearchableEntity2],
        user: "postgres",
        password: "",
        dbName: "test",
        connect: false,
      })
    )
  })

  it("should return a filter function that filters entities based on the free text search value", async () => {
    const entityManager = orm.em.fork()
    const freeTextSearchValue = "search"

    let filterConstraints = mikroOrmFreeTextSearchFilterOptionsFactory(
      SearchableEntity1.name
    ).cond(
      {
        value: freeTextSearchValue,
        fromEntity: SearchableEntity1.name,
      },
      "read",
      entityManager
    )

    expect(filterConstraints).toEqual({
      $or: [
        {
          searchableField: {
            $ilike: `%${freeTextSearchValue}%`,
          },
        },
        {
          entity2: {
            $or: [
              {
                searchableField: {
                  $ilike: `%${freeTextSearchValue}%`,
                },
              },
            ],
          },
        },
      ],
    })

    filterConstraints = mikroOrmFreeTextSearchFilterOptionsFactory(
      SearchableEntity2.name
    ).cond(
      {
        value: freeTextSearchValue,
        fromEntity: SearchableEntity2.name,
      },
      "read",
      entityManager
    )

    expect(filterConstraints).toEqual({
      $or: [
        {
          searchableField: {
            $ilike: `%${freeTextSearchValue}%`,
          },
        },
      ],
    })
  })

  it("should return a tokenized filter when multiple words are provided", async () => {
    const entityManager = orm.em.fork()
    const freeTextSearchValue = "John Doe"

    const filterConstraints = mikroOrmFreeTextSearchFilterOptionsFactory(
      SearchableEntity1.name
    ).cond(
      {
        value: freeTextSearchValue,
        fromEntity: SearchableEntity1.name,
      },
      "read",
      entityManager
    )

    expect(filterConstraints).toEqual({
      $and: [
        {
          $or: [
            {
              searchableField: {
                $ilike: "%John%",
              },
            },
            {
              entity2: {
                $or: [
                  {
                    searchableField: {
                      $ilike: "%John%",
                    },
                  },
                ],
              },
            },
          ],
        },
        {
          $or: [
            {
              searchableField: {
                $ilike: "%Doe%",
              },
            },
            {
              entity2: {
                $or: [
                  {
                    searchableField: {
                      $ilike: "%Doe%",
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    })
  })

  it("should return an empty object when only whitespace is provided", async () => {
    const entityManager = orm.em.fork()
    const freeTextSearchValue = "   "

    const filterConstraints = mikroOrmFreeTextSearchFilterOptionsFactory(
      SearchableEntity1.name
    ).cond(
      {
        value: freeTextSearchValue,
        fromEntity: SearchableEntity1.name,
      },
      "read",
      entityManager
    )

    expect(filterConstraints).toEqual({})
  })
})
