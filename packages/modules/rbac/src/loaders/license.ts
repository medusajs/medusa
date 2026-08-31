import { assertLicensed, LicenseFeature } from "@medusajs/framework/utils"

export default async (): Promise<void> => {
  assertLicensed(LicenseFeature.RBAC)
}
