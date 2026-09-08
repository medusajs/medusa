import { describe, expect, it } from "vitest"
import { splitContentBlocks } from "../parse-code-tabs.js"

describe("splitContentBlocks", () => {
  it("returns no blocks for empty or whitespace-only content", () => {
    expect(splitContentBlocks("")).toEqual([])
    expect(splitContentBlocks("   \n\n  ")).toEqual([])
  })

  it("emits a markdown block for plain prose", () => {
    expect(splitContentBlocks("Hello world")).toEqual([
      { kind: "markdown", html: "Hello world" },
    ])
  })

  it("splits headings from surrounding prose", () => {
    const blocks = splitContentBlocks(
      "Intro paragraph\n\n## A Heading\n\nBody paragraph"
    )
    expect(blocks).toEqual([
      { kind: "markdown", html: "Intro paragraph" },
      { kind: "heading", level: 2, text: "A Heading", id: "a-heading" },
      { kind: "markdown", html: "Body paragraph" },
    ])
  })

  it("derives heading level from the number of `#`", () => {
    const blocks = splitContentBlocks("#### Deep Heading")
    expect(blocks).toEqual([
      { kind: "heading", level: 4, text: "Deep Heading", id: "deep-heading" },
    ])
  })

  it("keeps inline code in heading text but strips it from the id", () => {
    const [block] = splitContentBlocks("### Understanding `data` property")
    expect(block).toEqual({
      kind: "heading",
      level: 3,
      text: "Understanding `data` property",
      id: "understanding-data-property",
    })
  })

  it("keeps a heading link's label but drops the url + entities from the id", () => {
    const [block] = splitContentBlocks(
      "## createApiKeys(): Promise&#60;[ApiKeyDTO](/references/api_key/x)&#62;"
    )
    expect(block).toMatchObject({
      kind: "heading",
      level: 2,
      text: "createApiKeys(): Promise&#60;[ApiKeyDTO](/references/api_key/x)&#62;",
      id: "createapikeys-promiseapikeydto",
    })
  })

  it("parses a <CodeTabs> block into codeTabs", () => {
    const content = [
      "<CodeTabs>",
      '<CodeTab label="Node">',
      '```ts title="index.ts"',
      "const a = 1",
      "```",
      "</CodeTab>",
      '<CodeTab label="cURL">',
      "```bash",
      "curl x",
      "```",
      "</CodeTab>",
      "</CodeTabs>",
    ].join("\n")

    expect(splitContentBlocks(content)).toEqual([
      {
        kind: "codeTabs",
        tabs: [
          { label: "Node", language: "ts", title: "index.ts", code: "const a = 1" },
          { label: "cURL", language: "bash", title: undefined, code: "curl x" },
        ],
      },
    ])
  })

  it("parses a <TypeList> with a JSON `types` prop", () => {
    const types = [{ name: "id", type: "`string`" }]
    const content = `<TypeList types={${JSON.stringify(
      types
    )}} sectionTitle="Foo" expandUrl="https://x.com/y" />`

    expect(splitContentBlocks(content)).toEqual([
      {
        kind: "typeList",
        sectionTitle: "Foo",
        expandUrl: "https://x.com/y",
        types,
      },
    ])
  })

  it("parses a <WorkflowDiagram> workflow prop", () => {
    const workflow = { name: "createThingWorkflow", steps: [] }
    const content = `<WorkflowDiagram workflow={${JSON.stringify(workflow)}} />`

    expect(splitContentBlocks(content)).toEqual([
      { kind: "workflowDiagram", workflow },
    ])
  })

  it("parses a <SourceCodeLink> link", () => {
    const content = '<SourceCodeLink link="https://github.com/x/y/z.ts" />'
    expect(splitContentBlocks(content)).toEqual([
      { kind: "sourceCodeLink", link: "https://github.com/x/y/z.ts" },
    ])
  })

  it("parses a <Note> component with type + title", () => {
    const content = '<Note type="warning" title="Careful">\n\nBe careful.\n\n</Note>'
    expect(splitContentBlocks(content)).toEqual([
      { kind: "note", variant: "warning", title: "Careful", html: "Be careful." },
    ])
  })

  it("defaults a bare <Note> to the note variant", () => {
    const content = "<Note>\n\nHeads up.\n\n</Note>"
    expect(splitContentBlocks(content)).toEqual([
      { kind: "note", variant: "note", title: undefined, html: "Heads up." },
    ])
  })

  it("parses a `:::note[Title]` admonition", () => {
    const content = ":::note[Deprecated]\n\nUse the new API.\n\n:::"
    expect(splitContentBlocks(content)).toEqual([
      { kind: "note", variant: "note", title: "Deprecated", html: "Use the new API." },
    ])
  })

  it("parses a bare `:::warning` admonition without a title", () => {
    const content = ":::warning\n\nWatch out.\n\n:::"
    expect(splitContentBlocks(content)).toEqual([
      { kind: "note", variant: "warning", title: undefined, html: "Watch out." },
    ])
  })

  it("preserves order of prose and constructs", () => {
    const content = [
      "Some intro.",
      "",
      '<SourceCodeLink link="https://x/y.ts" />',
      "",
      "## Example",
      "",
      "<Note>\n\nA note.\n\n</Note>",
    ].join("\n")

    const kinds = splitContentBlocks(content).map((block) => block.kind)
    expect(kinds).toEqual(["markdown", "sourceCodeLink", "heading", "note"])
  })

  it("treats an unbalanced/unparseable TypeList tag's `>` as prose without crashing", () => {
    const content = "Before < after"
    // a lone `<` isn't a recognized construct, so it stays prose
    expect(splitContentBlocks(content)).toEqual([
      { kind: "markdown", html: "Before < after" },
    ])
  })
})
