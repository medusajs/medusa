import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { OptionType } from "@/hooks/use-select"

// mock hooks
const mockIsValueSelected = vi.fn()
const mockHandleChange = vi.fn()
const mockHandleSelectAll = vi.fn()
const mockSetSelectedValues = vi.fn()

const defaultUseSelectReturn = {
  isValueSelected: mockIsValueSelected,
  isAllSelected: false,
  handleChange: mockHandleChange,
  handleSelectAll: mockHandleSelectAll,
  setSelectedValues: mockSetSelectedValues,
}

const mockUseSelect = vi.fn((_options: unknown) => defaultUseSelectReturn)

vi.mock("@/hooks/use-select", () => ({
  useSelect: (options: unknown) => mockUseSelect(options),
}))

// mock components
vi.mock("@medusajs/icons", () => ({
  TriangleDownMini: () => <svg data-testid="triangle-down-icon" />,
}))

vi.mock("@/components/Select/Dropdown", () => ({
  SelectDropdown: ({
    open,
    options,
  }: {
    open: boolean
    options: OptionType[]
  }) => (
    <div data-testid="select-dropdown" data-open={open}>
      {options.map((opt) => (
        <div key={opt.value}>{opt.label}</div>
      ))}
    </div>
  ),
}))

import { SelectBadge } from "../../Badge"

beforeEach(() => {
  vi.clearAllMocks()
  mockIsValueSelected.mockReturnValue(false)
  mockUseSelect.mockReturnValue(defaultUseSelectReturn)
})

describe("rendering", () => {
  test("renders select badge", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectBadge value={[]} options={options} setSelected={vi.fn()} />
    )
    const badge = container.querySelector("[data-testid='select-badge']")
    expect(badge).toBeInTheDocument()
  })

  test("renders triangle down icon", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectBadge value={[]} options={options} setSelected={vi.fn()} />
    )
    const icon = container.querySelector("[data-testid='triangle-down-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("renders 'No Filters Selected' when no value is selected", () => {
    mockUseSelect.mockReturnValue({
      ...defaultUseSelectReturn,
      isAllSelected: false,
    })
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectBadge value={[]} options={options} setSelected={vi.fn()} />
    )
    expect(container).toHaveTextContent("No Filters Selected")
  })

  test("renders selected option label", () => {
    mockIsValueSelected.mockImplementation((val: string) => val === "option1")
    mockUseSelect.mockReturnValue({
      ...defaultUseSelectReturn,
      isAllSelected: false,
    })
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectBadge
        value={["option1"]}
        options={options}
        setSelected={vi.fn()}
      />
    )
    expect(container).toHaveTextContent("Option 1")
  })

  test("renders 'All areas' when all selected", () => {
    mockUseSelect.mockReturnValue({
      ...defaultUseSelectReturn,
      isAllSelected: true,
    })
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectBadge
        value={["option1"]}
        options={options}
        setSelected={vi.fn()}
      />
    )
    expect(container).toHaveTextContent("All areas")
  })

  test("renders count when multiple options selected", () => {
    mockIsValueSelected.mockImplementation((val: string) =>
      ["option1", "option2"].includes(val)
    )
    mockUseSelect.mockReturnValue({
      ...defaultUseSelectReturn,
      isAllSelected: false,
    })
    const options: OptionType[] = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ]
    const { container } = render(
      <SelectBadge
        value={["option1", "option2"]}
        options={options}
        setSelected={vi.fn()}
      />
    )
    expect(container).toHaveTextContent("Option 1")
    expect(container).toHaveTextContent("+ 1")
  })

  test("renders hidden input with value", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectBadge
        value={["option1"]}
        options={options}
        setSelected={vi.fn()}
      />
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
      <SelectBadge
        value={["option1", "option2"]}
        options={options}
        setSelected={vi.fn()}
      />
    )
    const input = container.querySelector("input[type='hidden']")
    expect(input).toHaveAttribute("value", "option1,option2")
  })

  test("applies hover background when open", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectBadge value={[]} options={options} setSelected={vi.fn()} />
    )
    const badge = container.querySelector(
      "[data-testid='select-badge-dropdown']"
    )
    fireEvent.click(badge!)
    expect(badge).toHaveClass("bg-medusa-tag-neutral-bg-hover")
  })
})

describe("interactions", () => {
  test("toggles dropdown when badge is clicked", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectBadge value={[]} options={options} setSelected={vi.fn()} />
    )
    const badge = container.querySelector("div.cursor-pointer")
    const dropdown = container.querySelector("[data-testid='select-dropdown']")
    expect(dropdown).toHaveAttribute("data-open", "false")
    fireEvent.click(badge!)
    const updatedDropdown = container.querySelector(
      "[data-testid='select-dropdown']"
    )
    expect(updatedDropdown).toHaveAttribute("data-open", "true")
  })

  test("does not toggle dropdown when clicking inside dropdown", () => {
    const options: OptionType[] = [{ value: "option1", label: "Option 1" }]
    const { container } = render(
      <SelectBadge value={[]} options={options} setSelected={vi.fn()} />
    )
    const badge = container.querySelector(
      "[data-testid='select-badge-dropdown']"
    )
    fireEvent.click(badge!)
    const dropdown = container.querySelector("[data-testid='select-dropdown']")
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
      <SelectBadge
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
