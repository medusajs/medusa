import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { OpenAPI } from "types"
import { InlineCodeProps } from "docs-ui"

// mock data
const mockSchema: OpenAPI.SchemaObject = {
  type: "object",
  properties: {
    name: { type: "string", properties: {} },
  },
}

// mock functions
const mockCapitalize = vi.fn((text: string) => text.charAt(0).toUpperCase() + text.slice(1))

// mock components
vi.mock("docs-ui", () => ({
  InlineCode: ({ children }: InlineCodeProps) => (
    <div data-testid="inline-code">{children}</div>
  ),
  Link: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} data-testid="link" />
  ),
  capitalize: (text: string) => mockCapitalize(text),
}))
vi.mock("@/components/MDXContent/Client", () => ({
  default: ({ content }: { content: string }) => (
    <div data-testid="mdx-content">{content}</div>
  ),
}))

import TagOperationParametersDescription from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders default when schema has a default", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      default: "test-default",
    }
    const { container } = render(<TagOperationParametersDescription schema={modifiedSchema} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveTextContent("Default: " + JSON.stringify(modifiedSchema.default))
    })
  })

  test("does not render default when schema does not have a default", () => {
    const { container } = render(<TagOperationParametersDescription schema={mockSchema} />)
    const defaultElement = container.querySelector("[data-testid='default']")
    expect(defaultElement).not.toBeInTheDocument()
  })
  
  test("renders enum when schema has an enum", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      enum: ["test-enum1", "test-enum2"],
    }
    const { container } = render(<TagOperationParametersDescription schema={modifiedSchema} />)
    await waitFor(() => {
      const enumElement = container.querySelector("[data-testid='enum']")
      expect(enumElement).toBeInTheDocument()
      expect(enumElement).toHaveTextContent("Enum: " + modifiedSchema.enum!.map((value) => JSON.stringify(value)).join(", "))
    })
  })

  test("does not render enum when schema does not have an enum", () => {
    const { container } = render(<TagOperationParametersDescription schema={mockSchema} />)
    const enumElement = container.querySelector("[data-testid='enum']")
    expect(enumElement).not.toBeInTheDocument()
  })
  
  test("renders example when schema has an example", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      example: "test-example",
    }
    const { container } = render(<TagOperationParametersDescription schema={modifiedSchema} />)
    const exampleElement = container.querySelector("[data-testid='example']")
    expect(exampleElement).toBeInTheDocument()
    expect(exampleElement).toHaveTextContent("Example: " + JSON.stringify(modifiedSchema.example))
  })

  test("does not render example when schema does not have an example", () => {
    const { container } = render(<TagOperationParametersDescription schema={mockSchema} />)
    const exampleElement = container.querySelector("[data-testid='example']")
    expect(exampleElement).not.toBeInTheDocument()
  })
  
  test("renders description when schema has a description", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      description: "test-description",
    }
    const { container } = render(<TagOperationParametersDescription schema={modifiedSchema} />)
    const descriptionElement = container.querySelector("[data-testid='mdx-content']")
    expect(descriptionElement).toBeInTheDocument()
    expect(descriptionElement).toHaveTextContent(mockCapitalize(modifiedSchema.description!))
  })

  test("does not render description when schema does not have a description", () => {
    const { container } = render(<TagOperationParametersDescription schema={mockSchema} />)
    const descriptionElement = container.querySelector("[data-testid='mdx-content']")
    expect(descriptionElement).not.toBeInTheDocument()
  })
  
  test("renders related guide when schema has a related guide", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      externalDocs: {
        url: "https://example.com",
        description: "test-description",
      },
    }
    const { container } = render(<TagOperationParametersDescription schema={modifiedSchema} />)
    const relatedGuideElement = container.querySelector("[data-testid='related-guide']")
    expect(relatedGuideElement).toBeInTheDocument()
    expect(relatedGuideElement).toHaveTextContent("Related guide: " + modifiedSchema.externalDocs!.description)
    const link = relatedGuideElement!.querySelector("[data-testid='link']")
    expect(link).toHaveAttribute("href", modifiedSchema.externalDocs!.url)
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("variant", "content")
  })

  test("renders related guide with default description when schema has a related guide with no description", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      externalDocs: {
        url: "https://example.com",
      },
    }
    const { container } = render(<TagOperationParametersDescription schema={modifiedSchema} />)
    const relatedGuideElement = container.querySelector("[data-testid='related-guide']")
    expect(relatedGuideElement).toBeInTheDocument()
    expect(relatedGuideElement).toHaveTextContent("Related guide: " + "Read More")
    const link = relatedGuideElement!.querySelector("[data-testid='link']")
    expect(link).toHaveAttribute("href", modifiedSchema.externalDocs!.url)
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("variant", "content")
  })

  test("does not render related guide when schema does not have a related guide", () => {
    const { container } = render(<TagOperationParametersDescription schema={mockSchema} />)
    const relatedGuideElement = container.querySelector("[data-testid='related-guide']")
    expect(relatedGuideElement).not.toBeInTheDocument()
  })
})