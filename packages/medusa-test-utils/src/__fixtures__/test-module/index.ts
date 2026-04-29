import { Module } from "@medusajs/framework/utils"
import TestService from "./service"

export const TEST_MODULE = "test"

export default Module(TEST_MODULE, {
  service: TestService,
})
