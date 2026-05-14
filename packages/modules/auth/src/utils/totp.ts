import crypto from "node:crypto"

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

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
  return encodeBase32(crypto.randomBytes(size))
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
  const counter = Math.floor(timestamp / 1000 / period)
  const key = decodeBase32(secret)
  const counterBuffer = Buffer.alloc(8)

  counterBuffer.writeUInt32BE(Math.floor(counter / 0x100000000), 0)
  counterBuffer.writeUInt32BE(counter & 0xffffffff, 4)

  const hmac = crypto.createHmac("sha1", key).update(counterBuffer).digest()
  const offset = hmac[hmac.length - 1] & 0xf
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)

  return String(binary % 10 ** digits).padStart(digits, "0")
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

  for (let offset = -window; offset <= window; offset++) {
    const candidate = generateTotpCode({
      secret,
      digits,
      period,
      timestamp: timestamp + offset * period * 1000,
    })

    if (timingSafeEqual(candidate, code)) {
      return true
    }
  }

  return false
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
  const label = `${issuer}:${accountName}`
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: "SHA1",
    digits: String(digits),
    period: String(period),
  })

  return `otpauth://totp/${encodeURIComponent(label)}?${params.toString()}`
}

/**
 * Encodes random secret bytes using the RFC 4648 Base32 alphabet without padding.
 */
function encodeBase32(buffer: Buffer): string {
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

/**
 * Decodes a Base32 TOTP secret, accepting whitespace and optional padding.
 */
function decodeBase32(secret: string): Buffer {
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

  return Buffer.from(bytes)
}

/**
 * Compares generated and submitted codes without leaking timing differences.
 */
function timingSafeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}
