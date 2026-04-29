import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render } from "@testing-library/react"

// Mock dependencies
const mockTrackWithSegment = vi.fn()
const mockTrackWithPostHog = vi.fn()
const mockUsePathname = vi.fn(() => "/test-path")

const mockUseReoDevAnalytics = vi.fn()

const mockUsePostHogAnalytics = vi.fn(() => ({
  track: mockTrackWithPostHog,
}))

const mockUseSegmentAnalytics = vi.fn((options: unknown) => ({
  track: mockTrackWithSegment,
}))

vi.mock("@/providers/Analytics/providers/segment", () => ({
  useSegmentAnalytics: (options: unknown) => mockUseSegmentAnalytics(options),
}))

vi.mock("@/providers/Analytics/providers/posthog", () => ({
  usePostHogAnalytics: () => mockUsePostHogAnalytics(),
}))

vi.mock("@/providers/Analytics/providers/reo-dev", () => ({
  useReoDevAnalytics: (options: unknown) => mockUseReoDevAnalytics(options),
}))

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}))

import { AnalyticsProvider, useAnalytics } from "../index"

const TestComponent = () => {
  const { track } = useAnalytics()
  return (
    <div>
      <button
        data-testid="track-event"
        onClick={() =>
          track({
            event: {
              event: "test-event",
              options: { custom: "data" },
            },
          })
        }
      >
        Track Event
      </button>
      <button
        data-testid="track-with-callback"
        onClick={() =>
          track({
            event: {
              event: "callback-event",
              callback: () => {
                const elm = document.getElementById("callback-result")
                if (elm) {
                  elm.textContent = "callback-called"
                }
              },
            },
          })
        }
      >
        Track With Callback
      </button>
      <button
        data-testid="track-with-segment"
        onClick={() =>
          track({
            event: {
              event: "segment-event",
              tracker: "segment",
            },
          })
        }
      >
        Track With Segment
      </button>
      <button
        data-testid="track-with-posthog"
        onClick={() =>
          track({
            event: {
              event: "posthog-event",
              tracker: "posthog",
            },
          })
        }
      >
        Track With PostHog
      </button>
      <button
        data-testid="track-with-both"
        onClick={() =>
          track({
            event: {
              event: "both-event",
              tracker: ["segment", "posthog"],
            },
          })
        }
      >
        Track With Both
      </button>
      <div id="callback-result" data-testid="callback-result"></div>
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockUsePathname.mockReturnValue("/test-path")
  mockTrackWithSegment.mockResolvedValue(undefined)
  mockTrackWithPostHog.mockResolvedValue(undefined)
  mockUseSegmentAnalytics.mockReturnValue({
    track: mockTrackWithSegment,
  })
  mockUseReoDevAnalytics.mockReturnValue(undefined)

  // Mock document.title
  Object.defineProperty(document, "title", {
    writable: true,
    configurable: true,
    value: "Test Page Title",
  })

  // Mock window.navigator.userAgent
  Object.defineProperty(window.navigator, "userAgent", {
    writable: true,
    configurable: true,
    value: "Mozilla/5.0 Test User Agent",
  })

  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("rendering", () => {
  test("renders children", () => {
    const { container } = render(
      <AnalyticsProvider>
        <div>Test</div>
      </AnalyticsProvider>
    )
    expect(container).toHaveTextContent("Test")
  })
})

describe("useAnalytics hook", () => {
  test("queues events when track is called", async () => {
    const { getByTestId } = render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(getByTestId("track-event"))

    vi.runAllTimers()

    expect(mockTrackWithPostHog).toHaveBeenCalled()
  })

  test("uses posthog as default tracker", async () => {
    const { getByTestId } = render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(getByTestId("track-event"))

    vi.runAllTimers()

    expect(mockTrackWithPostHog).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "test-event",
      })
    )
    expect(mockTrackWithSegment).not.toHaveBeenCalled()
  })

  test("enriches event options with url, label, and os", async () => {
    const { getByTestId } = render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(getByTestId("track-event"))
    vi.runAllTimers()

    expect(mockTrackWithPostHog).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "test-event",
        options: expect.objectContaining({
          url: "/test-path",
          label: "Test Page Title",
          os: "Mozilla/5.0 Test User Agent",
          custom: "data",
        }),
      })
    )
  })

  test("calls callback immediately even when event is queued", () => {
    const { getByTestId } = render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(getByTestId("track-with-callback"))
    vi.runAllTimers()
    // Callback should be called immediately, not waiting for async processing
    expect(getByTestId("callback-result")).toHaveTextContent("callback-called")
  })

  test("tracks with segment when tracker is segment", async () => {
    const { getByTestId } = render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(getByTestId("track-with-segment"))
    vi.runAllTimers()

    expect(mockTrackWithSegment).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "segment-event",
      })
    )
    expect(mockTrackWithPostHog).not.toHaveBeenCalled()
  })

  test("tracks with posthog when tracker is posthog", async () => {
    const { getByTestId } = render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(getByTestId("track-with-posthog"))
    vi.runAllTimers()

    expect(mockTrackWithPostHog).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "posthog-event",
      })
    )
    expect(mockTrackWithSegment).not.toHaveBeenCalled()
  })

  test("tracks with both trackers when tracker is array", async () => {
    const { getByTestId } = render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(getByTestId("track-with-both"))
    vi.runAllTimers()

    expect(mockTrackWithSegment).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "both-event",
      })
    )
    expect(mockTrackWithPostHog).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "both-event",
      })
    )
  })

  test("processes events in batches", async () => {
    const TestComponentWithMultipleEvents = () => {
      const { track } = useAnalytics()
      return (
        <div>
          <button
            data-testid="track-multiple"
            onClick={() => {
              // Queue 12 events (more than batch size of 5)
              for (let i = 0; i < 12; i++) {
                track({
                  event: {
                    event: `event-${i}`,
                  },
                })
              }
            }}
          >
            Track Multiple
          </button>
        </div>
      )
    }

    const { getByTestId } = render(
      <AnalyticsProvider>
        <TestComponentWithMultipleEvents />
      </AnalyticsProvider>
    )

    fireEvent.click(getByTestId("track-multiple"))

    expect(vi.getTimerCount()).toBe(3)
    vi.runAllTimers()
    expect(mockTrackWithPostHog).toHaveBeenCalledTimes(12)
  })

  test("preserves custom options when enriching event", async () => {
    const TestComponentWithCustomOptions = () => {
      const { track } = useAnalytics()
      return (
        <button
          data-testid="track-custom"
          onClick={() =>
            track({
              event: {
                event: "custom-event",
                options: {
                  customKey: "customValue",
                  nested: {
                    key: "value",
                  },
                },
              },
            })
          }
        >
          Track Custom
        </button>
      )
    }

    const { getByTestId } = render(
      <AnalyticsProvider>
        <TestComponentWithCustomOptions />
      </AnalyticsProvider>
    )

    fireEvent.click(getByTestId("track-custom"))
    vi.runAllTimers()

    expect(mockTrackWithPostHog).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "custom-event",
      })
    )
  })

  test("updates pathname when it changes", async () => {
    const { getByTestId, rerender } = render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    // Track first event
    fireEvent.click(getByTestId("track-event"))
    vi.runAllTimers()

    expect(mockTrackWithPostHog).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          url: "/test-path",
        }),
      })
    )

    // Update pathname
    mockUsePathname.mockReturnValue("/new-path")
    mockTrackWithPostHog.mockClear()

    // Re-render to trigger pathname change
    rerender(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    // Track second event
    fireEvent.click(getByTestId("track-event"))
    vi.runAllTimers()

    expect(mockTrackWithPostHog).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          url: "/new-path",
        }),
      })
    )
  })

  test("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow("useAnalytics must be used within a AnalyticsProvider")

    consoleSpy.mockRestore()
  })
})

describe("provider props", () => {
  test("passes segmentWriteKey to useSegmentAnalytics", () => {
    render(
      <AnalyticsProvider segmentWriteKey="test-segment-key">
        <div>Test</div>
      </AnalyticsProvider>
    )

    expect(mockUseSegmentAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        segmentWriteKey: "test-segment-key",
        setEventsQueue: expect.any(Function),
      })
    )
  })

  test("passes reoDevKey to useReoDevAnalytics", () => {
    render(
      <AnalyticsProvider reoDevKey="test-reo-key">
        <div>Test</div>
      </AnalyticsProvider>
    )

    expect(mockUseReoDevAnalytics).toHaveBeenCalledWith({
      reoDevKey: "test-reo-key",
    })
  })
})
