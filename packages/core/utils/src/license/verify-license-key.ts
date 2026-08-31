import { createPublicKey, KeyObject, verify } from "crypto"
import { LicenseKeyClaims } from "./types"

const SIGNATURE_ALGORITHM = "EdDSA"

function getPublicKey(): KeyObject | null {
  const pem = process.env.MEDUSA_LICENSE_PUBLIC_KEY

  if (!pem) {
    return null
  }

  try {
    return createPublicKey(pem)
  } catch {
    return null
  }
}

function decodeSegment(segment: string): unknown {
  return JSON.parse(Buffer.from(segment, "base64url").toString("utf-8"))
}

function isLicenseKeyClaims(claims: unknown): claims is LicenseKeyClaims {
  if (!claims || typeof claims !== "object") {
    return false
  }

  const { sub, jti, iat, features } = claims as LicenseKeyClaims

  return (
    typeof sub === "string" &&
    typeof jti === "string" &&
    typeof iat === "number" &&
    Array.isArray(features) &&
    features.every((feature) => typeof feature === "string")
  )
}

/**
 * Verifies that a license key was issued by Medusa and returns its claims.
 * Returns `null` for a token that is malformed, tampered with, signed by
 * another key, or verified without a usable public key.
 *
 * Authenticity is not freshness: an authentic token whose `exp` is in the past
 * still returns its claims. Whether a license still entitles an instance is
 * decided by the remote check, never locally.
 */
export function verifyLicenseKey(token: string): LicenseKeyClaims | null {
  try {
    const publicKey = getPublicKey()

    if (!publicKey) {
      return null
    }

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

    return isLicenseKeyClaims(claims) ? claims : null
  } catch {
    return null
  }
}
