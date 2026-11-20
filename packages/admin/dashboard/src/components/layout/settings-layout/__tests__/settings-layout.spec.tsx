import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { afterEach, describe, expect, it, vi } from "vitest"

import { SettingsLayout } from "../settings-layout"

const mocks = vi.hoisted(() => ({
  installedModules: [] as string[],
  permissions: [] as string[],
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("../../../../hooks/api/modules", () => ({
  AUDIT_MODULE_KEY: "audit",
  RBAC_MODULE_KEY: "rbac",
  useIsModuleInstalled: (key: string) => ({
    isInstalled: mocks.installedModules.includes(key),
    isLoading: false,
  }),
}))

// Mirrors the permissions provider: without RBAC every check passes.
vi.mock("../../../../providers/permissions-provider", () => ({
  usePermissions: () => ({
    isLoading: false,
    can: (resource: string, operation: string) =>
      !mocks.installedModules.includes("rbac") ||
      mocks.permissions.includes(`${resource}:${operation}`),
  }),
}))

vi.mock("../../../../hooks/api/search-indexes", () => ({
  useSearchIndexes: () => ({ enabled: false }),
}))

vi.mock("../../../../providers/feature-flag-provider", () => ({
  useFeatureFlag: () => false,
}))

vi.mock("../../../../providers/extension-provider", () => ({
  useExtension: () => ({ getMenu: () => [] }),
}))

vi.mock("../../user-menu", () => ({
  UserMenu: () => null,
}))

vi.mock("../../shell", () => ({
  Shell: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock("../../../layout-composer", () => {
  const LayoutComposer = ({
    sections,
  }: {
    sections: { general: React.ReactNode }
  }) => <>{sections.general}</>
  LayoutComposer.Entry = function Entry({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <>{children}</>
  }
  return { LayoutComposer }
})

vi.mock("../../nav-item", () => ({
  usePermittedNavItems: (items: unknown[]) => items,
  NavItem: ({ to }: { to: string }) => <p>{to}</p>,
}))

const renderSettingsNav = () => {
  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <SettingsLayout />
    </MemoryRouter>
  )

  return [...markup.matchAll(/<p>([^<]+)<\/p>/g)].map(([, to]) => to)
}

describe("SettingsLayout audit logs item", () => {
  afterEach(() => {
    mocks.installedModules = []
    mocks.permissions = []
  })

  it("is hidden when the audit module is not installed", () => {
    expect(renderSettingsNav()).not.toContain("/settings/audit-logs")
  })

  it("is shown when the audit module is installed and RBAC is not", () => {
    mocks.installedModules = ["audit"]

    expect(renderSettingsNav()).toContain("/settings/audit-logs")
  })

  it("is shown with RBAC installed when the user can read audit logs", () => {
    mocks.installedModules = ["audit", "rbac"]
    mocks.permissions = ["audit_log:read"]

    expect(renderSettingsNav()).toContain("/settings/audit-logs")
  })

  it("is hidden with RBAC installed when the user can't read audit logs", () => {
    mocks.installedModules = ["audit", "rbac"]
    mocks.permissions = ["rbac_role:read"]

    const nav = renderSettingsNav()

    expect(nav).toContain("/settings/roles")
    expect(nav).not.toContain("/settings/audit-logs")
  })

  it("is hidden with audit_log:read when the audit module is not installed", () => {
    mocks.installedModules = ["rbac"]
    mocks.permissions = ["audit_log:read"]

    expect(renderSettingsNav()).not.toContain("/settings/audit-logs")
  })
})
