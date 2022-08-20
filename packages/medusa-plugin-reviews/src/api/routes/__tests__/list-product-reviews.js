import { request } from "../../../../../helpers/test-request"
import { ProductReviewServiceMock } from "../../../../services/__mocks__/product-review"

describe("GET /store/reviews", () => {
  describe("successful retrieval", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("GET", `/store/reviews`)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls product reviews service list", () => {
      expect(ProductReviewServiceMock.listAndCount).toHaveBeenCalledTimes(1)
    })
  })

  describe("can pass a limit query param and offset default is used", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("GET", `/store/reviews?limit=5`)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls product reviews service list with the right params", () => {
      expect(ProductReviewServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(ProductReviewServiceMock.listAndCount).toHaveBeenCalledWith(
        {},
        {
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
      subject = await request("GET", `/store/reviews?offset=10`)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls product review service list with the right params", () => {
      expect(ProductReviewServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(ProductReviewServiceMock.listAndCount).toHaveBeenCalledWith(
        {},
        {
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
      subject = await request("GET", `/store/reviews?offset=10&limit=20`)
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls product collection service list with the right params", () => {
      expect(ProductReviewServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(ProductReviewServiceMock.listAndCount).toHaveBeenCalledWith(
        {},
        {
          skip: 10,
          take: 20,
        }
      )
    })
  })
})
