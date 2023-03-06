import { dataSource } from "../loaders/database"
import { Notification } from "../models"

export const NotificationRepository = dataSource.getRepository(Notification)
export default NotificationRepository
