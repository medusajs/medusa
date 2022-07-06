import { EntityRepository, Repository } from "typeorm"
import { SalesChannel } from "../models"

@EntityRepository(SalesChannel)
export class SalesChannelRepository extends Repository<SalesChannel> {}
