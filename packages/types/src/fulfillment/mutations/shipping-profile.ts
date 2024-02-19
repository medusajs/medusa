export interface CreateShippingProfileDTO {
  name: string
  type?: string
  metadata?: Record<string, unknown>
}

export interface UpdateShippingProfileDTO
  extends Partial<CreateShippingProfileDTO> {}
