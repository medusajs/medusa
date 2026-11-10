import { Module } from "@medusajs/framework/utils"
import CloudModuleService from "./service"

export const CLOUD_MODULE = "cloud"

export default Module(CLOUD_MODULE, {
  service: CloudModuleService,
})
