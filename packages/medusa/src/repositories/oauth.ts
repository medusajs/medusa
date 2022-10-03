import { Oauth } from "../models"
import { dataSource } from "../loaders/database"

export const OauthRepository = dataSource.getRepository(Oauth)
export default OauthRepository
