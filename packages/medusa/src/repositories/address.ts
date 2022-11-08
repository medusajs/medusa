import { Address } from "../models/address"
import { dataSource } from "../loaders/database"

export const AddressRepository = dataSource.getRepository(Address)
export default AddressRepository
