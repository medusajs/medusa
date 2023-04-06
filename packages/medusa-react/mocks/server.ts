import { setupServer } from "msw/node"
import { storeHandlers, adminHandlers } from "./handlers"

export const server = setupServer(...storeHandlers, ...adminHandlers)
