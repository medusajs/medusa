import { EntityRepository, Repository } from "typeorm"
import { Customer } from "../models/customer"

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {}
