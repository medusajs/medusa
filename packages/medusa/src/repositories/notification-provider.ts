import { EntityRepository, Repository } from "typeorm"
import { NotificationProvider } from "../models/notification-provider"

@EntityRepository(NotificationProvider)
export class NotificationProviderRepository extends Repository<
  NotificationProvider
> {}
