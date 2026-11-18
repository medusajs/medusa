// @vitest-environment jsdom
import React from "react"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { TooltipProvider } from "@medusajs/ui"
import { afterEach, describe, expect, it, Mock, vi } from "vitest"

import { buildMatrix, MatrixPolicy } from "../../utils"
import { PermissionsMatrix } from "./permissions-matrix"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key,
  }),
}))

vi.mock("../../../../../hooks/use-document-direction", () => ({
  useDocumentDirection: () => "ltr",
}))

// Radix checkboxes inside a form measure themselves, jsdom has no ResizeObserver.
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
)

const policy = (resource: string, operation: string): MatrixPolicy => ({
  id: `${resource}_${operation}`,
  key: `${resource}:${operation}`,
  resource,
  operation,
})

const policies = [
  ...["read", "create", "update", "delete"].flatMap((operation) => [
    policy("product", operation),
    policy("product_tag", operation),
  ]),
  // A custom operation on one resource of the products group only.
  policy("product", "publish"),
]

const grantable = (ungrantable: string[] = []) =>
  new Set(policies.map((p) => p.id).filter((id) => !ungrantable.includes(id)))

const renderMatrix = ({
  ungrantable = [],
  selection = new Set<string>(),
  onSelectionChange = vi.fn<(next: Set<string>) => void>(),
  onClearAll = vi.fn<() => void>(),
}: {
  ungrantable?: string[]
  selection?: Set<string>
  onSelectionChange?: Mock<(next: Set<string>) => void>
  onClearAll?: Mock<() => void>
} = {}) => {
  const matrix = buildMatrix(policies, grantable(ungrantable))

  render(
    <TooltipProvider>
      <PermissionsMatrix
        matrix={matrix}
        selection={selection}
        onSelectionChange={onSelectionChange}
        onClearAll={onClearAll}
      />
    </TooltipProvider>
  )

  // Groups are collapsed by default.
  fireEvent.click(screen.getByText("Products"))

  return { onSelectionChange, onClearAll }
}

describe("PermissionsMatrix", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders an ungrantable cell disabled and ignores clicks", () => {
    const { onSelectionChange } = renderMatrix({
      ungrantable: ["product_tag_delete"],
    })

    const checkbox = screen.getByRole("checkbox", {
      name: "Delete Product tag",
    })

    expect((checkbox as HTMLButtonElement).disabled).toBe(true)

    fireEvent.click(checkbox)

    expect(onSelectionChange).not.toHaveBeenCalled()
  })

  it("selects the read policy together with a created one", () => {
    const { onSelectionChange } = renderMatrix()

    fireEvent.click(
      screen.getByRole("checkbox", { name: "Create Product tag" })
    )

    expect(onSelectionChange).toHaveBeenCalledTimes(1)

    const next = onSelectionChange.mock.calls[0][0] as Set<string>

    expect(next.has("product_tag_create")).toBe(true)
    expect(next.has("product_tag_read")).toBe(true)
  })

  it("shows full as pressed when all grantable cells are selected despite a locked one", () => {
    const ungrantable = ["product_tag_delete"]
    const selection = new Set(
      [...grantable(ungrantable)].filter((id) => id.startsWith("product"))
    )

    renderMatrix({ ungrantable, selection })

    const group = screen.getByRole("group", {
      name: "roles.permissions.matrix.levelControlLabel",
    })

    const state = (level: string) =>
      within(group)
        .getByText(`roles.permissions.matrix.levels.${level}`)
        .getAttribute("data-state")

    expect(state("full")).toBe("on")
    expect(state("view")).toBe("off")
  })

  it("adds a column for a custom operation and marks resources lacking it", () => {
    renderMatrix()

    expect(
      screen.getByRole("checkbox", { name: "Publish Product" })
    ).toBeTruthy()

    expect(
      screen.getAllByText("roles.permissions.matrix.notAvailable")
    ).toHaveLength(1)
  })

  it("selects every grantable policy of a row with its select-all checkbox", () => {
    const { onSelectionChange } = renderMatrix({
      ungrantable: ["product_tag_delete"],
    })

    const row = screen.getByText("Product tag").closest("tr") as HTMLElement

    fireEvent.click(
      within(row).getByRole("checkbox", {
        name: "roles.permissions.matrix.rowToggle",
      })
    )

    expect(onSelectionChange).toHaveBeenCalledTimes(1)

    const next = onSelectionChange.mock.calls[0][0] as Set<string>

    expect(next).toEqual(
      new Set(["product_tag_read", "product_tag_create", "product_tag_update"])
    )
    expect(next.has("product_tag_delete")).toBe(false)
  })

  it("calls onClearAll when Clear all is pressed", () => {
    const { onClearAll } = renderMatrix()

    fireEvent.click(screen.getByText("roles.permissions.matrix.clearAll"))

    expect(onClearAll).toHaveBeenCalledTimes(1)
  })

  it("does not submit the surrounding form when Enter is pressed in the search box", () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())
    const matrix = buildMatrix(policies, grantable())

    render(
      <TooltipProvider>
        <form onSubmit={onSubmit}>
          <PermissionsMatrix
            matrix={matrix}
            selection={new Set<string>()}
            onSelectionChange={vi.fn()}
            onClearAll={vi.fn()}
          />
        </form>
      </TooltipProvider>
    )

    const search = screen.getByLabelText(
      "roles.permissions.matrix.search.placeholder"
    )

    const notPrevented = fireEvent.keyDown(search, { key: "Enter" })
    expect(notPrevented).toBe(false)

    const otherKey = fireEvent.keyDown(search, { key: "a" })
    expect(otherKey).toBe(true)

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
