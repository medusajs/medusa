import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { OptionType } from "@/hooks/use-select"
import { IconProps } from "@medusajs/icons/dist/types"

// mock components
vi.mock("@medusajs/icons", () => ({
  CheckMini: (props: IconProps) => <svg data-testid="check-icon" {...props} />,
  EllipseMiniSolid: (props: IconProps) => (
    <svg data-testid="ellipse-icon" {...props} />
  ),
}))

import { SelectDropdown } from "../../Dropdown"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders dropdown", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    const dropdown = container.querySelector("ul")
    expect(dropdown).toBeInTheDocument()
  })

  test("renders options", () => {
    const options: OptionType[] = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    expect(container).toHaveTextContent("Option 1")
    expect(container).toHaveTextContent("Option 2")
  })

  test("renders 'All Areas' option when addAll is true", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        addAll={true}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    expect(container).toHaveTextContent("All Areas")
  })

  test("renders divider when addAll is true", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        addAll={true}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })

  test("does not render 'All Areas' option when addAll is false", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        addAll={false}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    expect(container).not.toHaveTextContent("All Areas")
  })

  test("shows dropdown when open is true", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    const dropdown = container.querySelector(
      "[data-testid='select-dropdown-wrapper']"
    )
    expect(dropdown).toHaveClass("h-auto")
    expect(dropdown).toHaveClass("translate-y-docs_0.5")
    expect(dropdown).toHaveClass("!overflow-visible")
  })

  test("hides dropdown when open is false", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={false}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    const dropdown = container.querySelector(
      "[data-testid='select-dropdown-wrapper']"
    )
    expect(dropdown).toHaveClass("h-0")
    expect(dropdown).toHaveClass("translate-y-0")
    expect(dropdown).toHaveClass("overflow-hidden")
  })

  test("renders check icon for selected option in multiple mode", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        multiple={true}
        isAllSelected={false}
        isValueSelected={() => true}
        handleSelectAll={vi.fn()}
      />
    )
    const checkIcon = container.querySelector("[data-testid='check-icon']")
    expect(checkIcon).toBeInTheDocument()
  })

  test("renders ellipse icon for selected option in single mode", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        multiple={false}
        isAllSelected={false}
        isValueSelected={() => true}
        handleSelectAll={vi.fn()}
      />
    )
    const ellipseIcons = container.querySelectorAll(
      "[data-testid='ellipse-icon']"
    )
    expect(ellipseIcons.length).toBeGreaterThan(0)
  })

  test("renders invisible ellipse icon for unselected option", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    const ellipseIcon = container.querySelector("[data-testid='ellipse-icon']")
    expect(ellipseIcon).toHaveClass("invisible")
  })

  test("renders ellipse icon for 'All Areas' when selected", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        addAll={true}
        isAllSelected={true}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    const ellipseIcons = container.querySelectorAll(
      "[data-testid='ellipse-icon']"
    )
    expect(ellipseIcons.length).toBeGreaterThan(0)
  })

  test("applies rounded corners to first option", () => {
    const options: OptionType[] = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    const listItems = container.querySelectorAll("li")
    expect(listItems[0]).toHaveClass("rounded-t-docs_DEFAULT")
  })

  test("applies rounded corners to last option", () => {
    const options: OptionType[] = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    const listItems = container.querySelectorAll("li")
    expect(listItems[listItems.length - 1]).toHaveClass(
      "rounded-b-docs_DEFAULT"
    )
  })

  test("applies selected styles to selected option", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={false}
        isValueSelected={() => true}
        handleSelectAll={vi.fn()}
      />
    )
    const optionDiv = container.querySelector("div.flex")
    expect(optionDiv).toHaveClass("text-compact-small-plus")
  })

  test("applies unselected styles to unselected option", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    const optionDiv = container.querySelector(
      "[data-testid='select-dropdown-option']"
    )
    expect(optionDiv).toHaveClass("text-compact-small")
  })
})

describe("interactions", () => {
  test("calls handleSelectAll when 'All Areas' option is clicked", () => {
    const mockHandleSelectAll = vi.fn()
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        addAll={true}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={mockHandleSelectAll}
      />
    )
    const allAreasOption = Array.from(container.querySelectorAll("li")).find(
      (li) => li.textContent?.includes("All Areas")
    )
    fireEvent.click(allAreasOption!)
    expect(mockHandleSelectAll).toHaveBeenCalledTimes(1)
  })

  test("calls handleChange when option is clicked", () => {
    const mockHandleChange = vi.fn()
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
        handleChange={mockHandleChange}
      />
    )
    const option = container.querySelector("li")
    fireEvent.click(option!)
    expect(mockHandleChange).toHaveBeenCalledWith("option1", false)
  })

  test("calls handleChange with wasSelected=true when clicking selected option", () => {
    const mockHandleChange = vi.fn()
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={false}
        isValueSelected={() => true}
        handleSelectAll={vi.fn()}
        handleChange={mockHandleChange}
      />
    )
    const option = container.querySelector("li")
    fireEvent.click(option!)
    expect(mockHandleChange).toHaveBeenCalledWith("option1", true)
  })

  test("closes dropdown when option is clicked in single mode", () => {
    const mockSetOpen = vi.fn()
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={mockSetOpen}
        options={options}
        multiple={false}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
        handleChange={vi.fn()}
      />
    )
    const option = container.querySelector("li")
    fireEvent.click(option!)
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  test("does not close dropdown when option is clicked in multiple mode", () => {
    const mockSetOpen = vi.fn()
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={mockSetOpen}
        options={options}
        multiple={true}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
        handleChange={vi.fn()}
      />
    )
    const option = container.querySelector("li")
    fireEvent.click(option!)
    expect(mockSetOpen).not.toHaveBeenCalled()
  })

  test("closes dropdown when clicking outside", () => {
    const mockSetOpen = vi.fn()
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    render(
      <SelectDropdown
        open={true}
        setOpen={mockSetOpen}
        options={options}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    // Simulate click outside
    fireEvent.click(document.body)
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  test("closes dropdown when clicking inside single mode", () => {
    const mockSetOpen = vi.fn()
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={mockSetOpen}
        options={options}
        multiple={false}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
      />
    )
    const option = container.querySelector("li")
    fireEvent.click(option!)
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  test("does not close dropdown when clicking inside multiple mode", () => {
    const mockSetOpen = vi.fn()
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={mockSetOpen}
        options={options}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
        multiple={true}
      />
    )
    const option = container.querySelector("li")
    fireEvent.click(option!)
    // Should not close in this case (unless single mode)
    // But clicking inside dropdown itself shouldn't trigger outside click
    expect(mockSetOpen).not.toHaveBeenCalled()
  })

  test("calls setSelectedValues when all is selected and option is clicked", () => {
    const mockSetSelectedValues = vi.fn()
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={true}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
        handleChange={vi.fn()}
        setSelectedValues={mockSetSelectedValues}
      />
    )
    const option = container.querySelector("li")
    fireEvent.click(option!)
    expect(mockSetSelectedValues).toHaveBeenCalledWith(["option1"])
  })
})

describe("ref handling", () => {
  test("supports function ref", () => {
    const refCallback = vi.fn()
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
        passedRef={refCallback}
      />
    )
    expect(refCallback).toHaveBeenCalled()
  })

  test("supports object ref", () => {
    const ref = React.createRef<HTMLDivElement>()
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    render(
      <SelectDropdown
        open={true}
        setOpen={vi.fn()}
        options={options}
        isAllSelected={false}
        isValueSelected={() => false}
        handleSelectAll={vi.fn()}
        passedRef={ref}
      />
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
