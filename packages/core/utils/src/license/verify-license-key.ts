import { KeyObject, verify } from "crypto"
import { LicenseKeyClaims } from "./types"

const SIGNATURE_ALGORITHM = "EdDSA"

function decodeSegment(segment: string): unknown {
  return JSON.parse(Buffer.from(segment, "base64url").toString("utf-8"))
}

function isLicenseKeyClaims(claims: unknown): claims is LicenseKeyClaims {
  if (!claims || typeof claims !== "object") {
    return false
  }

  const { sub, features } = claims as LicenseKeyClaims

  return (
    typeof sub === "string" &&
    Array.isArray(features) &&
    features.every((feature) => typeof feature === "string")
  )
}

export function verifyLicenseKey(
  token: string,
  publicKey: KeyObject
): LicenseKeyClaims | null {
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

    return isLicenseKeyClaims(claims) ? claims : null
  } catch {
    return null
  }
}
