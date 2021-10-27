import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

const relations = [
  "variants",
  "variants.prices",
  "options",
  "options.values",
  "images",
  "tags",
  "collection",
  "type",
]

describe("GET /store/collections/:id/products", () => {
  describe("list all collections", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/store/collections/${IdMap.getId("suits")}/products`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls list from productCollectionService", () => {
      expect(ProductServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.list).toHaveBeenCalledWith(
        { collection_id: IdMap.getId("suits"), status: ["published"] },
        {
          skip: 0,
          take: 20,
          order: { title: "ASC" },
          relations,
        }
      )
    })

    it("returns collections", () => {
      expect(subject.body.products[0].id).toEqual(IdMap.getId("product1"))
      expect(subject.body.products[1].id).toEqual(IdMap.getId("product2"))
    })
  })

  describe("overrides limit and offset", () => {
    beforeAll(async () => {
      await request(
        "GET",
        `/store/collections/${IdMap.getId("suits")}/products?limit=10&offset=10`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls list from productCollectionService", () => {
      expect(ProductServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.list)
      expect(ProductServiceMock.list).toHaveBeenCalledWith(
        {
          collection_id: IdMap.getId("suits"),
          status: ["published"],
        },
        {
          skip: 10,
          take: 10,
          order: { title: "ASC" },
          relations,
        }
      )
    })
  })

  describe("list all products using q", () => {
    beforeAll(async () => {
      await request(
        "GET",
        `/store/collections/${IdMap.getId("suits")}/products?q=suits`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls list from productCollectionService", () => {
      expect(ProductServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.list).toHaveBeenCalledWith(
        {
          collection_id: IdMap.getId("suits"),
          q: "suits",
          status: ["published"],
        },
        {
          skip: 0,
          take: 20,
          order: { title: "ASC" },
          relations,
        }
      )
    })
  })

  describe("list all products using tags", () => {
    beforeAll(async () => {
      await request(
        "GET",
        `/store/collections/${IdMap.getId(
          "suits"
        )}/products?tags[]=first,second`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls list from productCollectionService", () => {
      expect(ProductServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.list).toHaveBeenCalledWith(
        {
          collection_id: IdMap.getId("suits"),
          tags: ["first", "second"],
          status: ["published"],
        },
        {
          skip: 0,
          take: 20,
          order: { title: "ASC" },
          relations,
        }
      )
    })
  })

  describe.each([
    ["title", "title", "ASC"],
    ["-title", "title", "DESC"],
    ["created_at", "created_at", "ASC"],
    ["-created_at", "created_at", "DESC"],
    ["updated_at", "updated_at", "ASC"],
    ["-updated_at", "updated_at", "DESC"],
  ])("allows ordering on valid columns", (input, column, order) => {
    beforeAll(async () => {
      await request(
        "GET",
        `/store/collections/${IdMap.getId("suits")}/products?order=${input}`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it(`calls productCollectionService with '${column}' '${order}'`, () => {
      expect(ProductServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.list).toHaveBeenCalledWith(
        { collection_id: IdMap.getId("suits"), status: ["published"] },
        {
          skip: 0,
          take: 20,
          order: { [column]: order },
          relations,
        }
      )
    })
  })

  describe("fails request on bad ordering column", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/store/collections/${IdMap.getId("suits")}/products?order=not_existing`
      )
    })

    it("call results in error", () => {
      expect(subject.status).toEqual(400)
    })
  })
})
