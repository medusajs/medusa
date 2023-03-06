import { dataSource } from "../loaders/database"
import { Oauth } from "../models"

export const OauthRepository = dataSource.getRepository(Oauth)
export default OauthRepository
