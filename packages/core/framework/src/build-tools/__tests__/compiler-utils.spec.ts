import path from "path"
import { isFileIgnored } from "../compiler-utils"

const backendIgnoreFiles = [
  "integration-tests",
  "test",
  "unit-tests",
  "src/admin",
]

const p = (...segments: string[]) => segments.join(path.sep)

describe("isFileIgnored", () => {
  it("ignores files inside ignored directories", () => {
    expect(isFileIgnored(p("integration-tests", "foo.ts"), backendIgnoreFiles)).toBe(
      true
    )
    expect(isFileIgnored(p("test", "foo.ts"), backendIgnoreFiles)).toBe(true)
    expect(isFileIgnored(p("unit-tests", "foo.ts"), backendIgnoreFiles)).toBe(true)
    expect(
      isFileIgnored(p("src", "modules", "test", "foo.ts"), backendIgnoreFiles)
    ).toBe(true)
  })

  it("ignores multi-segment chunks such as src/admin", () => {
    expect(
      isFileIgnored(p("src", "admin", "widget.tsx"), backendIgnoreFiles)
    ).toBe(true)
  })

  it("keeps user files whose name merely contains an ignored substring", () => {
    expect(
      isFileIgnored(p("src", "scripts", "seed-test-accounts.ts"), backendIgnoreFiles)
    ).toBe(false)
    expect(
      isFileIgnored(
        p("src", "scripts", "reset-test-vendor-password.ts"),
        backendIgnoreFiles
      )
    ).toBe(false)
    expect(isFileIgnored(p("src", "my-test-helper.ts"), backendIgnoreFiles)).toBe(
      false
    )
  })

  it("does not match partial segment names", () => {
    expect(
      isFileIgnored(p("src", "administration", "foo.ts"), backendIgnoreFiles)
    ).toBe(false)
    expect(isFileIgnored(p("contest", "foo.ts"), backendIgnoreFiles)).toBe(false)
  })
})
