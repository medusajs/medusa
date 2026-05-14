import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render } from "@testing-library/react"
import { OpenAPI } from "types"

// mock data
const mockResponse: OpenAPI.ResponseObject = {
  description: "Mock response",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            properties: {}
          },
          age: {
            type: "number",
            properties: {}
          }
        },
      },
    },
  },
}
const mockExamples: OpenAPI.ExampleObject[] = [
  {
    title: "example 1",
    value: "example 1",
    content: "Example 1",
  },
]

// mock function
const mockUseSchemaExample = vi.fn((options: unknown) => ({ 
  examples: mockExamples
}))

// mock components and hooks
vi.mock("docs-ui", () => ({
  CodeBlock: ({ source, collapsed, className, lang }: { source: string, collapsed: boolean, className: string, lang: string }) => (
    <div data-testid="code-block" data-collapsed={collapsed} className={className} data-lang={lang}>{source}</div>
  ),
}))
vi.mock("@/hooks/use-schema-example", () => ({
  default: (options: unknown) => mockUseSchemaExample(options),
}))

import TagsOperationCodeSectionResponsesSample from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("selects first example by default", () => {
    const { getByTestId, container } = render(
      <TagsOperationCodeSectionResponsesSample response={mockResponse} />
    )
    const codeBlockElement = getByTestId("code-block")
    expect(codeBlockElement).toBeInTheDocument()
    expect(codeBlockElement).toHaveAttribute("data-collapsed", "true")
    expect(codeBlockElement).toHaveAttribute("data-lang", "json")
    expect(codeBlockElement).toHaveTextContent("Example 1")
  })

  test("renders empty response when no examples are available", () => {
    mockUseSchemaExample.mockReturnValue({
      examples: [],
    })
    const { container } = render(
      <TagsOperationCodeSectionResponsesSample response={mockResponse} />
    )
    expect(container).toHaveTextContent("Empty Response")
  })

  test("renders content type when content is available", () => {
    const { container } = render(
      <TagsOperationCodeSectionResponsesSample response={mockResponse} />
    )
    const contentTypeElement = container.querySelector("[data-testid='content-type']")
    expect(contentTypeElement).toBeInTheDocument()
    expect(contentTypeElement).toHaveTextContent("Content type: application/json")
  })

  test("doesn't render content type when content is empty", () => {
    const modifiedResponse: OpenAPI.ResponseObject = {
      ...mockResponse,
      content: {},
    }
    const { container } = render(
      <TagsOperationCodeSectionResponsesSample response={modifiedResponse} />
    )
    const contentTypeElement = container.querySelector("[data-testid='content-type']")
    expect(contentTypeElement).not.toBeInTheDocument()
  })

  test("doesn't render select for single example", () => {
    mockUseSchemaExample.mockReturnValue({
      examples: [
        { title: "example 1", value: "example 1", content: "Example 1" },
      ],
    })
    const { container } = render(
      <TagsOperationCodeSectionResponsesSample response={mockResponse} />
    )
    const selectElement = container.querySelector("select")
    expect(selectElement).not.toBeInTheDocument()
  })

  test("renders select for multiple examples", () => {
    mockUseSchemaExample.mockReturnValue({
      examples: [
        { title: "example 1", value: "example 1", content: "Example 1" },
        { title: "example 2", value: "example 2", content: "Example 2" },
      ],
    })
    const { container } = render(
      <TagsOperationCodeSectionResponsesSample response={mockResponse} />
    )
    const selectElement = container.querySelector("select")
    expect(selectElement).toBeInTheDocument()
    const options = selectElement!.querySelectorAll("option")
    expect(options).toHaveLength(2)
    expect(options[0]).toHaveValue("example 1")
    expect(options[1]).toHaveValue("example 2")
    expect(options[0]).toHaveTextContent("example 1")
    expect(options[1]).toHaveTextContent("example 2")
  })

  test("renders empty response when no example is selected", () => {
    mockUseSchemaExample.mockReturnValue({
      examples: [
        { title: "example 1", value: "example 1", content: "Example 1" },
        { title: "example 2", value: "example 2", content: "Example 2" },
      ],
    })
    const { container } = render(
      <TagsOperationCodeSectionResponsesSample response={mockResponse} />
    )
    const selectElement = container.querySelector("select")
    expect(selectElement).toBeInTheDocument()
    fireEvent.change(selectElement!, { target: { value: "example 3" } })
    const codeBlockElement = container.querySelector(
      "[data-testid='code-block']"
    )
    expect(codeBlockElement).not.toBeInTheDocument()
    expect(container).toHaveTextContent("Empty Response")
  })
})

describe("interaction", () => {
  test("renders code block for selected example when select is changed", () => {
    mockUseSchemaExample.mockReturnValue({
      examples: [
        { title: "example 1", value: "example 1", content: "Example 1" },
        { title: "example 2", value: "example 2", content: "Example 2" },
      ],
    })
    const { container, getByTestId } = render(
      <TagsOperationCodeSectionResponsesSample response={mockResponse} />
    )
    const selectElement = container.querySelector("select")
    fireEvent.change(selectElement!, { target: { value: "example 2" } })
    const codeBlockElement = getByTestId("code-block")
    expect(codeBlockElement).toHaveTextContent("Example 2")
  })
})