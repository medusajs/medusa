import { container } from "@medusajs/framework"
import { asValue } from "@medusajs/framework/awilix"
import { ContainerRegistrationKeys, License } from "@medusajs/framework/utils"

export function testLicense(features: string[]): License {
  return { token: "test-license", sub: "org_test", features }
}

export function setTestLicense(features: string[]): void {
  container.register(
    ContainerRegistrationKeys.LICENSE,
    asValue(testLicense(features))
  )
}
