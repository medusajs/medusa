export interface AddJobOptions {
  attempts: number
  repeat: {
    tz?: string
    endDate?: Date | string | number
  }
  preventParsingData: boolean
}
