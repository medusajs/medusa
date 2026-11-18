import crypto from "node:crypto"

type ScryptKdf = typeof import("scrypt-kdf", {
  with: { "resolution-mode": "import" },
})

let scryptKdf: ScryptKdf | undefined

// scrypt-kdf is ESM-only, and Jest run with --experimental-vm-modules rejects require() of ESM
async function loadScrypt(): Promise<ScryptKdf> {
  scryptKdf ??= (
    (await import("scrypt-kdf")) as unknown as { default: ScryptKdf }
  ).default
  return scryptKdf
}

const ENCRYPTION_VERSION = "v1"
const RECOVERY_CODE_HASH_CONFIG = { logN: 15, r: 8, p: 1 }

export function encryptSecret(secret: string, encryptionKey: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    deriveKey(encryptionKey),
    iv
  )
  const encrypted = Buffer.concat([
    cipher.update(secret, "utf8"),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()

  return [
    ENCRYPTION_VERSION,
    iv.toString("base64url"),
    tag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(":")
}

export function decryptSecret(payload: string, encryptionKey: string): string {
  const [version, iv, tag, encrypted] = payload.split(":")

  if (version !== ENCRYPTION_VERSION || !iv || !tag || !encrypted) {
    throw new Error("Invalid encrypted MFA secret")
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    deriveKey(encryptionKey),
    Buffer.from(iv, "base64url")
  )

  decipher.setAuthTag(Buffer.from(tag, "base64url"))

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64url")),
    decipher.final(),
  ]).toString("utf8")
}

export function generateRecoveryCode(): string {
  return crypto
    .randomBytes(16)
    .toString("hex")
    .match(/.{1,4}/g)!
    .join("-")
}

export async function hashRecoveryCode(code: string): Promise<string> {
  const Scrypt = await loadScrypt()
  const hash = await Scrypt.kdf(
    normalizeRecoveryCode(code),
    RECOVERY_CODE_HASH_CONFIG
  )

  return Buffer.from(hash).toString("base64")
}

export async function verifyRecoveryCodeHash(
  hash: string,
  code: string
): Promise<boolean> {
  const Scrypt = await loadScrypt()
  return await Scrypt.verify(
    Buffer.from(hash, "base64"),
    normalizeRecoveryCode(code)
  )
}

function deriveKey(encryptionKey: string): Buffer {
  return crypto.createHash("sha256").update(encryptionKey).digest()
}

function normalizeRecoveryCode(code: string): string {
  return code.trim().toLowerCase()
}
