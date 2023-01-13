import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"

describe("List variants", () => {
  describe("list variants successfull", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/store/variants`)
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("returns variants", () => {
      expect(subject.body.variants[0].id).toEqual(IdMap.getId("testVariant"))
    })
  })
})
