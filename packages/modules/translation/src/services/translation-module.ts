import { raw } from "@medusajs/framework/mikro-orm/core"
import {
  Context,
  CreateTranslationDTO,
  CreateTranslationSettingsDTO,
  DAL,
  FilterableTranslationProps,
  FindConfig,
  ITranslationModuleService,
  LocaleDTO,
  ModulesSdkTypes,
  TranslationTypes,
  UpdateTranslationSettingsDTO,
} from "@medusajs/framework/types"
import { SqlEntityManager } from "@medusajs/framework/mikro-orm/postgresql"
import {
  arrayDifference,
  DmlEntity,
  EmitEvents,
  InjectManager,
  MedusaContext,
  MedusaError,
  MedusaErrorTypes,
  MedusaService,
  normalizeLocale,
  toSnakeCase,
} from "@medusajs/framework/utils"
import Locale from "@models/locale"
import Translation from "@models/translation"
import Settings from "@models/settings"
import { computeTranslatedFieldCount } from "@utils/compute-translated-field-count"
import { filterTranslationFields } from "@utils/filter-translation-fields"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  translationService: ModulesSdkTypes.IMedusaInternalService<typeof Translation>
  localeService: ModulesSdkTypes.IMedusaInternalService<typeof Locale>
  translationSettingsService: ModulesSdkTypes.IMedusaInternalService<
    typeof Settings
  >
}

export default class TranslationModuleService
  extends MedusaService<{
    Locale: {
      dto: TranslationTypes.LocaleDTO
    }
    Translation: {
      dto: TranslationTypes.TranslationDTO
    }
    TranslationSettings: {
      dto: TranslationTypes.TranslationSettingsDTO
    }
  }>({
    Locale,
    Translation,
    TranslationSettings: Settings,
  })
  implements ITranslationModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected translationService_: ModulesSdkTypes.IMedusaInternalService<
    typeof Translation
  >
  protected localeService_: ModulesSdkTypes.IMedusaInternalService<
    typeof Locale
  >
  protected settingsService_: ModulesSdkTypes.IMedusaInternalService<
    typeof Settings
  >

  constructor({
    baseRepository,
    translationService,
    localeService,
    translationSettingsService,
  }: InjectedDependencies) {
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.translationService_ = translationService
    this.localeService_ = localeService
    this.settingsService_ = translationSettingsService
  }

  __hooks = {
    onApplicationStart: async () => {
      return this.onApplicationStart_()
    },
  }

  protected async onApplicationStart_() {
    const translatableEntities = DmlEntity.getTranslatableEntities()
    const translatableEntitiesSet = new Set(
      translatableEntities.map((entity) => toSnakeCase(entity.entity))
    )

    const currentTranslationSettings = await this.settingsService_.list()
    const currentTranslationSettingsSet = new Set(
      currentTranslationSettings.map((setting) => setting.entity_type)
    )

    const settingsToUpsert: (
      | CreateTranslationSettingsDTO
      | UpdateTranslationSettingsDTO
    )[] = []

    for (const setting of currentTranslationSettings) {
      if (
        !translatableEntitiesSet.has(setting.entity_type) &&
        setting.is_active
      ) {
        settingsToUpsert.push({
          id: setting.id,
          is_active: false,
        })
      }
    }

    for (const entity of translatableEntities) {
      const snakeCaseEntityType = toSnakeCase(entity.entity)
      const hasCurrentSettings =
        currentTranslationSettingsSet.has(snakeCaseEntityType)
      if (!hasCurrentSettings) {
        settingsToUpsert.push({
          entity_type: snakeCaseEntityType,
          fields: entity.fields,
        })
      }
    }

    await this.settingsService_.upsert(settingsToUpsert)
  }

  @InjectManager()
  async getTranslatableFields(
    entityType?: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]>> {
    const filters = entityType ? { entity_type: entityType } : {}
    const settings = await this.settingsService_.list(
      filters,
      {},
      sharedContext
    )
    return settings.reduce((acc, setting) => {
      acc[setting.entity_type] = setting.is_active
        ? (setting.fields as unknown as string[])
        : []
      return acc
    }, {} as Record<string, string[]>)
  }

  @InjectManager()
  async getInactiveTranslatableFields(
    entityType?: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]>> {
    const translatableFields = await this.getTranslatableFields(
      entityType,
      sharedContext
    )
    return Object.entries(translatableFields).reduce(
      (acc, [entityType, fields]) => {
        const entity = DmlEntity.getTranslatableEntities().find(
          (entity) => toSnakeCase(entity.entity) === entityType
        )
        if (!entity) {
          return acc
        }

        acc[entityType] = arrayDifference(entity.fields, fields)
        return acc
      },
      {} as Record<string, string[]>
    )
  }

  static prepareFilters(
    filters: FilterableTranslationProps
  ): FilterableTranslationProps {
    let { q, ...restFilters } = filters

    if (q) {
      restFilters = {
        ...restFilters,
        [raw(`translations::text ILIKE ?`, [`%${q}%`])]: [],
      }
    }

    return restFilters
  }

  @InjectManager()
  // @ts-expect-error
  async retrieveTranslation(
    id: string,
    config: FindConfig<TranslationTypes.TranslationDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TranslationTypes.TranslationDTO> {
    const configWithReference =
      TranslationModuleService.ensureReferenceFieldInConfig(config)

    const result = await this.translationService_.retrieve(
      id,
      configWithReference,
      sharedContext
    )

    const serialized =
      await this.baseRepository_.serialize<TranslationTypes.TranslationDTO>(
        result
      )

    const translatableFieldsConfig = await this.getTranslatableFields(
      undefined,
      sharedContext
    )

    return filterTranslationFields([serialized], translatableFieldsConfig)[0]
  }

  /**
   * Ensures the 'reference' field is included in the select config.
   * This is needed for filtering translations by translatable fields.
   */
  static ensureReferenceFieldInConfig(
    config: FindConfig<TranslationTypes.TranslationDTO>
  ): FindConfig<TranslationTypes.TranslationDTO> {
    if (!config?.select?.length) {
      return config
    }

    const select = config.select as string[]
    if (!select.includes("reference")) {
      return { ...config, select: [...select, "reference"] }
    }

    return config
  }

  @InjectManager()
  // @ts-expect-error
  async listTranslations(
    filters: FilterableTranslationProps = {},
    config: FindConfig<TranslationTypes.TranslationDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TranslationTypes.TranslationDTO[]> {
    const preparedFilters = TranslationModuleService.prepareFilters(filters)
    const configWithReference =
      TranslationModuleService.ensureReferenceFieldInConfig(config)

    const results = await this.translationService_.list(
      preparedFilters,
      configWithReference,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      TranslationTypes.TranslationDTO[]
    >(results)

    const translatableFieldsConfig = await this.getTranslatableFields(
      undefined,
      sharedContext
    )

    return filterTranslationFields(serialized, translatableFieldsConfig)
  }

  @InjectManager()
  // @ts-expect-error
  async listAndCountTranslations(
    filters: FilterableTranslationProps = {},
    config: FindConfig<TranslationTypes.TranslationDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TranslationTypes.TranslationDTO[], number]> {
    const preparedFilters = TranslationModuleService.prepareFilters(filters)
    const configWithReference =
      TranslationModuleService.ensureReferenceFieldInConfig(config)

    const [results, count] = await this.translationService_.listAndCount(
      preparedFilters,
      configWithReference,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      TranslationTypes.TranslationDTO[]
    >(results)

    const translatableFieldsConfig = await this.getTranslatableFields(
      undefined,
      sharedContext
    )

    return [
      filterTranslationFields(serialized, translatableFieldsConfig),
      count,
    ]
  }

  // @ts-expect-error
  createLocales(
    data: TranslationTypes.CreateLocaleDTO[],
    sharedContext?: Context
  ): Promise<TranslationTypes.LocaleDTO[]>
  // @ts-expect-error
  createLocales(
    data: TranslationTypes.CreateLocaleDTO,
    sharedContext?: Context
  ): Promise<TranslationTypes.LocaleDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createLocales(
    data: TranslationTypes.CreateLocaleDTO | TranslationTypes.CreateLocaleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TranslationTypes.LocaleDTO | TranslationTypes.LocaleDTO[]> {
    const dataArray = Array.isArray(data) ? data : [data]
    const normalizedData = dataArray.map((locale) => ({
      ...locale,
      code: normalizeLocale(locale.code),
    }))

    const createdLocales = await this.localeService_.create(
      normalizedData,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<LocaleDTO[]>(
      createdLocales
    )
    return Array.isArray(data) ? serialized : serialized[0]
  }

  // @ts-expect-error
  createTranslations(
    data: CreateTranslationDTO,
    sharedContext?: Context
  ): Promise<TranslationTypes.TranslationDTO>

  // @ts-expect-error
  createTranslations(
    data: CreateTranslationDTO[],
    sharedContext?: Context
  ): Promise<TranslationTypes.TranslationDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createTranslations(
    data: CreateTranslationDTO | CreateTranslationDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    TranslationTypes.TranslationDTO | TranslationTypes.TranslationDTO[]
  > {
    const dataArray = Array.isArray(data) ? data : [data]
    const translatableFieldsConfig = await this.getTranslatableFields(
      undefined,
      sharedContext
    )
    const normalizedData = dataArray.map((translation) => ({
      ...translation,
      locale_code: normalizeLocale(translation.locale_code),
      translated_field_count: computeTranslatedFieldCount(
        translation.translations as Record<string, unknown>,
        translatableFieldsConfig[translation.reference]
      ),
    }))

    const createdTranslations = await this.translationService_.create(
      normalizedData,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      TranslationTypes.TranslationDTO[]
    >(createdTranslations)

    return Array.isArray(data) ? serialized : serialized[0]
  }

  // @ts-expect-error
  updateTranslations(
    data: TranslationTypes.UpdateTranslationDTO,
    sharedContext?: Context
  ): Promise<TranslationTypes.TranslationDTO>
  // @ts-expect-error
  updateTranslations(
    data: TranslationTypes.UpdateTranslationDTO[],
    sharedContext?: Context
  ): Promise<TranslationTypes.TranslationDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateTranslations(
    data:
      | TranslationTypes.UpdateTranslationDTO
      | TranslationTypes.UpdateTranslationDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    TranslationTypes.TranslationDTO | TranslationTypes.TranslationDTO[]
  > {
    const dataArray = Array.isArray(data) ? data : [data]

    const updatesWithTranslations = dataArray.filter((d) => d.translations)

    if (updatesWithTranslations.length) {
      const idsNeedingReference = updatesWithTranslations
        .filter((d) => !d.reference)
        .map((d) => d.id)

      let referenceMap: Record<string, string> = {}

      if (idsNeedingReference.length) {
        const existingTranslations = await this.translationService_.list(
          { id: idsNeedingReference },
          { select: ["id", "reference"] },
          sharedContext
        )
        referenceMap = Object.fromEntries(
          existingTranslations.map((t) => [t.id, t.reference])
        )
      }

      const translatableFieldsConfig = await this.getTranslatableFields(
        undefined,
        sharedContext
      )

      for (const update of dataArray) {
        if (update.translations) {
          const reference = update.reference || referenceMap[update.id]
          ;(
            update as TranslationTypes.UpdateTranslationDTO & {
              translated_field_count: number
            }
          ).translated_field_count = computeTranslatedFieldCount(
            update.translations as Record<string, unknown>,
            translatableFieldsConfig[reference] || []
          )
        }
      }
    }

    const updatedTranslations = await this.translationService_.update(
      dataArray,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      TranslationTypes.TranslationDTO[]
    >(updatedTranslations)

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createTranslationSettings(
    data: CreateTranslationSettingsDTO[] | CreateTranslationSettingsDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | TranslationTypes.TranslationSettingsDTO
    | TranslationTypes.TranslationSettingsDTO[]
  > {
    const dataArray = Array.isArray(data) ? data : [data]

    const normalizedData = await this.ensureEntityType_(
      dataArray,
      sharedContext
    )
    TranslationModuleService.validateSettings(normalizedData)

    // @ts-expect-error TS can't match union type to overloads
    return await super.createTranslationSettings(data, sharedContext)
  }

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateTranslationSettings(
    data: UpdateTranslationSettingsDTO | UpdateTranslationSettingsDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    | TranslationTypes.TranslationSettingsDTO[]
    | TranslationTypes.TranslationSettingsDTO
  > {
    const dataArray = Array.isArray(data) ? data : [data]

    const normalizedData = await this.ensureEntityType_(
      dataArray,
      sharedContext
    )
    TranslationModuleService.validateSettings(normalizedData)

    const updatedSettings = await this.settingsService_.update(
      data,
      sharedContext
    )

    const entityTypes = [
      ...new Set(normalizedData.map((setting) => setting.entity_type)),
    ]

    const translatableFieldsConfig = await this.getTranslatableFields(
      undefined,
      sharedContext
    )

    const translations = await this.translationService_.list({
      reference: entityTypes,
    })

    const toUpdate = translations.map((translation) => ({
      id: translation.id,
      translated_field_count: computeTranslatedFieldCount(
        translation.translations,
        translatableFieldsConfig[translation.reference] ?? []
      ),
    }))

    if (toUpdate.length) {
      await this.translationService_.update(toUpdate, sharedContext)
    }

    const serialized = await this.baseRepository_.serialize<
      TranslationTypes.TranslationSettingsDTO[]
    >(updatedSettings)

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectManager()
  async getStatistics(
    input: TranslationTypes.TranslationStatisticsInput,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TranslationTypes.TranslationStatisticsOutput> {
    const { locales, entities } = input

    if (!locales || !locales.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "At least one locale must be provided"
      )
    }

    if (!entities || !Object.keys(entities).length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "At least one entity type must be provided"
      )
    }

    const normalizedLocales = locales.map(normalizeLocale)

    const manager = (sharedContext.transactionManager ??
      sharedContext.manager) as SqlEntityManager
    const knex = manager.getKnex()

    const translatableFieldsConfig = await this.getTranslatableFields(
      undefined,
      sharedContext
    )

    const result: TranslationTypes.TranslationStatisticsOutput = {}
    const entityTypes: string[] = []

    for (const entityType of Object.keys(entities)) {
      const translatableFields = translatableFieldsConfig[entityType]

      if (!translatableFields || translatableFields.length === 0) {
        result[entityType] = {
          expected: 0,
          translated: 0,
          missing: 0,
          by_locale: Object.fromEntries(
            normalizedLocales.map((locale) => [
              locale,
              { expected: 0, translated: 0, missing: 0 },
            ])
          ),
        }
      } else {
        entityTypes.push(entityType)
      }
    }

    if (!entityTypes.length) {
      return result
    }

    const { rows } = await knex.raw(
      `
      SELECT
        reference,
        locale_code,
        COALESCE(SUM(translated_field_count), 0)::int AS translated_field_count
      FROM translation
      WHERE reference = ANY(?)
        AND locale_code = ANY(?)
        AND deleted_at IS NULL
      GROUP BY reference, locale_code
      `,
      [entityTypes, normalizedLocales]
    )

    for (const entityType of entityTypes) {
      const translatableFields = translatableFieldsConfig[entityType]
      const fieldsPerEntity = translatableFields.length
      const entityCount = entities[entityType].count
      const expectedPerLocale = entityCount * fieldsPerEntity

      result[entityType] = {
        expected: expectedPerLocale * normalizedLocales.length,
        translated: 0,
        missing: expectedPerLocale * normalizedLocales.length,
        by_locale: Object.fromEntries(
          normalizedLocales.map((locale) => [
            locale,
            {
              expected: expectedPerLocale,
              translated: 0,
              missing: expectedPerLocale,
            },
          ])
        ),
      }
    }

    for (const row of rows) {
      const entityType = row.reference
      const localeCode = row.locale_code
      const translatedCount = parseInt(row.translated_field_count, 10) || 0

      result[entityType].by_locale[localeCode].translated = translatedCount
      result[entityType].by_locale[localeCode].missing =
        result[entityType].by_locale[localeCode].expected - translatedCount
      result[entityType].translated += translatedCount
    }

    for (const entityType of entityTypes) {
      result[entityType].missing =
        result[entityType].expected - result[entityType].translated
    }

    return result
  }

  /**
   * Validates the translation settings to create or update against the translatable entities and their translatable fields configuration.
   * @param dataToValidate - The data to validate.
   */
  static validateSettings(
    dataToValidate: (
      | CreateTranslationSettingsDTO
      | (UpdateTranslationSettingsDTO & { entity_type: string })
    )[]
  ) {
    const translatableEntities = DmlEntity.getTranslatableEntities()
    const translatableEntitiesMap = new Map(
      translatableEntities.map((entity) => [toSnakeCase(entity.entity), entity])
    )

    const invalidSettings: {
      entity_type: string
      is_invalid_entity: boolean
      invalidFields?: string[]
    }[] = []

    for (const item of dataToValidate) {
      const entityType = item.entity_type
      const entity = translatableEntitiesMap.get(entityType)

      if (!entity) {
        invalidSettings.push({
          entity_type: entityType,
          is_invalid_entity: true,
        })
      } else {
        const invalidFields = arrayDifference(item.fields ?? [], entity.fields)
        if (invalidFields.length) {
          invalidSettings.push({
            entity_type: entityType,
            is_invalid_entity: false,
            invalidFields,
          })
        }
      }
    }

    if (invalidSettings.length) {
      throw new MedusaError(
        MedusaErrorTypes.INVALID_DATA,
        "Invalid translation settings:\n" +
          invalidSettings
            .map(
              (setting) =>
                `- ${setting.entity_type} ${
                  setting.is_invalid_entity
                    ? "is not a translatable entity"
                    : `doesn't have the following fields set as translatable: ${setting.invalidFields?.join(
                        ", "
                      )}`
                }`
            )
            .join("\n")
      )
    }
  }

  /**
   * Ensures the entity type is set for the settings to be created or updated. This is useful for validation purposes and recomputing the translated field count.
   * @param settings - The settings to ensure the entity type for.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns The settings with the entity type set.
   */
  protected async ensureEntityType_(
    settings: (CreateTranslationSettingsDTO | UpdateTranslationSettingsDTO)[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    (
      | CreateTranslationSettingsDTO
      | (UpdateTranslationSettingsDTO & { entity_type: string })
    )[]
  > {
    const idsNeedingResolution = settings
      .filter((setting) => !setting.entity_type && "id" in setting)
      .map((setting) => (setting as UpdateTranslationSettingsDTO).id)

    let entityTypeMap: Record<string, string> = {}

    if (idsNeedingResolution.length) {
      const existingSettings = await this.settingsService_.list(
        { id: idsNeedingResolution },
        { select: ["id", "entity_type"] },
        sharedContext
      )
      entityTypeMap = Object.fromEntries(
        existingSettings.map((s) => [s.id, s.entity_type])
      )
    }

    return settings.map((setting) => {
      const entityType =
        setting.entity_type ||
        entityTypeMap[(setting as UpdateTranslationSettingsDTO).id]
      return { ...setting, entity_type: entityType }
    })
  }
}
