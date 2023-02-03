import { containsDuplicates } from "../array-contains-duplicates"

describe("containsDuplicates", () => {
  describe("Correctly validates array", () => {
    it("False on duplicates", () => {
      const res = containsDuplicates([123, 123], "value")

      expect(res).toBe(false)
    })

    it("False on nested duplicates", () => {
      const res = containsDuplicates([{ value: 123 }, { value: 123 }], "value")

      expect(res).toBe(false)
    })

    it("True on no nested duplicates", () => {
      const res = containsDuplicates([{ value: 123 }, { value: 1234 }], "value")

      expect(res).toBe(true)
    })

    it("True on no duplicates", () => {
      const res = containsDuplicates([123, 1234])

      expect(res).toBe(true)
    })

    it("True on empty array", () => {
      const res = containsDuplicates([])

      expect(res).toBe(true)
    })
  })
})
