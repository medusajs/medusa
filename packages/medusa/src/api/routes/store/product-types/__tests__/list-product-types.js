import { request } from "../../../../../helpers/test-request"
import { ProductTypeServiceMock } from "../../../../../services/__mocks__/product-type"

describe("GET /store/product-types", () => {
  describe("successful retrieval", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("GET", `/store/product-types`)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls product types service list", () => {
      expect(ProductTypeServiceMock.listAndCount).toHaveBeenCalledTimes(1)
    })
  })

  describe("can pass a limit query param and offset default is used", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("GET", `/store/product-types?limit=5`)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls product type service list with the right params", () => {
      expect(ProductTypeServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(ProductTypeServiceMock.listAndCount).toHaveBeenCalledWith(
        {},
        {
          relations: [],
          select: undefined,
          skip: 0,
          take: 5,
        }
      )
    })
  })

  describe("can pass an offset query param and limit default is used", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("GET", `/store/product-types?offset=10`)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls product type service list with the right params", () => {
      expect(ProductTypeServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(ProductTypeServiceMock.listAndCount).toHaveBeenCalledWith(
        {},
        {
          relations: [],
          select: undefined,
          skip: 10,
          take: 10,
        }
      )
    })
  })

  describe("can pass an offset and limit query params", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("GET", `/store/product-types?offset=10&limit=20`)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls product collection service list with the right params", () => {
      expect(ProductTypeServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(ProductTypeServiceMock.listAndCount).toHaveBeenCalledWith(
        {},
        {
          relations: [],
          select: undefined,
          skip: 10,
          take: 20,
        }
      )
    })
  })
})
