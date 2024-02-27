export type ProgressStatus = "not-started" | "in-progress" | "completed"

export type DateRange = {
  /**
   * The range's start date.
   */
  from: Date | undefined
  /**
   * The range's end date.
   */
  to?: Date | undefined
}
