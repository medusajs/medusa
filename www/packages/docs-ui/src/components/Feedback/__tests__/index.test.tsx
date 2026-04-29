import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render, waitFor } from "@testing-library/react"
import { GITHUB_ISSUES_LINK } from "../../../constants"
import { ButtonProps } from "../../Button"
import { LabelProps } from "../../Label"
import { RadioItemProps } from "../../RadioItem"

// mock data
const defaultUseSiteConfigReturn = {
  config: {
    reportIssueLink: GITHUB_ISSUES_LINK as string | undefined,
  },
}

// mock functions
const mockTrack = vi.fn(({ event }: { event: { callback?: () => void } }) => {
  // Call callback immediately to simulate synchronous behavior
  event.callback?.()
})
const mockUseSiteConfig = vi.fn(() => defaultUseSiteConfigReturn)

// mock components
vi.mock("@/providers/Analytics", () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}))

vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))

vi.mock("@/components/Button", () => ({
  Button: (props: ButtonProps) => <button {...props} />,
}))

vi.mock("@/components/TextArea", () => ({
  TextArea: ({
    value,
    onChange,
    placeholder,
    rows,
  }: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    placeholder?: string
    rows?: number
  }) => (
    <textarea
      data-testid="textarea"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
    />
  ),
}))

vi.mock("@/components/Label", () => ({
  Label: (props: LabelProps) => <label {...props} />,
}))

vi.mock("@/components/DottedSeparator", () => ({
  DottedSeparator: ({ wrapperClassName }: { wrapperClassName?: string }) => (
    <div data-testid="dotted-separator" className={wrapperClassName} />
  ),
}))

vi.mock("@/components/RadioItem", () => ({
  RadioItem: (props: RadioItemProps) => <input {...props} />,
}))

vi.mock("@/components/Feedback/Solutions", () => ({
  Solutions: ({
    message,
    feedback,
  }: {
    message: string
    feedback: boolean
  }) => (
    <div
      data-testid="solutions"
      data-message={message}
      data-feedback={feedback}
    >
      Solutions
    </div>
  ),
}))

vi.mock("react-transition-group", () => ({
  CSSTransition: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SwitchTransition: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

import { Feedback } from "../../Feedback"

beforeEach(() => {
  mockTrack.mockClear()
  mockUseSiteConfig.mockImplementation(() => defaultUseSiteConfigReturn)
})

describe("rendering", () => {
  test("default render", () => {
    const { container } = render(<Feedback event="test-event" />)
    const positiveButton = container.querySelector(
      "button[data-testid='positive-button']"
    )
    expect(positiveButton).toBeInTheDocument()
    expect(positiveButton).toHaveTextContent("It was helpful")
    const negativeButton = container.querySelector(
      "button[data-testid='negative-button']"
    )
    expect(negativeButton).toBeInTheDocument()
    expect(negativeButton).toHaveTextContent("It wasn't helpful")
    const label = container.querySelector("label[data-testid='question-label']")
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent("Was this page helpful?")

    const reportIssueButton = container.querySelector(
      "button[data-testid='report-issue-button']"
    )
    expect(reportIssueButton).toBeInTheDocument()
    expect(reportIssueButton).toHaveTextContent("Report Issue")
    const link = reportIssueButton?.querySelector("a")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", GITHUB_ISSUES_LINK)
    const separators = container.querySelectorAll(
      "[data-testid='dotted-separator']"
    )
    expect(separators).toHaveLength(2)
  })

  test("renders custom question", () => {
    const { container } = render(
      <Feedback event="test-event" question="Custom question?" />
    )
    const label = container.querySelector("label[data-testid='question-label']")
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent("Custom question?")
  })

  test("renders custom positive button text", () => {
    const { container } = render(
      <Feedback event="test-event" positiveBtn="Yes!" />
    )
    const buttons = container.querySelector(
      "button[data-testid='positive-button']"
    )
    expect(buttons).toBeInTheDocument()
    expect(buttons).toHaveTextContent("Yes!")
  })

  test("renders custom negative button text", () => {
    const { container } = render(
      <Feedback event="test-event" negativeBtn="No!" />
    )
    const buttons = container.querySelector(
      "button[data-testid='negative-button']"
    )
    expect(buttons).toBeInTheDocument()
    expect(buttons).toHaveTextContent("No!")
  })

  test("renders report issue button when initReportLink is provided", () => {
    const customReportLink = "https://custom-link.com"
    const { container } = render(
      <Feedback event="test-event" reportLink={customReportLink} />
    )
    const reportIssueButton = container.querySelector(
      "button[data-testid='report-issue-button']"
    )
    expect(reportIssueButton).toBeInTheDocument()
    expect(reportIssueButton).toHaveTextContent("Report Issue")
    const link = reportIssueButton?.querySelector("a")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", customReportLink)
  })

  test("does not render report issue button when no reportLink is available", () => {
    // Override the mock to return undefined for reportIssueLink
    // Use mockImplementation (not Once) to ensure it applies to all calls during render
    // const originalImplementation = mockUseSiteConfig.getMockImplementation()
    mockUseSiteConfig.mockImplementation(() => ({
      config: {
        reportIssueLink: undefined,
      },
    }))

    const { container } = render(<Feedback event="test-event" />)
    const reportIssueButton = container.querySelector(
      "button[data-testid='report-issue-button']"
    )
    expect(reportIssueButton).not.toBeInTheDocument()
  })

  test("does not render dotted separator when showDottedSeparator is false", () => {
    const { container } = render(
      <Feedback event="test-event" showDottedSeparator={false} />
    )
    const separators = container.querySelectorAll(
      "[data-testid='dotted-separator']"
    )
    expect(separators).toHaveLength(0)
  })

  test("applies custom className", () => {
    const { container } = render(
      <Feedback event="test-event" className="custom-class" />
    )
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass("custom-class")
  })

  test("shows custom submit button text", () => {
    const { container } = render(
      <Feedback event="test-event" submitBtn="Send" />
    )
    const positiveButton = container.querySelector(
      "button[data-testid='positive-button']"
    )
    fireEvent.click(positiveButton!)

    const submitButton = container.querySelector(
      "button[data-testid='submit-button']"
    )
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveTextContent("Send")
  })

  test("shows custom positive question", () => {
    const { container } = render(
      <Feedback event="test-event" positiveQuestion="What did you like most?" />
    )
    const positiveButton = container.querySelector(
      "button[data-testid='positive-button']"
    )
    fireEvent.click(positiveButton!)

    const label = container.querySelector(
      "label[data-testid='submit-question-label']"
    )
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent("What did you like most?")
  })

  test("shows custom negative question", () => {
    const { container } = render(
      <Feedback event="test-event" negativeQuestion="What went wrong?" />
    )
    const negativeButton = container.querySelector(
      "button[data-testid='negative-button']"
    )
    fireEvent.click(negativeButton!)

    const label = container.querySelector(
      "label[data-testid='submit-question-label']"
    )
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent("What went wrong?")
  })
})

describe("positive feedback flow", () => {
  test("shows form when positive button is clicked", () => {
    const { container } = render(<Feedback event="test-event" />)
    const positiveButton = container.querySelector(
      "button[data-testid='positive-button']"
    )
    fireEvent.click(positiveButton!)

    const label = container.querySelector(
      "label[data-testid='submit-question-label']"
    )
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent("What did you like?")
  })

  test("shows positive feedback options", () => {
    const { container } = render(<Feedback event="test-event" />)
    const positiveButton = container.querySelector(
      "button[data-testid='positive-button']"
    )
    fireEvent.click(positiveButton!)

    const radioOptions = [
      "Easy to understand",
      "Accurate code and text",
      "Exactly what I was looking for",
      "Ease of use",
      "Other",
    ]

    const feedbackOptions = Array.from(
      container.querySelectorAll<HTMLInputElement>(
        "[data-testid='feedback-option']"
      )
    )
    expect(feedbackOptions).toHaveLength(5)
    const optionValues = feedbackOptions.map((radio) => radio.value)
    radioOptions.forEach((option) => {
      expect(optionValues).toContain(option)
    })
  })

  test("tracks positive feedback when button is clicked", () => {
    const { container } = render(<Feedback event="test-event" />)
    const positiveButton = container.querySelector(
      "button[data-testid='positive-button']"
    )
    expect(positiveButton).toBeInTheDocument()
    fireEvent.click(positiveButton!)

    expect(mockTrack).toHaveBeenCalledWith({
      event: {
        event: "test-event",
        options: {
          feedback: "yes",
          message: null,
          feedbackOption: "Other",
        },
        callback: expect.any(Function),
      },
    })
  })
})

describe("negative feedback flow", () => {
  test("shows form when negative button is clicked", () => {
    const { container } = render(<Feedback event="test-event" />)
    const negativeButton = container.querySelector(
      "button[data-testid='negative-button']"
    )
    expect(negativeButton).toBeInTheDocument()
    fireEvent.click(negativeButton!)

    const label = container.querySelector(
      "label[data-testid='submit-question-label']"
    )
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent("What was the problem?")
  })

  test("shows negative feedback options", () => {
    const { container } = render(<Feedback event="test-event" />)
    const negativeButton = container.querySelector(
      "button[data-testid='negative-button']"
    )
    expect(negativeButton).toBeInTheDocument()
    fireEvent.click(negativeButton!)

    const radioOptions = [
      "Difficult to understand",
      "Inaccurate code or text",
      "Didn't find what I was looking for",
      "Trouble using the documentation",
      "Other",
    ]

    const feedbackOptions = Array.from(
      container.querySelectorAll<HTMLInputElement>(
        "[data-testid='feedback-option']"
      )
    )
    expect(feedbackOptions).toHaveLength(5)
    const optionValues = feedbackOptions.map((radio) => radio.value)
    radioOptions.forEach((option) => {
      expect(optionValues).toContain(option)
    })
  })

  test("tracks negative feedback when button is clicked", () => {
    const { container } = render(<Feedback event="test-event" />)
    const negativeButton = container.querySelector(
      "button[data-testid='negative-button']"
    )
    expect(negativeButton).toBeInTheDocument()
    fireEvent.click(negativeButton!)

    expect(mockTrack).toHaveBeenCalledWith({
      event: {
        event: "test-event",
        options: {
          feedback: "no",
          message: null,
          feedbackOption: "Other",
        },
        callback: expect.any(Function),
      },
    })
  })
})

describe("form interaction", () => {
  test("submits feedback with selected option and message", () => {
    const { container } = render(<Feedback event="test-event" />)
    const positiveButton = container.querySelector(
      "button[data-testid='positive-button']"
    )
    fireEvent.click(positiveButton!)

    // Select an option
    const feedbackOption = container.querySelector(
      "[data-testid='feedback-option']"
    )
    fireEvent.click(feedbackOption!)

    // Enter message
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: "Great documentation!" } })

    // Clear previous track calls
    mockTrack.mockClear()

    // Submit
    const submitButton = container.querySelector(
      "button[data-testid='submit-button']"
    )
    expect(submitButton).toBeInTheDocument()
    fireEvent.click(submitButton!)

    expect(mockTrack).toHaveBeenCalledWith({
      event: expect.objectContaining({
        options: expect.objectContaining({
          feedback: "yes",
          message: "Great documentation!",
          feedbackOption: (feedbackOption as HTMLInputElement)?.value,
        }),
      }),
    })
  })
})

describe("submission success", () => {
  test("shows thank you message after submission", async () => {
    const { container } = render(<Feedback event="test-event" />)
    const positiveButton = container.querySelector(
      "button[data-testid='positive-button']"
    )
    fireEvent.click(positiveButton!)

    const submitButton = container.querySelector(
      "button[data-testid='submit-button']"
    )
    expect(submitButton).toBeInTheDocument()
    fireEvent.click(submitButton!)

    await waitFor(() => {
      const submittedMessage = container.querySelector(
        "[data-testid='submitted-message']"
      )
      expect(submittedMessage).toBeInTheDocument()
      expect(submittedMessage).toHaveTextContent(
        "Thank you for helping improve our documentation!"
      )
    })
  })

  test("shows custom submit message", async () => {
    const { container } = render(
      <Feedback event="test-event" submitMessage="Custom thank you message!" />
    )
    const positiveButton = container.querySelector(
      "button[data-testid='positive-button']"
    )
    fireEvent.click(positiveButton!)

    const submitButton = container.querySelector(
      "button[data-testid='submit-button']"
    )
    expect(submitButton).toBeInTheDocument()
    fireEvent.click(submitButton!)

    await waitFor(() => {
      const submittedMessage = container.querySelector(
        "[data-testid='submitted-message']"
      )
      expect(submittedMessage).toBeInTheDocument()
      expect(submittedMessage).toHaveTextContent("Custom thank you message!")
    })
  })

  test("shows solutions after submission when showPossibleSolutions is true", async () => {
    const { container } = render(<Feedback event="test-event" />)
    const positiveButton = container.querySelector(
      "button[data-testid='positive-button']"
    )
    fireEvent.click(positiveButton!)

    const textarea = container.querySelector("textarea") as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: "Test message" } })

    const submitButton = container.querySelector(
      "button[data-testid='submit-button']"
    )
    expect(submitButton).toBeInTheDocument()
    fireEvent.click(submitButton!)

    await waitFor(() => {
      const solutions = container.querySelector("[data-testid='solutions']")
      expect(solutions).toBeInTheDocument()
      expect(solutions).toHaveAttribute("data-message", "Test message")
      expect(solutions).toHaveAttribute("data-feedback", "true")
    })
  })

  test("does not show solutions when showPossibleSolutions is false", async () => {
    const { container } = render(
      <Feedback event="test-event" showPossibleSolutions={false} />
    )
    const positiveButton = container.querySelector(
      "button[data-testid='positive-button']"
    )
    fireEvent.click(positiveButton!)

    const submitButton = container.querySelector(
      "button[data-testid='submit-button']"
    )
    expect(submitButton).toBeInTheDocument()
    fireEvent.click(submitButton!)

    await waitFor(() => {
      const solutions = container.querySelector("[data-testid='solutions']")
      expect(solutions).not.toBeInTheDocument()
    })
  })

  test("passes negative feedback to solutions", async () => {
    const { container } = render(<Feedback event="test-event" />)
    const negativeButton = container.querySelector(
      "button[data-testid='negative-button']"
    )
    fireEvent.click(negativeButton!)

    const textarea = container.querySelector("textarea") as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: "Issue message" } })

    const submitButton = container.querySelector(
      "button[data-testid='submit-button']"
    )
    expect(submitButton).toBeInTheDocument()
    fireEvent.click(submitButton!)

    await waitFor(() => {
      const solutions = container.querySelector("[data-testid='solutions']")
      expect(solutions).toHaveAttribute("data-feedback", "false")
    })
  })
})

describe("extra data tracking", () => {
  test("includes extraData in tracking", () => {
    const { container } = render(
      <Feedback event="test-event" extraData={{ customField: "customValue" }} />
    )
    const positiveButton = container.querySelector(
      "button[data-testid='positive-button']"
    )
    fireEvent.click(positiveButton!)

    expect(mockTrack).toHaveBeenCalledWith({
      event: expect.objectContaining({
        options: expect.objectContaining({
          customField: "customValue",
        }),
      }),
    })
  })
})

describe("layout", () => {
  test("applies vertical layout classes when vertical is true", () => {
    const { container } = render(<Feedback event="test-event" vertical />)
    const feedbackForm = container.querySelector(
      "[data-testid='feedback-form']"
    )
    expect(feedbackForm).toBeInTheDocument()
    expect(feedbackForm).toHaveClass("flex-col justify-center")
  })

  test("applies horizontal layout classes when vertical is false", () => {
    const { container } = render(
      <Feedback event="test-event" vertical={false} />
    )
    const feedbackForm = container.querySelector(
      "[data-testid='feedback-form']"
    )
    expect(feedbackForm).toBeInTheDocument()
    expect(feedbackForm).toHaveClass("flex-col md:flex-row md:items-center")
  })
})
