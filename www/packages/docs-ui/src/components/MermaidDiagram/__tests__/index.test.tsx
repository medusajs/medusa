import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { act, fireEvent, render, waitFor } from "@testing-library/react"

// mock components
vi.mock("@/components/Loading", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}))

vi.mock("react-medium-image-zoom", () => ({
  Controlled: ({
    children,
    isZoomed,
    onZoomChange,
    classDialog,
  }: {
    children: React.ReactNode
    isZoomed: boolean
    onZoomChange: (shouldZoom: boolean) => void
    classDialog?: string
  }) => (
    <div
      data-testid="controlled-zoom"
      data-is-zoomed={isZoomed}
      data-class-dialog={classDialog}
      onClick={() => onZoomChange(!isZoomed)}
    >
      {children}
    </div>
  ),
}))

// Mock Suspense to avoid act warnings - render children directly
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof React>("react")
  return {
    ...actual,
    Suspense: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

// mock mermaid
const mockRender = vi.fn()
const mockInitialize = vi.fn()

vi.mock("mermaid", () => ({
  default: {
    mermaidAPI: {
      initialize: () => mockInitialize(),
    },
    render: (id: string, content: string) => mockRender(id, content),
  },
}))

import { MermaidDiagram } from "../../MermaidDiagram"

beforeEach(() => {
  vi.clearAllMocks()
  mockRender.mockResolvedValue({
    svg: `<svg viewBox="0 0 100 200"><rect width="100" height="200" /></svg>`,
  })
})

describe("rendering", () => {
  test("renders mermaid diagram container", async () => {
    const { container } = render(
      <MermaidDiagram diagramContent="graph TD; A-->B" />
    )
    const zoom = container.querySelector("[data-testid='controlled-zoom']")
    expect(zoom).toBeInTheDocument()
  })

  test("initializes mermaid API", async () => {
    render(<MermaidDiagram diagramContent="graph TD; A-->B" />)
    await waitFor(() => {
      expect(mockInitialize).toHaveBeenCalledTimes(1)
    })
  })

  test("calls mermaid.render with diagram content", async () => {
    const diagramContent = "graph TD; A-->B"
    render(<MermaidDiagram diagramContent={diagramContent} />)
    await waitFor(() => {
      expect(mockRender).toHaveBeenCalled()
    })
    expect(mockRender).toHaveBeenCalledWith(
      expect.stringContaining("mermaid-svg-"),
      diagramContent
    )
  })

  test("renders SVG when result is available", async () => {
    const { container } = render(
      <MermaidDiagram diagramContent="graph TD; A-->B" />
    )
    await waitFor(() => {
      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
    })
  })

  test("renders SVG with correct content", async () => {
    const mockSvg = `<svg viewBox="0 0 100 200"><rect width="100" height="200" /></svg>`
    mockRender.mockResolvedValue({
      svg: mockSvg,
    })
    const { container } = render(
      <MermaidDiagram diagramContent="graph TD; A-->B" />
    )
    await waitFor(() => {
      // Query the inner SVG (the mermaid content)
      const svgs = container.querySelectorAll("svg")
      expect(svgs.length).toBeGreaterThan(0)
      // The outer SVG contains the mermaid SVG as innerHTML
      const outerSvg = svgs[0]
      expect(outerSvg).toBeInTheDocument()
      // Check that the inner SVG content is present (browser normalizes self-closing tags)
      expect(outerSvg.innerHTML).toContain(`viewBox="0 0 100 200"`)
      expect(outerSvg.innerHTML).toContain("<rect")
      expect(outerSvg.innerHTML).toContain(`width="100"`)
      expect(outerSvg.innerHTML).toContain(`height="200"`)
    })
  })

  test("renders SVG with 100% width when not zoomed", async () => {
    const { container } = render(
      <MermaidDiagram diagramContent="graph TD; A-->B" />
    )
    await waitFor(() => {
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("width", "100%")
    })
  })

  test("renders SVG with viewBox height when available", async () => {
    const mockSvg = `<svg viewBox="0 0 100 200"><rect width="100" height="200" /></svg>`
    mockRender.mockResolvedValue({
      svg: mockSvg,
    })
    const { container } = render(
      <MermaidDiagram diagramContent="graph TD; A-->B" />
    )
    await waitFor(() => {
      const svg = container.querySelector("svg")
      // The regex extracts the last number from viewBox (height), which is "200"
      expect(svg).toHaveAttribute("height", "200px")
    })
  })

  test("renders SVG with 100% height when viewBox is not available", async () => {
    const mockSvg = `<svg><rect width="100" height="200" /></svg>`
    mockRender.mockResolvedValue({
      svg: mockSvg,
    })
    const { container } = render(
      <MermaidDiagram diagramContent="graph TD; A-->B" />
    )
    await waitFor(() => {
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("height", "100%")
    })
  })
})

describe("zoom functionality", () => {
  test("renders SVG with 100vw width when zoomed", async () => {
    const { container } = render(
      <MermaidDiagram diagramContent="graph TD; A-->B" />
    )
    await waitFor(() => {
      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
    })

    const zoom = container.querySelector("[data-testid='controlled-zoom']")
    await act(async () => {
      fireEvent.click(zoom!)
    })

    await waitFor(() => {
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("width", "100vw")
    })
  })

  test("renders SVG with 100vh height when zoomed", async () => {
    const { container } = render(
      <MermaidDiagram diagramContent="graph TD; A-->B" />
    )
    await waitFor(() => {
      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
    })

    const zoom = container.querySelector("[data-testid='controlled-zoom']")
    await act(async () => {
      fireEvent.click(zoom!)
    })

    await waitFor(() => {
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("height", "100vh")
    })
  })

  test("updates zoom state when onZoomChange is called", async () => {
    const { container } = render(
      <MermaidDiagram diagramContent="graph TD; A-->B" />
    )
    await waitFor(() => {
      const zoom = container.querySelector("[data-testid='controlled-zoom']")
      expect(zoom).toHaveAttribute("data-is-zoomed", "false")
    })

    const zoom = container.querySelector("[data-testid='controlled-zoom']")
    await act(async () => {
      fireEvent.click(zoom!)
    })

    await waitFor(() => {
      const updatedZoom = container.querySelector(
        "[data-testid='controlled-zoom']"
      )
      expect(updatedZoom).toHaveAttribute("data-is-zoomed", "true")
    })
  })
})

describe("error handling", () => {
  test("handles mermaid render error gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {})
    const error = new Error("Mermaid render failed")
    mockRender.mockRejectedValue(error)

    const diagramContent = "invalid mermaid syntax"
    render(<MermaidDiagram diagramContent={diagramContent} />)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "An error occurred while rendering Mermaid.js diagram"
        )
      )
    })

    consoleErrorSpy.mockRestore()
  })

  test("does not render SVG when render fails", async () => {
    mockRender.mockRejectedValue(new Error("Render failed"))
    const { container } = render(
      <MermaidDiagram diagramContent="invalid syntax" />
    )

    await waitFor(() => {
      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
      expect(svg?.innerHTML).toBe("")
    })
  })
})

describe("viewBox regex matching", () => {
  test("extracts viewBox values correctly", async () => {
    const mockSvg = `<svg viewBox="0 0 300 400"><rect /></svg>`
    mockRender.mockResolvedValue({
      svg: mockSvg,
    })
    const { container } = render(
      <MermaidDiagram diagramContent="graph TD; A-->B" />
    )
    await waitFor(() => {
      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
      // The regex extracts the last number from viewBox (height), which is "400"
      expect(svg).toHaveAttribute("height", "400px")
    })
  })

  test("handles viewBox with negative values", async () => {
    const mockSvg = `<svg viewBox="-10 -20 300 400"><rect /></svg>`
    mockRender.mockResolvedValue({
      svg: mockSvg,
    })
    const { container } = render(
      <MermaidDiagram diagramContent="graph TD; A-->B" />
    )
    await waitFor(() => {
      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
      // The regex extracts the last number from viewBox (height), which is "400"
      expect(svg).toHaveAttribute("height", "400px")
    })
  })
})

describe("diagram content changes", () => {
  test("re-renders when diagramContent changes", async () => {
    const { rerender } = render(
      <MermaidDiagram diagramContent="graph TD; A-->B" />
    )

    await waitFor(() => {
      expect(mockRender).toHaveBeenCalledTimes(1)
    })

    rerender(<MermaidDiagram diagramContent="graph LR; C-->D" />)

    await waitFor(() => {
      expect(mockRender).toHaveBeenCalledTimes(2)
    })
  })
})
