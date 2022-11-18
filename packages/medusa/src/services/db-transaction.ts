import { Connection, EntityManager, QueryRunner } from "typeorm"
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel"
import formatRegistrationName from "../utils/format-registration-name"
import { resolve } from "path"

type Handler<TOutput = unknown> = ({
  transactionManager,
}: {
  transactionManager: EntityManager
}) => Promise<TOutput>

export default class DbTransactionService {
  static RESOLUTION_KEY = formatRegistrationName(resolve(__dirname, this.name))

  protected connection_: Connection

  constructor({ manager }: { manager: EntityManager }) {
    this.connection_ = manager.connection
  }

  async run<TOutput>(
    handler: Handler<TOutput>,
    {
      isolationLevel,
      transactionManager,
      errorHandler,
    }: {
      isolationLevel?: IsolationLevel
      transactionManager?: EntityManager
      errorHandler?: (err: unknown) => Promise<void>
    } = {}
  ): Promise<TOutput> {
    let queryRunner: QueryRunner

    if (!transactionManager) {
      queryRunner = await this.connection_.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction(isolationLevel)
    } else {
      queryRunner = transactionManager.queryRunner!
    }

    // No transactionManager means no parent and therefore no execution in a sub method relying on the parent transaction, at that point we are at  the higher level of transaction
    // and we can commit/rollback everything under that level
    try {
      const result = await handler({
        transactionManager: queryRunner.manager,
      })

      if (!transactionManager) {
        await queryRunner.commitTransaction()
        await queryRunner.release()
      }

      return result
    } catch (error) {
      if (!transactionManager) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
      }

      if (errorHandler) {
        await errorHandler(error)
      }
      throw error
    }
  }
}
