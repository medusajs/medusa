import {
  generateVerificationToken,
  getVerificationTokenTtlMs,
  hashVerificationToken,
} from "../verification-token"

describe("verification-token utils", () => {
  it("generates opaque tokens and stable hashes", () => {
    const token = generateVerificationToken()

    expect(token).toEqual(expect.any(String))
    expect(hashVerificationToken(token)).toMatch(/^[a-f0-9]{64}$/)
    expect(hashVerificationToken(token)).toEqual(hashVerificationToken(token))
  })

  it("converts ttl seconds to milliseconds", () => {
    expect(getVerificationTokenTtlMs(60)).toEqual(60_000)
  })
})
