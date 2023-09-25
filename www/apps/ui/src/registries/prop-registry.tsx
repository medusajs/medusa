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
  "code-block-body": {
    table: React.lazy(async () => import("../props/code-block-body")),
  },
  copy: {
    table: React.lazy(async () => import("../props/copy")),
  },
  "date-picker": {
    table: React.lazy(async () => import("../props/date-picker")),
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
}
