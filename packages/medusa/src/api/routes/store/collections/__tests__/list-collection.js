import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductCollectionServiceMock } from "../../../../../services/__mocks__/product-collection"

describe("GET /store/collections", () => {
  describe("list all collections", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", "/store/collections")
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls list from productCollectionService", () => {
      expect(ProductCollectionServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ProductCollectionServiceMock.list).toHaveBeenCalledWith(
        {},
        { skip: 0, take: 20, order: { title: "ASC" }, relations: [] }
      )
    })

    it("returns collections", () => {
      expect(subject.body.collections[0].id).toEqual(IdMap.getId("col"))
    })
  })

  describe("list all collections using q", () => {
    beforeAll(async () => {
      await request("GET", "/store/collections?q=suits")
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls list from productCollectionService", () => {
      expect(ProductCollectionServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ProductCollectionServiceMock.list).toHaveBeenCalledWith(
        { q: "suits" },
        { skip: 0, take: 20, order: { title: "ASC" }, relations: [] }
      )
    })
  })

  describe("overrides limit and offset", () => {
    beforeAll(async () => {
      await request("GET", `/store/collections/?limit=10&offset=10`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls list from productCollectionService", () => {
      expect(ProductCollectionServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ProductCollectionServiceMock.list).toHaveBeenCalledWith(
        {},
        {
          skip: 10,
          take: 10,
          order: { title: "ASC" },
          relations: [],
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
      await request("GET", `/store/collections?order=${input}`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it(`calls productCollectionService with '${column}' '${order}'`, () => {
      expect(ProductCollectionServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ProductCollectionServiceMock.list).toHaveBeenCalledWith(
        {},
        {
          skip: 0,
          take: 20,
          order: { [column]: order },
          relations: [],
        }
      )
    })
  })

  describe("fails request on bad ordering column", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/store/collections?order=not_existing`)
    })

    it("request results in error", () => {
      expect(subject.status).toEqual(400)
    })
  })
})
