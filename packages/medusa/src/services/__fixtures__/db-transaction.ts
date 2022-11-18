import { asClass, createContainer } from "awilix"
import { DbTransactionService } from "../index"

export const defaultContainerMock = createContainer()

defaultContainerMock.register({
  [DbTransactionService.RESOLUTION_KEY]: asClass(DbTransactionService),
})

export const fakeUserData = {
  id: "test",
  email: "test@email.com",
  first_name: "firstname",
  last_name: "lastname",
  password_hash: "password_hash",
}
