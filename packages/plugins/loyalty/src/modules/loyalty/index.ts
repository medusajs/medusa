import { Module } from "@medusajs/framework/utils";
import { PluginModule } from "../../types";
import LoyaltyModuleService from "./service";

export default Module(PluginModule.LOYALTY, {
  service: LoyaltyModuleService,
});
