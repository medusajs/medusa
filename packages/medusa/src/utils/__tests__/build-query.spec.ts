import { In, Not } from "typeorm"
import { buildQuery } from "../build-query"

describe('buildQuery', () => {
  describe("buildQuery_", () => {
    it("successfully creates query", () => {
      const q = buildQuery(
        {
          id: "1234",
          test1: ["123", "12", "1"],
          test2: Not("this"),
        },
        {
          relations: ["1234"],
        }
      )

      expect(q).toEqual({
        where: {
          id: "1234",
          test1: In(["123", "12", "1"]),
          test2: Not("this"),
        },
        relations: ["1234"],
      })
    })
  })
})