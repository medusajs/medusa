import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CustomerGroupServiceMock } from "../../../../../services/__mocks__/customer-group"

describe("GET /customer-groups", () => {
  let subject
  const id = "123"

  beforeAll(async () => {
    subject = await request(
      "GET",
      `/admin/customer-groups/${id}?expand=customers`,
      {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      }
    )
  })

  it("returns 200", () => {
    expect(subject.status).toEqual(200)
  })

  it("calls CustomerGroupService get", () => {
    expect(CustomerGroupServiceMock.retrieve).toHaveBeenCalledTimes(1)
    expect(CustomerGroupServiceMock.retrieve).toHaveBeenCalledWith(id, {
      relations: ["customers"],
    })
  })
})
