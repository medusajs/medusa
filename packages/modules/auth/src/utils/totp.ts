import { createBase32Plugin, generateSecret } from "@otplib/core"
import { crypto } from "@otplib/plugin-crypto-node"
import { generateSync, verifySync } from "@otplib/totp"
import { generateTOTP } from "@otplib/uri"

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
const base32 = createBase32Plugin({
  name: "medusa-base32",
  encode: encodeBase32,
  decode: decodeBase32,
})

export type TotpOptions = {
  secret: string
  code?: string
  digits?: number
  period?: number
  window?: number
  timestamp?: number
}

/**
 * Creates a Base32-encoded shared secret suitable for authenticator apps.
 */
export function generateTotpSecret(size = 20): string {
  return generateSecret({
    crypto,
    base32,
    length: size,
  })
}

/**
 * Generates an RFC 6238 TOTP code for the current time step.
 */
export function generateTotpCode({
  secret,
  digits = 6,
  period = 30,
  timestamp = Date.now(),
}: TotpOptions): string {
  return generateSync({
    secret,
    crypto,
    base32,
    digits,
    period,
    epoch: Math.floor(timestamp / 1000),
  })
}

/**
 * Verifies a TOTP code across the configured time-step window.
 */
export function verifyTotpCode({
  secret,
  code,
  digits = 6,
  period = 30,
  window = 1,
  timestamp = Date.now(),
}: TotpOptions): boolean {
  if (!code || !/^\d+$/.test(code) || code.length !== digits) {
    return false
  }

  return verifySync({
    secret,
    crypto,
    base32,
    token: code,
    digits,
    period,
    epoch: Math.floor(timestamp / 1000),
    epochTolerance: window * period,
  }).valid
}

/**
 * Builds the otpauth URI consumed by authenticator apps and QR codes.
 */
export function generateTotpUri({
  issuer,
  accountName,
  secret,
  digits = 6,
  period = 30,
}: {
  issuer: string
  accountName: string
  secret: string
  digits?: number
  period?: number
}): string {
  return generateTOTP({
    issuer,
    label: accountName,
    secret,
    algorithm: "sha1",
    digits,
    period,
  })
}

function encodeBase32(buffer: Uint8Array): string {
  let bits = 0
  let value = 0
  let output = ""

  for (const byte of buffer) {
    value = (value << 8) | byte
    bits += 8

    while (bits >= 5) {
      const index = (value >> (bits - 5)) & 31
      output += BASE32_ALPHABET[index]
      bits -= 5
      value &= (1 << bits) - 1
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31]
  }

  return output
}

function decodeBase32(secret: string): Uint8Array {
  const normalized = secret
    .replace(/=+$/g, "")
    .replace(/\s+/g, "")
    .toUpperCase()
  let bits = 0
  let value = 0
  const bytes: number[] = []

  for (const char of normalized) {
    const index = BASE32_ALPHABET.indexOf(char)

    if (index === -1) {
      throw new Error("Invalid TOTP secret")
    }

    value = (value << 5) | index
    bits += 5

    if (bits >= 8) {
      bytes.push((value >> (bits - 8)) & 255)
      bits -= 8
      value &= (1 << bits) - 1
    }
  }

  return Uint8Array.from(bytes)
}
