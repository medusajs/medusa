export interface S3FileServiceOptions {
  file_url: string
  access_key_id: string
  secret_access_key: string
  region: string
  bucket: string
  prefix?: string
  endpoint?: string
  cache_control?: string
  download_file_duration?: number
  additional_client_config?: Record<string, any>
}
