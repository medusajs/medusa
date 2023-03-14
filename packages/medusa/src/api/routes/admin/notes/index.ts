import { Router } from "express"
import { Note } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"
import "reflect-metadata"

const route = Router()

export default (app) => {
  app.use("/notes", route)

  route.get("/:id", middlewares.wrap(require("./get-note").default))

  route.get("/", middlewares.wrap(require("./list-notes").default))

  route.post("/", middlewares.wrap(require("./create-note").default))

  route.post("/:id", middlewares.wrap(require("./update-note").default))

  route.delete("/:id", middlewares.wrap(require("./delete-note").default))

  return app
}

/**
 * @schema AdminNotesRes
 * type: object
 * properties:
 *   note:
 *     $ref: "#/components/schemas/Note"
 */
export type AdminNotesRes = {
  note: Note
}

/**
 * @schema AdminNotesDeleteRes
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Note.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: note
 *   deleted:
 *     type: boolean
 *     description: Whether or not the Note was deleted.
 *     default: true
 */
export type AdminNotesDeleteRes = DeleteResponse

/**
 * @schema AdminNotesListRes
 * type: object
 * properties:
 *   notes:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Note"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of items skipped before these items
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminNotesListRes = PaginatedResponse & {
  notes: Note[]
}
export * from "./create-note"
export * from "./delete-note"
export * from "./get-note"
export * from "./list-notes"
export * from "./update-note"
