import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import { OpenAPI } from "types"
import { TagOperationParametersProps } from "../../../Parameters"

// mock data
const mockParameters: OpenAPI.Parameter[] = [
  {
    name: "parameter1",
    in: "query",
    description: "description1",
    schema: {
      type: "string",
      properties: {},
    } as OpenAPI.SchemaObject,
    examples: {},
  },
]

// mock components
vi.mock("@/components/Tags/Operation/Parameters", () => ({
  default: (props: TagOperationParametersProps) => (
    <div data-testid="parameters" {...props}>
      {Object.values(props.schemaObject.properties).map((property) => (
        <div key={property.parameterName} data-testid={"property"}>
          {property.parameterName}
        </div>
      ))}
    </div>
  ),
}))

import TagsOperationDescriptionSectionParameters from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders header parameters when parameters have header in parameter location", () => {
    const modifiedParameters: OpenAPI.Parameter[] = [
      {
        ...mockParameters[0],
        in: "header",
      },
    ]
    const { container } = render(
      <TagsOperationDescriptionSectionParameters parameters={modifiedParameters} />
    )

    const headerParameters = container.querySelector("[data-testid='header-parameters']")
    expect(headerParameters).toBeInTheDocument()
    const properties = headerParameters!.querySelectorAll("[data-testid='property']")
    expect(properties).toHaveLength(1)
    expect(properties[0]).toHaveTextContent(mockParameters[0].name)
  })

  test("does not render header parameters when parameters do not have header in parameter location", () => {
    const modifiedParameters: OpenAPI.Parameter[] = [
      {
        ...mockParameters[0],
        in: "query",
      },
    ]
    const { container } = render(
      <TagsOperationDescriptionSectionParameters parameters={modifiedParameters} />
    )
    const headerParameters = container.querySelector("[data-testid='header-parameters']")
    expect(headerParameters).not.toBeInTheDocument()
  })

  test("renders path parameters when parameters have path in parameter location", () => {
    const modifiedParameters: OpenAPI.Parameter[] = [
      {
        ...mockParameters[0],
        in: "path",
      },
    ]
    const { container } = render(
      <TagsOperationDescriptionSectionParameters parameters={modifiedParameters} />
    )
    const pathParameters = container.querySelector("[data-testid='path-parameters']")
    expect(pathParameters).toBeInTheDocument()
    const properties = pathParameters!.querySelectorAll("[data-testid='property']")
    expect(properties).toHaveLength(1)
    expect(properties[0]).toHaveTextContent(mockParameters[0].name)
  })

  test("does not render path parameters when parameters do not have path in parameter location", () => {
    const modifiedParameters: OpenAPI.Parameter[] = [
      {
        ...mockParameters[0],
        in: "query",
      },
    ]
    const { container } = render(
      <TagsOperationDescriptionSectionParameters parameters={modifiedParameters} />
    )
    const pathParameters = container.querySelector("[data-testid='path-parameters']")
    expect(pathParameters).not.toBeInTheDocument()
  })

  test("renders query parameters when parameters have query in parameter location", () => {
    const modifiedParameters: OpenAPI.Parameter[] = [
      {
        ...mockParameters[0],
        in: "query",
      },
    ]
    const { container } = render(
      <TagsOperationDescriptionSectionParameters parameters={modifiedParameters} />
    )
    const queryParameters = container.querySelector("[data-testid='query-parameters']")
    expect(queryParameters).toBeInTheDocument()
    const properties = queryParameters!.querySelectorAll("[data-testid='property']")
    expect(properties).toHaveLength(1)
    expect(properties[0]).toHaveTextContent(mockParameters[0].name)
  })

  test("does not render query parameters when parameters do not have query in parameter location", () => {
    const modifiedParameters: OpenAPI.Parameter[] = [
      {
        ...mockParameters[0],
        in: "header",
      },
    ]
    const { container } = render(
      <TagsOperationDescriptionSectionParameters parameters={modifiedParameters} />
    )
    const queryParameters = container.querySelector("[data-testid='query-parameters']")
    expect(queryParameters).not.toBeInTheDocument()
  })
})