import {
  getAllFieldsAndRelations,
  ModuleDataFetcher,
} from "../module-data-fetcher"

describe("ModuleDataFetcher", () => {
  describe("fetch", () => {
    it("should give each batch its own relations when the ids are fetched in batches", async () => {
      const service = {
        list: jest.fn(async (filters, options) => {
          const fieldIdx = options.relations.indexOf("calculated_price")
          const shouldCalculatePrice = fieldIdx > -1
          if (shouldCalculatePrice) {
            options.relations.splice(fieldIdx, 1)
          }

          return filters.id.map((id) => ({
            id,
            ...(shouldCalculatePrice
              ? { calculated_price: { calculated_amount: 10 } }
              : {}),
          }))
        }),
      }
      const fetcher = new ModuleDataFetcher(
        new Map([["pricing", service as any]])
      )
      const ids = Array.from({ length: 8001 }, (_, i) => `pset_${i}`)

      const { data } = await fetcher.fetch(
        {
          serviceConfig: { serviceName: "pricing" },
          fields: ["id"],
          expands: { calculated_price: { fields: ["calculated_amount"] } },
        } as any,
        "id",
        ids
      )

      expect(service.list).toHaveBeenCalledTimes(3)
      expect(data).toHaveLength(8001)
      expect(
        (data as any[]).filter((priceSet) => priceSet.calculated_price)
      ).toHaveLength(8001)
    })
  })

  describe("getAllFieldsAndRelations", () => {
    it("should properly handle fields and relations transformation", () => {
      let expand = {
        fields: ["name", "age"],
        expands: {
          friend: {
            fields: ["name"],
            expands: {
              ball: {
                fields: ["*"],
              },
            },
          },
        },
      }

      let result = getAllFieldsAndRelations(expand)

      expect(result).toEqual({
        select: ["name", "age", "friend.name"],
        relations: ["friend", "friend.ball"],
        args: {
          "": undefined,
          friend: undefined,
          "friend.ball": undefined,
        },
      })

      expand = {
        fields: [],
        expands: {
          friend: {
            fields: ["name"],
            expands: {
              ball: {
                fields: ["*"],
              },
            },
          },
        },
      }

      result = getAllFieldsAndRelations(expand)

      expect(result).toEqual({
        select: ["friend.name"],
        relations: ["friend", "friend.ball"],
        args: {
          "": undefined,
          friend: undefined,
          "friend.ball": undefined,
        },
      })

      expand = {
        fields: [],
        expands: {
          friend: {
            fields: ["*"],
            expands: {
              ball: {
                fields: ["*"],
              },
            },
          },
        },
      }

      result = getAllFieldsAndRelations(expand)

      expect(result).toEqual({
        select: [],
        relations: ["friend", "friend.ball"],
        args: {
          "": undefined,
          friend: undefined,
          "friend.ball": undefined,
        },
      })

      expand = {
        fields: [],
        expands: {
          friend: {
            fields: [],
            expands: {
              ball: {
                fields: ["*"],
              },
            },
          },
        },
      }

      result = getAllFieldsAndRelations(expand)

      expect(result).toEqual({
        select: [],
        relations: ["friend", "friend.ball"],
        args: {
          "": undefined,
          friend: undefined,
          "friend.ball": undefined,
        },
      })
    })
  })
})
