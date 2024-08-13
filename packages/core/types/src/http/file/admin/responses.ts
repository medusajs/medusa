import { AdminFile } from "./entities";

export interface AdminFileResponse {
  file: AdminFile
}

export interface AdminFileListResponse {
  files: AdminFile[]
}