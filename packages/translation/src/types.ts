export interface TranslationDTO {
  id: string
  local: string
  attributes: Record<string, string>
  created_at: Date
  updated_at: Date
}

export interface CreateTranslationDTO {
  local: string
  attributes: Record<string, string>
}

export interface UpdateTranslationDTO {
  id: string
  local?: string
  attributes?: Record<string, string>
}
