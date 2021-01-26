import { EntityRepository, Repository } from "typeorm"
import { Oauth } from "../models/oauth"

@EntityRepository(Oauth)
export class OauthRepository extends Repository<Oauth> {}
