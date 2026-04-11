import React from "react"
import { describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { ApiRunnerParamInputProps } from "../../Default"
import { ButtonProps } from "../../../../Button"

// mock data
const mockApiRunnerParamArrayInput: ApiRunnerParamInputProps = {
  paramName: "test",
  paramValue: ["test"],
  objPath: "test",
  setValue: vi.fn(),
}
const mockApiRunnerParamArrayInput2: ApiRunnerParamInputProps = {
  paramName: "test",
  paramValue: ["test", "test2"],
  objPath: "test",
  setValue: vi.fn(),
}
const mockApiRunnerNotArrayInput: ApiRunnerParamInputProps = {
  paramName: "test",
  paramValue: "test",
  objPath: "test",
  setValue: vi.fn(),
}

// mock components
vi.mock("@/components/Button", () => ({
  Button: (props: ButtonProps) => <button {...props} />,
}))
vi.mock("@/components/ApiRunner/ParamInputs/Default", () => ({
  ApiRunnerParamInput: () => (
    <div className="api-runner-param-input">ApiRunnerParamInput</div>
  ),
}))
vi.mock("@/utils/set-obj-value", () => ({
  setObjValue: vi.fn(),
}))

import { ApiRunnerParamArrayInput } from "../../Array"

describe("rendering", () => {
  test("renders when param value is an array", () => {
    const { container } = render(
      <ApiRunnerParamArrayInput {...mockApiRunnerParamArrayInput} />
    )
    expect(container).toBeInTheDocument()
    const fieldset = container.querySelector("fieldset")
    expect(fieldset).toBeInTheDocument()
    const legend = fieldset?.querySelector("legend")
    expect(legend).toBeInTheDocument()
    expect(legend).toHaveTextContent("test Array Items")
    expect(fieldset).toHaveTextContent("ApiRunnerParamInput")
    const button = fieldset?.querySelector("button[data-testid='minus-button']")
    expect(button).not.toBeInTheDocument()
    const plusButton = fieldset?.querySelector(
      "button[data-testid='plus-button']"
    )
    expect(plusButton).toBeInTheDocument()
    const svg = plusButton?.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })
  test("renders minus button when param value is an array and has more than one item", () => {
    const { container } = render(
      <ApiRunnerParamArrayInput {...mockApiRunnerParamArrayInput2} />
    )
    expect(container).toBeInTheDocument()
    const fieldset = container.querySelector("fieldset")
    expect(fieldset).toBeInTheDocument()
    const button = fieldset?.querySelector("button[data-testid='minus-button']")
    expect(button).toBeInTheDocument()
    const svg = button?.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })
  test("doesn't render when param value is not an array", () => {
    const { container } = render(
      <ApiRunnerParamArrayInput {...mockApiRunnerNotArrayInput} />
    )
    expect(container).toBeInTheDocument()
    const fieldset = container.querySelector("fieldset")
    expect(fieldset).not.toBeInTheDocument()
    expect(container).toHaveTextContent("ApiRunnerParamInput")
  })
})

describe("interactions", () => {
  test("clicking minus button should remove item from array", () => {
    const { container } = render(
      <ApiRunnerParamArrayInput {...mockApiRunnerParamArrayInput2} />
    )
    expect(container).toBeInTheDocument()
    const fieldset = container.querySelector("fieldset")
    expect(fieldset).toBeInTheDocument()
    const button = fieldset?.querySelector("button[data-testid='minus-button']")
    expect(button).toBeInTheDocument()

    fireEvent.click(button!)
    const apiRunnerParamInput = container.querySelectorAll(
      ".api-runner-param-input"
    )
    expect(apiRunnerParamInput).toHaveLength(1)
  })
  test("clicking plus button should add item to array", () => {
    const { container } = render(
      <ApiRunnerParamArrayInput {...mockApiRunnerParamArrayInput} />
    )
    expect(container).toBeInTheDocument()
    const fieldset = container.querySelector("fieldset")
    expect(fieldset).toBeInTheDocument()
    const plusButton = fieldset?.querySelector(
      "button[data-testid='plus-button']"
    )
    expect(plusButton).toBeInTheDocument()
    const initialApiRunnerParamInput = container.querySelectorAll(
      ".api-runner-param-input"
    )
    expect(initialApiRunnerParamInput).toHaveLength(1)

    fireEvent.click(plusButton!)
    const updatedApiRunnerParamInput = container.querySelectorAll(
      ".api-runner-param-input"
    )
    expect(updatedApiRunnerParamInput).toHaveLength(2)
  })
})
