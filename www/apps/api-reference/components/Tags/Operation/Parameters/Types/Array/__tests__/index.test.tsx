import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { OpenAPI } from "types"
import { TagOperationParametersProps } from "../../.."
import { TagOperationParametersDefaultProps } from "../../Default"

// mock components
vi.mock("@/components/Tags/Operation/Parameters", () => ({
  default: ({ schemaObject }: TagOperationParametersProps) => (
    <div data-testid="parameters">{JSON.stringify(schemaObject)}</div>
  ),
}))
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
vi.mock("docs-ui", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
  Details: ({ children, summaryElm }: { children: React.ReactNode, summaryElm: React.ReactNode }) => (
    <div data-testid="details">
      <div data-testid="summary">{summaryElm}</div>
      <div data-testid="content">{children}</div>
    </div>
  ),
}))

import TagsOperationParametersArray from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("does not render when schema is not an array", () => {
    const mockSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {}
    }
    const { container } = render(
      <TagsOperationParametersArray name="test-name" schema={mockSchema} />
    )
    expect(container).toBeEmptyDOMElement()
  })
  
  test("renders default when items type is not an array, object, or undefined", async () => {
    const mockSchema: OpenAPI.SchemaObject = {
      type: "array",
      items: { type: "string", properties: {} },
      properties: {},
    }
    const { container } = render(<TagsOperationParametersArray name="test-name" schema={mockSchema} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveTextContent(JSON.stringify(mockSchema))
    })
  })

  test("renders default when items is undefined", async () => {
    const mockSchema: OpenAPI.SchemaObject = {
      type: "array",
      // @ts-expect-error - we are testing the case where items is undefined
      items: undefined,
      properties: {},
    }
    const { container } = render(
      <TagsOperationParametersArray name="test-name" schema={mockSchema} />
    )
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveTextContent(JSON.stringify({ ...mockSchema, items: undefined }))
    })
  })

  test("renders default when items type is an object with no properties, allOf, anyOf, or oneOf", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "array",
      // @ts-expect-error - we are testing the case where items is an object with no properties, allOf, anyOf, or oneOf
      items: { type: "object" },
      properties: {},
    }
    const { container } = render(<TagsOperationParametersArray name="test-name" schema={modifiedSchema} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveTextContent(JSON.stringify(modifiedSchema))
    })
  })

  test("renders details when items type is an object with properties, allOf, anyOf, or oneOf", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "array",
      items: { type: "object", properties: { name: { type: "string", properties: {} } } },
      properties: {},
    }
    const { container } = render(<TagsOperationParametersArray name="test-name" schema={modifiedSchema} />)
    const detailsElement = container.querySelector("[data-testid='details']")
    expect(detailsElement).toBeInTheDocument()
    expect(detailsElement).toHaveTextContent(JSON.stringify(modifiedSchema))
  })

  test("renders details when items type is an array", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "array",
      items: { 
        type: "array", 
        items: { type: "string", properties: {} },
        properties: {},
      },
      properties: {},
    }
    const { container } = render(<TagsOperationParametersArray name="test-name" schema={modifiedSchema} />)
    const detailsElement = container.querySelector("[data-testid='details']")
    expect(detailsElement).toBeInTheDocument()
    expect(detailsElement).toHaveTextContent(JSON.stringify(modifiedSchema))
  })

  test("renders items in nested parameters when items type is an array", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "array",
      items: { type: "array", items: { type: "string", properties: {} }, properties: {} },
      properties: {},
    }
    const { container } = render(<TagsOperationParametersArray name="test-name" schema={modifiedSchema} />)
    const nestedElement = container.querySelector("[data-testid='nested']")
    expect(nestedElement).toBeInTheDocument()
    expect(nestedElement).toHaveTextContent(JSON.stringify(modifiedSchema.items))
  })

  test("renders items in nested parameters when items type is an object", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "array",
      items: { type: "object", properties: { name: { type: "string", properties: {} } } },
      properties: {},
    }
    const { container } = render(<TagsOperationParametersArray name="test-name" schema={modifiedSchema} />)
    const nestedElement = container.querySelector("[data-testid='nested']")
    expect(nestedElement).toBeInTheDocument()
    expect(nestedElement).toHaveTextContent(JSON.stringify(modifiedSchema.items))
  })
})