import { Connection, EntityManager } from "typeorm"
import {
  DbTransactionService,
  TransactionBaseService,
  User,
} from "@medusajs/medusa"
import { TransactionContext } from "@medusajs/medusa/dist/types/transaction"

export const fakeUserData1 = {
  id: "test",
  email: "test@email.com",
  first_name: "firstname",
  last_name: "lastname",
  password_hash: "password_hash",
}

export const fakeUserData2 = {
  id: "test2",
  email: "test2@email.com",
  first_name: "firstname",
  last_name: "lastname",
  password_hash: "password_hash",
}

export async function retrieveUsers(connection: Connection): Promise<User[]> {
  return await connection.manager
    .createQueryBuilder()
    .select()
    .from(User, "user")
    .orderBy("created_at", "ASC")
    .execute()
}

export class Service1 extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly dbTransactionService_: DbTransactionService

  constructor({ dbTransactionService }) {
    super({ dbTransactionService })

    this.dbTransactionService_ = dbTransactionService
  }

  /**
   * Run inside a run block and call an atomic phase method
   * @param context
   */
  async createUserInRunBlockCallingAnAtomicPhaseMethod(
    context: TransactionContext = {}
  ) {
    const transactionManager =
      context.transactionManager ?? this.transactionManager_
    return await this.dbTransactionService_.run(
      async ({ transactionManager }) => {
        return await this.createUserInAtomicPhase({
          transactionManager,
        })
      },
      {
        transactionManager,
      }
    )
  }

  /**
   * Run inside a run block and call an atomic phase method. The run block fails and the atomic phase method should have been commited
   * @param context
   */
  async createUserInRunBlockCallingAnAtomicPhaseMethodAndFail(
    context: TransactionContext
  ) {
    const transactionManager =
      context.transactionManager ?? this.transactionManager_
    return await this.dbTransactionService_.run(
      async ({ transactionManager }) => {
        await this.createUserInAtomicPhase({
          transactionManager,
        })

        throw new Error("Error")
      },
      {
        transactionManager,
      }
    )
  }

  /**
   * Run the block in an atomic phase
   * @param context
   */
  private async createUserInAtomicPhase(context: TransactionContext) {
    return await this.atomicPhase_(async (transactionManager) => {
      return await transactionManager
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(fakeUserData1)
        .execute()
    })
  }
}
