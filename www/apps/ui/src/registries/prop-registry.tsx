import * as React from "react"
import { PropRegistryItem } from "../types/props"

export const PropRegistry: Record<string, PropRegistryItem> = {
  avatar: {
    table: React.lazy(async () => import("../props/avatar")),
  },
  badge: {
    table: React.lazy(async () => import("../props/badge")),
  },
  button: {
    table: React.lazy(async () => import("../props/button")),
  },
  calendar: {
    table: React.lazy(async () => import("../props/calendar")),
  },
  "code-block": {
    table: React.lazy(async () => import("../props/code-block")),
  },
  "code-block-header": {
    table: React.lazy(async () => import("../props/code-block-header")),
  },
  "currency-input": {
    table: React.lazy(async () => import("../props/currency-input")),
  },
  copy: {
    table: React.lazy(async () => import("../props/copy")),
  },
  "command-bar": {
    table: React.lazy(async () => import("../props/command-bar")),
  },
  "command-bar-command": {
    table: React.lazy(async () => import("../props/command-bar-command")),
  },
  "date-picker": {
    table: React.lazy(async () => import("../props/date-picker")),
  },
  "icon-badge": {
    table: React.lazy(async () => import("../props/icon-badge")),
  },
  "icon-button": {
    table: React.lazy(async () => import("../props/icon-button")),
  },
  "status-badge": {
    table: React.lazy(async () => import("../props/status-badge")),
  },
  "focus-modal": {
    table: React.lazy(async () => import("../props/focus-modal")),
  },
  heading: {
    table: React.lazy(async () => import("../props/heading")),
  },
  hint: {
    table: React.lazy(async () => import("../props/hint")),
  },
  input: {
    table: React.lazy(async () => import("../props/input")),
  },
  label: {
    table: React.lazy(async () => import("../props/label")),
  },
  select: {
    table: React.lazy(async () => import("../props/select")),
  },
  "select-value": {
    table: React.lazy(async () => import("../props/select-value")),
  },
  "select-item": {
    table: React.lazy(async () => import("../props/select-item")),
  },
  switch: {
    table: React.lazy(async () => import("../props/switch")),
  },
  "table-pagination": {
    table: React.lazy(async () => import("../props/table-pagination")),
  },
  text: {
    table: React.lazy(async () => import("../props/text")),
  },
  "time-input": {
    table: React.lazy(async () => import("../props/time-input")),
  },
  tooltip: {
    table: React.lazy(async () => import("../props/tooltip")),
  },
  "progress-accordion-header": {
    table: React.lazy(async () => import("../props/progress-accordion-header")),
  },
  "progress-tabs-trigger": {
    table: React.lazy(async () => import("../props/progress-tabs-trigger")),
  },
}
