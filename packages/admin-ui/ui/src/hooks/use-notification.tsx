import { toast, ToastOptions } from "react-hot-toast"
import Notification, {
  NotificationTypes,
} from "../components/atoms/notification"

const useNotification = () => {
  return (
    title: string,
    message: string,
    type: NotificationTypes,
    toastProps?: ToastOptions
  ) => {
    toast.custom(
      (t) => (
        <Notification toast={t} type={type} title={title} message={message} />
      ),
      {
        position: "top-right",
        duration: 3000,
        ...toastProps,
      }
    )
  }
}

export default useNotification
