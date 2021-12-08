import { EntityRepository, Repository } from "typeorm"
import { Invite } from "../models/invite"

@EntityRepository(Invite)
export class InviteRepository extends Repository<Invite> {}
