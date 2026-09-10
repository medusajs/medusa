import { readFileSync } from "fs"
import { join } from "path"

describe("api middlewares", () => {
  it("should not spread a route middleware collection more than once", () => {
    const source = readFileSync(join(__dirname, "../middlewares.ts"), "utf-8")

    const spreads = source.match(/^\s*\.\.\.(\w+),$/gm) ?? []
    const counts = spreads.reduce<Record<string, number>>((acc, spread) => {
      const name = spread.trim().replace(/^\.\.\./, "").replace(/,$/, "")
      acc[name] = (acc[name] ?? 0) + 1
      return acc
    }, {})

    const duplicates = Object.keys(counts).filter((name) => counts[name] > 1)

    expect(duplicates).toEqual([])
  })
})
