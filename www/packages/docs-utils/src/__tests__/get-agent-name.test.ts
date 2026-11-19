import { describe, expect, test } from "vitest"
import { getAgentName } from "../get-agent-name.js"

describe("getAgentName", () => {
  test.each([
    [
      "Claude-User (claude-code/2.1.0; +https://support.anthropic.com/)",
      "Claude Code",
    ],
    [
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-User/1.0; +Claude-User@anthropic.com)",
      "Claude",
    ],
    [
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
      "ChatGPT",
    ],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Cursor/1.2.0", "Cursor"],
    ["curl/8.7.1", "curl"],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
      "Browser",
    ],
  ])("detects %s", (userAgent, expected) => {
    expect(getAgentName(userAgent)).toBe(expected)
  })

  test("returns unknown for missing or unrecognized user agents", () => {
    expect(getAgentName(null)).toBe("unknown")
    expect(getAgentName("SomeTool/1.0")).toBe("unknown")
  })
})
