import { mkdtemp, mkdir, rm, writeFile } from "fs/promises"
import { tmpdir } from "os"
import path from "path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { getCleanMd } from "../get-clean-md.js"
import { inlineMdxImports } from "../inline-mdx-imports.js"

describe("inlineMdxImports", () => {
  let dir: string
  let pagePath: string

  const writePartial = async (relPath: string, content: string) => {
    const partialPath = path.join(dir, relPath)
    await mkdir(path.dirname(partialPath), { recursive: true })
    await writeFile(partialPath, content)
  }

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "inline-mdx-imports-"))
    pagePath = path.join(dir, "page.mdx")
  })

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  it("replaces a partial rendered as a component with its content", async () => {
    await writePartial("_content/section.mdx", "Partial content.")

    const result = await inlineMdxImports(
      [
        'import Section from "./_content/section.mdx"',
        "",
        "# Title",
        "",
        "<Section />",
      ].join("\n"),
      pagePath
    )

    expect(result).not.toContain("<Section />")
    expect(result).toContain("Partial content.")
  })

  it("removes the partial's own imports", async () => {
    await writePartial(
      "_content.mdx",
      ['import { Table } from "docs-ui"', "", "Partial content."].join("\n")
    )

    const result = await inlineMdxImports(
      [
        'import { Table } from "docs-ui"',
        'import Content from "./_content.mdx"',
        "",
        "<Content />",
        "",
        "<Content />",
      ].join("\n"),
      pagePath
    )

    expect(result.match(/import \{ Table \}/g)).toHaveLength(1)
    expect(result.match(/Partial content\./g)).toHaveLength(2)
  })

  it("doesn't replace components in code blocks", async () => {
    await writePartial("_content.mdx", "Partial content.")
    const content = [
      'import Content from "./_content.mdx"',
      "",
      "```tsx",
      "<Content />",
      "```",
    ].join("\n")

    expect(await inlineMdxImports(content, pagePath)).toBe(content)
  })

  it("inlines partials imported by other partials", async () => {
    await writePartial(
      "_sections/outer.mdx",
      ['import Inner from "./inner.mdx"', "", "Outer.", "", "<Inner />"].join(
        "\n"
      )
    )
    await writePartial("_sections/inner.mdx", "Inner.")

    const result = await inlineMdxImports(
      ['import Outer from "./_sections/outer.mdx"', "", "<Outer />"].join("\n"),
      pagePath
    )

    expect(result).toContain("Outer.")
    expect(result).toContain("Inner.")
    expect(result).not.toContain("<Inner />")
  })

  it("keeps partials used in a component's prop", async () => {
    await writePartial("_content.mdx", "Partial content.")
    const content = [
      'import Content from "./_content.mdx"',
      "",
      "<Tabs items={[{ content: <Content /> }]} />",
    ].join("\n")

    expect(await inlineMdxImports(content, pagePath)).toBe(content)
  })

  it("keeps imports of partials that don't exist", async () => {
    const content = [
      'import Missing from "./missing.mdx"',
      "",
      "<Missing />",
    ].join("\n")

    expect(await inlineMdxImports(content, pagePath)).toBe(content)
  })

  it("includes the partial's content in the cleaned Markdown", async () => {
    await writePartial(
      "_content.mdx",
      [
        'import { Note } from "docs-ui"',
        "",
        "Partial paragraph.",
        "",
        "<Note>",
        "",
        "Partial note.",
        "",
        "</Note>",
      ].join("\n")
    )

    const md = await getCleanMd({
      file: await inlineMdxImports(
        [
          'import Content from "./_content.mdx"',
          "",
          "export const metadata = {",
          "  title: `Page Title`,",
          "}",
          "",
          "# {metadata.title}",
          "",
          "<Content />",
        ].join("\n"),
        pagePath
      ),
      type: "content",
    })

    expect(md).toContain("# Page Title")
    expect(md).toContain("Partial paragraph.")
    expect(md).toContain("Partial note.")
    expect(md).not.toContain("import")
  })
})
