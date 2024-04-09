/**
 * The shipping profile to be created.
 */
export interface CreateShippingProfileDTO {
  /**
   * The name of the shipping profile.
   */
  name: string

  /**
   * The type of the shipping profile.
   */
  type?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * The attributes to update in the shipping profile.
 */
export interface UpdateShippingProfileDTO
  extends Partial<CreateShippingProfileDTO> {}
