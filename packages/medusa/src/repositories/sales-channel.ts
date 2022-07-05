import { EntityRepository, Repository } from "typeorm"
import { SalesChannel } from "../models/sales-channel"

@EntityRepository(SalesChannel)
export class SalesChannelRepository extends Repository<SalesChannel> {}
