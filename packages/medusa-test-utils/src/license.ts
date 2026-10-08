import {
  LICENSE_KEY_ENV_VAR,
  resetLicenseState,
  setLicensePublicKey,
} from "@medusajs/framework/utils"
import { generateKeyPairSync, sign } from "crypto"

function toSegment(value: object): string {
  return Buffer.from(JSON.stringify(value), "utf-8").toString("base64url")
}

/**
 * Test helper. Signs a license key covering `features` with an ephemeral
 * Ed25519 key pair and sets it as `MEDUSA_LICENSE_KEY`
 *
 * @internal
 */
export function setTestLicense(features: string[]): void {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519")

  const headerSegment = toSegment({ alg: "EdDSA" })
  const payloadSegment = toSegment({ sub: "org_test", features })
  const signature = sign(
    null,
    Buffer.from(`${headerSegment}.${payloadSegment}`, "utf-8"),
    privateKey
  ).toString("base64url")

  process.env[
    LICENSE_KEY_ENV_VAR
  ] = `${headerSegment}.${payloadSegment}.${signature}`
  setLicensePublicKey(
    publicKey.export({ type: "spki", format: "pem" }).toString()
  )
}

/**
 * Test helper. Removes the key set by `setTestLicense` and restores the
 * default license state
 *
 * @internal
 */
export function clearTestLicense(): void {
  delete process.env[LICENSE_KEY_ENV_VAR]

  resetLicenseState()
}
