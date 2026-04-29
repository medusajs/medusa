import React from "react"
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import { describe, test, expect, vi, beforeEach } from "vitest"
import type { OpenAPI } from "types"
import { TagOperationParametersDefaultProps } from "../../Default"
import { TagOperationParametersProps } from "../../.."

// mock data
const mockSchema: OpenAPI.SchemaObject = {
  title: "test-title",
  oneOf: [
    {
      type: "object",
      properties: {
        name: { type: "string", properties: {} },
      },
    },
    {
      type: "string",
      properties: {}
    }
  ],
  properties: {}
}

// mock components
vi.mock("@/components/Tags/Operation/Parameters/Types/Default", () => ({
  default: ({ schema }: TagOperationParametersDefaultProps) => (
    <div data-testid="default">{JSON.stringify(schema)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/Parameters/Nested", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="nested">{children}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/Parameters", () => ({
  default: ({ schemaObject }: TagOperationParametersProps) => (
    <div data-testid="parameters">{JSON.stringify(schemaObject)}</div>
  ),
}))
vi.mock("docs-ui", () => ({
  Details: ({ children, summaryElm }: { children: React.ReactNode, summaryElm: React.ReactNode }) => (
    <div data-testid="details">
      {summaryElm}
      {children}
    </div>
  ),
  Loading: () => <div data-testid="loading">Loading...</div>,
}))

import TagsOperationParametersTypesOneOf from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("does not render when schema is not an oneOf type", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string", properties: {} },
      },
    }
    const { container } = render(<TagsOperationParametersTypesOneOf schema={modifiedSchema} />)
    expect(container).toBeEmptyDOMElement()
  })

  test("renders one of type schema not nested by default", async () => {
    const { container } = render(<TagsOperationParametersTypesOneOf schema={mockSchema} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).not.toBeInTheDocument()
      const nestedElement = container.querySelector("[data-testid='nested']")
      expect(nestedElement).not.toBeInTheDocument()
      const parametersElement = container.querySelector("[data-testid='parameters']")
      expect(parametersElement).toBeInTheDocument()
      expect(parametersElement).toHaveTextContent(JSON.stringify(mockSchema.oneOf![0]))
    })
  })
  
  test("renders nested one of type schema", async () => {
    const { container } = render(<TagsOperationParametersTypesOneOf schema={mockSchema} isNested={true} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      const nestedElement = container.querySelector("[data-testid='nested']")
      expect(nestedElement).toBeInTheDocument()
      const parametersElement = nestedElement!.querySelector("[data-testid='parameters']")
      expect(parametersElement).toBeInTheDocument()
      expect(parametersElement).toHaveTextContent(JSON.stringify(mockSchema.oneOf![0]))
    })
  })

  test("renders parameter name when provided and nested is enabled", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      parameterName: "test-parameter-name",
    }
    const { container } = render(<TagsOperationParametersTypesOneOf schema={modifiedSchema} isNested={true} />)
    await waitFor(() => {
      const detailsElement = container.querySelector("[data-testid='details']")
      expect(detailsElement).toBeInTheDocument()
      const summaryElement = detailsElement!.querySelector("summary")
      expect(summaryElement).toBeInTheDocument()
      expect(summaryElement).toHaveTextContent(modifiedSchema.parameterName!)
    })
  })

  test("renders schema title when parameter name is not provided and nested is enabled", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      parameterName: undefined,
    }
    const { container } = render(<TagsOperationParametersTypesOneOf schema={modifiedSchema} isNested={true} />)
    await waitFor(() => {
      const detailsElement = container.querySelector("[data-testid='details']")
      expect(detailsElement).toBeInTheDocument()
      const summaryElement = detailsElement!.querySelector("summary")
      expect(summaryElement).toBeInTheDocument()
      expect(summaryElement).toHaveTextContent(modifiedSchema.title!)
    })
  })
})

describe("interaction", () => {
  test("toggles between one of options when clicking on the tab", async () => {
    const { container } = render(<TagsOperationParametersTypesOneOf schema={mockSchema} />)
    const tabElements = container.querySelectorAll("[data-testid='tab']")
    expect(tabElements).toHaveLength(mockSchema.oneOf!.length)
    fireEvent.click(tabElements[1]!)
    await waitFor(() => {
      const parametersElement = container.querySelector("[data-testid='parameters']")
      expect(parametersElement).toBeInTheDocument()
      expect(parametersElement).toHaveTextContent(JSON.stringify(mockSchema.oneOf![1]))
    })
  })
})