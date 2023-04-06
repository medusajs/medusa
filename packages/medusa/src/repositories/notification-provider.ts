import { NotificationProvider } from "../models/notification-provider"
import { dataSource } from "../loaders/database"

export const NotificationProviderRepository =
  dataSource.getRepository(NotificationProvider)
export default NotificationProviderRepository
