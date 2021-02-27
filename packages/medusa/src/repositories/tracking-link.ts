import { EntityRepository, Repository } from "typeorm"
import { TrackingLink } from "../models/tracking-link"

@EntityRepository(TrackingLink)
export class TrackingLinkRepository extends Repository<TrackingLink> {}
