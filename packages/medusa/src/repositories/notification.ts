import { Notification } from "../models"
import { dataSource } from "../loaders/database"

export const NotificationRepository = dataSource.getRepository(Notification)
export default NotificationRepository
