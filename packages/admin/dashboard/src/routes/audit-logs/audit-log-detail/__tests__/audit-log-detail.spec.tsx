// @vitest-environment jsdom
import React from "react"
import { cleanup, render, screen, within } from "@testing-library/react"
import { HttpTypes } from "@medusajs/types"
import { TooltipProvider } from "@medusajs/ui"
import { afterEach, describe, expect, it, vi } from "vitest"

import { AuditLogDetail } from "../audit-log-detail"

const mocks = vi.hoisted(() => ({
  auditLog: undefined as unknown,
  users: [] as Record<string, unknown>[],
  canReadUsers: true,
  usersQuery: undefined as unknown,
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}))

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "audlog_1" }),
  useLoaderData: () => undefined,
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}))

vi.mock("../../../../hooks/api/users", () => ({
  useUsers: (query: unknown, options: { enabled: boolean }) => {
    mocks.usersQuery = options.enabled ? query : undefined
    return { users: options.enabled ? mocks.users : undefined }
  },
}))

vi.mock("../../../../hooks/use-resource-permissions", () => ({
  useUserPermissions: () => ({ canRead: mocks.canReadUsers }),
}))

vi.mock("../../../../hooks/api/audit-logs", () => ({
  useAuditLog: () => ({
    audit_log: mocks.auditLog,
    isPending: false,
    isError: false,
  }),
}))

vi.mock("../../../../components/layout-composer", () => {
  const LayoutComposer = ({
    sections,
  }: {
    sections: { main: React.ReactNode }
  }) => <>{sections.main}</>
  LayoutComposer.Entry = function Entry({
    id,
    children,
  }: {
    id: string
    children: React.ReactNode
  }) {
    return <section data-testid={id}>{children}</section>
  }
  return { LayoutComposer }
})

vi.mock("../../../../components/common/json-view-section", () => ({
  JsonViewSection: ({ title, data }: { title?: string; data: object }) => (
    <pre data-title={title ?? "json"}>{JSON.stringify(data)}</pre>
  ),
}))

const baseLog: HttpTypes.AdminAuditLog = {
  id: "audlog_1",
  started_at: "2026-11-19T10:00:00.000Z",
  ended_at: "2026-11-19T10:00:01.000Z",
  actor_type: "user",
  actor_id: "user_1",
  impersonator_id: null,
  action: "order.cancel",
  resource_type: "order",
  resource_id: "order_1",
  outcome: "succeeded",
  request: null,
  request_data: null,
  response_data: null,
  metadata: null,
}

const renderDetail = (auditLog: HttpTypes.AdminAuditLog) => {
  mocks.auditLog = auditLog

  return render(
    <TooltipProvider>
      <AuditLogDetail />
    </TooltipProvider>
  )
}

describe("AuditLogDetail", () => {
  afterEach(() => {
    cleanup()
    mocks.users = []
    mocks.canReadUsers = true
    mocks.usersQuery = undefined
  })

  it("links a user actor by name and email, keeping the ID", () => {
    mocks.users = [
      {
        id: "user_1",
        email: "jane@example.com",
        first_name: "Jane",
        last_name: "Doe",
      },
    ]

    renderDetail(baseLog)

    const general = within(screen.getByTestId("AuditLogGeneralSection"))
    const link = general.getByText("Jane Doe").closest("a")

    expect(link?.getAttribute("href")).toBe("/settings/users/user_1")
    expect(general.getByText("jane@example.com")).toBeTruthy()
    expect(general.getByText("user_1")).toBeTruthy()
    expect(mocks.usersQuery).toEqual({
      id: ["user_1"],
      fields: "id,email,first_name,last_name",
      limit: 1,
    })
  })

  it("shows only the actor ID when users can't be read", () => {
    mocks.canReadUsers = false

    renderDetail(baseLog)

    const general = within(screen.getByTestId("AuditLogGeneralSection"))

    expect(mocks.usersQuery).toBeUndefined()
    expect(general.queryByText("auditLogs.fields.actor")).toBeNull()
    expect(general.getByText("user_1")).toBeTruthy()
  })

  it("doesn't look up users for non-user actors", () => {
    renderDetail({ ...baseLog, actor_type: "system", actor_id: null })

    expect(mocks.usersQuery).toBeUndefined()
  })

  it("renders every field of the audit log", () => {
    renderDetail({ ...baseLog, impersonator_id: "staff_1" })

    const general = screen.getByTestId("AuditLogGeneralSection")

    for (const value of [
      "order.cancel",
      "audlog_1",
      "user",
      "user_1",
      "staff_1",
      "order",
      "order_1",
      "auditLogs.outcome.succeeded",
    ]) {
      expect(within(general).getAllByText(value).length).toBeGreaterThan(0)
    }
  })

  it("renders the request block when the audit log has one", () => {
    renderDetail({
      ...baseLog,
      request: {
        method: "POST",
        route: "/admin/orders/:id/cancel",
        path: "/admin/orders/order_1/cancel",
        status_code: 200,
        request_id: "req_1",
        ip_address: "127.0.0.1",
        user_agent: "Mozilla/5.0",
      },
    })

    const section = within(screen.getByTestId("AuditLogRequestSection"))

    for (const value of [
      "POST",
      "/admin/orders/:id/cancel",
      "/admin/orders/order_1/cancel",
      "200",
      "req_1",
      "127.0.0.1",
      "Mozilla/5.0",
    ]) {
      expect(section.getByText(value)).toBeTruthy()
    }
    expect(section.queryByText("auditLogs.request.none")).toBeNull()
  })

  it("renders a placeholder when the audit log has no request", () => {
    renderDetail({ ...baseLog, request: null })

    const section = within(screen.getByTestId("AuditLogRequestSection"))

    expect(section.getByText("auditLogs.request.none")).toBeTruthy()
    expect(section.queryByText("auditLogs.request.method")).toBeNull()
  })

  it("renders missing request, response and metadata as empty JSON", () => {
    renderDetail(baseLog)

    for (const id of [
      "AuditLogRequestDataSection",
      "AuditLogResponseDataSection",
      "AuditLogMetadataSection",
    ]) {
      expect(screen.getByTestId(id).textContent).toBe("{}")
    }
  })

  it("renders the request and response data as JSON", () => {
    renderDetail({
      ...baseLog,
      request_data: { reason: "fraud" },
      response_data: { status: "canceled" },
      metadata: { source: "api" },
    })

    expect(screen.getByTestId("AuditLogRequestDataSection").textContent).toBe(
      JSON.stringify({ reason: "fraud" })
    )
    expect(screen.getByTestId("AuditLogResponseDataSection").textContent).toBe(
      JSON.stringify({ status: "canceled" })
    )
    expect(screen.getByTestId("AuditLogMetadataSection").textContent).toBe(
      JSON.stringify({ source: "api" })
    )
  })
})
