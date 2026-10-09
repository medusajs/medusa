import { generateKeyPairSync, KeyObject, sign } from "crypto"
import { assertLicensed, loadLicense } from "../index"

const { publicKey, privateKey } = generateKeyPairSync("ed25519")
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
  delete process.env.MEDUSA_LICENSE_PUBLIC_KEY
})

describe("loadLicense", () => {
  it("returns the license encoded in an authentic token", () => {
    const token = signToken(validClaims)

    expect(loadLicense(token, publicKey)).toEqual({ token, ...validClaims })
  })

  it("returns null when no token is set", () => {
    expect(loadLicense(undefined, publicKey)).toBeNull()
    expect(loadLicense("", publicKey)).toBeNull()
    expect(loadLicense()).toBeNull()
  })

  it("reads the token from the environment and verifies it against the Medusa key", () => {
    process.env.MEDUSA_LICENSE_KEY = signToken(validClaims)

    expect(loadLicense()).toBeNull()
  })

  it("verifies the token against the public key from the environment when set", () => {
    const token = signToken(validClaims)
    process.env.MEDUSA_LICENSE_KEY = token
    process.env.MEDUSA_LICENSE_PUBLIC_KEY = publicKey.export({
      type: "spki",
      format: "pem",
    }) as string

    expect(loadLicense()).toEqual({ token, ...validClaims })
  })

  it("returns null when the payload was tampered with", () => {
    const [headerSegment, , signatureSegment] =
      signToken(validClaims).split(".")
    const tampered = [
      headerSegment,
      toSegment({ ...validClaims, features: ["rbac", "auth-oidc", "extra"] }),
      signatureSegment,
    ].join(".")

    expect(loadLicense(tampered, publicKey)).toBeNull()
  })

  it("returns null when the token was signed by another key", () => {
    const token = signToken(validClaims, otherKeyPair.privateKey)

    expect(loadLicense(token, publicKey)).toBeNull()
  })

  it("returns null for a malformed token", () => {
    const twoSegments = `${toSegment({ alg: "EdDSA" })}.${toSegment(
      validClaims
    )}`

    expect(loadLicense("not-a-token", publicKey)).toBeNull()
    expect(loadLicense(twoSegments, publicKey)).toBeNull()
    expect(loadLicense("!!!.???.***", publicKey)).toBeNull()
    expect(loadLicense(`${signToken(validClaims)}.extra`, publicKey)).toBeNull()
  })

  it("returns null when the algorithm is not EdDSA", () => {
    const token = signToken(validClaims, privateKey, { alg: "HS256" })

    expect(loadLicense(token, publicKey)).toBeNull()
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
      expect(loadLicense(signToken(claims), publicKey)).toBeNull()
    }
  })
})

describe("assertLicensed", () => {
  it("throws when there is no license", () => {
    expect(() => assertLicensed(null, "rbac")).toThrow(
      /missing or could not be verified\. Set MEDUSA_LICENSE_KEY/
    )
    expect(() => assertLicensed(undefined, "rbac")).toThrow(
      /missing or could not be verified/
    )
  })

  it("throws when the license does not cover the feature", () => {
    const license = { token: "token", sub: "org_01", features: ["auth-oidc"] }

    expect(() => assertLicensed(license, "rbac")).toThrow(
      /does not cover the "rbac" feature\. It covers: auth-oidc\./
    )
  })

  it("passes when the license covers the feature", () => {
    const license = { token: "token", ...validClaims }

    expect(() => assertLicensed(license, "rbac")).not.toThrow()
  })
})
