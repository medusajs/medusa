import {
  Context,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  PromotionTypes,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"
import { Promotion } from "@models"
import { ApplicationMethodService, PromotionService } from "@services"
import { joinerConfig } from "../joiner-config"
import { CreateApplicationMethodDTO, CreatePromotionDTO } from "../types"
import { validateApplicationMethodAttributes } from "../utils"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  promotionService: PromotionService
  applicationMethodService: ApplicationMethodService
}

export default class PromotionModuleService<
  TPromotion extends Promotion = Promotion
> implements PromotionTypes.IPromotionModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected promotionService_: PromotionService
  protected applicationMethodService_: ApplicationMethodService

  constructor(
    {
      baseRepository,
      promotionService,
      applicationMethodService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.promotionService_ = promotionService
    this.applicationMethodService_ = applicationMethodService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  async list(
    filters: PromotionTypes.FilterablePromotionProps = {},
    config: FindConfig<PromotionTypes.PromotionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO[]> {
    const promotions = await this.promotionService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PromotionTypes.PromotionDTO[]>(
      promotions,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async create(
    data: PromotionTypes.CreatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO[]> {
    const promotions = await this.create_(data, sharedContext)

    return await this.list(
      { id: promotions.map((p) => p!.id) },
      {
        relations: ["application_method"],
      },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: PromotionTypes.CreatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const promotionCodeApplicationMethodDataMap = new Map<
      string,
      PromotionTypes.CreateApplicationMethodDTO
    >()
    const promotionsData: CreatePromotionDTO[] = []
    const applicationMethodsData: CreateApplicationMethodDTO[] = []

    for (const {
      application_method: applicationMethodData,
      ...promotionData
    } of data) {
      if (applicationMethodData) {
        promotionCodeApplicationMethodDataMap.set(
          promotionData.code,
          applicationMethodData
        )
      }

      promotionsData.push(promotionData)
    }

    const createdPromotions = await this.promotionService_.create(
      data,
      sharedContext
    )

    for (const promotion of createdPromotions) {
      const data = promotionCodeApplicationMethodDataMap.get(promotion.code)

      if (!data) continue

      const applicationMethodData = {
        ...data,
        promotion,
      }

      validateApplicationMethodAttributes(applicationMethodData)
      applicationMethodsData.push(applicationMethodData)
    }

    await this.applicationMethodService_.create(
      applicationMethodsData,
      sharedContext
    )

    return createdPromotions
  }
}
