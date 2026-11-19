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
})
