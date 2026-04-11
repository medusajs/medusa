
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

// mock components
vi.mock("@/componets/Card", () => ({
  Card: (props: { title: string }) => <div data-testid="card">{props.title}</div>,
}))

import { useMedusaSuggestions } from "../index"

const TestComponent = ({ keywords }: { keywords: string | string[] }) => {
  const suggestion = useMedusaSuggestions({ keywords })
  return suggestion ? (
    <div data-testid="suggestion">{suggestion.title}</div>
  ) : null
}

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("keywords", () => {
  test("should handle empty keyword string", () => {
    const { container } = render(<TestComponent keywords="" />)

    expect(container.firstChild).toBeNull()
  })

  test("should handle empty keyword array", () => {
    const { container } = render(<TestComponent keywords={[]} />)

    expect(container.firstChild).toBeNull()
  })

  test("should return null for no matches", () => {
    const { container } = render(<TestComponent keywords="nonexistentkeyword" />)

    expect(container.firstChild).toBeNull()
  })

  test("should return suggestion for matching keyword string", () => {
    const { getByTestId } = render(<TestComponent keywords="railway" />)

    const suggestion = getByTestId("suggestion")

    expect(suggestion).toBeInTheDocument()
    expect(suggestion).toHaveTextContent("Deploy to Cloud")
  })

  test("should return suggestion for matching keyword in array", () => {
    const { getByTestId } = render(
      <TestComponent keywords={["nonexistent", "railway", "anothernonexistent"]} />
    )

    const suggestion = getByTestId("suggestion")

    expect(suggestion).toBeInTheDocument()
    expect(suggestion).toHaveTextContent("Deploy to Cloud")
  })

  test("should be case insensitive and ignore punctuation", () => {
    const { getByTestId } = render(<TestComponent keywords="Railway!" />)

    const suggestion = getByTestId("suggestion")

    expect(suggestion).toBeInTheDocument()
    expect(suggestion).toHaveTextContent("Deploy to Cloud")
  })
})