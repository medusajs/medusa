import { isNodeVersionSupported } from "../get-node-version"

describe("isNodeVersionSupported", () => {
  it.each(["22.15.0", "22.15.1", "22.20.0", "24.0.0", "25.3.0"])(
    "should accept %s",
    (version) => {
      expect(isNodeVersionSupported(version)).toBe(true)
    }
  )

  it.each(["20.19.0", "20.20.0", "22.12.0", "22.14.9", "18.20.0"])(
    "should reject %s",
    (version) => {
      expect(isNodeVersionSupported(version)).toBe(false)
    }
  )
})
