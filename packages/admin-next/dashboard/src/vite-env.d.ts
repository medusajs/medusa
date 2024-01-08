/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MEDUSA_ADMIN_BACKEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
