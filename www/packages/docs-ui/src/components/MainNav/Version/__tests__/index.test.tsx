import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock data
const mockVersion = {
  number: "2.0.0",
  releaseUrl: "https://github.com/example/releases/v2.0.0",
  hide: false,
}

const defaultUseSiteConfigReturn = {
  config: {
    version: mockVersion,
  },
}

// mock functions
const mockUseSiteConfig = vi.fn(() => defaultUseSiteConfigReturn)

// mock components
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))

vi.mock("next/link", () => ({
  default: (props: {
    href: string
    target?: string
    className?: string
    children: React.ReactNode
  }) => (
    <a href={props.href} target={props.target} className={props.className}>
      {props.children}
    </a>
  ),
}))

vi.mock("@/components/Tooltip", () => ({
  Tooltip: ({
    html,
    children,
  }: {
    html: string
    children: React.ReactNode
  }) => (
    <div data-testid="tooltip" data-html={html}>
      {children}
    </div>
  ),
}))

import { MainNavVersion } from "../../Version"

beforeEach(() => {
  mockUseSiteConfig.mockReturnValue(defaultUseSiteConfigReturn)
})

describe("rendering", () => {
  test("renders version link", () => {
    const { container } = render(<MainNavVersion />)
    const link = container.querySelector("a")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", mockVersion.releaseUrl)
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveTextContent(`v${mockVersion.number}`)
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveAttribute(
      "data-html",
      "View the release notes<br/>on GitHub"
    )
  })

  test("hides link when version.hide is true", () => {
    mockUseSiteConfig.mockReturnValueOnce({
      config: {
        version: {
          ...mockVersion,
          hide: true,
        },
      },
    })
    const { container } = render(<MainNavVersion />)
    const link = container.querySelector("a")
    expect(link).toHaveClass("hidden")
  })
})
