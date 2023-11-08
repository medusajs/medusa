import { TransactionBaseService } from "@medusajs/medusa"
import { FindConfig, Selector } from "@medusajs/types"
import { isDefined, MedusaError, promiseAll } from "@medusajs/utils"
import { Translation } from "../models/translation"
import { buildQuery } from "@medusajs/medusa/dist"
import { TranslationRepository } from "../repositories/translation"

type InjectedDependencies = {
  translationRepository: typeof TranslationRepository
}

export default class TranslationService extends TransactionBaseService {
  protected readonly translationRepository_: typeof TranslationRepository
  constructor({ translationRepository }) {
    // @ts-ignore
    super(...arguments)

    this.translationRepository_ = translationRepository
  }

  async retrieve(
    id: string,
    config: FindConfig<Translation> = {}
  ): Promise<Translation> {
    if (!isDefined(id)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `translation "id" must be defined`
      )
    }

    const translationRepo = this.activeManager_.withRepository(
      this.translationRepository_
    )

    const query = buildQuery({ id }, config)

    const translation = await translationRepo.findOne(query)

    if (!translation) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `translation with id: ${id} was not found`
      )
    }

    return translation
  }

  async list(
    selector: Selector<Translation>,
    config: FindConfig<Translation> = {
      skip: 0,
      take: 20,
    }
  ): Promise<any> {
    const translationRepo = this.activeManager_.withRepository(
      this.translationRepository_
    )

    const query = buildQuery(selector, config)

    return await translationRepo.find(query)
  }

  async listAndCount(
    selector: Selector<Translation>,
    config: FindConfig<Translation> = {
      skip: 0,
      take: 20,
    }
  ): Promise<any> {
    const translationRepo = this.activeManager_.withRepository(
      this.translationRepository_
    )

    const query = buildQuery(selector, config)

    return await translationRepo.findAndCount(query)
  }

  async create(data: Partial<Translation>[]): Promise<Translation> {
    const data_ = Array.isArray(data) ? data : [data]

    return await this.atomicPhase_(async (manager) => {
      const translationRepo = manager.withRepository(
        this.translationRepository_
      )

      return promiseAll(
        data_.map(async (d) => {
          const translation = translationRepo.create(d)
          return await translationRepo.save(translation)
        })
      )
    })
  }

  async update(
    data: { id: string; lang?: string; attributes: Record<string, string> }[]
  ): Promise<Translation[]> {
    return await this.atomicPhase_(async (manager) => {
      const translations = await this.list({
        id: data.map((d) => d.id),
      })

      const translationMap = new Map(translations.map((t) => [t.id, t])) as Map<
        string,
        Translation
      >
      const translationsIds = new Set(translations.map((t) => t.id))
      const translationToUpdateIds = new Set(data.map((d) => d.id))
      const notFoundTranslations = Array.from(translationToUpdateIds).filter(
        (id) => !translationsIds.has(id)
      )

      if (notFoundTranslations.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `translations with ids: ${notFoundTranslations} were not found`
        )
      }

      const translationRepo = manager.withRepository(
        this.translationRepository_
      )

      const translationToSave = data.map((translationData) => {
        const translation = translationMap.get(translationData.id)!

        if (translationData.lang) {
          translation.lang = translationData.lang
        }

        if (translationData.attributes) {
          translation.attributes = {
            ...translation.attributes,
            ...translationData.attributes,
          }
        }

        return translation
      })

      return await translationRepo.save(translationToSave)
    })
  }

  async delete(ids: string | string[]): Promise<void> {
    const ids_ = Array.isArray(ids) ? ids : [ids]

    return await this.atomicPhase_(async (manager) => {
      const translationRepo = manager.withRepository(
        this.translationRepository_
      )

      await translationRepo.delete(ids_)
    })
  }
}
