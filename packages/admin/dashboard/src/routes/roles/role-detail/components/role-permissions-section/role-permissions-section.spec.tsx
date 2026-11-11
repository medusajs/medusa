// @vitest-environment jsdom
import React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { HttpTypes } from "@medusajs/types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { MatrixPolicy } from "../../../common/utils"
import { RolePermissionsSection } from "./role-permissions-section"

// Radix primitives measure themselves, jsdom has no ResizeObserver.
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
)

const mocks = vi.hoisted(() => ({
  canUpdate: true,
  canReadPolicies: true,
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("react-router-dom", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}))

vi.mock("../../../../../hooks/use-resource-permissions", () => ({
  useRbacRolePermissions: () => ({ canUpdate: mocks.canUpdate }),
  useRbacPolicyPermissions: () => ({ canRead: mocks.canReadPolicies }),
}))

const policy = (resource: string, operation: string): MatrixPolicy => ({
  id: `${resource}_${operation}`,
  key: `${resource}:${operation}`,
  resource,
  operation,
})

const renderSection = (policies: MatrixPolicy[]) => {
  const role = {
    id: "role_1",
    name: "Editor",
    policies,
  } as unknown as HttpTypes.AdminRbacRole

  render(<RolePermissionsSection role={role} />)
}

describe("RolePermissionsSection", () => {
  beforeEach(() => {
    mocks.canUpdate = true
    mocks.canReadPolicies = true
  })

  afterEach(() => {
    cleanup()
  })

  it("renders a group without policies as a non-interactive no access row", () => {
    renderSection([policy("product", "read")])

    // Orders has nothing, so its label is not inside a button.
    const label = screen.getByText(
      "roles.permissions.matrix.groups.orders.label"
    )
    expect(label.closest("button")).toBeNull()

    // The only buttons are Manage permissions and the Products trigger.
    expect(screen.getAllByRole("button")).toHaveLength(2)
    expect(
      screen.getAllByText("roles.permissions.matrix.levels.none").length
    ).toBeGreaterThan(0)
  })

  it("expands a mixed group to show its resources and operations", () => {
    renderSection([
      policy("product", "read"),
      policy("product", "update"),
      policy("product_tag", "create"),
    ])

    expect(screen.queryByText("permissions.resources.product")).toBeNull()

    fireEvent.click(
      screen.getByText("roles.permissions.matrix.groups.products.label")
    )

    expect(screen.getByText("permissions.resources.product")).toBeTruthy()
    expect(screen.getByText("permissions.resources.product_tag")).toBeTruthy()
    expect(screen.getByText("permissions.actions.update")).toBeTruthy()
    expect(screen.getByText("permissions.actions.create")).toBeTruthy()
    // product_tag has create but no read.
    expect(
      screen.getAllByText("roles.permissions.matrix.noViewAccess")
    ).toHaveLength(1)
    expect(
      screen.getByText("roles.permissions.matrix.detail.noAccessTo")
    ).toBeTruthy()
    expect(screen.getByText("3/36")).toBeTruthy()
  })

  it("hides the manage permissions link when the user cannot manage policies", () => {
    mocks.canUpdate = false
    renderSection([policy("product", "read")])

    expect(screen.queryByText("roles.actions.managePermissions")).toBeNull()
  })

  it("shows the manage permissions link when the user can manage policies", () => {
    renderSection([policy("product", "read")])

    expect(
      screen
        .getByText("roles.actions.managePermissions")
        .closest("a")
        ?.getAttribute("href")
    ).toBe("permissions")
  })

  it("shows the wildcard line when the role has *:*", () => {
    renderSection([policy("*", "*")])

    expect(
      screen.getByText("roles.permissions.matrix.summary.wildcards")
    ).toBeTruthy()
  })

  it("does not show the wildcard line without wildcard policies", () => {
    renderSection([policy("product", "read")])

    expect(
      screen.queryByText("roles.permissions.matrix.summary.wildcards")
    ).toBeNull()
  })
})
