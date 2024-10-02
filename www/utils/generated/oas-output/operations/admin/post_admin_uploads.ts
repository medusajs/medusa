/**
 * @oas [post] /admin/uploads
 * operationId: PostUploads
 * summary: Upload Files
 * description: Upload files to the configured File Module Provider.
 * x-authenticated: true
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         oneOf:
 *           - type: object
 *             description: The files to upload
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 description: The upload's files.
 *                 items:
 *                   oneOf:
 *                     - type: object
 *                       description: The file's files.
 *                       required:
 *                         - name
 *                         - content
 *                       properties:
 *                         name:
 *                           type: string
 *                           title: name
 *                           description: The file's name.
 *                         content:
 *                           type: string
 *                           title: content
 *                           description: The file's content.
 *                     - type: object
 *                       description: A File to upload.
 *                       externalDocs:
 *                         url: https://developer.mozilla.org/en-US/docs/Web/API/File
 *                         description: Learn more about the File API
 *                       title: files
 *           - type: array
 *             description: list of files to upload.
 *             items:
 *               type: object
 *               description: A File to upload.
 *               externalDocs:
 *                 url: https://developer.mozilla.org/en-US/docs/Web/API/File
 *                 description: Learn more about the File API
 *             title: FileList
 *         description: The files to upload.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/uploads' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Uploads
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminFileListResponse"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * x-workflow: uploadFilesWorkflow
 * 
*/

