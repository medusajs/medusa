import { EntityRepository, Repository } from "typeorm"
import { DiscountRule } from "../models/discount-rule"

@EntityRepository(DiscountRule)
export class DiscountRuleRepository extends Repository<DiscountRule> {}
