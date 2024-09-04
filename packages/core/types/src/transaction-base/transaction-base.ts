export interface ITransactionBaseService {
  withTransaction<TManager = unknown>(transactionManager?: TManager): this
}
