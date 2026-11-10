import { createPublicKey, KeyObject, verify } from "crypto"
import { MedusaError } from "../common/errors"

export const LicenseFeature = {
  RBAC: "rbac",
  AUTH_OIDC: "auth-oidc",
} as const

export type LicenseFeature =
  (typeof LicenseFeature)[keyof typeof LicenseFeature]

export const LICENSE_KEY_ENV_VAR = "MEDUSA_LICENSE_KEY"
export const LICENSE_PUBLIC_KEY_ENV_VAR = "MEDUSA_LICENSE_PUBLIC_KEY"

export const LICENSE_CHECK_ERROR_CODE = "LICENSE_CHECK_ERROR"

const MEDUSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAnRoePLA0drIdxYPM9LJoNeyMFPe+CLBEXsYP164ZHKA=
-----END PUBLIC KEY-----`

const SIGNATURE_ALGORITHM = "EdDSA"
const OBTAIN_KEY_HINT = "Contact support@medusajs.com for more information."

export interface License {
  token: string
  sub: string
  features: string[]
}

type LicenseClaims = Pick<License, "sub" | "features">

function decodeSegment(segment: string): unknown {
  return JSON.parse(Buffer.from(segment, "base64url").toString("utf-8"))
}

function isLicenseClaims(claims: unknown): claims is LicenseClaims {
  if (!claims || typeof claims !== "object") {
    return false
  }

  const { sub, features } = claims as LicenseClaims

  return (
    typeof sub === "string" &&
    Array.isArray(features) &&
    features.every((feature) => typeof feature === "string")
  )
}

/**
 * Verifies a license key and returns the license it encodes, or `null` when
 * the key is missing, malformed, or not signed by Medusa.
 *
 * @param token - The license key. Defaults to `MEDUSA_LICENSE_KEY`.
 * @param publicKey - The key the signature is verified against. Defaults to
 * `MEDUSA_LICENSE_PUBLIC_KEY`, or the Medusa public key when it is not set.
 */
export function loadLicense(
  token: string | undefined = process.env[LICENSE_KEY_ENV_VAR],
  publicKey: KeyObject = createPublicKey(
    process.env[LICENSE_PUBLIC_KEY_ENV_VAR] || MEDUSA_PUBLIC_KEY
  )
): License | null {
  if (!token) {
    return null
  }

  try {
    const [headerSegment, payloadSegment, signatureSegment, ...rest] =
      token.split(".")

    if (!headerSegment || !payloadSegment || !signatureSegment || rest.length) {
      return null
    }

    const header = decodeSegment(headerSegment) as { alg?: string } | null

    if (header?.alg !== SIGNATURE_ALGORITHM) {
      return null
    }

    const isAuthentic = verify(
      null,
      Buffer.from(`${headerSegment}.${payloadSegment}`, "utf-8"),
      publicKey,
      Buffer.from(signatureSegment, "base64url")
    )

    if (!isAuthentic) {
      return null
    }

    const claims = decodeSegment(payloadSegment)

    return isLicenseClaims(claims)
      ? { token, sub: claims.sub, features: claims.features }
      : null
  } catch {
    return null
  }
}

export function assertLicensed(
  license: License | null | undefined,
  feature: string
): void {
  if (!license) {
    throw licenseCheckError(
      `The Medusa license key required by the "${feature}" feature is missing or could not be verified. Set ${LICENSE_KEY_ENV_VAR} to the license key issued for your organization.`
    )
  }

  if (!license.features.includes(feature)) {
    throw licenseCheckError(
      `The configured Medusa license key does not cover the "${feature}" feature. It covers: ${
        license.features.join(", ") || "no features"
      }.`
    )
  }
}

function licenseCheckError(message: string): MedusaError {
  return new MedusaError(
    MedusaError.Types.NOT_ALLOWED,
    `${message} ${OBTAIN_KEY_HINT}`,
    LICENSE_CHECK_ERROR_CODE
  )
}
