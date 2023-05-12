import * as addExternalId from "./schema-migrations/1675761451145-add_reservation_external_id"
import * as descriptionsAndThumbnail from "./schema-migrations/1682927363119-item_descriptions_and_thumbnail"
import * as setup from "./schema-migrations/1665748086258-inventory_setup"

export default [setup, addExternalId, descriptionsAndThumbnail]
