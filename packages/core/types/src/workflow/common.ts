export interface WorkflowInputConfig {
  listConfig?: {
    select?: string[]
    relations?: string[]
  }
  retrieveConfig?: {
    select?: string[]
    relations?: string[]
  }
}
