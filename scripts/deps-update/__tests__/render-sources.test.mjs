import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  githubSlug,
  isAllowedSource,
  renderSources,
} from "../render-sources.mjs"

const vite = { name: "vite", slug: "vitejs/vite", homepage: "https://vite.dev" }
const stripe = {
  name: "stripe",
  slug: "stripe/stripe-node",
  homepage: "https://github.com/stripe/stripe-node",
}

describe("githubSlug", () => {
  it("reads the common repository formats", () => {
    assert.equal(
      githubSlug({ url: "git+https://github.com/vitejs/vite.git" }),
      "vitejs/vite"
    )
    assert.equal(
      githubSlug("git@github.com:stripe/stripe-node.git"),
      "stripe/stripe-node"
    )
    assert.equal(githubSlug("github:expressjs/express"), "expressjs/express")
    assert.equal(githubSlug("https://gitlab.com/a/b"), null)
  })
})

describe("isAllowedSource", () => {
  it("allows the package's own repo, npm page, and homepage host", () => {
    assert.equal(
      isAllowedSource("https://vite.dev/guide/migration", vite),
      true
    )
    assert.equal(isAllowedSource("https://v7.vite.dev/guide/", vite), true)
    assert.equal(
      isAllowedSource(
        "https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md",
        vite
      ),
      true
    )
    assert.equal(
      isAllowedSource("https://www.npmjs.com/package/vite/v/8.0.3", vite),
      true
    )
    assert.equal(
      isAllowedSource(
        "https://github.com/stripe/stripe-node/wiki/Migration-guide-for-v23",
        stripe
      ),
      true
    )
  })

  it("rejects other hosts, other repos, and unsafe URLs", () => {
    assert.equal(isAllowedSource("https://evil.example/vite", vite), false)
    assert.equal(isAllowedSource("https://vite.dev.evil.example/", vite), false)
    assert.equal(
      isAllowedSource("https://github.com/evil/vite/releases", vite),
      false
    )
    assert.equal(
      isAllowedSource("https://github.com/stripe/stripe-node-evil/x", stripe),
      false
    )
    assert.equal(
      isAllowedSource("https://github.com/someone/else", stripe),
      false
    )
    assert.equal(isAllowedSource("http://vite.dev/guide", vite), false)
    assert.equal(
      isAllowedSource("https://user:pass@vite.dev/guide", vite),
      false
    )
    assert.equal(isAllowedSource("javascript:alert(1)", vite), false)
    assert.equal(
      isAllowedSource("https://www.npmjs.com/package/vitest", vite),
      false
    )
  })
})

describe("renderSources", () => {
  it("adds default links and keeps only allowed agent links", () => {
    const section = renderSources({
      group: {
        packages: [{ name: "vite", changes: [{ from: "7.3.6", to: "8.0.3" }] }],
      },
      sources: [
        {
          package: "vite",
          title: "Migration from v7",
          url: "https://vite.dev/guide/migration",
        },
        {
          package: "vite",
          title: "Totally legit",
          url: "https://evil.example/",
        },
        {
          package: "vitest",
          title: "Other package",
          url: "https://vitest.dev/",
        },
      ],
      metadata: new Map([["vite", vite]]),
    })
    assert.equal(
      section,
      [
        "### Release notes",
        "",
        "| Package | Version | Notes |",
        "| --- | --- | --- |",
        "| `vite` | 7.3.6 → 8.0.3 | [Migration from v7](https://vite.dev/guide/migration), [GitHub releases](https://github.com/vitejs/vite/releases), [npm](https://www.npmjs.com/package/vite/v/8.0.3) |",
        "",
      ].join("\n")
    )
  })
})
