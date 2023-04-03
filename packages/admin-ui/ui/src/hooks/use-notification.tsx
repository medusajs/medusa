import { toast } from "react-hot-toast"
import Notification, {
  NotificationTypes,
} from "../components/atoms/notification"

const useNotification = () => {
  return (title: string, message: string, type: NotificationTypes) => {
    toast.custom(
      (t) => (
        <Notification toast={t} type={type} title={title} message={message} />
      ),
      {
        position: "top-right",
        duration: 3000,
      }
    )
  }
}

export default useNotification
