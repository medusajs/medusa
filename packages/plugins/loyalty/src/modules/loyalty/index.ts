import { Module } from "@zjedene-medusa/framework/utils";
import { PluginModule } from "../../types";
import LoyaltyModuleService from "./service";

export default Module(PluginModule.LOYALTY, {
  service: LoyaltyModuleService,
});
