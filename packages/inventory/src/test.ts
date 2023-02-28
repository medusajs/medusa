import { initialize } from "./initialize"
import { InventoryServiceInitializeOptions } from "./types"

const DB_HOST = process.env.DB_HOST || "localhost"
const DB_USERNAME = process.env.DB_USERNAME || "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_NAME = process.env.DB_NAME || "development"
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

class FakeEventBus {
  emit(...args): any {
    console.log("FakeEvent.emit()", args)
  }
  withTransaction() {
    return this
  }
}

async function main() {
  const options: InventoryServiceInitializeOptions = {
    database: {
      type: "postgres",
      url: `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
    },
  }

  const inventoryService = await initialize(options, {
    eventBusService: new FakeEventBus(),
  })

  const newInventoryItem = await inventoryService.createInventoryItem({
    sku: "sku_1236***" + Math.random() * 99999,
  })

  console.log(newInventoryItem)
}

main()
