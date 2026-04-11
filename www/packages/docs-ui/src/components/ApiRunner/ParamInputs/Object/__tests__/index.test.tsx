import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { ApiRunnerParamInputProps } from "../../Default"

// mock data
const mockApiRunnerParamObjectInput: ApiRunnerParamInputProps = {
  paramName: "",
  paramValue: { test: "testValue" },
  objPath: "",
  setValue: vi.fn(),
}
const mockApiRunnerParamObjectInput2: ApiRunnerParamInputProps = {
  paramName: "",
  paramValue: { test: "testValue", test2: "testValue2" },
  objPath: "",
  setValue: vi.fn(),
}
const mockApiRunnerNotObjectInput: ApiRunnerParamInputProps = {
  paramName: "testName",
  paramValue: "testValue",
  objPath: "",
  setValue: vi.fn(),
}

// mock components
vi.mock("@/components/ApiRunner/ParamInputs/Default", () => ({
  ApiRunnerParamInput: ({
    paramName,
    paramValue,
    objPath,
  }: ApiRunnerParamInputProps) => (
    <div className="api-runner-param-input">
      <span>ApiRunnerParamInput</span>
      <span>{paramName}</span>
      <span>{paramValue as string}</span>
      <span>{objPath}</span>
    </div>
  ),
}))
import { ApiRunnerParamObjectInput } from "../../Object"

describe("rendering", () => {
  test("renders when param value is an object", () => {
    const { container } = render(
      <ApiRunnerParamObjectInput {...mockApiRunnerParamObjectInput} />
    )
    expect(container).toBeInTheDocument()
    const fieldset = container.querySelector("fieldset")
    expect(fieldset).toBeInTheDocument()
    const apiRunnerParamInputs = fieldset?.querySelectorAll(
      ".api-runner-param-input"
    )
    expect(apiRunnerParamInputs).toHaveLength(1)
    expect(apiRunnerParamInputs?.[0]).toHaveTextContent("ApiRunnerParamInput")
    expect(apiRunnerParamInputs?.[0]).toHaveTextContent("test")
    expect(apiRunnerParamInputs?.[0]).toHaveTextContent("testValue")
  })

  test("renders when param value is an object with multiple properties", () => {
    const { container } = render(
      <ApiRunnerParamObjectInput {...mockApiRunnerParamObjectInput2} />
    )
    expect(container).toBeInTheDocument()
    const fieldset = container.querySelector("fieldset")
    expect(fieldset).toBeInTheDocument()
    const apiRunnerParamInputs = fieldset?.querySelectorAll(
      ".api-runner-param-input"
    )
    expect(apiRunnerParamInputs).toHaveLength(2)
    expect(apiRunnerParamInputs?.[0]).toHaveTextContent("ApiRunnerParamInput")
    expect(apiRunnerParamInputs?.[0]).toHaveTextContent("test")
    expect(apiRunnerParamInputs?.[0]).toHaveTextContent("testValue")
    expect(apiRunnerParamInputs?.[1]).toHaveTextContent("ApiRunnerParamInput")
    expect(apiRunnerParamInputs?.[1]).toHaveTextContent("test2")
    expect(apiRunnerParamInputs?.[1]).toHaveTextContent("testValue2")
  })

  test("renders when param value is not an object", () => {
    const { container } = render(
      <ApiRunnerParamObjectInput {...mockApiRunnerNotObjectInput} />
    )
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("ApiRunnerParamInput")
    expect(container).toHaveTextContent("testName")
    expect(container).toHaveTextContent("testValue")
  })
})
