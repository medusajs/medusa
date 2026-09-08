/**
 * The options for the S3 file provider module.
 */
export interface S3FileServiceOptions {
  /**
   * The base URL used to construct public file URLs.
   */
  file_url: string
  /**
   * The AWS access key ID used for authentication.
   */
  access_key_id?: string
  /**
   * The AWS secret access key used for authentication.
   */
  secret_access_key?: string
  /**
   * The AWS session token used for temporary credentials.
   */
  session_token?: string
  /**
   * The authentication method to use when connecting to S3.
   */
  authentication_method?: "access-key" | "s3-iam-role"
  /**
   * The AWS region where the S3 bucket is located.
   */
  region: string
  /**
   * The name of the S3 bucket to upload files to.
   */
  bucket: string
  /**
   * An optional prefix (folder path) to prepend to uploaded file keys.
   */
  prefix?: string
  /**
   * A custom endpoint URL, used for S3-compatible storage services.
   */
  endpoint?: string
  /**
   * The value of the `Cache-Control` header set on uploaded objects.
   */
  cache_control?: string
  /**
   * The duration in seconds for which a download URL remains valid.
   */
  download_file_duration?: number
  /**
   * Additional configuration options passed directly to the S3 client.
   */
  additional_client_config?: Record<string, any>
  /**
   * Controls the ACL set on uploaded objects.
   *
   * - `undefined` (default): Uses "public-read" for public files and "private" for private files.
   * - `false`: Omits the ACL header entirely. Required for S3 buckets with
   *   BucketOwnerEnforced Object Ownership or Block Public Access enabled.
   * - A specific `ObjectCannedACL` value: Uses that ACL for all uploads.
   *
   * @since 2.17.0
   */
  acl?: "public-read" | "private" | "authenticated-read" | "bucket-owner-full-control" | false
}
