import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"

export type ChannelName = "browser" | "fetch"

export type Assertion = {
  type: string
  value?: unknown
  metric?: string
  config?: Record<string, unknown>
}

export type Channel = {
  description: string
  prompt: (startUrl: string) => string
  mcp: { name: string; command: string; args: string[] }
  maxTurns: number
  concurrency: number
  assert: Assertion[]
}

const require = createRequire(import.meta.url)
const distDir = path.dirname(fileURLToPath(import.meta.url))

// Not every package exports its package.json, so walk up from its entry point.
export const binPath = (pkg: string, bin: string) => {
  let dir = path.dirname(fileURLToPath(import.meta.resolve(pkg)))
  while (
    !fs.existsSync(path.join(dir, "package.json")) ||
    require(path.join(dir, "package.json")).name !== pkg
  ) {
    dir = path.dirname(dir)
  }
  const manifest = require(path.join(dir, "package.json"))
  const relative =
    typeof manifest.bin === "string" ? manifest.bin : manifest.bin[bin]
  return path.join(dir, relative)
}

export const check = (name: string) =>
  `file://${path.join(distDir, "assertions.js")}:${name}`

export const CHANNELS: Record<ChannelName, Channel> = {
  browser: {
    description:
      "Browses the docs site in a headless browser, starting from the homepage and only clicking.",
    prompt: (
      startUrl
    ) => `Open ${startUrl} in the browser. That is the only URL you may type.
From there, reach your goal only by clicking links, buttons, the navbar, sidebars, or the site search, like a real visitor.
Take a snapshot after each click to see where you are. Stop as soon as you find the page that answers your goal, or after 15 clicks.

Your goal: {{goal}}

When done, reply with:
- Reached: yes/no, and the final page URL
- Path: each page you went through, with the link text you clicked
- Confusing moments: where you hesitated, backtracked, or weren't sure what to click, and why
- Next step: what you would do next`,
    mcp: {
      name: "playwright",
      command: process.execPath,
      args: [
        binPath("@playwright/mcp", "playwright-mcp"),
        "--headless",
        "--isolated",
        "--viewport-size=1440,900",
      ],
    },
    maxTurns: 45,
    concurrency: 2,
    assert: [
      {
        type: "javascript",
        metric: "Browsing realism",
        value: check("browsedByClicking"),
      },
    ],
  },
  fetch: {
    description:
      "Answers a question with a single `fetch_url` tool that reads docs.medusajs.com URLs, like an AI agent.",
    prompt: () => "{{question}}",
    mcp: {
      name: "web",
      command: process.execPath,
      args: [path.join(distDir, "fetch-mcp.js")],
    },
    maxTurns: 30,
    concurrency: 3,
    assert: [
      {
        type: "javascript",
        metric: "Agent discoverability",
        value: check("usedAgentEntryPoints"),
      },
      {
        type: "javascript",
        metric: "Agent discoverability",
        value: check("gotMarkdown"),
      },
      {
        type: "javascript",
        metric: "Docs reachability",
        value: check("noBrokenFetches"),
      },
    ],
  },
}
