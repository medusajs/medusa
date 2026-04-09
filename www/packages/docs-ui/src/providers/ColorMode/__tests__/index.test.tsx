import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { ColorModeProvider, useColorMode } from "../index"

const TestComponent = () => {
  const { colorMode, setColorMode, toggleColorMode } = useColorMode()
  return (
    <div>
      <div data-testid="color-mode">{colorMode}</div>
      <button data-testid="set-dark" onClick={() => setColorMode("dark")}>
        Set Dark
      </button>
      <button data-testid="set-light" onClick={() => setColorMode("light")}>
        Set Light
      </button>
      <button data-testid="toggle" onClick={toggleColorMode}>
        Toggle
      </button>
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  document.documentElement.removeAttribute("data-theme")
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.removeAttribute("data-theme")
})

describe("rendering", () => {
  test("renders children", () => {
    const { container } = render(
      <ColorModeProvider>
        <div>Test</div>
      </ColorModeProvider>
    )
    expect(container).toHaveTextContent("Test")
  })
})

describe("useColorMode hook", () => {
  test("defaults to light mode", async () => {
    const { getByTestId } = render(
      <ColorModeProvider>
        <TestComponent />
      </ColorModeProvider>
    )

    await waitFor(() => {
      expect(getByTestId("color-mode")).toHaveTextContent("light")
    })
  })

  test("loads theme from localStorage on mount", async () => {
    localStorage.setItem("theme", "dark")
    const { getByTestId } = render(
      <ColorModeProvider>
        <TestComponent />
      </ColorModeProvider>
    )

    await waitFor(() => {
      expect(getByTestId("color-mode")).toHaveTextContent("dark")
    })
  })

  test("sets data-theme attribute on html element", async () => {
    render(
      <ColorModeProvider>
        <TestComponent />
      </ColorModeProvider>
    )

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-theme", "light")
    })
  })

  test("updates data-theme when colorMode changes", async () => {
    const { getByTestId } = render(
      <ColorModeProvider>
        <TestComponent />
      </ColorModeProvider>
    )

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-theme", "light")
    })

    getByTestId("set-dark").click()

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-theme", "dark")
    })
  })

  test("saves theme to localStorage when colorMode changes", async () => {
    const { getByTestId } = render(
      <ColorModeProvider>
        <TestComponent />
      </ColorModeProvider>
    )

    await waitFor(() => {
      expect(localStorage.getItem("theme")).toBe("light")
    })

    getByTestId("set-dark").click()

    await waitFor(() => {
      expect(localStorage.getItem("theme")).toBe("dark")
    })
  })

  test("setColorMode updates colorMode", async () => {
    const { getByTestId } = render(
      <ColorModeProvider>
        <TestComponent />
      </ColorModeProvider>
    )

    getByTestId("set-dark").click()

    await waitFor(() => {
      expect(getByTestId("color-mode")).toHaveTextContent("dark")
    })
  })

  test("toggleColorMode toggles between light and dark", async () => {
    const { getByTestId } = render(
      <ColorModeProvider>
        <TestComponent />
      </ColorModeProvider>
    )

    await waitFor(() => {
      expect(getByTestId("color-mode")).toHaveTextContent("light")
    })

    getByTestId("toggle").click()

    await waitFor(() => {
      expect(getByTestId("color-mode")).toHaveTextContent("dark")
    })

    getByTestId("toggle").click()

    await waitFor(() => {
      expect(getByTestId("color-mode")).toHaveTextContent("light")
    })
  })

  test("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow("useColorMode must be used inside a ColorModeProvider")

    consoleSpy.mockRestore()
  })

  test("ignores invalid theme values in localStorage", async () => {
    localStorage.setItem("theme", "invalid")
    const { getByTestId } = render(
      <ColorModeProvider>
        <TestComponent />
      </ColorModeProvider>
    )

    await waitFor(() => {
      expect(getByTestId("color-mode")).toHaveTextContent("light")
    })
  })
})
