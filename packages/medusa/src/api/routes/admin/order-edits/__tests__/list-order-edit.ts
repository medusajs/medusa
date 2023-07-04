import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"
import {
  defaultOrderEditFields,
  defaultOrderEditRelations
} from "../../../../../types/order-edit"

describe("GET /admin/order-edits", () => {
  describe("successfully list order edits", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/order-edits`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService listAndCount", () => {
      expect(orderEditServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.listAndCount).toHaveBeenCalledWith(
        {},
        {
          select: defaultOrderEditFields,
          relations: defaultOrderEditRelations,
          order: { created_at: "DESC" },
          skip: 0,
          take: 20,
        }
      )
      expect(orderEditServiceMock.decorateTotals).toHaveBeenCalledTimes(1)
    })
  })
})
