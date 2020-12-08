import { EntityRepository, Repository } from "typeorm"
import { Return } from "../models/return"

@EntityRepository(Return)
export class ReturnRepository extends Repository<Return> {}
