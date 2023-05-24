import type { NavigateFunction } from "react-router-dom"

type Notify = {
  success: (title: string, message: string) => void
  error: (title: string, message: string) => void
  info: (title: string, message: string) => void
  warning: (title: string, message: string) => void
}

export interface ExtensionProps {
  navigate: NavigateFunction
  notify: Notify
}
