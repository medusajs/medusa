import { model } from "@zjedene-medusa/framework/utils";

export default model.define("translation", {
  id: model.id({ prefix: "i18n" }).primaryKey(),
  key: model.text().unique(),
  value: model.json().default({}),
});
