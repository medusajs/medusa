import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { Translation } from "../models/translation"

export const TranslationRepository = dataSource.getRepository(Translation)
