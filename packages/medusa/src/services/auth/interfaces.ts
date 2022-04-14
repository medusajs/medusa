import {
  UserRetrieve,
  UserRetrieveByApiToken,
  UserRetrieveByEmail,
} from "../user"
import { CustomerRetrieveByEmail } from "../customer"
import BaseService from "../../interfaces/base-service"

export interface AuthUserService
  extends UserRetrieve,
    UserRetrieveByApiToken,
    UserRetrieveByEmail,
    BaseService<AuthUserService> {}

export interface AuthCustomerService
  extends CustomerRetrieveByEmail,
    BaseService<AuthCustomerService> {}
