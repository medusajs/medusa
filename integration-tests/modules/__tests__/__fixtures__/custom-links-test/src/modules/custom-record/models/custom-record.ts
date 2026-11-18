import { model } from "@medusajs/framework/utils";

export default model.define("custom_record", {
  id: model.id({ prefix: "crec" }).primaryKey(),
  key: model.text().unique(),
  value: model.json().default({}),
});
