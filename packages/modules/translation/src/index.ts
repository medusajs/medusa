import "./types"
import { Module } from "@zjedene-medusa/framework/utils"
import TranslationModuleService from "@services/translation-module"
import loadDefaults from "./loaders/defaults"

export const TRANSLATION_MODULE = "translation"

export default Module(TRANSLATION_MODULE, {
  service: TranslationModuleService,
  loaders: [loadDefaults],
})
