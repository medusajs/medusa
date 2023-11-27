import { Notify } from "../types/extensions"
import useNotification from "./use-notification"

export const useExtensionBaseProps = () => {
  const notification = useNotification()

  const notify: Notify = {
    success: (title: string, message: string) => {
      notification(title, message, "success")
    },
    error: (title: string, message: string) => {
      notification(title, message, "error")
    },
    warn: (title: string, message: string) => {
      notification(title, message, "warning")
    },
    info: (title: string, message: string) => {
      notification(title, message, "info")
    },
  }

  return {
    notify,
  }
}
