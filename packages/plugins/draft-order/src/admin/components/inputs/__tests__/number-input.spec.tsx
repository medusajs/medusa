import { ReactElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { NumberInput } from "../number-input"

const renderTree = (props: { value: number; onChange: (v: number) => void }) =>
  (NumberInput as any).render(props, null) as ReactElement<any>

const findChild = (tree: ReactElement<any>, type: string, index = 0) =>
  (tree.props.children as ReactElement<any>[]).filter(
    (child) => child?.type === type
  )[index]

describe("NumberInput", () => {
  it("should accept a typed value above 100 when no max is given", () => {
    const onChange = jest.fn()
    const input = findChild(renderTree({ value: 100, onChange }), "input")

    input.props.onChange({ target: { value: "150" } })

    expect(onChange).toHaveBeenCalledWith(150)
  })

  it("should increment past 100 when no max is given", () => {
    const onChange = jest.fn()
    const increment = findChild(
      renderTree({ value: 100, onChange }),
      "button",
      1
    )

    increment.props.onClick()

    expect(onChange).toHaveBeenCalledWith(101)
  })

  it("should not disable the increase button at 100 when no max is given", () => {
    const html = renderToStaticMarkup(
      <NumberInput value={100} onChange={() => {}} />
    )

    expect(html).not.toContain('disabled=""')
    expect(html).not.toContain('max="100"')
  })

  it("should still enforce an explicit max", () => {
    const onChange = jest.fn()
    const input = findChild(
      (NumberInput as any).render({ value: 5, onChange, max: 10 }, null),
      "input"
    )

    input.props.onChange({ target: { value: "11" } })

    expect(onChange).not.toHaveBeenCalled()
  })
})
