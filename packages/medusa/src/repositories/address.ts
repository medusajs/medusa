import { Address } from "../models"
import { dataSource } from "../loaders/database"

export const AddressRepository = dataSource.getRepository(Address)
export default AddressRepository
