import { safeHttpUrl } from "../common"

describe("safeHttpUrl", () => {
  it.each([
    ["https://example.com/tracking/123", "https URL"],
    ["http://example.com/label.pdf", "http URL"],
    ["", "empty string"],
    ["#", "placeholder hash"],
  ])("accepts %s (%s)", (value) => {
    expect(safeHttpUrl.safeParse(value).success).toBe(true)
  })

  it.each([
    "javascript:alert(document.domain)",
    "JavaScript:alert(1)",
    "  javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "not a url",
  ])("rejects dangerous or invalid URL %s", (value) => {
    expect(safeHttpUrl.safeParse(value).success).toBe(false)
  })
})
