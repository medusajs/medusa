import { IdMap } from "medusa-test-utils"
import { defaultStoreProductsFields, defaultStoreProductsRelations } from ".."
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("GET /store/products", () => {
  describe("list all products", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", "/store/products")
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls get product from productSerice", () => {
      expect(ProductServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.listAndCount).toHaveBeenCalledWith(
        { status: ["published"] },
        {
          relations: defaultStoreProductsRelations,
          select: defaultStoreProductsFields,
          skip: 0,
          take: 100,
          order: {
            created_at: "DESC",
          },
        }
      )
    })

    it("returns products", () => {
      expect(subject.body.products[0].id).toEqual(IdMap.getId("product1"))
      expect(subject.body.products[1].id).toEqual(IdMap.getId("product2"))
    })
  })

  describe("list all gift cards", () => {
    beforeAll(async () => {
      await request("GET", "/store/products?is_giftcard=true")
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls list from productSerice", () => {
      expect(ProductServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.listAndCount).toHaveBeenCalledWith(
        { is_giftcard: true, status: ["published"] },
        {
          relations: defaultStoreProductsRelations,
          select: defaultStoreProductsFields,
          skip: 0,
          take: 100,
          order: {
            created_at: "DESC",
          },
        }
      )
    })
  })
})
