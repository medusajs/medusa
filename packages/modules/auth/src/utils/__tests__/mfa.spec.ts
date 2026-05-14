import {
  generateRecoveryCode,
  hashRecoveryCode,
  verifyRecoveryCodeHash,
} from "../mfa"

describe("MFA utilities", () => {
  describe("recovery code hashing", () => {
    it("generates 16-byte recovery codes as grouped hex", () => {
      expect(generateRecoveryCode()).toMatch(
        /^[a-f0-9]{4}(-[a-f0-9]{4}){7}$/
      )
    })

    it("hashes recovery codes with a per-hash salt", async () => {
      const firstHash = await hashRecoveryCode("ABCDE-12345")
      const secondHash = await hashRecoveryCode("ABCDE-12345")

      expect(firstHash).not.toEqual("ABCDE-12345")
      expect(secondHash).not.toEqual("ABCDE-12345")
      expect(firstHash).not.toEqual(secondHash)
      await expect(
        verifyRecoveryCodeHash(firstHash, "ABCDE-12345")
      ).resolves.toBe(true)
      await expect(
        verifyRecoveryCodeHash(secondHash, "ABCDE-12345")
      ).resolves.toBe(true)
    })

    it("normalizes recovery codes before verifying them", async () => {
      const hash = await hashRecoveryCode("abcde-12345")

      await expect(
        verifyRecoveryCodeHash(hash, " ABCDE-12345 ")
      ).resolves.toBe(true)
      await expect(
        verifyRecoveryCodeHash(hash, "abcde-54321")
      ).resolves.toBe(false)
    })
  })
})
