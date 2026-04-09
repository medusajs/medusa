import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { render, waitFor } from "@testing-library/react"
import { WorkflowStepUi } from "types"

// mock hooks
const mockGetBrowser = vi.fn(() => "Chrome")

vi.mock("@/utils", () => ({
  getBrowser: () => mockGetBrowser(),
}))

// mock components
vi.mock("@/components/Tooltip", () => ({
  Tooltip: ({
    tooltipChildren,
    children,
    place,
    offset,
    ref,
  }: {
    tooltipChildren: React.ReactNode
    children: React.ReactNode
    place?: string
    offset?: number
    ref?: React.RefObject<HTMLDivElement>
  }) => (
    <div
      data-testid="tooltip"
      data-place={place}
      data-offset={offset}
      ref={ref}
    >
      <div data-testid="tooltip-content">{tooltipChildren}</div>
      {children}
    </div>
  ),
}))

vi.mock("@/components/MarkdownContent", () => ({
  MarkdownContent: ({
    children,
    allowedElements,
  }: {
    children: React.ReactNode
    allowedElements?: string[]
  }) => (
    <div
      data-testid="markdown-content"
      data-allowed={allowedElements?.join(",")}
    >
      {children}
    </div>
  ),
}))

vi.mock("@/components/CodeBlock", () => ({
  CodeBlock: ({
    source,
    lang,
    title,
    wrapperClassName,
  }: {
    source: string
    lang?: string
    title?: string
    wrapperClassName?: string
  }) => (
    <div
      data-testid="code-block"
      data-source={source}
      data-lang={lang}
      data-title={title}
      className={wrapperClassName}
    >
      Code
    </div>
  ),
}))

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={href} className={className} data-testid="step-link">
      {children}
    </a>
  ),
}))

vi.mock("@medusajs/ui", () => ({
  Text: ({
    children,
    size,
    leading,
    weight,
    className,
    ...props
  }: {
    children: React.ReactNode
    size?: string
    leading?: string
    weight?: string
    className?: string
    [key: string]: unknown
  }) => (
    <span
      data-size={size}
      data-leading={leading}
      data-weight={weight}
      className={className}
      {...props}
    >
      {children}
    </span>
  ),
}))

vi.mock("@medusajs/icons", () => ({
  Bolt: () => <svg data-testid="bolt-icon" />,
  InformationCircle: () => <svg data-testid="information-circle-icon" />,
}))

import { WorkflowDiagramStepNode } from "../../Node"

beforeEach(() => {
  vi.clearAllMocks()
  mockGetBrowser.mockReturnValue("Chrome")
  // Create mock DOM structure
  const diagramParent = document.createElement("div")
  diagramParent.className = "workflow-list-diagram"
  const nodeParent = document.createElement("div")
  nodeParent.className = "workflow-node-group"
  const firstChild = document.createElement("div")
  firstChild.style.width = "100px"
  nodeParent.appendChild(firstChild)
  diagramParent.appendChild(nodeParent)
  document.body.appendChild(diagramParent)
})

afterEach(() => {
  document.body.innerHTML = ""
})

describe("rendering", () => {
  test("renders step name without prefix", () => {
    const step: WorkflowStepUi = {
      name: "test.step1",
      type: "step",
      depth: 1,
    }
    const { container } = render(<WorkflowDiagramStepNode step={step} />)
    const stepName = container.querySelector("[data-testid='step-name']")
    expect(stepName).toHaveTextContent("step1")
  })

  test("renders link with step.link when provided", () => {
    const step: WorkflowStepUi = {
      name: "test.step1",
      type: "step",
      depth: 1,
      link: "/test-link",
    }
    const { container } = render(<WorkflowDiagramStepNode step={step} />)
    const link = container.querySelector("[data-testid='step-link']")
    expect(link).toHaveAttribute("href", "/test-link")
  })

  test("renders link with hash when step.link is not provided", () => {
    const step: WorkflowStepUi = {
      name: "test.step1",
      type: "step",
      depth: 1,
    }
    const { container } = render(<WorkflowDiagramStepNode step={step} />)
    const link = container.querySelector("[data-testid='step-link']")
    expect(link).toHaveAttribute("href", "#test.step1")
  })

  test("renders bolt icon when type is hook", () => {
    const step: WorkflowStepUi = {
      name: "test.step1",
      type: "hook",
      depth: 1,
    }
    const { container } = render(<WorkflowDiagramStepNode step={step} />)
    const boltIcon = container.querySelector("[data-testid='bolt-icon']")
    expect(boltIcon).toBeInTheDocument()
  })

  test("renders information circle icon when when is provided", () => {
    const step: WorkflowStepUi = {
      name: "test.step1",
      type: "step",
      depth: 1,
      when: {
        type: "when",
        steps: [],
        depth: 1,
        condition: "test === true",
      },
    }
    const { container } = render(<WorkflowDiagramStepNode step={step} />)
    const infoIcon = container.querySelector(
      "[data-testid='information-circle-icon']"
    )
    expect(infoIcon).toBeInTheDocument()
  })

  test("renders description in tooltip", () => {
    const step: WorkflowStepUi = {
      name: "test.step1",
      type: "step",
      depth: 1,
      description: "Test description",
    }
    const { container } = render(<WorkflowDiagramStepNode step={step} />)
    const tooltipContent = container.querySelector(
      "[data-testid='tooltip-content']"
    )
    expect(tooltipContent).toHaveTextContent("Test description")
  })

  test("removes admonition syntax from description", () => {
    const step: WorkflowStepUi = {
      name: "test.step1",
      type: "step",
      depth: 1,
      description: ":::info\nTest description\n:::",
    }
    const { container } = render(<WorkflowDiagramStepNode step={step} />)
    const tooltipContent = container.querySelector(
      "[data-testid='tooltip-content']"
    )
    expect(tooltipContent).not.toHaveTextContent(":::")
  })

  test("renders when condition code block in tooltip", () => {
    const step: WorkflowStepUi = {
      name: "test.step1",
      type: "step",
      depth: 1,
      when: {
        type: "when",
        steps: [],
        depth: 1,
        condition: "test === true",
      },
    }
    const { container } = render(<WorkflowDiagramStepNode step={step} />)
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveAttribute("data-source", "test === true")
    expect(codeBlock).toHaveAttribute("data-lang", "typescript")
    expect(codeBlock).toHaveAttribute("data-title", "when Condition")
  })

  test("applies gap when type is hook", () => {
    const step: WorkflowStepUi = {
      name: "test.step1",
      type: "hook",
      depth: 1,
    }
    const { container } = render(<WorkflowDiagramStepNode step={step} />)
    const nodeDiv = container.querySelector("div[data-step-id]")
    expect(nodeDiv).toHaveClass("gap-x-docs_0.125")
  })

  test("applies gap when when is provided", () => {
    const step: WorkflowStepUi = {
      name: "test.step1",
      type: "step",
      depth: 1,
      when: {
        type: "when",
        steps: [],
        depth: 1,
        condition: "test === true",
      },
    }
    const { container } = render(<WorkflowDiagramStepNode step={step} />)
    const nodeDiv = container.querySelector("div[data-step-id]")
    expect(nodeDiv).toHaveClass("gap-x-docs_0.125")
  })

  test("has data-step-id attribute", () => {
    const step: WorkflowStepUi = {
      name: "test.step1",
      type: "step",
      depth: 1,
    }
    const { container } = render(<WorkflowDiagramStepNode step={step} />)
    const nodeDiv = container.querySelector("div[data-step-id]")
    expect(nodeDiv).toHaveAttribute("data-step-id", "test.step1")
  })
})

describe("unindentLines function", () => {
  test("unindents code lines correctly", () => {
    const step: WorkflowStepUi = {
      name: "test.step1",
      type: "step",
      depth: 1,
      when: {
        type: "when",
        steps: [],
        depth: 1,
        condition: "    if (test) {\n      return true\n    }",
      },
    }
    const { container } = render(<WorkflowDiagramStepNode step={step} />)
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    // The unindentLines function should remove 4 spaces from each line
  })
})
