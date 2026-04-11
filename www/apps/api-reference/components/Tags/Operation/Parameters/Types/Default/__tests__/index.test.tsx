import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { OpenAPI } from "types"
import { TagOperationParametersNameProps } from "../../../Name"
import { TagOperationParametersDescriptionProps } from "../../../Description"

// mock data
const mockSchema: OpenAPI.SchemaObject = {
  type: "string",
  properties: {},
}

// mock components
vi.mock("@/components/Tags/Operation/Parameters/Description", () => ({
  default: ({ schema }: TagOperationParametersDescriptionProps) => (
    <div data-testid="description">{JSON.stringify(schema)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/Parameters/Name", () => ({
  default: ({ name, isRequired, schema }: TagOperationParametersNameProps) => (
    <div data-testid="name">{name} {isRequired ? "required" : "optional"} {JSON.stringify(schema)}</div>
  ),
}))

import TagsOperationParametersDefault from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders description", async () => {
    const { container } = render(<TagsOperationParametersDefault schema={mockSchema} />)
    const descriptionElement = container.querySelector("[data-testid='description']")
    expect(descriptionElement).toBeInTheDocument()
    expect(descriptionElement).toHaveTextContent(JSON.stringify(mockSchema))
  })

  test("renders name when name is provided", () => {
    const { container } = render(<TagsOperationParametersDefault name="test-name" schema={mockSchema} />)
    const nameElement = container.querySelector("[data-testid='name']")
    expect(nameElement).toBeInTheDocument()
    expect(nameElement).toHaveTextContent("test-name")
  })

  test("renders name with required when isRequired is true", () => {
    const { container } = render(<TagsOperationParametersDefault name="test-name" schema={mockSchema} isRequired={true} />)
    const nameElement = container.querySelector("[data-testid='name']")
    expect(nameElement).toBeInTheDocument()
    expect(nameElement).toHaveTextContent("test-name required")
  })

  test("does not render name when name is not provided", () => {
    const { container } = render(<TagsOperationParametersDefault schema={mockSchema} />)
    const nameElement = container.querySelector("[data-testid='name']")
    expect(nameElement).not.toBeInTheDocument()
  })

  test("add expandable class when expandable is true", () => {
    const { container } = render(<TagsOperationParametersDefault schema={mockSchema} expandable={true} />)
    const element = container.querySelector("[data-testid='default']")
    expect(element).toHaveClass("w-[calc(100%-16px)]")
    expect(element).not.toHaveClass("w-full pl-1")
  })

  test("does not add expandable class when expandable is false", () => {
    const { container } = render(<TagsOperationParametersDefault schema={mockSchema} expandable={false} />)
    const element = container.querySelector("[data-testid='default']")
    expect(element).not.toHaveClass("w-[calc(100%-16px)]")
    expect(element).toHaveClass("w-full pl-1")
  })

  test("adds className when provided", () => {
    const { container } = render(<TagsOperationParametersDefault schema={mockSchema} className="test-class" />)
    const element = container.querySelector("[data-testid='default']")
    expect(element).toHaveClass("test-class")
  })
})