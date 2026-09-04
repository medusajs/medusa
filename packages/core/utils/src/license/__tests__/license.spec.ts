import { generateKeyPairSync, KeyObject, sign } from "crypto"
import { assertLicensed } from "../assert-licensed"
import { checkLicenseRemote } from "../check-license-remote"
import { resetLicenseState } from "../license-state"
import { verifyLicenseKey } from "../verify-license-key"

const { publicKey, privateKey } = generateKeyPairSync("ed25519")
const publicPem = publicKey.export({ type: "spki", format: "pem" }).toString()

const otherKeyPair = generateKeyPairSync("ed25519")

const LICENSE_ENV_VARS = ["MEDUSA_LICENSE_KEY", "MEDUSA_LICENSE_PUBLIC_KEY"]

function toSegment(value: object): string {
  return Buffer.from(JSON.stringify(value), "utf-8").toString("base64url")
}

function signToken(
  claims: object,
  key: KeyObject = privateKey,
  header: object = { alg: "EdDSA", kid: "test-key" }
): string {
  const headerSegment = toSegment(header)
  const payloadSegment = toSegment(claims)
  const signature = sign(
    null,
    Buffer.from(`${headerSegment}.${payloadSegment}`, "utf-8"),
    key
  ).toString("base64url")

  return `${headerSegment}.${payloadSegment}.${signature}`
}

const validClaims = {
  sub: "org_01",
  jti: "lic_abc123",
  features: ["rbac", "auth-oidc"],
  iat: 1700000000,
}

beforeEach(() => {
  process.env.MEDUSA_LICENSE_PUBLIC_KEY = publicPem
})

afterEach(() => {
  for (const name of LICENSE_ENV_VARS) {
    delete process.env[name]
  }

  resetLicenseState()
})

describe("verifyLicenseKey", () => {
  it("returns the claims of an authentic token", () => {
    expect(verifyLicenseKey(signToken(validClaims))).toEqual(validClaims)
  })

  it("returns the claims of an authentic token whose exp is in the past", () => {
    // Authenticity is not freshness: expiry is decided by the remote check.
    const expiredClaims = { ...validClaims, exp: 1700000001 }

    expect(verifyLicenseKey(signToken(expiredClaims))).toEqual(expiredClaims)
  })

  it("returns null when the payload was tampered with", () => {
    const [headerSegment, , signatureSegment] =
      signToken(validClaims).split(".")
    const tampered = [
      headerSegment,
      toSegment({ ...validClaims, features: ["rbac", "auth-oidc", "extra"] }),
      signatureSegment,
    ].join(".")

    expect(verifyLicenseKey(tampered)).toBeNull()
  })

  it("returns null when the token was signed by another key", () => {
    const token = signToken(validClaims, otherKeyPair.privateKey)

    expect(verifyLicenseKey(token)).toBeNull()
  })

  it("returns null for a malformed token", () => {
    const twoSegments = `${toSegment({ alg: "EdDSA" })}.${toSegment(
      validClaims
    )}`

    expect(verifyLicenseKey("")).toBeNull()
    expect(verifyLicenseKey("not-a-token")).toBeNull()
    expect(verifyLicenseKey(twoSegments)).toBeNull()
    expect(verifyLicenseKey("!!!.???.***")).toBeNull()
    expect(verifyLicenseKey(`${signToken(validClaims)}.extra`)).toBeNull()
  })

  it("returns null when the algorithm is not EdDSA", () => {
    const token = signToken(validClaims, privateKey, {
      alg: "HS256",
      kid: "test-key",
    })

    expect(verifyLicenseKey(token)).toBeNull()
  })

  it("returns null when structural claims are missing or malformed", () => {
    const malformedClaims = [
      { jti: "lic_1", features: [], iat: 1 },
      { sub: "org_1", features: [], iat: 1 },
      { sub: "org_1", jti: "lic_1", features: [] },
      { ...validClaims, jti: 123 },
      { ...validClaims, features: "rbac" },
      { ...validClaims, features: ["rbac", 1] },
    ]

    for (const claims of malformedClaims) {
      expect(verifyLicenseKey(signToken(claims))).toBeNull()
    }
  })

  it("returns null when the public key env var is missing or malformed", () => {
    const token = signToken(validClaims)

    delete process.env.MEDUSA_LICENSE_PUBLIC_KEY
    expect(verifyLicenseKey(token)).toBeNull()

    process.env.MEDUSA_LICENSE_PUBLIC_KEY = "not-a-pem"
    expect(verifyLicenseKey(token)).toBeNull()
  })
})

describe("assertLicensed", () => {
  it("throws when no license key is set", () => {
    expect(() => assertLicensed("rbac")).toThrow(
      /requires a Medusa license key, but MEDUSA_LICENSE_KEY is not set/
    )
  })

  it("throws and names both env vars when the key cannot be verified", () => {
    process.env.MEDUSA_LICENSE_KEY = signToken(
      validClaims,
      otherKeyPair.privateKey
    )

    expect(() => assertLicensed("rbac")).toThrow(
      /Both MEDUSA_LICENSE_KEY and MEDUSA_LICENSE_PUBLIC_KEY must be set and valid/
    )
  })

  it("throws when the license key does not cover the feature", () => {
    process.env.MEDUSA_LICENSE_KEY = signToken({
      ...validClaims,
      features: ["auth-oidc"],
    })

    expect(() => assertLicensed("rbac")).toThrow(
      /does not cover the "rbac" feature/
    )
  })

  it("passes when the license key covers the feature", () => {
    process.env.MEDUSA_LICENSE_KEY = signToken(validClaims)

    expect(() => assertLicensed("rbac")).not.toThrow()
  })
})

describe("checkLicenseRemote", () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  function mockResponse(status: number, body: unknown): void {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    })
  }

  it("returns the parsed body on 200", async () => {
    const body = {
      status: "expired",
      expires_at: "2026-01-01T00:00:00.000Z",
      grace_until: "2026-01-15T00:00:00.000Z",
    }
    mockResponse(200, body)

    await expect(checkLicenseRemote("token")).resolves.toEqual(body)
  })

  it("returns null on a non-2xx response", async () => {
    mockResponse(500, { status: "active" })

    await expect(checkLicenseRemote("token")).resolves.toBeNull()
  })

  it("returns null on a network error", async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error("ECONNREFUSED"))

    await expect(checkLicenseRemote("token")).resolves.toBeNull()
  })

  it("returns null when the request times out", async () => {
    // The rejection AbortSignal.timeout() produces, without the real wait.
    ;(global.fetch as jest.Mock).mockRejectedValue(
      new DOMException(
        "The operation was aborted due to timeout",
        "TimeoutError"
      )
    )

    await expect(checkLicenseRemote("token")).resolves.toBeNull()
  })

  it("returns null on an unparsable body", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("Unexpected token")
      },
    })

    await expect(checkLicenseRemote("token")).resolves.toBeNull()
  })

  it("returns null on an unknown status", async () => {
    mockResponse(200, { status: "something-else" })

    await expect(checkLicenseRemote("token")).resolves.toBeNull()

    mockResponse(200, {})

    await expect(checkLicenseRemote("token")).resolves.toBeNull()
  })
})
