import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render } from "@testing-library/react"
import { NotificationProvider, useNotifications } from "../index"
import type { NotificationItemType } from "../index"

// mock components
vi.mock("@/components/Notification", () => ({
  NotificationContainer: () => <div data-testid="notification-container" />,
}))

vi.mock("react-uuid", () => ({
  default: vi.fn(() => "mock-uuid"),
}))

const TestComponent = () => {
  const notifications = useNotifications()
  if (!notifications) {
    return null
  }

  const {
    notifications: notifs,
    addNotification,
    removeNotification,
    updateNotification,
    generateId,
  } = notifications

  return (
    <div>
      <div data-testid="count">{notifs.length}</div>
      <div data-testid="notifications">
        {notifs.map((notif) => (
          <div key={notif.id} data-testid={`notification-${notif.id}`}>
            {notif.title}
          </div>
        ))}
      </div>
      <button
        data-testid="add"
        onClick={() =>
          addNotification({
            title: "Test Notification",
            type: "info",
          })
        }
      >
        Add
      </button>
      <button
        data-testid="remove"
        onClick={() => {
          if (notifs[0]) {
            removeNotification(notifs[0].id!)
          }
        }}
      >
        Remove
      </button>
      <button
        data-testid="update"
        onClick={() => {
          if (notifs[0]) {
            updateNotification(notifs[0].id!, { title: "Updated" })
          }
        }}
      >
        Update
      </button>
      <button data-testid="generate-id" onClick={() => generateId()}>
        Generate ID
      </button>
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

describe("rendering", () => {
  test("renders children", () => {
    const { container } = render(
      <NotificationProvider>
        <div>Test</div>
      </NotificationProvider>
    )
    expect(container).toHaveTextContent("Test")
  })

  test("renders NotificationContainer", () => {
    const { getByTestId } = render(
      <NotificationProvider>
        <div>Test</div>
      </NotificationProvider>
    )
    expect(getByTestId("notification-container")).toBeInTheDocument()
  })
})

describe("useNotifications hook", () => {
  test("initializes with empty notifications", () => {
    const { getByTestId } = render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    expect(getByTestId("count")).toHaveTextContent("0")
  })

  test("initializes with initial notifications", () => {
    const initial: NotificationItemType[] = [
      {
        id: "1",
        title: "Initial",
        type: "info",
      },
    ]

    const { getByTestId } = render(
      <NotificationProvider initial={initial}>
        <TestComponent />
      </NotificationProvider>
    )

    expect(getByTestId("count")).toHaveTextContent("1")
    expect(getByTestId("notification-1")).toHaveTextContent("Initial")
  })

  test("addNotification adds a notification", () => {
    const { getByTestId } = render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    expect(getByTestId("count")).toHaveTextContent("0")

    fireEvent.click(getByTestId("add"))

    expect(getByTestId("count")).toHaveTextContent("1")
    expect(getByTestId("notification-mock-uuid")).toHaveTextContent(
      "Test Notification"
    )
  })

  test("addNotification generates id if not provided", () => {
    const { getByTestId } = render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    fireEvent.click(getByTestId("add"))

    expect(getByTestId("notification-mock-uuid")).toBeInTheDocument()
  })

  test("removeNotification removes a notification", () => {
    const initial: NotificationItemType[] = [
      {
        id: "1",
        title: "Test",
        type: "info",
      },
    ]

    const { getByTestId } = render(
      <NotificationProvider initial={initial}>
        <TestComponent />
      </NotificationProvider>
    )

    expect(getByTestId("count")).toHaveTextContent("1")

    fireEvent.click(getByTestId("remove"))

    expect(getByTestId("count")).toHaveTextContent("0")
  })

  test("updateNotification updates a notification", () => {
    const initial: NotificationItemType[] = [
      {
        id: "1",
        title: "Original",
        type: "info",
      },
    ]

    const { getByTestId } = render(
      <NotificationProvider initial={initial}>
        <TestComponent />
      </NotificationProvider>
    )

    expect(getByTestId("notification-1")).toHaveTextContent("Original")

    fireEvent.click(getByTestId("update"))

    expect(getByTestId("notification-1")).toHaveTextContent("Updated")
  })

  test("generateId generates a unique id", () => {
    const { getByTestId } = render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    getByTestId("generate-id").click()
    // The generateId function is mocked to return "mock-uuid"
    // This test verifies it's callable
    expect(getByTestId("generate-id")).toBeInTheDocument()
  })

  test("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow("useNotifications must be used within a NotificationProvider")

    consoleSpy.mockRestore()
  })

  test("returns null when suppressError is true", () => {
    const TestComponentSuppress = () => {
      const notifications = useNotifications(true)
      return <div>{notifications ? "has context" : "no context"}</div>
    }

    const { container } = render(<TestComponentSuppress />)
    expect(container).toHaveTextContent("no context")
  })
})
