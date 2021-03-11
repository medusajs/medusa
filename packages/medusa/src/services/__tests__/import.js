import { IdMap, MockRepository, MockManager } from "medusa-test-utils"
import ImportService from "../import"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function() {
    return this
  },
}

describe("ImportService", () => {
  describe("importProducts", () => {
    const productRepository = MockRepository({
      create: () => ({
        id: IdMap.getId("ironman"),
        title: "Suit",
        options: [],
        collection: { id: IdMap.getId("cat"), title: "Suits" },
      }),
      findOne: () => undefined,
    })

    const productTagRepository = MockRepository({
      findOne: data => {
        if (data.where.value === "title") {
          return Promise.resolve({ id: "tag-1", value: "title" })
        }
        return undefined
      },
      create: data => {
        if (data.value === "title2") {
          return { value: "title2" }
        }
      },
    })

    const productTypeRepository = MockRepository({
      findOne: () => Promise.resolve({ id: "type-id", value: "type-1" }),
    })

    const productOptionRepository = MockRepository({
      create: d => d,
      save: d => ({ id: "test-opt-id", ...d }),
    })

    const productCollectionRepository = MockRepository({
      create: d => d,
    })

    const productVariantRepository = MockRepository({
      create: d => d,
    })

    const moneyAmountRepository = MockRepository({
      findOne: data => {
        if (data.where.currency_code === "dkk") {
          return Promise.resolve({ amount: 10000, currency_code: "dkk" })
        }
        if (data.where.currency_code === "usd") {
          return Promise.resolve({ amount: 150, currency_code: "usd" })
        }
      },
    })

    const importService = new ImportService({
      manager: MockManager,
      productRepository,
      eventBusService,
      productCollectionRepository,
      productOptionRepository,
      moneyAmountRepository,
      productVariantRepository,
      productTagRepository,
      productTypeRepository,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully imports products", async () => {
      await importService.importProducts(
        [
          {
            title: "Suit",
            options: [{ title: "test-opt" }],
            tags: ["title", "title2"],
            type: "type-1",
            collection: "test-col",
            variants: [
              {
                title: "test-var-1",
                options: [{ value: "opt-val-1" }],
                prices: [
                  {
                    amount: 10000,
                    currency_code: "dkk",
                  },
                  {
                    amount: 1500,
                    currency_code: "usd",
                  },
                ],
              },
            ],
          },
        ],
        "default-shipping-id"
      )

      expect(productRepository.create).toHaveBeenCalledTimes(1)
      expect(productRepository.create).toHaveBeenCalledWith({
        title: "Suit",
        profile_id: "default-shipping-id",
      })

      expect(productTagRepository.findOne).toHaveBeenCalledTimes(2)
      // We add two tags, that does not exist therefore we make sure
      // that create is also called
      expect(productTagRepository.create).toHaveBeenCalledTimes(1)
      expect(productTagRepository.create).toHaveBeenCalledWith({
        value: "title2",
      })

      expect(productTypeRepository.findOne).toHaveBeenCalledTimes(1)
      expect(productTypeRepository.create).toHaveBeenCalledTimes(0)

      expect(productRepository.save).toHaveBeenCalledTimes(1)
      expect(productRepository.save).toHaveBeenCalledWith([
        expect.objectContaining({
          title: "Suit",
          options: [{ id: "test-opt-id", title: "test-opt" }],
          tags: [{ id: "tag-1", value: "title" }, { value: "title2" }],
          type: { id: "type-id", value: "type-1" },
          variants: [
            expect.objectContaining({
              title: "test-var-1",
              prices: [
                {
                  amount: 10000,
                  currency_code: "dkk",
                },
                {
                  amount: 1500,
                  currency_code: "usd",
                },
              ],
              options: [
                {
                  value: "opt-val-1",
                  option_id: "test-opt-id",
                },
              ],
            }),
          ],
          collection: {
            title: "test-col",
          },
        }),
      ])
    })
  })
})
