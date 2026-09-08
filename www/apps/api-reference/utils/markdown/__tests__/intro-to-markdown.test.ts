import { describe, it, expect } from "vitest"
import { cleanIntroContent, sliceSection } from "../intro-to-markdown"

const SAMPLE_MDX = `import Section from "@/components/Section"
import { CodeTabs, CodeTab, H1 } from "docs-ui"
import { Feedback } from "@/components/Feedback"

<Section checkActiveOnScroll>

<SectionContainer noTopPadding={true}>

<DividedMarkdownLayout>

<DividedMarkdownContent>

<H1 id="introduction">Store API Reference</H1>

Intro paragraph.

<Feedback question="Was this helpful?" />

</DividedMarkdownContent>

</DividedMarkdownLayout>

</SectionContainer>

<SectionContainer noTopPadding={true}>

<DividedMarkdownContent>

## Authentication

Auth intro.

</DividedMarkdownContent>

<DividedMarkdownCode>

\`\`\`bash title="Example"
curl example
\`\`\`

</DividedMarkdownCode>

</SectionContainer>

</Section>
`

describe("cleanIntroContent", () => {
  it("unwraps structural components and converts H1 to a heading", async () => {
    const md = await cleanIntroContent(SAMPLE_MDX)
    expect(md).toContain("# Store API Reference")
    expect(md).toContain("Intro paragraph.")
    expect(md).toContain("## Authentication")
    expect(md).toContain("Auth intro.")
    // code block inside DividedMarkdownCode survives
    expect(md).toContain("curl example")
    // Feedback and raw wrapper tags are removed
    expect(md).not.toContain("Feedback")
    expect(md).not.toContain("DividedMarkdown")
    expect(md).not.toContain("<H1")
  })

  it("resolves cross-project (!area!) links to real URLs", async () => {
    const mdx = `<DividedMarkdownContent>

See the [JS SDK guide](!resources!/js-sdk#configurations).

</DividedMarkdownContent>`
    const md = await cleanIntroContent(mdx)
    expect(md).not.toContain("!resources!")
    expect(md).toContain("/resources/js-sdk#configurations")
  })
})

describe("sliceSection", () => {
  const content = `# Title

Intro.

## Authentication

Auth content.

### Sub

more.

## Publishable API Key

Other content.
`

  it("extracts a single section up to the next level-2 heading", () => {
    const section = sliceSection(content, "Authentication")
    expect(section).toContain("## Authentication")
    expect(section).toContain("Auth content.")
    expect(section).toContain("### Sub")
    expect(section).not.toContain("## Publishable API Key")
    expect(section).not.toContain("Other content.")
  })

  it("returns null when the section is missing", () => {
    expect(sliceSection(content, "Nonexistent")).toBeNull()
  })
})
