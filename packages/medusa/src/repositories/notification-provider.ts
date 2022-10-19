import { EntityRepository, Repository } from "typeorm"
import { NotificationProvider } from "../models/notification-provider"

@EntityRepository(NotificationProvider)
// eslint-disable-next-line max-len
export class NotificationProviderRepository extends Repository<NotificationProvider> {}
