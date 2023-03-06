import { dataSource } from "../loaders/database"
import { NotificationProvider } from "../models/notification-provider"

export const NotificationProviderRepository =
  dataSource.getRepository(NotificationProvider)
export default NotificationProviderRepository
