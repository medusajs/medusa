import { Connection, EntityManager, QueryRunner } from "typeorm"
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel"
import formatRegistrationName from "../utils/format-registration-name"
import resolveCwd from "resolve-cwd"
import { resolve } from "path"

type Handler<TOutput = unknown> = ({
  transactionManager: EntityManager,
}) => Promise<TOutput>

export default class DbTransactionService {
  static RESOLUTION_KEY = formatRegistrationName(
    resolveCwd(resolve(__dirname, this.name))
  )

  protected connection_: Connection

  protected constructor({ manager }: { manager: EntityManager }) {
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

    // No transactionManager means that we are at the higher level of transaction and we can commit/rollback everything under that level
    return await handler({
      transactionManager: queryRunner.manager,
    })
      .then(async (result) => {
        if (!transactionManager) {
          await queryRunner.commitTransaction()
        }
        return result
      })
      .catch(async (error) => {
        if (!transactionManager) {
          await queryRunner.rollbackTransaction()
        }

        if (errorHandler) {
          await errorHandler(error)
        }
        throw error
      })
      .finally(async () => {
        if (!transactionManager) {
          await queryRunner.release()
        }
      })
  }
}
