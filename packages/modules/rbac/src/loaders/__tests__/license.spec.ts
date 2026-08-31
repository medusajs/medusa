import { clearTestLicense, setTestLicense } from "@medusajs/test-utils"
import rbacModule from "../../index"
import licenseLoader from "../license"

describe("rbac license loader", () => {
  afterEach(() => {
    clearTestLicense()
  })

  it("is the first loader the module runs", () => {
    expect(rbacModule.loaders?.[0]).toBe(licenseLoader)
  })

  it("fails to initialize without a license key", async () => {
    await expect(licenseLoader()).rejects.toThrow(
      'The "rbac" feature requires a Medusa license key, but MEDUSA_LICENSE_KEY is not set.'
    )
  })

  it("fails to initialize with a license key that does not cover rbac", async () => {
    setTestLicense(["auth-oidc"])

    await expect(licenseLoader()).rejects.toThrow(
      'The configured Medusa license key does not cover the "rbac" feature.'
    )
  })

  it("initializes with a license key covering rbac", async () => {
    setTestLicense(["rbac"])

    await expect(licenseLoader()).resolves.toBeUndefined()
  })
})
