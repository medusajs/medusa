import { AdminCustomersParams } from "../validators"

describe("AdminCustomersParams", () => {
  it("accepts a phone filter", () => {
    expect(AdminCustomersParams.parse({ phone: "+15555550100" }).phone).toEqual(
      "+15555550100"
    )
  })

  it("accepts a list of phone numbers", () => {
    expect(
      AdminCustomersParams.parse({ phone: ["+15555550100", "+15555550101"] })
        .phone
    ).toEqual(["+15555550100", "+15555550101"])
  })

  it("accepts operators on phone", () => {
    expect(AdminCustomersParams.parse({ phone: { $ne: "" } }).phone).toEqual({
      $ne: "",
    })
  })
})
