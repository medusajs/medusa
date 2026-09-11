import { LicenseKeyEnvVars, resetLicenseState } from "@medusajs/framework/utils"
import { generateKeyPairSync, randomBytes, sign } from "crypto"

function toSegment(value: object): string {
  return Buffer.from(JSON.stringify(value), "utf-8").toString("base64url")
}

/**
 * Test helper. Signs a license key covering `features` with an ephemeral
 * Ed25519 key pair and points both license env vars at it, so suites can boot
 * modules guarded by `assertLicensed` without a real key.
 *
 * @internal
 */
export function setTestLicense(features: string[]): void {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519")

  const headerSegment = toSegment({ alg: "EdDSA", kid: "test-license" })
  const payloadSegment = toSegment({
    sub: "org_test",
    jti: `lic_${randomBytes(8).toString("hex")}`,
    features,
    iat: Math.floor(Date.now() / 1000),
  })
  const signature = sign(
    null,
    Buffer.from(`${headerSegment}.${payloadSegment}`, "utf-8"),
    privateKey
  ).toString("base64url")

  process.env[
    LicenseKeyEnvVars.KEY
  ] = `${headerSegment}.${payloadSegment}.${signature}`
  process.env[LicenseKeyEnvVars.PUBLIC_KEY] = publicKey
    .export({ type: "spki", format: "pem" })
    .toString()

  resetLicenseState()
}

/**
 * Test helper. Removes the env vars set by `setTestLicense` and drops the
 * cached license state, leaving the process without a license key.
 *
 * @internal
 */
export function clearTestLicense(): void {
  delete process.env[LicenseKeyEnvVars.KEY]
  delete process.env[LicenseKeyEnvVars.PUBLIC_KEY]

  resetLicenseState()
}
