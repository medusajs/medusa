export interface TranslationDTO {
  id: string
  lang: string
  attributes: Record<string, string>
  created_at: Date
  updated_at: Date
}

export interface CreateTranslationDTO {
  lang: string
  attributes: Record<string, string>
}

export interface UpdateTranslationDTO {
  id: string
  lang?: string
  attributes?: Record<string, string>
}
