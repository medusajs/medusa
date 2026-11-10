import type { ReactNode } from "react"

// Progress types

export type ProgressStatus = "not-started" | "in-progress" | "completed"

// Calendar types

export type DateRange = {
  /**
   * The range's start date.
   */
  from: Date | undefined
  /**
   * The range's end date.
   */
  to?: Date | undefined
}

// Toast types

export type ToasterPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

export type ToastVariant =
  "info" | "success" | "warning" | "error" | "loading" | "message"

export type ToastActionVariant = "default" | "destructive"

export type ToastAction = {
  /**
   * The button's text.
   */
  label: string
  /**
   * The button's alt text.
   */
  altText: string
  /**
   * The function to execute when the button is clicked.
   */
  onClick: () => void | Promise<void>
  /**
   * The button's variant.
   */
  variant?: ToastActionVariant
  /**
   * An icon shown after the button's text, such as an arrow for a link
   * that opens in a new tab.
   */
  icon?: ReactNode
}

export type Granularity = "day" | "hour" | "minute" | "second"
