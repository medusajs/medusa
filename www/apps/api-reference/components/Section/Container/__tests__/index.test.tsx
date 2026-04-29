import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

// mock components
vi.mock("@/components/Section/Divider", () => ({
  default: () => <div data-testid="section-divider">Section Divider</div>,
}))
vi.mock("docs-ui", () => ({
  WideSection: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wide-section">{children}</div>
  ),
}))

import SectionContainer from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders section container with children", () => {
    const { getByTestId } = render(<SectionContainer>Test</SectionContainer>)
    const wideSectionElement = getByTestId("wide-section")
    expect(wideSectionElement).toBeInTheDocument()
    expect(wideSectionElement).toHaveTextContent("Test")
  })
  test("renders section container with no top padding", () => {
    const { getByTestId } = render(<SectionContainer noTopPadding>Test</SectionContainer>)
    const sectionContainerElement = getByTestId("section-container")
    expect(sectionContainerElement).not.toHaveClass("pt-7")
  })
  test("renders section container with top padding", () => {
    const { getByTestId } = render(<SectionContainer noTopPadding={false}>Test</SectionContainer>)
    const sectionContainerElement = getByTestId("section-container")
    expect(sectionContainerElement).toHaveClass("pt-7")
  })
  test("renders section container with divider", () => {
    const { getByTestId } = render(<SectionContainer>Test</SectionContainer>)
    const sectionDividerElement = getByTestId("section-divider")
    expect(sectionDividerElement).toBeInTheDocument()
  })
  test("renders section container with no divider", () => {
    const { container } = render(<SectionContainer noDivider>Test</SectionContainer>)
    const sectionDividerElement = container.querySelectorAll("[data-testid='section-divider']")
    expect(sectionDividerElement).toHaveLength(0)
  })
  test("renders section container with className", () => {
    const { getByTestId } = render(<SectionContainer className="test-class">Test</SectionContainer>)
    const sectionContainerElement = getByTestId("section-container")
    expect(sectionContainerElement).toHaveClass("test-class")
  })
  test("renders section container with ref", () => {
    const ref = vi.fn()
    render(<SectionContainer ref={ref}>Test</SectionContainer>)
    expect(ref).toHaveBeenCalled()
  })
})