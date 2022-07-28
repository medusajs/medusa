import { parseCorsOrigins } from ".."

describe('parseCorsOrigins', function () {
  it("should return an array containing both string and regexp", () => {
    const cors = "abc,/abc/,/ab#\/[c]/ig,@ab#\/[c]@ig,/ab\/[c/ig,/abc/gig"
    const [
      origin1,
      origin2,
      origin3,
      origin4,
      origin5,
      origin6,
    ] = parseCorsOrigins(cors)

    expect(typeof origin1).toBe("string")
    expect(origin2).toBeInstanceOf(RegExp)
    expect(origin3).toBeInstanceOf(RegExp)
    expect(origin4).toBeInstanceOf(RegExp)
    expect(typeof origin5).toBe("string")
    expect(typeof origin6).toBe("string")
  })
})
