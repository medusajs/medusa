import { describe, expect, it } from "vitest"
import { getCleanMd } from "../get-clean-md.js"

const clean = (content: string) =>
  getCleanMd({ file: content, type: "content" })

describe("parseTable", () => {
  it("keeps all inline segments of a multi-value cell", async () => {
    const result = await clean(
      `# Title

<Table>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Policies</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>
        \`product:read\`, \`product:create\`, \`product:delete\`
      </Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>`
    )

    // all segments survive (the table parser escapes backticks in text,
    // so assert on the plain values rather than the inline-code form)
    expect(result).toContain("product:read")
    expect(result).toContain("product:create")
    expect(result).toContain("product:delete")
  })
})

describe("parsePermissionsBadge", () => {
  it("renders required policies with the all-of label", async () => {
    const result = await clean(
      `# Title\n\n<PermissionsBadge permissions={["product:create", "product:update"]} />`
    )

    expect(result).toContain("Required policies (all of):")
    expect(result).toContain("`product:create`")
    expect(result).toContain("`product:update`")
  })

  it("uses the any-of label when requireAll is false", async () => {
    const result = await clean(
      `# Title\n\n<PermissionsBadge permissions={["order:read", "order:update"]} requireAll={false} />`
    )

    expect(result).toContain("Required policies (any of):")
  })

  it("uses the singular label for a single policy", async () => {
    const result = await clean(
      `# Title\n\n<PermissionsBadge permissions={["customer:read"]} />`
    )

    expect(result).toContain("Required policy:")
    expect(result).toContain("`customer:read`")
  })
})

describe("parseEnterpriseNotice", () => {
  it("renders the enterprise license sentence", async () => {
    const result = await clean(`# Title\n\n<EnterpriseNotice />`)

    expect(result).toContain(
      "This feature requires an enterprise license."
    )
  })

  it("includes the feature flag when provided", async () => {
    const result = await clean(
      `# Title\n\n<EnterpriseNotice featureName="RBAC feature" featureFlag="rbac" />`
    )

    expect(result).toContain(
      "This RBAC feature requires an enterprise license."
    )
    expect(result).toContain("enable its feature flag: `rbac`")
  })
})
