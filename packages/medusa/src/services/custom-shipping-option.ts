import { MedusaError } from "medusa-core-utils"
import { DeepPartial, EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { CustomShippingOption } from "../models"
import { CustomShippingOptionRepository } from "../repositories/custom-shipping-option"
import { FindConfig, Selector } from "../types/common"
import { CreateCustomShippingOptionInput } from "../types/shipping-options"
import { buildQuery } from "../utils"

type InjectedDependencies = {
  manager: EntityManager
  customShippingOptionRepository: typeof CustomShippingOptionRepository
}
class CustomShippingOptionService extends TransactionBaseService {
  // eslint-disable-next-line max-len
  protected customShippingOptionRepository_: typeof CustomShippingOptionRepository

  constructor({ customShippingOptionRepository }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.customShippingOptionRepository_ = customShippingOptionRepository
  }

  /**
   * Retrieves a specific shipping option.
   * @param id - the id of the custom shipping option to retrieve.
   * @param config - any options needed to query for the result.
   * @return the requested custom shipping option.
   */
  async retrieve(
    id: string,
    config: FindConfig<CustomShippingOption> = {}
  ): Promise<CustomShippingOption> {
    const customShippingOptionRepo = this.activeManager_.withRepository(
      this.customShippingOptionRepository_
    )

    const query = buildQuery({ id }, config)

    const customShippingOption = await customShippingOptionRepo.findOne(query)

    if (!customShippingOption) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Custom shipping option with id: ${id} was not found.`
      )
    }

    return customShippingOption
  }

  /** Fetches all custom shipping options based on the given selector
   * @param selector - the query object for find
   * @param config - the configuration used to find the objects. contains relations, skip, and take.
   * @return custom shipping options matching the query
   */
  async list(
    selector: Selector<CustomShippingOption>,
    config: FindConfig<CustomShippingOption> = {
      skip: 0,
      take: 50,
      relations: [],
    }
  ): Promise<CustomShippingOption[]> {
    const customShippingOptionRepo = this.activeManager_.withRepository(
      this.customShippingOptionRepository_
    )

    const query = buildQuery(selector, config)

    return await customShippingOptionRepo.find(query)
  }

  /**
   * Creates a custom shipping option
   * @param data - the custom shipping option to create
   * @return resolves to the creation result
   */
  async create<
    T = CreateCustomShippingOptionInput | CreateCustomShippingOptionInput[],
    TResult = T extends CreateCustomShippingOptionInput[]
      ? CustomShippingOption[]
      : CustomShippingOption
  >(data: T): Promise<TResult> {
    const customShippingOptionRepo = this.activeManager_.withRepository(
      this.customShippingOptionRepository_
    )
    const data_ = (
      Array.isArray(data) ? data : [data]
    ) as DeepPartial<CustomShippingOption>[]

    const customShippingOptions = customShippingOptionRepo.create(data_)
    const shippingOptions = await customShippingOptionRepo.save(
      customShippingOptions
    )

    return (Array.isArray(data)
      ? shippingOptions
      : shippingOptions[0]) as unknown as TResult
  }
}

export default CustomShippingOptionService
