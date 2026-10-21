import { container } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { setTestLicense, testLicense } from "../license"

describe("setTestLicense", () => {
  it("overrides the license the framework registers by default", () => {
    delete process.env.MEDUSA_LICENSE_KEY

    expect(container.resolve(ContainerRegistrationKeys.LICENSE)).toBeNull()

    setTestLicense(["rbac"])

    expect(container.resolve(ContainerRegistrationKeys.LICENSE)).toEqual(
      testLicense(["rbac"])
    )
  })
})
