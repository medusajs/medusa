import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock functions
const npxToYarnMock = vi.fn((code: string, packageManager: "yarn" | "pnpm", isExecutable?: boolean) => code)

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

vi.mock("@/utils/npx-to-yarn", () => ({
  npxToYarn: (code: string, packageManager: "yarn" | "pnpm", isExecutable?: boolean) =>
    npxToYarnMock(code, packageManager, isExecutable),
}))

import { Npx2YarnCode } from "../index"

describe("render", () => {
  test("renders npm2yarn code", () => {
    const { container } = render(
      <Npx2YarnCode npxCode="npx medusa db:migrate" />
    )
    expect(npxToYarnMock).toHaveBeenCalledTimes(2)
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
    expect(codeTabsChildren![1]).toHaveAttribute("data-label", "pnpm")
    expect(codeTabsChildren![1]).toHaveAttribute("data-value", "pnpm")
    const pnpmCodeBlock = codeTabsChildren![1].querySelector(
      "[data-testid='code-block']"
    )
    expect(pnpmCodeBlock).toBeInTheDocument()
    expect(pnpmCodeBlock).toHaveAttribute("data-lang", "bash")
    expect(codeTabsChildren![2]).toHaveAttribute("data-label", "npx")
    expect(codeTabsChildren![2]).toHaveAttribute("data-value", "npm")
    const npxCodeBlock = codeTabsChildren![2].querySelector(
      "[data-testid='code-block']"
    )
    expect(npxCodeBlock).toBeInTheDocument()
    expect(npxCodeBlock).toHaveAttribute("data-lang", "bash")
    expect(npxCodeBlock).toHaveTextContent("npx medusa db:migrate")
  })

  test("renders npm2yarn code with custom code options", () => {
    const { container } = render(
      <Npx2YarnCode
        npxCode="npx medusa db:migrate"
        title="Custom Title"
      />
    )
    expect(container).toBeInTheDocument()
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveAttribute("data-title", "Custom Title")
  })

  test("calls npxToYarn with isExecutable=false by default", () => {
    npxToYarnMock.mockClear()
    render(<Npx2YarnCode npxCode="npx medusa db:migrate" />)
    expect(npxToYarnMock).toHaveBeenCalledWith("npx medusa db:migrate", "yarn", false)
    expect(npxToYarnMock).toHaveBeenCalledWith("npx medusa db:migrate", "pnpm", false)
  })

  test("calls npxToYarn with isExecutable=true when specified", () => {
    npxToYarnMock.mockClear()
    render(<Npx2YarnCode npxCode="npx create-medusa-app@latest" isExecutable={true} />)
    expect(npxToYarnMock).toHaveBeenCalledWith("npx create-medusa-app@latest", "yarn", true)
    expect(npxToYarnMock).toHaveBeenCalledWith("npx create-medusa-app@latest", "pnpm", true)
  })

  test("calls npxToYarn with isExecutable=false when explicitly set", () => {
    npxToYarnMock.mockClear()
    render(<Npx2YarnCode npxCode="npx medusa db:migrate" isExecutable={false} />)
    expect(npxToYarnMock).toHaveBeenCalledWith("npx medusa db:migrate", "yarn", false)
    expect(npxToYarnMock).toHaveBeenCalledWith("npx medusa db:migrate", "pnpm", false)
  })
})
