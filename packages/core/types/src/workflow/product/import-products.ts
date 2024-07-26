export interface ImportProductsDTO {
  fileContent: string
  filename: string
}

export interface ImportProductsSummary {
  toCreate: number
  toUpdate: number
}
