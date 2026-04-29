import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock components
vi.mock("@/components/CodeTabs", () => ({
  CodeTabs: ({
    children,
    group,
  }: {
    children: React.ReactNode
    group: string
  }) => (
    <div data-testid="code-tabs" data-group={group}>
      {children}
    </div>
  ),
}))

vi.mock("@/components/CodeTabs/Item", () => ({
  CodeTab: ({
    children,
    label,
    value,
  }: {
    children: React.ReactNode
    label: string
    value: string
  }) => (
    <div data-testid="code-tab" data-label={label} data-value={value}>
      {children}
    </div>
  ),
}))

vi.mock("@/components/CodeBlock", () => ({
  CodeBlock: ({
    source,
    lang,
    title,
  }: {
    source: string
    lang: string
    title?: string
  }) => (
    <div data-testid="code-block" data-lang={lang} data-title={title}>
      {source}
    </div>
  ),
}))

import { Npm2YarnCode } from "../index"

describe("render", () => {
  test("renders npm2yarn code", () => {
    const { container } = render(
      <Npm2YarnCode npmCode="npm install @medusajs/medusa" />
    )
    expect(container).toBeInTheDocument()
    const codeTabs = container.querySelector("[data-testid='code-tabs']")
    expect(codeTabs).toBeInTheDocument()
    expect(codeTabs).toHaveAttribute("data-group", "npm2yarn")
    const codeTabsChildren = codeTabs?.querySelectorAll(
      "[data-testid='code-tab']"
    )
    expect(codeTabsChildren).toHaveLength(3)
    expect(codeTabsChildren![0]).toHaveAttribute("data-label", "yarn")
    expect(codeTabsChildren![0]).toHaveAttribute("data-value", "yarn")
    const yarnCodeBlock = codeTabsChildren![0].querySelector(
      "[data-testid='code-block']"
    )
    expect(yarnCodeBlock).toBeInTheDocument()
    expect(yarnCodeBlock).toHaveAttribute("data-lang", "bash")
    expect(yarnCodeBlock).toHaveTextContent("yarn add @medusajs/medusa")
    expect(codeTabsChildren![1]).toHaveAttribute("data-label", "pnpm")
    expect(codeTabsChildren![1]).toHaveAttribute("data-value", "pnpm")
    const pnpmCodeBlock = codeTabsChildren![1].querySelector(
      "[data-testid='code-block']"
    )
    expect(pnpmCodeBlock).toBeInTheDocument()
    expect(pnpmCodeBlock).toHaveAttribute("data-lang", "bash")
    expect(pnpmCodeBlock).toHaveTextContent("pnpm add @medusajs/medusa")
    expect(codeTabsChildren![2]).toHaveAttribute("data-label", "npm")
    expect(codeTabsChildren![2]).toHaveAttribute("data-value", "npm")
    const npmCodeBlock = codeTabsChildren![2].querySelector(
      "[data-testid='code-block']"
    )
    expect(npmCodeBlock).toBeInTheDocument()
    expect(npmCodeBlock).toHaveAttribute("data-lang", "bash")
    expect(npmCodeBlock).toHaveTextContent("npm install @medusajs/medusa")
  })

  test("renders npm2yarn code with custom code options", () => {
    const { container } = render(
      <Npm2YarnCode
        npmCode="npm install @medusajs/medusa"
        title="Custom Title"
      />
    )
    expect(container).toBeInTheDocument()
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveAttribute("data-title", "Custom Title")
  })
})
