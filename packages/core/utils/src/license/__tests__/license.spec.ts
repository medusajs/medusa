import { generateKeyPairSync, KeyObject, sign } from "crypto"
import { assertLicensed } from "../assert-licensed"
import { checkLicenseRemote } from "../check-license-remote"
import { LICENSE_CHECK_URL } from "../constants"
import { resetLicenseState, setLicensePublicKey } from "../license-state"
import { verifyLicenseKey } from "../verify-license-key"

const { publicKey, privateKey } = generateKeyPairSync("ed25519")
const publicPem = publicKey.export({ type: "spki", format: "pem" }).toString()

const otherKeyPair = generateKeyPairSync("ed25519")

function toSegment(value: object): string {
  return Buffer.from(JSON.stringify(value), "utf-8").toString("base64url")
}

function signToken(
  claims: object,
  key: KeyObject = privateKey,
  header: object = { alg: "EdDSA" }
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
  features: ["auth-oidc", "rbac"],
}

afterEach(() => {
  delete process.env.MEDUSA_LICENSE_KEY

  resetLicenseState()
})

describe("verifyLicenseKey", () => {
  it("returns the claims of an authentic token", () => {
    expect(verifyLicenseKey(signToken(validClaims), publicKey)).toEqual(
      validClaims
    )
  })

  it("returns null when the payload was tampered with", () => {
    const [headerSegment, , signatureSegment] =
      signToken(validClaims).split(".")
    const tampered = [
      headerSegment,
      toSegment({ ...validClaims, features: ["rbac", "auth-oidc", "extra"] }),
      signatureSegment,
    ].join(".")

    expect(verifyLicenseKey(tampered, publicKey)).toBeNull()
  })

  it("returns null when the token was signed by another key", () => {
    const token = signToken(validClaims, otherKeyPair.privateKey)

    expect(verifyLicenseKey(token, publicKey)).toBeNull()
  })

  it("returns null for a malformed token", () => {
    const twoSegments = `${toSegment({ alg: "EdDSA" })}.${toSegment(
      validClaims
    )}`

    expect(verifyLicenseKey("", publicKey)).toBeNull()
    expect(verifyLicenseKey("not-a-token", publicKey)).toBeNull()
    expect(verifyLicenseKey(twoSegments, publicKey)).toBeNull()
    expect(verifyLicenseKey("!!!.???.***", publicKey)).toBeNull()
    expect(
      verifyLicenseKey(`${signToken(validClaims)}.extra`, publicKey)
    ).toBeNull()
  })

  it("returns null when the algorithm is not EdDSA", () => {
    const token = signToken(validClaims, privateKey, { alg: "HS256" })

    expect(verifyLicenseKey(token, publicKey)).toBeNull()
  })

  it("returns null when the claims are missing or malformed", () => {
    const malformedClaims = [
      { features: ["rbac"] },
      { sub: "org_1" },
      { sub: 1, features: ["rbac"] },
      { sub: "org_1", features: "rbac" },
      { sub: "org_1", features: ["rbac", 1] },
    ]

    for (const claims of malformedClaims) {
      expect(verifyLicenseKey(signToken(claims), publicKey)).toBeNull()
    }
  })
})

describe("assertLicensed", () => {
  it("throws when no license key is set", () => {
    expect(() => assertLicensed("rbac")).toThrow(/could not be verified/)
  })

  it("throws when the key was not signed by Medusa Cloud", () => {
    process.env.MEDUSA_LICENSE_KEY = signToken(validClaims)

    expect(() => assertLicensed("rbac")).toThrow(
      /could not be verified\. Set MEDUSA_LICENSE_KEY/
    )
  })

  it("throws when the license key does not cover the feature", () => {
    setLicensePublicKey(publicPem)
    process.env.MEDUSA_LICENSE_KEY = signToken({
      ...validClaims,
      features: ["auth-oidc"],
    })

    expect(() => assertLicensed("rbac")).toThrow(
      /does not cover the "rbac" feature/
    )
  })

  it("passes when the license key covers the feature", () => {
    setLicensePublicKey(publicPem)
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

  it("posts to the remote endpoint and returns the status", async () => {
    mockResponse(200, { status: "revoked" })

    await expect(checkLicenseRemote("token")).resolves.toEqual({
      status: "revoked",
    })
    expect(global.fetch).toHaveBeenCalledWith(
      LICENSE_CHECK_URL,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ license_key: "token" }),
      })
    )
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
    for (const body of [{ status: "expired" }, { status: 1 }, {}]) {
      mockResponse(200, body)

      await expect(checkLicenseRemote("token")).resolves.toBeNull()
    }
  })
})
