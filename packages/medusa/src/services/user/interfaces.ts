import { User } from "../../models/user"
import { FindConfig } from "../../types/common"

export interface UserRetrieve {
  retrieve(token: string): Promise<User>
}

export interface UserRetrieveByApiToken {
  retrieveByApiToken(token: string): Promise<User>
}

export interface UserRetrieveByEmail {
  retrieveByEmail(email: string, config?: FindConfig<User>): Promise<User>
}

export type IUserService = UserRetrieve &
  UserRetrieveByApiToken &
  UserRetrieveByEmail
