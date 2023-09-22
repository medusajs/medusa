/********************************************************************************/
/*                         Model Base DTO's                                     */
/********************************************************************************/

export interface ProductBaseDTO<
  TExtendedVariantBaseDTO extends ProductVariantBaseDTO | undefined = undefined
> {
  [key: string]: any
  id: string
  variants?: (TExtendedVariantBaseDTO extends undefined
    ? ProductVariantBaseDTO
    : TExtendedVariantBaseDTO)[]
}

export interface ProductVariantBaseDTO {
  id: string
  [key: string]: any
}

/********************************************************************************/
/*                     End of Model Base DTO's                                  */
/********************************************************************************/
