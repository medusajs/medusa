import { Module } from "@medusajs/framework/utils";
import { CustomRecordModule } from "./service";

export const CUSTOM_RECORD = "custom_record";

export default Module(CUSTOM_RECORD, {
  service: CustomRecordModule,
});
