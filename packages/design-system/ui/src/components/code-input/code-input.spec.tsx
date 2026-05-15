import { fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"
import { vi } from "vitest"

import { CodeInput } from "./code-input"

const ControlledCodeInput = ({
  initialValue = "",
  onComplete,
}: {
  initialValue?: string
  onComplete?: (value: string) => void
}) => {
  const [value, setValue] = React.useState(initialValue)

  return (
    <CodeInput
      aria-label="Verification code"
      value={value}
      onChange={setValue}
      onComplete={onComplete}
    />
  )
}

describe("CodeInput", () => {
  it("renders six inputs by default", () => {
    render(<ControlledCodeInput />)

    expect(screen.getByRole("group")).toBeInTheDocument()
    expect(screen.getAllByRole("textbox")).toHaveLength(6)
  })

  it("accepts only numeric values", () => {
    render(<ControlledCodeInput />)

    const [firstInput] = screen.getAllByRole("textbox")

    fireEvent.change(firstInput, { target: { value: "a1b" } })

    expect(firstInput).toHaveValue("1")
  })

  it("fills the inputs when pasting a complete code", () => {
    const onComplete = vi.fn()

    render(<ControlledCodeInput onComplete={onComplete} />)

    const inputs = screen.getAllByRole("textbox")

    fireEvent.paste(inputs[0], {
      clipboardData: {
        getData: () => "12a3456",
      },
    })

    expect(inputs.map((input) => (input as HTMLInputElement).value)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
    ])
    expect(onComplete).toHaveBeenCalledWith("123456")
  })

  it("clears the previous input when backspacing from an empty input", () => {
    render(<ControlledCodeInput initialValue="1" />)

    const inputs = screen.getAllByRole("textbox")

    fireEvent.keyDown(inputs[1], { key: "Backspace" })

    expect(inputs[0]).toHaveValue("")
  })
})
