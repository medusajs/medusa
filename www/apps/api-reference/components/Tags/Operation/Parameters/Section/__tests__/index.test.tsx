import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { OpenAPI } from "types"
import { TagOperationParametersProps } from "../../../Parameters"

// mock data
const mockSchema: OpenAPI.SchemaObject = {
  type: "object",
  properties: {
    name: { type: "string", properties: {} },
  },
}

// mock components
vi.mock("@/components/Tags/Operation/Parameters", () => ({
  default: ({ schemaObject }: TagOperationParametersProps) => (
    <div data-testid="parameters">{JSON.stringify(schemaObject)}</div>
  ),
}))
vi.mock("docs-ui", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}))

import TagsOperationParametersSection from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders parameters", async () => {
    const { container } = render(<TagsOperationParametersSection schema={mockSchema} />)
    await waitFor(() => {
      const parametersElement = container.querySelector("[data-testid='parameters']")
      expect(parametersElement).toBeInTheDocument()
      expect(parametersElement).toHaveTextContent(JSON.stringify(mockSchema))
    })
  })
  test("renders header when header is provided", () => {
    const { container } = render(
      <TagsOperationParametersSection header="test-header" schema={mockSchema} />
    )
    const headerElement = container.querySelector("[data-testid='header']")
    expect(headerElement).toBeInTheDocument()
    expect(headerElement).toHaveTextContent("test-header")
  })
  
  test("does not render header when header is not provided", () => {
    const { container } = render(<TagsOperationParametersSection schema={mockSchema} />)
    const headerElement = container.querySelector("[data-testid='header']")
    expect(headerElement).not.toBeInTheDocument()
  })
  
  test("renders content type when content type is provided", () => {
    const { container } = render(<TagsOperationParametersSection contentType="test-content-type" schema={mockSchema} />)
    const contentTypeElement = container.querySelector("[data-testid='content-type']")
    expect(contentTypeElement).toBeInTheDocument()
    expect(contentTypeElement).toHaveTextContent("Content type: test-content-type")
  })
  
  test("does not render content type when content type is not provided", () => {
    const { container } = render(<TagsOperationParametersSection schema={mockSchema} />)
    const contentTypeElement = container.querySelector("[data-testid='content-type']")
    expect(contentTypeElement).not.toBeInTheDocument()
  })
})