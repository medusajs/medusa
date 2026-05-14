import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { OptionType } from "@/hooks/use-select"

// mock functions
const mockstopPropagation = vi.fn()

// mock hooks
const mockIsValueSelected = vi.fn()
const mockHasSelectedValue = vi.fn()
const mockHasSelectedValues = vi.fn()
const mockSelectedValues: OptionType[] = []
const mockIsAllSelected = vi.fn()
const mockHandleChange = vi.fn()
const mockHandleSelectAll = vi.fn()

const defaultUseSelectReturn = {
  isValueSelected: mockIsValueSelected,
  hasSelectedValue: mockHasSelectedValue,
  hasSelectedValues: mockHasSelectedValues,
  selectedValues: mockSelectedValues,
  isAllSelected: mockIsAllSelected,
  handleChange: mockHandleChange,
  handleSelectAll: mockHandleSelectAll,
}

const mockUseSelect = vi.fn((_options: unknown) => defaultUseSelectReturn)

vi.mock("@/hooks/use-select", () => ({
  useSelect: (options: unknown) => mockUseSelect(options),
}))

// mock components
vi.mock("@medusajs/icons", () => ({
  ChevronUpDown: (props: IconProps) => (
    <svg data-testid="chevron-icon" {...props} />
  ),
  XMarkMini: (props: IconProps) => <svg data-testid="x-mark-icon" {...props} />,
}))

vi.mock("@/components/Badge", () => ({
  Badge: ({
    variant,
    className,
    children,
  }: {
    variant?: string
    className?: string
    children: React.ReactNode
  }) => (
    <div data-testid="badge" data-variant={variant} className={className}>
      {children}
    </div>
  ),
}))

vi.mock("@/components/Select/Dropdown", () => ({
  SelectDropdown: ({
    open,
    options,
    passedRef,
  }: {
    open: boolean
    options: OptionType[]
    passedRef: React.RefObject<HTMLDivElement>
  }) => (
    <div data-testid="select-dropdown" data-open={open} ref={passedRef}>
      {options.map((opt) => (
        <div key={opt.value}>{opt.label}</div>
      ))}
    </div>
  ),
}))

import { SelectInput } from "../../Input"
import { IconProps } from "@medusajs/icons/dist/types"

beforeEach(() => {
  vi.clearAllMocks()
  mockIsValueSelected.mockReturnValue(false)
  mockHasSelectedValue.mockReturnValue(false)
  mockHasSelectedValues.mockReturnValue(false)
  mockIsAllSelected.mockReturnValue(false)
  mockUseSelect.mockReturnValue(defaultUseSelectReturn)
  window.MouseEvent.prototype.stopPropagation = mockstopPropagation
})

describe("rendering", () => {
  test("renders select input", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectInput value={[]} options={options} setSelected={vi.fn()} />
    )
    const input = container.querySelector("[data-testid='select-input']")
    expect(input).toBeInTheDocument()
  })

  test("renders placeholder when no value selected", () => {
    mockHasSelectedValue.mockReturnValue(false)
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectInput
        value={[]}
        options={options}
        setSelected={vi.fn()}
        placeholder="Select an option"
      />
    )
    expect(container).toHaveTextContent("Select an option")
  })

  test("renders selected value label in single mode", () => {
    mockHasSelectedValue.mockReturnValue(true)
    mockUseSelect.mockReturnValue({
      ...defaultUseSelectReturn,
      selectedValues: [{ value: "option1", label: "Option 1" }],
    })
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectInput
        value="option1"
        options={options}
        setSelected={vi.fn()}
        multiple={false}
      />
    )
    expect(container).toHaveTextContent("Option 1")
  })

  test("renders badge with count when multiple values selected", () => {
    mockHasSelectedValues.mockReturnValue(true)
    const options: OptionType[] = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ]
    const { container } = render(
      <SelectInput
        value={["option1", "option2"]}
        options={options}
        setSelected={vi.fn()}
        multiple={true}
      />
    )
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("2")
  })

  test("renders clear button when showClearButton is true and values selected", () => {
    mockHasSelectedValues.mockReturnValue(true)
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectInput
        value={["option1"]}
        options={options}
        setSelected={vi.fn()}
        multiple={true}
        showClearButton={true}
      />
    )
    const xMark = container.querySelector("[data-testid='x-mark-icon']")
    expect(xMark).toBeInTheDocument()
  })

  test("does not render clear button when showClearButton is false", () => {
    mockHasSelectedValues.mockReturnValue(true)
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectInput
        value={["option1"]}
        options={options}
        setSelected={vi.fn()}
        multiple={true}
        showClearButton={false}
      />
    )
    const xMark = container.querySelector("[data-testid='x-mark-icon']")
    expect(xMark).not.toBeInTheDocument()
  })

  test("renders chevron icon", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectInput value={[]} options={options} setSelected={vi.fn()} />
    )
    const chevron = container.querySelector("[data-testid='chevron-icon']")
    expect(chevron).toBeInTheDocument()
  })

  test("renders hidden input with value", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectInput value="option1" options={options} setSelected={vi.fn()} />
    )
    const input = container.querySelector("input[type='hidden']")
    expect(input).toHaveAttribute("value", "option1")
  })

  test("renders hidden input with comma-separated values for array", () => {
    const options: OptionType[] = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ]
    const { container } = render(
      <SelectInput
        value={["option1", "option2"]}
        options={options}
        setSelected={vi.fn()}
      />
    )
    const input = container.querySelector("input[type='hidden']")
    expect(input).toHaveAttribute("value", "option1,option2")
  })

  test("applies custom className", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectInput
        value={[]}
        options={options}
        setSelected={vi.fn()}
        className="custom-class"
      />
    )
    const input = container.querySelector("[data-testid='select-input']")
    expect(input).toHaveClass("custom-class")
  })
})

describe("interactions", () => {
  test("toggles dropdown when input is clicked", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectInput value={[]} options={options} setSelected={vi.fn()} />
    )
    const input = container.querySelector("[data-testid='select-input']")
    const dropdown = container.querySelector("[data-testid='select-dropdown']")
    expect(dropdown).toHaveAttribute("data-open", "false")
    fireEvent.click(input!)
    const updatedDropdown = container.querySelector(
      "[data-testid='select-dropdown']"
    )
    expect(updatedDropdown).toHaveAttribute("data-open", "true")
  })

  test("calls setSelected with empty array when clear button is clicked", () => {
    const mockSetSelected = vi.fn()
    mockHasSelectedValues.mockReturnValue(true)
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectInput
        value={["option1"]}
        options={options}
        setSelected={mockSetSelected}
        multiple={true}
        showClearButton={true}
      />
    )
    const xMark = container.querySelector("[data-testid='x-mark-icon']")
    fireEvent.click(xMark!)
    expect(mockSetSelected).toHaveBeenCalledWith([])
  })

  test("stops propagation when clear button is clicked", () => {
    const mockSetSelected = vi.fn()
    mockHasSelectedValues.mockReturnValue(true)
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectInput
        value={["option1"]}
        options={options}
        setSelected={mockSetSelected}
        multiple={true}
        showClearButton={true}
      />
    )
    const xMark = container.querySelector("[data-testid='x-mark-icon']")
    fireEvent.click(xMark!)
    // Clear button should stop propagation to prevent toggling dropdown
    expect(mockstopPropagation).toHaveBeenCalled()
  })

  test("does not toggle dropdown when clicking inside dropdown", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectInput value={[]} options={options} setSelected={vi.fn()} />
    )
    const input = container.querySelector("[data-testid='select-input']")
    fireEvent.click(input!)
    const dropdown = container.querySelector("[data-testid='select-dropdown']")
    expect(dropdown).toHaveAttribute("data-open", "true")
    const dropdownContent = dropdown?.querySelector("div")
    if (dropdownContent) {
      fireEvent.click(dropdownContent)
      // Dropdown should remain open
      expect(dropdown).toHaveAttribute("data-open", "true")
    }
  })
})

describe("useSelect integration", () => {
  test("passes correct options to useSelect", () => {
    const mockSetSelected = vi.fn()
    const mockAddSelected = vi.fn()
    const mockRemoveSelected = vi.fn()
    const mockHandleAddAll = vi.fn()
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    render(
      <SelectInput
        value={[]}
        options={options}
        setSelected={mockSetSelected}
        addSelected={mockAddSelected}
        removeSelected={mockRemoveSelected}
        handleAddAll={mockHandleAddAll}
        multiple={true}
      />
    )
    expect(mockUseSelect).toHaveBeenCalledWith({
      value: [],
      options,
      multiple: true,
      setSelected: mockSetSelected,
      removeSelected: mockRemoveSelected,
      addSelected: mockAddSelected,
      handleAddAll: mockHandleAddAll,
    })
  })
})
