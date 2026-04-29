import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { CodeBlockProps } from "../../CodeBlock"
import { InlineCodeProps } from "../../InlineCode"

// mock data
const mockSource = "console.log('Hello, world!')"

// mock components
vi.mock("@/components/CodeBlock", () => ({
  CodeBlock: ({ source, ...codeBlockProps }: CodeBlockProps) => (
    <div data-testid="code-block">
      <div data-testid="code-block-source">{source}</div>
      <div data-testid="code-block-props">
        {JSON.stringify(codeBlockProps as Record<string, unknown>)}
      </div>
    </div>
  ),
}))
vi.mock("@/components/InlineCode", () => ({
  InlineCode: ({ children, ...inlineCodeProps }: InlineCodeProps) => (
    <div data-testid="inline-code">
      <div data-testid="inline-code-children">{children}</div>
      <div data-testid="inline-code-props">
        {JSON.stringify(inlineCodeProps)}
      </div>
    </div>
  ),
}))
vi.mock("@/components/MermaidDiagram", () => ({
  MermaidDiagram: ({ diagramContent }: { diagramContent: string }) => (
    <div data-testid="mermaid-diagram">{diagramContent}</div>
  ),
}))
vi.mock("@/components/Npm2YarnCode", () => ({
  Npm2YarnCode: ({ npmCode }: { npmCode: string }) => (
    <div data-testid="npm2yarn-code">{npmCode}</div>
  ),
}))
vi.mock("@/components/Npx2YarnCode", () => ({
  Npx2YarnCode: ({ npxCode, isExecutable }: { npxCode: string; isExecutable?: boolean }) => (
    <div data-testid="npx2yarn-code" data-is-executable={isExecutable}>
      {npxCode}
    </div>
  ),
}))

import { CodeMdx } from "../../CodeMdx"

describe("render", () => {
  test("renders without children", () => {
    const { container } = render(<CodeMdx />)
    expect(container).toBeInTheDocument()
    expect(container).toBeEmptyDOMElement()
  })

  test("renders with children", () => {
    const { container } = render(<CodeMdx>{mockSource}</CodeMdx>)
    expect(container).toBeInTheDocument()
    const inlineCodeChildren = container.querySelector(
      "[data-testid='inline-code-children']"
    )
    expect(inlineCodeChildren).toBeInTheDocument()
    expect(inlineCodeChildren).toHaveTextContent(mockSource)
  })

  test("renders with className", () => {
    const { container } = render(
      <CodeMdx className="language-javascript">{mockSource}</CodeMdx>
    )
    expect(container).toBeInTheDocument()
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    const codeBlockSource = container.querySelector(
      "[data-testid='code-block-source']"
    )
    expect(codeBlockSource).toBeInTheDocument()
    expect(codeBlockSource).toHaveTextContent(mockSource)
  })

  test("renders with npm2yarn", () => {
    const { container } = render(
      <CodeMdx npm2yarn={true} className="language-bash">
        {mockSource}
      </CodeMdx>
    )
    expect(container).toBeInTheDocument()
    const npm2yarnCode = container.querySelector(
      "[data-testid='npm2yarn-code']"
    )
    expect(npm2yarnCode).toBeInTheDocument()
    expect(npm2yarnCode).toHaveTextContent(mockSource)
  })

  test("renders with npx2yarn", () => {
    const { container } = render(
      <CodeMdx npx2yarn={true} className="language-bash">
        {mockSource}
      </CodeMdx>
    )
    expect(container).toBeInTheDocument()
    const npx2yarnCode = container.querySelector(
      "[data-testid='npx2yarn-code']"
    )
    expect(npx2yarnCode).toBeInTheDocument()
    expect(npx2yarnCode).toHaveTextContent(mockSource)
    expect(npx2yarnCode).toHaveAttribute("data-is-executable", "false")
  })

  test("renders with npx2yarnExec", () => {
    const { container } = render(
      <CodeMdx npx2yarnExec={true} className="language-bash">
        {mockSource}
      </CodeMdx>
    )
    expect(container).toBeInTheDocument()
    const npx2yarnCode = container.querySelector(
      "[data-testid='npx2yarn-code']"
    )
    expect(npx2yarnCode).toBeInTheDocument()
    expect(npx2yarnCode).toHaveTextContent(mockSource)
    expect(npx2yarnCode).toHaveAttribute("data-is-executable", "true")
  })

  test("renders with npx2yarnExec taking precedence over npx2yarn", () => {
    const { container } = render(
      <CodeMdx npx2yarn={true} npx2yarnExec={true} className="language-bash">
        {mockSource}
      </CodeMdx>
    )
    expect(container).toBeInTheDocument()
    const npx2yarnCode = container.querySelector(
      "[data-testid='npx2yarn-code']"
    )
    expect(npx2yarnCode).toBeInTheDocument()
    expect(npx2yarnCode).toHaveAttribute("data-is-executable", "true")
  })

  test("renders with mermaid", () => {
    const { container } = render(
      <CodeMdx className="language-mermaid">{mockSource}</CodeMdx>
    )
    expect(container).toBeInTheDocument()
    const mermaidDiagram = container.querySelector(
      "[data-testid='mermaid-diagram']"
    )
    expect(mermaidDiagram).toBeInTheDocument()
    expect(mermaidDiagram).toHaveTextContent(mockSource)
  })

  test("renders with codeBlockProps", () => {
    const codeBlockProps = { className: "language-javascript" }
    const { container } = render(
      <CodeMdx codeBlockProps={codeBlockProps} className="language-javascript">
        {mockSource}
      </CodeMdx>
    )
    expect(container).toBeInTheDocument()
    const codeBlockPropsElement = container.querySelector(
      "[data-testid='code-block-props']"
    )
    expect(codeBlockPropsElement).toBeInTheDocument()
    const parsedContent = JSON.parse(codeBlockPropsElement!.textContent || "{}")
    expect(parsedContent).toEqual({
      ...codeBlockProps,
      lang: "javascript",
    })
  })

  test("renders with inlineCodeProps", () => {
    const inlineCodeProps: Partial<InlineCodeProps> = { variant: "grey-bg" }
    const { container } = render(
      <CodeMdx inlineCodeProps={inlineCodeProps}>{mockSource}</CodeMdx>
    )
    expect(container).toBeInTheDocument()
    const inlineCodePropsElement = container.querySelector(
      "[data-testid='inline-code-props']"
    )
    expect(inlineCodePropsElement).toBeInTheDocument()
    expect(inlineCodePropsElement).toHaveTextContent(
      JSON.stringify(inlineCodeProps)
    )
  })
})
