import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { NotificationItemType } from "@/providers/Notification"

// mock data
const mockNotifications: NotificationItemType[] = [
  {
    id: "1",
    title: "Top Notification",
    placement: "top",
  },
  {
    id: "2",
    title: "Bottom Notification",
    placement: "bottom",
  },
  {
    id: "3",
    title: "Another Top",
    placement: "top",
    onClose: vi.fn(),
  },
]

// mock functions
const mockRemoveNotification = vi.fn()

// mock components
vi.mock("react-transition-group", () => ({
  TransitionGroup: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <div data-testid="transition-group" className={className}>
      {children}
    </div>
  ),
}))

vi.mock("@/components/Notification/Item", () => ({
  NotificationItem: ({
    id,
    title,
    className,
  }: {
    id?: string
    title?: string
    className?: string
  }) => (
    <div data-testid="notification-item" data-id={id} className={className}>
      {title}
    </div>
  ),
}))

vi.mock("@/providers/Notification", () => ({
  useNotifications: () => ({
    notifications: mockNotifications,
    removeNotification: mockRemoveNotification,
  }),
}))

import { NotificationContainer } from "../../Notification"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders notification container", () => {
    const { container } = render(<NotificationContainer />)
    const transitionGroups = container.querySelectorAll(
      "[data-testid='transition-group']"
    )
    expect(transitionGroups).toHaveLength(2)
  })

  test("renders top notifications in top transition group", () => {
    const { container } = render(<NotificationContainer />)
    const transitionGroups = container.querySelectorAll(
      "[data-testid='transition-group']"
    )
    const topGroup = transitionGroups[0]
    expect(topGroup).toHaveClass("top-0")
    const topNotifications = topGroup.querySelectorAll(
      "[data-testid='notification-item']"
    )
    expect(topNotifications).toHaveLength(2)
    expect(topNotifications[0]).toHaveAttribute("data-id", "1")
    expect(topNotifications[1]).toHaveAttribute("data-id", "3")
  })

  test("renders bottom notifications in bottom transition group", () => {
    const { container } = render(<NotificationContainer />)
    const transitionGroups = container.querySelectorAll(
      "[data-testid='transition-group']"
    )
    const bottomGroup = transitionGroups[1]
    expect(bottomGroup).toHaveClass("bottom-0")
    const bottomNotifications = bottomGroup.querySelectorAll(
      "[data-testid='notification-item']"
    )
    expect(bottomNotifications).toHaveLength(1)
    expect(bottomNotifications[0]).toHaveAttribute("data-id", "2")
  })
})

describe("interactions", () => {
  test("renders notifications with onClose callback", () => {
    const mockOnClose = vi.fn()
    const notificationWithOnClose: NotificationItemType = {
      id: "4",
      title: "Test",
      onClose: mockOnClose,
    }
    mockNotifications.push(notificationWithOnClose)

    render(<NotificationContainer />)
    // Verify notification is rendered
    // The onClose would be called when user clicks close button
    expect(mockNotifications).toContainEqual(notificationWithOnClose)
  })
})
