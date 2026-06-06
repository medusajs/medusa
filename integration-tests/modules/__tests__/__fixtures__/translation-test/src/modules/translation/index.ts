import { Module } from "@zjedene-medusa/framework/utils";
import { TranslationModule } from "./service";

export const TRANSLATION = "translation";

export default Module(TRANSLATION, {
  service: TranslationModule,
});
