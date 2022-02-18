import { EntityRepository, Repository } from "typeorm"
import { CustomerGroup } from "../models/customer-group"

@EntityRepository(CustomerGroup)
export class CustomerGroupRepository extends Repository<CustomerGroup> {}
