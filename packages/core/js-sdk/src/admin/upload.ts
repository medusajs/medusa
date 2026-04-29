import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class Upload {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * This method creates a new upload. It sends a request to the
   * [Upload Files](https://docs.medusajs.com/api/admin#uploads_postuploads)
   * API route.
   *
   * @param body - The details of the files to upload.
   * @param query - Configure the fields and relations to retrieve in the uploaded files.
   * @param headers - Headers to pass in the request.
   * @returns The upload files' details.
   *
   * @privateRemarks
   *
   * Note: The creation/upload flow be made more advanced, with support for streaming and progress, but for now we keep it simple
   *
   * @example
   * sdk.admin.upload.create(
   *   {
   *     files: [
   *        // file uploaded as a binary string
   *       {
   *         name: "test.txt",
   *         content: "test", // Should be the binary string of the file
   *       },
   *       // file uploaded as a File object
   *       new File(["test"], "test.txt", { type: "text/plain" })
   *     ],
   *   }
   * )
   * .then(({ files }) => {
   *   console.log(files)
   * })
   */
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

    return this.client.fetch<HttpTypes.AdminFileListResponse>(
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

  /**
   * This method retrieves a file's details by its ID. It sends a request to the
   * [Get File](https://docs.medusajs.com/api/admin#uploads_getuploadsid)
   * API route.
   *
   * @param id - The ID of the file to retrieve.
   * @param query - Query parameters to pass in the request.
   * @param headers - Headers to pass in the request.
   * @returns The file's details.
   *
   * @example
   * sdk.admin.upload.retrieve("test.txt")
   * .then(({ file }) => {
   *   console.log(file)
   * })
   */
  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminFileResponse>(
      `/admin/uploads/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method deletes a file by its ID from the configured File Module Provider. It sends a request to the
   * [Delete File](https://docs.medusajs.com/api/admin#uploads_deleteuploadsid)
   * API route.
   *
   * @param id - The ID of the file to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.upload.delete("test.txt")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminFileDeleteResponse>(
      `/admin/uploads/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method creates a presigned URL for a file upload. It sends a request to the
   * `/admin/uploads/presigned-urls` API route.
   *
   * @param body - The details of the file to upload.
   * @param query - Query parameters to pass in the request.
   * @param headers - Headers to pass in the request.
   * @returns The presigned URL for the file upload.
   *
   * @example
   * sdk.admin.upload.presignedUrl({
   *   name: "test.txt",
   *   size: 1000,
   *   type: "text/plain",
   * }))
   */
  async presignedUrl(
    body: HttpTypes.AdminUploadPreSignedUrlRequest,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminUploadPreSignedUrlResponse>(
      `/admin/uploads/presigned-urls`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
