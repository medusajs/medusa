const path = require("path")

const { IdMap } = require("medusa-test-utils")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")
const productSeeder = require("../../helpers/product-seeder")
const {
  DiscountConditionType,
  DiscountConditionOperator,
} = require("@medusajs/medusa")
const { simpleDiscountFactory } = require("../../factories")
const { DiscountRuleType, AllocationType } = require("@medusajs/medusa/dist")

jest.setTimeout(50000)

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("/admin/product-tags", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/product-tags", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await productSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns a list of product tags", async () => {
      const api = useApi()

      const res = await api
        .get("/admin/product-tags", adminReqConfig)
        .catch((err) => {
          console.log(err)
        })

      expect(res.status).toEqual(200)

      const tagMatch = {
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }

      expect(res.data.product_tags).toMatchSnapshot([
        tagMatch,
        tagMatch,
        tagMatch,
      ])
    })

    it("returns a list of product tags matching free text search param", async () => {
      const api = useApi()

      const res = await api
        .get("/admin/product-tags?q=123", adminReqConfig)
        .catch((err) => {
          console.log(err)
        })

      expect(res.status).toEqual(200)

      const tagMatch = {
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }

      expect(res.data.product_tags.length).toEqual(3)
      expect(res.data.product_tags.map((pt) => pt.value)).toEqual(
        expect.arrayContaining(["123", "1235", "1234"])
      )

      expect(res.data.product_tags).toMatchSnapshot([
        tagMatch,
        tagMatch,
        tagMatch,
      ])
    })

    it("returns a list of product tags filtered by discount condition id", async () => {
      const api = useApi()

      const resTags = await api.get("/admin/product-tags", adminReqConfig)

      const tag1 = resTags.data.product_tags[0]
      const tag2 = resTags.data.product_tags[2]

      const buildDiscountData = (code, conditionId, tags) => {
        return {
          code,
          rule: {
            type: DiscountRuleType.PERCENTAGE,
            value: 10,
            allocation: AllocationType.TOTAL,
            conditions: [
              {
                id: conditionId,
                type: DiscountConditionType.PRODUCT_TAGS,
                operator: DiscountConditionOperator.IN,
                product_tags: tags,
              },
            ],
          },
        }
      }

      const discountConditionId = IdMap.getId("discount-condition-tag-1")
      await simpleDiscountFactory(
        dbConnection,
        buildDiscountData("code-1", discountConditionId, [tag1.id])
      )

      const discountConditionId2 = IdMap.getId("discount-condition-tag-2")
      await simpleDiscountFactory(
        dbConnection,
        buildDiscountData("code-2", discountConditionId2, [tag2.id])
      )

      let res = await api.get(
        `/admin/product-tags?discount_condition_id=${discountConditionId}`,
        adminReqConfig
      )

      expect(res.status).toEqual(200)
      expect(res.data.product_tags).toHaveLength(1)
      expect(res.data.product_tags).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: tag1.id })])
      )

      res = await api.get(
        `/admin/product-tags?discount_condition_id=${discountConditionId2}`,
        adminReqConfig
      )

      expect(res.status).toEqual(200)
      expect(res.data.product_tags).toHaveLength(1)
      expect(res.data.product_tags).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: tag2.id })])
      )

      res = await api.get(`/admin/product-tags`, adminReqConfig)

      expect(res.status).toEqual(200)
      expect(res.data.product_tags).toHaveLength(3)
      expect(res.data.product_tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: tag1.id }),
          expect.objectContaining({ id: tag2.id }),
        ])
      )
    })
  })
})
