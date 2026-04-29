import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock data
const mockMenuItems = [
  {
    type: "link" as const,
    title: "Menu Item",
    link: "/item",
  },
]

// mock components
vi.mock("@/components/Menu", () => ({
  Menu: ({ items, className }: { items: unknown[]; className?: string }) => (
    <div data-testid="dropdown-menu" className={className}>
      {items.map((item: unknown, index: number) => (
        <div key={index} data-testid={`dropdown-menu-item-${index}`}>
          {JSON.stringify(item)}
        </div>
      ))}
    </div>
  ),
}))

vi.mock("@/providers/BrowserProvider", () => ({
  useIsBrowser: () => ({
    isBrowser: true,
  }),
}))

const mockMenuComponent = <div data-testid="custom-menu">Custom Menu</div>

import { DropdownMenu } from "../../Dropdown"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders dropdown button", () => {
    const { container } = render(
      <DropdownMenu
        dropdownButtonContent="Click me"
        menuItems={mockMenuItems}
      />
    )
    const button = container.querySelector("[data-testid='dropdown-button']")
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent("Click me")
  })

  test("hides menu when closed", () => {
    const { container } = render(
      <DropdownMenu
        dropdownButtonContent="Click me"
        menuItems={mockMenuItems}
      />
    )
    const menu = container.querySelector("[data-testid='dropdown-menu']")
    expect(menu).toHaveClass("hidden")
  })

  test("renders custom menuComponent when provided", () => {
    const { container } = render(
      <DropdownMenu
        dropdownButtonContent="Click me"
        menuComponent={mockMenuComponent}
        menuItems={mockMenuItems}
      />
    )
    const customMenu = container.querySelector("[data-testid='custom-menu']")
    expect(customMenu).toBeInTheDocument()
    expect(customMenu).toHaveTextContent("Custom Menu")
    const menu = container.querySelector("[data-testid='dropdown-menu']")
    expect(menu).not.toBeInTheDocument()
  })

  test("returns null when neither menuComponent nor menuItems are provided", () => {
    const { container } = render(
      <DropdownMenu dropdownButtonContent="Click me" />
    )
    expect(container.firstChild).toBeNull()
  })

  test("applies custom className", () => {
    const { container } = render(
      <DropdownMenu
        dropdownButtonContent="Click me"
        menuItems={mockMenuItems}
        className="custom-class"
      />
    )
    const wrapper = container.querySelector("[data-testid='dropdown-wrapper']")
    expect(wrapper).toHaveClass("custom-class")
  })

  test("applies custom dropdownButtonClassName", () => {
    const { container } = render(
      <DropdownMenu
        dropdownButtonContent="Click me"
        menuItems={mockMenuItems}
        dropdownButtonClassName="custom-button-class"
      />
    )
    const button = container.querySelector("[data-testid='dropdown-button']")
    expect(button).toHaveClass("custom-button-class")
  })

  test("applies custom menuClassName", () => {
    const { container } = render(
      <DropdownMenu
        dropdownButtonContent="Click me"
        menuItems={mockMenuItems}
        menuClassName="custom-menu-class"
      />
    )
    const menu = container.querySelector("[data-testid='dropdown-menu']")
    expect(menu).toHaveClass("custom-menu-class")
  })
})

describe("interaction", () => {
  test("renders menu when open", () => {
    const { container } = render(
      <DropdownMenu
        dropdownButtonContent="Click me"
        menuItems={mockMenuItems}
      />
    )
    const button = container.querySelector("[data-testid='dropdown-button']")
    fireEvent.click(button!)
    const menu = container.querySelector("[data-testid='dropdown-menu']")
    expect(menu).toBeInTheDocument()
    expect(menu).not.toHaveClass("hidden")
  })
  test("toggles menu when button is clicked", () => {
    const { container } = render(
      <DropdownMenu
        dropdownButtonContent="Click me"
        menuItems={mockMenuItems}
      />
    )
    const button = container.querySelector("[data-testid='dropdown-button']")
    let menu = container.querySelector("[data-testid='dropdown-menu']")

    expect(menu).toHaveClass("hidden")
    fireEvent.click(button!)
    menu = container.querySelector("[data-testid='dropdown-menu']")
    expect(menu).not.toHaveClass("hidden")

    fireEvent.click(button!)
    menu = container.querySelector("[data-testid='dropdown-menu']")
    expect(menu).toHaveClass("hidden")
  })

  test("closes menu when clicking outside", () => {
    const { container } = render(
      <div>
        <DropdownMenu
          dropdownButtonContent="Click me"
          menuItems={mockMenuItems}
        />
        <div data-testid="outside-element">Outside Element</div>
      </div>
    )
    const button = container.querySelector("[data-testid='dropdown-button']")
    fireEvent.click(button!)
    let menu = container.querySelector("[data-testid='dropdown-menu']")
    expect(menu).not.toHaveClass("hidden")

    // Simulate click outside
    const outsideElement = container.querySelector(
      "[data-testid='outside-element']"
    )
    fireEvent.click(outsideElement!)
    menu = container.querySelector("[data-testid='dropdown-menu']")
    expect(menu).toHaveClass("hidden")
  })

  test("uses external open state when provided", () => {
    const mockSetOpen = vi.fn()
    const { container } = render(
      <DropdownMenu
        dropdownButtonContent="Click me"
        menuItems={mockMenuItems}
        open={true}
        setOpen={mockSetOpen}
      />
    )
    const menu = container.querySelector("[data-testid='dropdown-menu']")
    expect(menu).not.toHaveClass("hidden")
  })

  test("calls external setOpen when button is clicked", () => {
    const mockSetOpen = vi.fn()
    const { container } = render(
      <DropdownMenu
        dropdownButtonContent="Click me"
        menuItems={mockMenuItems}
        open={false}
        setOpen={mockSetOpen}
      />
    )
    const button = container.querySelector("[data-testid='dropdown-button']")
    fireEvent.click(button!)
    expect(mockSetOpen).toHaveBeenCalledWith(true)
  })
})
