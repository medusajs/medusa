import { HttpTypes } from "@medusajs/types"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { useAuditLogTableColumns } from "../use-audit-log-table-columns"

vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  useMemo: (factory: () => unknown) => factory(),
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock("../../../../../../hooks/use-date", () => ({
  useDate: () => ({ getFullDate: () => "" }),
}))

describe("useAuditLogTableColumns", () => {
  it("doesn't use the `action` id, which the DataTable reserves for row actions", () => {
    const ids = useAuditLogTableColumns().map(
      (column) => column.id ?? (column as { accessorKey?: string }).accessorKey
    )

    expect(ids).not.toContain("action")
    expect(ids).toContain("audit_action")
  })

  const renderActor = (
    log: Partial<HttpTypes.AdminAuditLog>,
    users: Map<string, any> = new Map()
  ) => {
    // useMemo is mocked, so the hook is a plain function here.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const column = useAuditLogTableColumns(users).find(
      (c) => (c as { accessorKey?: string }).accessorKey === "actor_id"
    )!
    const cell = column.cell as (ctx: unknown) => React.ReactElement

    return renderToStaticMarkup(cell({ row: { original: log } }))
  }

  it("shows a resolved user's name and email instead of the ID", () => {
    const html = renderActor(
      { actor_type: "user", actor_id: "user_1", impersonator_id: null },
      new Map([
        [
          "user_1",
          {
            id: "user_1",
            email: "jane@example.com",
            first_name: "Jane",
            last_name: "Doe",
          },
        ],
      ])
    )

    expect(html).toContain("Jane Doe")
    expect(html).toContain("jane@example.com")
    expect(html).not.toContain("user_1")
  })

  it("falls back to the email when the user has no name", () => {
    const html = renderActor(
      { actor_type: "user", actor_id: "user_1", impersonator_id: null },
      new Map([
        [
          "user_1",
          {
            id: "user_1",
            email: "jane@example.com",
            first_name: null,
            last_name: null,
          },
        ],
      ])
    )

    expect(html).toContain("jane@example.com")
    expect(html).not.toContain("user_1")
  })

  it("falls back to the ID for an unresolved user", () => {
    const html = renderActor({
      actor_type: "user",
      actor_id: "user_deleted",
      impersonator_id: null,
    })

    expect(html).toContain("user_deleted")
  })
})
