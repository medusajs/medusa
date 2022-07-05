import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { FindConfig, QuerySelector } from "../types/common"
import {
  CreateSalesChannelInput,
  UpdateSalesChannelInput,
} from "../types/sales-channels"

type InjectedDependencies = {}

class SalesChannelService extends TransactionBaseService<SalesChannelService> {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  // eslint-disable-next-line no-empty-pattern
  constructor({}: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])
  }

  async retrieve(id: string): Promise<any> {
    throw new Error("Method not implemented.")
  }

  async listAndCount(
    selector: QuerySelector<any> = {},
    config: FindConfig<any> = { relations: [], skip: 0, take: 10 }
  ): Promise<any> {
    throw new Error("Method not implemented.")
  }

  async create(data: CreateSalesChannelInput): Promise<any> {
    throw new Error("Method not implemented.")
  }

  async update(id: string, data: UpdateSalesChannelInput): Promise<any> {
    throw new Error("Method not implemented.")
  }

  async delete(id: string): Promise<any> {
    throw new Error("Method not implemented.")
  }
}

export default SalesChannelService
