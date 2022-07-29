import { Router } from "express"
import { Note } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import "reflect-metadata"

const route = Router()

export default (app) => {
  app.use("/notes", route)

  route.get("/:id", require("./get-note").default)

  route.get("/", require("./list-notes").default)

  route.post("/", require("./create-note").default)

  route.post("/:id", require("./update-note").default)

  route.delete("/:id", require("./delete-note").default)

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
