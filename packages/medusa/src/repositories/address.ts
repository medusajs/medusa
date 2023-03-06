import { dataSource } from "../loaders/database"
import { Address } from "../models"

export const AddressRepository = dataSource.getRepository(Address)
export default AddressRepository
