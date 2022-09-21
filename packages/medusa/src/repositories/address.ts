import { EntityRepository, Repository } from "typeorm"
import { Address } from "../models/address"

@EntityRepository(Address)
export class AddressRepository extends Repository<Address> {}
