import { DeleteResponse } from "../../common"
import { AdminFile } from "./entities"

export interface AdminFileResponse {
  file: AdminFile
}

export interface AdminFileListResponse {
  files: AdminFile[]
}

export type AdminFileDeleteResponse = DeleteResponse<"file">
