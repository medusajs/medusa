import { toast, ToastOptions } from "react-hot-toast"
import Notification, {
  NotificationTypes,
} from "../components/atoms/notification"

const useNotification = (options?: ToastOptions) => {
  const { position = "top-right", duration = 3000, ...restOptions } =
    options || {}

  return (title: string, message: string, type: NotificationTypes) => {
    toast.custom(
      (t) => (
        <Notification toast={t} type={type} title={title} message={message} />
      ),
      {
        ...restOptions,
        position,
        duration,
      }
    )
  }
}

export default useNotification
