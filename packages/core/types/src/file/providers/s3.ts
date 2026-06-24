export interface S3FileServiceOptions {
  file_url: string
  access_key_id?: string
  secret_access_key?: string
  session_token?: string
  authentication_method?: "access-key" | "s3-iam-role"
  region: string
  bucket: string
  prefix?: string
  endpoint?: string
  cache_control?: string
  download_file_duration?: number
  additional_client_config?: Record<string, any>
  /**
   * Controls the ACL set on uploaded objects.
   *
   * - `undefined` (default): Uses "public-read" for public files and "private" for private files.
   * - `false`: Omits the ACL header entirely. Required for S3 buckets with
   *   BucketOwnerEnforced Object Ownership or Block Public Access enabled.
   * - A specific `ObjectCannedACL` value: Uses that ACL for all uploads.
   */
  acl?: "public-read" | "private" | "authenticated-read" | "bucket-owner-full-control" | false
}
