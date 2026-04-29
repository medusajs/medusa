import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render, waitFor } from "@testing-library/react"
import { CodeBlockProps } from "../../CodeBlock"
import { ButtonProps } from "../../Button"

// mock data
const mockApiRunnerSimpleGet = {
  apiMethod: "GET" as ApiMethod,
  apiUrl: "https://api.example.com",
}
const mockApiRunnerGet = {
  apiMethod: "GET" as ApiMethod,
  apiUrl: "https://api.example.com",
  pathData: {
    id: "123",
  },
  queryData: {
    limit: 10,
  },
}
const mockApiRunnerPost = {
  apiMethod: "POST" as ApiMethod,
  apiUrl: "https://api.example.com",
  bodyData: {
    name: "John Doe",
  },
}
const mockApiRunnerDelete = {
  apiMethod: "DELETE" as ApiMethod,
  apiUrl: "https://api.example.com",
  pathData: {
    id: "123",
  },
}

// mock functions
let capturedOnFinish: ((message: string, statusCode: string) => void) | null =
  null

// mock components and hooks
vi.mock("@/components/CodeBlock", () => ({
  CodeBlock: ({ badgeColor, badgeLabel, ...props }: CodeBlockProps) => (
    <div data-badge-color={badgeColor} data-badge-label={badgeLabel}>
      <pre {...props} />
    </div>
  ),
}))
vi.mock("@/components/Button", () => ({
  Button: (props: ButtonProps) => <button {...props} />,
}))
vi.mock("@/components/ApiRunner/ParamInputs", () => ({
  ApiRunnerParamInputs: () => <div>ApiRunnerParamInputs</div>,
}))
vi.mock("@/components/ApiRunner/FooterBackground", () => ({
  ApiRunnerFooterBackground: () => <div>ApiRunnerFooterBackground</div>,
}))
vi.mock("@/components/Icons/ArrowRightDown", () => ({
  ArrowRightDownIcon: () => <div>ArrowRightDownIcon</div>,
}))
vi.mock("@/hooks/use-request-runner", () => ({
  useRequestRunner: ({
    pushLog,
    onFinish,
  }: {
    pushLog: (...message: string[]) => void
    onFinish: (message: string, statusCode: string) => void
    replaceLog?: (message: string) => void
  }) => {
    capturedOnFinish = onFinish
    return {
      runRequest: vi.fn(() => {
        pushLog("Response data")
        onFinish("Finished running request.", "")
      }),
    }
  },
}))

import { ApiRunner } from "../../ApiRunner"
import { ApiMethod } from "types"

beforeEach(() => {
  capturedOnFinish = null
})

describe("rendering", () => {
  test("renders manual test trigger when there is data", () => {
    const { container } = render(<ApiRunner {...mockApiRunnerGet} />)
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("ApiRunnerParamInputs")
    expect(container).toHaveTextContent("ApiRunnerFooterBackground")
    expect(container).toHaveTextContent("ArrowRightDownIcon")
    const submitButton = container.querySelector("button")
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveTextContent("Send Request")
  })
  test("renders code block when request is running or has been run", () => {
    const { container } = render(<ApiRunner {...mockApiRunnerGet} />)
    expect(container).toBeInTheDocument()
    const submitButton = container.querySelector("button")
    expect(submitButton).toBeInTheDocument()
    fireEvent.click(submitButton!)
    const pre = container.querySelector("pre")
    expect(pre).toBeInTheDocument()
  })
})

describe("interactions", () => {
  test("clicking submit button should trigger request", () => {
    const { container } = render(<ApiRunner {...mockApiRunnerGet} />)
    expect(container).toBeInTheDocument()
    const submitButton = container.querySelector("button")
    expect(submitButton).toBeInTheDocument()
    fireEvent.click(submitButton!)
    // Verify the CodeBlock appears after clicking
    expect(container.querySelector("pre")).toBeInTheDocument()
  })
  test("clicking submit button should trigger POST request", () => {
    const { container } = render(<ApiRunner {...mockApiRunnerPost} />)
    expect(container).toBeInTheDocument()
    const submitButton = container.querySelector("button")
    expect(submitButton).toBeInTheDocument()
    fireEvent.click(submitButton!)
    expect(container.querySelector("pre")).toBeInTheDocument()
  })
  test("clicking submit button should trigger DELETE request", () => {
    const { container } = render(<ApiRunner {...mockApiRunnerDelete} />)
    expect(container).toBeInTheDocument()
    const submitButton = container.querySelector("button")
    expect(submitButton).toBeInTheDocument()
    fireEvent.click(submitButton!)
    expect(container.querySelector("pre")).toBeInTheDocument()
  })

  test("should send request automatically for simple GET request", () => {
    const { container } = render(<ApiRunner {...mockApiRunnerSimpleGet} />)
    expect(container).toBeInTheDocument()
    // The request is automatically triggered, so we just verify the component renders
    expect(container.querySelector("pre")).toBeInTheDocument()
  })
})

describe("badge display", () => {
  test("should show green badge with status code for successful request (2xx)", async () => {
    const { container } = render(<ApiRunner {...mockApiRunnerGet} />)
    const submitButton = container.querySelector("button")
    fireEvent.click(submitButton!)

    // Wait for the component to render the CodeBlock
    await waitFor(() => {
      expect(container.querySelector("pre")).toBeInTheDocument()
    })

    // Simulate successful response by calling onFinish with 200 status code
    if (capturedOnFinish) {
      capturedOnFinish("Finished running request.", "200")
    }

    await waitFor(() => {
      const codeBlock = container.querySelector("[data-badge-color]")
      expect(codeBlock).toBeInTheDocument()
      expect(codeBlock).toHaveAttribute("data-badge-color", "green")
      expect(codeBlock).toHaveAttribute("data-badge-label", "200")
    })
  })

  test("should show red badge with status code for failed request (4xx)", async () => {
    const { container } = render(<ApiRunner {...mockApiRunnerGet} />)
    const submitButton = container.querySelector("button")
    fireEvent.click(submitButton!)

    await waitFor(() => {
      expect(container.querySelector("pre")).toBeInTheDocument()
    })

    // Simulate failed response by calling onFinish with 404 status code
    if (capturedOnFinish) {
      capturedOnFinish("Finished running request.", "404")
    }

    await waitFor(() => {
      const codeBlock = container.querySelector("[data-badge-color]")
      expect(codeBlock).toBeInTheDocument()
      expect(codeBlock).toHaveAttribute("data-badge-color", "red")
      expect(codeBlock).toHaveAttribute("data-badge-label", "404")
    })
  })

  test("should show red badge with 'Failed' label when no status code", async () => {
    const { container } = render(<ApiRunner {...mockApiRunnerGet} />)
    const submitButton = container.querySelector("button")
    fireEvent.click(submitButton!)

    await waitFor(() => {
      expect(container.querySelector("pre")).toBeInTheDocument()
    })

    // Simulate error with no status code (empty string)
    if (capturedOnFinish) {
      capturedOnFinish("Finished running request.", "")
    }

    await waitFor(() => {
      const codeBlock = container.querySelector("[data-badge-color]")
      expect(codeBlock).toBeInTheDocument()
      expect(codeBlock).toHaveAttribute("data-badge-color", "red")
      expect(codeBlock).toHaveAttribute("data-badge-label", "Failed")
    })
  })

  test("should show green badge for 201 status code", async () => {
    const { container } = render(<ApiRunner {...mockApiRunnerPost} />)
    const submitButton = container.querySelector("button")
    fireEvent.click(submitButton!)

    await waitFor(() => {
      expect(container.querySelector("pre")).toBeInTheDocument()
    })

    // Simulate successful POST response with 201 status code
    if (capturedOnFinish) {
      capturedOnFinish("Finished running request.", "201")
    }

    await waitFor(() => {
      const codeBlock = container.querySelector("[data-badge-color]")
      expect(codeBlock).toBeInTheDocument()
      expect(codeBlock).toHaveAttribute("data-badge-color", "green")
      expect(codeBlock).toHaveAttribute("data-badge-label", "201")
    })
  })
})
