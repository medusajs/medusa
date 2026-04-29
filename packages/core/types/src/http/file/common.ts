export interface BaseFile {
  /**
   * The ID of the file in the configured File Module Provider.
   * For example, when using the Local File Provider Module (default provider),
   * the ID is the file's path relative to the `static` directory.
   */
  id: string
  /**
   * The URL of the file.
   */
  url: string
}

export type BaseUploadFile =
  | {
      /**
       * The list of files to upload.
       */
      files: (
        | {
            /**
             * The name of the file.
             */
            name: string
            /**
             * The content of the file.
             */
            content: string
          }
        | File
      )[]
    }
  | FileList
