import { clearTestLicense, setTestLicense } from "@medusajs/test-utils"
import oidcAuthProvider from "../../index"
import licenseLoader from "../license"

describe("auth-oidc license loader", () => {
  afterEach(() => {
    clearTestLicense()
  })

  it("is the first loader the provider runs", () => {
    expect(oidcAuthProvider.loaders?.[0]).toBe(licenseLoader)
  })

  it("fails to initialize without a license key", async () => {
    await expect(licenseLoader()).rejects.toThrow(
      'The "auth-oidc" feature requires a Medusa license key, but MEDUSA_LICENSE_KEY is not set.'
    )
  })

  it("fails to initialize with a license key that does not cover auth-oidc", async () => {
    setTestLicense(["rbac"])

    await expect(licenseLoader()).rejects.toThrow(
      'The configured Medusa license key does not cover the "auth-oidc" feature.'
    )
  })

  it("initializes with a license key covering auth-oidc", async () => {
    setTestLicense(["auth-oidc"])

    await expect(licenseLoader()).resolves.toBeUndefined()
  })
})
