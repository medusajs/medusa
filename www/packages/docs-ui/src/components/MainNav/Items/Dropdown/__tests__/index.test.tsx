import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock components
vi.mock("@/components/Menu", () => ({
  Menu: ({
    items,
    className,
    itemsOnClick,
  }: {
    items: unknown[]
    className?: string
    itemsOnClick?: () => void
  }) => (
    <div data-testid="menu" className={className}>
      {items.map((item: unknown, index: number) => (
        <div key={index} data-testid={`menu-item-${index}`}>
          {JSON.stringify(item)}
        </div>
      ))}
      {itemsOnClick && (
        <button data-testid="menu-items-onclick" onClick={itemsOnClick}>
          Close
        </button>
      )}
    </div>
  ),
}))

vi.mock("@/components/MainNav/Items/Link", () => ({
  MainNavItemLink: ({
    item,
    isActive,
    icon,
    className,
  }: {
    item: { title: string; link: string; type: string }
    isActive: boolean
    icon?: React.ReactNode
    className?: string
  }) => (
    <a
      href={item.link}
      data-testid="nav-item-link"
      data-active={isActive}
      className={className}
    >
      {item.title}
      {icon}
    </a>
  ),
}))

import { MainNavItemDropdown } from "../../Dropdown"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders dropdown with title when no link", () => {
    const item = {
      type: "dropdown" as const,
      title: "Test Dropdown",
      children: [
        {
          type: "link" as const,
          title: "Child 1",
          link: "/child1",
        },
      ],
    }
    const { container } = render(
      <MainNavItemDropdown item={item} isActive={false} />
    )
    const title = container.querySelector("[data-testid='dropdown-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test Dropdown")
  })

  test("renders link when item has link", () => {
    const item = {
      type: "dropdown" as const,
      title: "Test Dropdown",
      link: "/test",
      children: [
        {
          type: "link" as const,
          title: "Child 1",
          link: "/child1",
        },
      ],
    }
    const { container } = render(
      <MainNavItemDropdown item={item} isActive={false} />
    )
    const link = container.querySelector("[data-testid='nav-item-link']")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test")
  })

  test("hides menu when not hovered", () => {
    const item = {
      type: "dropdown" as const,
      title: "Test Dropdown",
      children: [
        {
          type: "link" as const,
          title: "Child 1",
          link: "/child1",
        },
      ],
    }
    const { container } = render(
      <MainNavItemDropdown item={item} isActive={false} />
    )
    const menu = container.querySelector("[data-testid='menu']")
    expect(menu).toHaveClass("hidden")
  })

  test("applies active styles when isActive is true", () => {
    const item = {
      type: "dropdown" as const,
      title: "Test Dropdown",
      children: [
        {
          type: "link" as const,
          title: "Child 1",
          link: "/child1",
        },
      ],
    }
    const { container } = render(
      <MainNavItemDropdown item={item} isActive={true} />
    )
    const title = container.querySelector(
      "[data-testid='dropdown-title-wrapper']"
    )
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass("text-medusa-fg-base")
  })

  test("applies inactive styles when isActive is false", () => {
    const item = {
      type: "dropdown" as const,
      title: "Test Dropdown",
      children: [
        {
          type: "link" as const,
          title: "Child 1",
          link: "/child1",
        },
      ],
    }
    const { container } = render(
      <MainNavItemDropdown item={item} isActive={false} />
    )
    const title = container.querySelector(
      "[data-testid='dropdown-title-wrapper']"
    )
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass(
      "text-medusa-fg-subtle hover:text-medusa-fg-base"
    )
  })

  test("rotates triangle icon when open", () => {
    const item = {
      type: "dropdown" as const,
      title: "Test Dropdown",
      children: [
        {
          type: "link" as const,
          title: "Child 1",
          link: "/child1",
        },
      ],
    }
    const { container } = render(
      <MainNavItemDropdown item={item} isActive={false} />
    )
    const dropdown = container.querySelector("[data-testid='dropdown-wrapper']")
    fireEvent.mouseOver(dropdown!)
    const icons = container.querySelectorAll("[data-testid='triangle-icon']")
    icons.forEach((icon) => {
      expect(icon).toHaveClass("rotate-180")
    })
  })

  test("applies custom className", () => {
    const item = {
      type: "dropdown" as const,
      title: "Test Dropdown",
      children: [
        {
          type: "link" as const,
          title: "Child 1",
          link: "/child1",
        },
      ],
    }
    const { container } = render(
      <MainNavItemDropdown
        item={item}
        isActive={false}
        className="custom-class"
      />
    )
    const title = container.querySelector(
      "[data-testid='dropdown-title-wrapper']"
    )
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass("custom-class")
  })

  test("applies custom wrapperClassName", () => {
    const item = {
      type: "dropdown" as const,
      title: "Test Dropdown",
      children: [
        {
          type: "link" as const,
          title: "Child 1",
          link: "/child1",
        },
      ],
    }
    const { container } = render(
      <MainNavItemDropdown
        item={item}
        isActive={false}
        wrapperClassName="custom-wrapper-class"
      />
    )
    const wrapper = container.querySelector("[data-testid='dropdown-wrapper']")
    expect(wrapper).toHaveClass("custom-wrapper-class")
  })
})

describe("interaction", () => {
  test("renders menu when hovered", () => {
    const item = {
      type: "dropdown" as const,
      title: "Test Dropdown",
      children: [
        {
          type: "link" as const,
          title: "Child 1",
          link: "/child1",
        },
      ],
    }
    const { container } = render(
      <MainNavItemDropdown item={item} isActive={false} />
    )
    const dropdown = container.querySelector("[data-testid='dropdown-wrapper']")
    fireEvent.mouseOver(dropdown!)
    const menu = container.querySelector("[data-testid='menu']")
    expect(menu).toBeInTheDocument()
    expect(menu).not.toHaveClass("hidden")
  })

  test("closes menu when itemsOnClick is triggered", () => {
    const item = {
      type: "dropdown" as const,
      title: "Test Dropdown",
      children: [
        {
          type: "link" as const,
          title: "Child 1",
          link: "/child1",
        },
      ],
    }
    const { container } = render(
      <MainNavItemDropdown item={item} isActive={false} />
    )
    const dropdown = container.querySelector("[data-testid='dropdown-wrapper']")
    fireEvent.mouseOver(dropdown!)
    const closeButton = container.querySelector(
      "[data-testid='menu-items-onclick']"
    )
    fireEvent.click(closeButton!)
    const menu = container.querySelector("[data-testid='menu']")
    expect(menu).toHaveClass("hidden")
  })
})
