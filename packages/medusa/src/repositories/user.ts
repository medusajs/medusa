import { User } from "../models"
import { dataSource } from "../loaders/database"

export const UserRepository = dataSource.getRepository(User)
export default UserRepository
