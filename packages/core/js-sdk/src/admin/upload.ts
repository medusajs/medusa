import { DeleteResponse, HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Upload {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  // Note: The creation/upload flow be made more advanced, with support for streaming and progress, but for now we keep it simple
  async create(
    body: HttpTypes.AdminUploadFile,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    const form = new FormData()
    if (body instanceof FileList) {
      Array.from(body).forEach((file) => {
        form.append("files", file)
      })
    } else {
      body.files.forEach((file) => {
        form.append(
          "files",
          "content" in file
            ? new Blob([file.content], {
                type: "text/plain",
              })
            : file,
          file.name
        )
      })
    }

    return this.client.fetch<{ files: HttpTypes.AdminFile[] }>(
      `/admin/uploads`,
      {
        method: "POST",
        headers: {
          ...headers,
          // Let the browser determine the content type.
          "content-type": null,
        },
        body: form,
        query,
      }
    )
  }

  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return this.client.fetch<{ file: HttpTypes.AdminFile }>(
      `/admin/uploads/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<DeleteResponse<"file">>(`/admin/uploads/${id}`, {
      method: "DELETE",
      headers,
    })
  }
}
