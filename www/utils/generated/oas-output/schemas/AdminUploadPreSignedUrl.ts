/**
 * @schema AdminUploadPreSignedUrl
 * type: object
 * description: The details of the file to upload.
 * x-schemaName: AdminUploadPreSignedUrl
 * required:
 *   - originalname
 *   - mime_type
 *   - size
 * properties:
 *   originalname:
 *     type: string
 *     title: originalname
 *     description: The file's original name.
 *   size:
 *     type: number
 *     title: size
 *     description: The file's size in bytes.
 *   mime_type:
 *     type: string
 *     title: mime_type
 *     description: The file's mime type.
 *     example: text/csv
 *   access:
 *     type: string
 *     description: The access level of the file. If `private`, the file will not be publicly accessible. The default value depends on the configured File Module Provider.
 *     enum:
 *       - public
 *       - private
 * 
*/

