/*
import { initialize } from "./initialize"
import { InventoryServiceInitializeOptions } from "./types"

// import { InventoryServiceInitializeOptions, initialize } from "@medusajs/inventory"

const DB_HOST = process.env.DB_HOST || "localhost"
const DB_USERNAME = process.env.DB_USERNAME || "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_NAME = process.env.DB_NAME || "inventory"
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
      url: DB_URL,
    },
  }

  const inventoryService = await initialize(options)

  const newInventoryItem = await inventoryService.createInventoryItem({
    sku: "sku_1236***" + Math.random() * 99999,
  })

  console.log(newInventoryItem)
}

main()
*/
