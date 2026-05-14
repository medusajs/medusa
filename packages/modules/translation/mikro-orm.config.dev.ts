import { defineMikroOrmCliConfig } from "@medusajs/framework/utils"
import Locale from "./src/models/locale"
import Translation from "./src/models/translation"
import Settings from "./src/models/settings"

export default defineMikroOrmCliConfig("translation", {
  entities: [Locale, Translation, Settings],
})
