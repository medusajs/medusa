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

export type AdminNotesRes = {
  note: Note
}

export type AdminNotesDeleteRes = DeleteResponse

export type AdminNotesListRes = PaginatedResponse & {
  notes: Note[]
}
export * from "./create-note"
export * from "./delete-note"
export * from "./get-note"
export * from "./list-notes"
export * from "./update-note"
