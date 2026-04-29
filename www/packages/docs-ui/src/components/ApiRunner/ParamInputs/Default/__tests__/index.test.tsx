import React from "react"
import { describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { ApiRunnerParamInputProps } from "../index"
import { InputTextProps } from "../../../../Input/Text"

// mock data
const mockApiRunnerParamInput: ApiRunnerParamInputProps = {
  paramName: "testName",
  paramValue: "testValue",
  objPath: "test",
  setValue: vi.fn(),
}
const mockApiRunnerParamArrayInput: ApiRunnerParamInputProps = {
  paramName: "testName",
  paramValue: ["testValue"],
  objPath: "",
  setValue: vi.fn(),
}
const mockApiRunnerParamObjectInput: ApiRunnerParamInputProps = {
  paramName: "",
  paramValue: { test: "testValue" },
  objPath: "",
  setValue: vi.fn(),
}

// mock components
vi.mock("@/components/Input/Text", () => ({
  InputText: (props: InputTextProps) => <input {...props} />,
}))

const TestWrapper = (props: ApiRunnerParamInputProps) => {
  const [value, setValue] = React.useState(props.paramValue)
  return (
    <ApiRunnerParamInput {...props} paramValue={value} setValue={setValue} />
  )
}

import { ApiRunnerParamInput } from "../index"

describe("rendering", () => {
  test("renders when param value is a string", () => {
    const { container } = render(
      <ApiRunnerParamInput {...mockApiRunnerParamInput} />
    )
    expect(container).toBeInTheDocument()
    const input = container.querySelector("input")
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("name", "testName")
    expect(input).toHaveValue("testValue")
  })
  test("renders when param value is an array", () => {
    const { container } = render(
      <ApiRunnerParamInput {...mockApiRunnerParamArrayInput} />
    )
    expect(container).toBeInTheDocument()
    const input = container.querySelector("input")
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("testValue")
  })
  test("renders when param value is an object", () => {
    const { container } = render(
      <ApiRunnerParamInput {...mockApiRunnerParamObjectInput} />
    )
    expect(container).toBeInTheDocument()
    const input = container.querySelector("input")
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("testValue")
  })
})

describe("interactions", () => {
  test("typing input for string value should update param value", () => {
    const { container } = render(<TestWrapper {...mockApiRunnerParamInput} />)
    expect(container).toBeInTheDocument()
    const input = container.querySelector("input")
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("testValue")

    fireEvent.change(input!, { target: { value: "testValue2" } })
    expect(input).toHaveValue("testValue2")
  })

  test("typing input for array item should update array value", () => {
    const { container } = render(
      <TestWrapper {...mockApiRunnerParamArrayInput} />
    )
    expect(container).toBeInTheDocument()
    const input = container.querySelector("input")
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("testValue")

    fireEvent.change(input!, { target: { value: "testValue2" } })
    expect(input).toHaveValue("testValue2")
  })

  test("typing input for object property should update object value", () => {
    const { container } = render(
      <TestWrapper {...mockApiRunnerParamObjectInput} />
    )
    expect(container).toBeInTheDocument()
    const input = container.querySelector("input")
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("testValue")

    fireEvent.change(input!, { target: { value: "testValue2" } })
    expect(input).toHaveValue("testValue2")
  })
})

describe("object path handling", () => {
  test("should update nested object property with objPath", () => {
    const { container } = render(
      <TestWrapper
        paramName=""
        paramValue={{
          parent: {
            child: "initialValue",
          },
        }}
        objPath=""
        setValue={vi.fn()}
      />
    )
    // Find the input for the "child" property (nested under "parent")
    const inputs = container.querySelectorAll("input")
    const input = Array.from(inputs).find(
      (input) => input.getAttribute("name") === "child"
    )
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("initialValue")

    fireEvent.change(input!, { target: { value: "updatedValue" } })
    expect(input).toHaveValue("updatedValue")
  })

  test("should update deeply nested object property", () => {
    const { container } = render(
      <TestWrapper
        paramName=""
        paramValue={{
          level1: {
            level2: {
              level3: "deepValue",
            },
          },
        }}
        objPath=""
        setValue={vi.fn()}
      />
    )
    // Find the input for the "level3" property (deeply nested)
    const inputs = container.querySelectorAll("input")
    const input = Array.from(inputs).find(
      (input) => input.getAttribute("name") === "level3"
    )
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("deepValue")

    fireEvent.change(input!, { target: { value: "newDeepValue" } })
    expect(input).toHaveValue("newDeepValue")
  })

  test("should update object property within array", () => {
    const { container } = render(
      <TestWrapper
        paramName="testName"
        paramValue={[{ name: "item1", value: "value1" }]}
        objPath=""
        setValue={vi.fn()}
      />
    )
    // Find the input for the "value" property within the object in the array
    const inputs = container.querySelectorAll("input")
    expect(inputs.length).toBeGreaterThan(0)
    const valueInput = Array.from(inputs).find(
      (input) => input.getAttribute("name") === "value"
    )
    expect(valueInput).toBeInTheDocument()
    expect(valueInput).toHaveValue("value1")

    fireEvent.change(valueInput!, { target: { value: "updatedValue1" } })
    expect(valueInput).toHaveValue("updatedValue1")
  })

  test("should update array item with objPath", () => {
    const { container } = render(
      <TestWrapper
        paramName="items"
        paramValue={{ items: ["item1", "item2"] }}
        objPath=""
        setValue={vi.fn()}
      />
    )
    // Find the input for the first array item (paramName will be "[0]")
    const inputs = container.querySelectorAll("input")
    expect(inputs.length).toBeGreaterThan(0)
    // The first input should be for the first array item
    const firstInput = inputs[0]
    expect(firstInput).toHaveValue("item1")

    fireEvent.change(firstInput, { target: { value: "updatedItem1" } })
    expect(firstInput).toHaveValue("updatedItem1")
  })

  test("should update nested object property within array", () => {
    const { container } = render(
      <TestWrapper
        paramName="data"
        paramValue={{
          data: [
            { id: 1, name: "first" },
            { id: 2, name: "second" },
          ],
        }}
        objPath=""
        setValue={vi.fn()}
      />
    )
    // Find the input for the name property of the first object in the array
    const inputs = container.querySelectorAll("input")
    expect(inputs.length).toBeGreaterThan(0)
    // The name input should be one of the inputs
    const nameInput = Array.from(inputs).find(
      (input) => input.getAttribute("name") === "name"
    )
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveValue("first")

    fireEvent.change(nameInput!, { target: { value: "updatedFirst" } })
    expect(nameInput).toHaveValue("updatedFirst")
  })

  test("should handle empty objPath correctly", () => {
    const { container } = render(
      <TestWrapper
        paramName=""
        paramValue={{ root: "rootValue" }}
        objPath=""
        setValue={vi.fn()}
      />
    )
    const input = container.querySelector("input")
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("rootValue")

    fireEvent.change(input!, { target: { value: "newRootValue" } })
    expect(input).toHaveValue("newRootValue")
  })
})
