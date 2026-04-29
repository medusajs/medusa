import {
  BigNumberValue,
  Context,
  DAL,
  FindConfig,
  InferEntityType,
  ModulesSdkTypes,
  SoftDeleteReturn,
} from "@medusajs/framework/types";
import {
  InjectManager,
  InjectTransactionManager,
  isDefined,
  MathBN,
  MedusaContext,
  MedusaError,
  MedusaService,
} from "@medusajs/framework/utils";
import { SqlEntityManager } from "@medusajs/framework/mikro-orm/postgresql";
import {
  IStoreCreditModuleService,
  ModuleAccountStats,
  ModuleAccountTransaction,
  ModuleCreditAccount,
  ModuleDebitAccount,
  ModuleRetrieveAccountStats,
  ModuleStoreCreditAccount,
  ModuleStoreCreditAccountFilters,
  ModuleUpdateStoreCreditAccount,
  TransactionType,
} from "../../types";
import AccountTransaction from "./models/account-transaction";
import StoreCreditAccount from "./models/store-credit-account";

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService;
  accountTransactionService: ModulesSdkTypes.IMedusaInternalService<any>;
};

class StoreCreditService
  extends MedusaService<{
    StoreCreditAccount: { dto: ModuleStoreCreditAccount };
    AccountTransaction: { dto: ModuleAccountTransaction };
  }>({ StoreCreditAccount, AccountTransaction })
  implements IStoreCreditModuleService
{
  protected baseRepository_: DAL.RepositoryService;
  protected readonly accountTransactionService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<ModuleAccountTransaction>
  >;

  constructor({
    baseRepository,
    accountTransactionService,
  }: InjectedDependencies) {
    super(...arguments);

    this.baseRepository_ = baseRepository;
    this.accountTransactionService_ = accountTransactionService;
  }

  @InjectManager()
  // @ts-expect-error
  async listStoreCreditAccounts(
    filters: ModuleStoreCreditAccountFilters,
    config: FindConfig<ModuleStoreCreditAccount> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const accounts = await super.listStoreCreditAccounts(
      filters,
      config,
      sharedContext
    );

    for (const account of accounts) {
      const stats = await this.retrieveAccountStats(
        {
          account_id: account.id,
        },
        sharedContext
      );

      account.balance = stats.balance;
      account.credits = stats.credits;
      account.debits = stats.debits;
    }

    return accounts;
  }

  /* Entity: StoreCreditAccount */

  @InjectTransactionManager()
  // @ts-expect-error
  async updateStoreCreditAccounts(
    data: ModuleUpdateStoreCreditAccount | ModuleUpdateStoreCreditAccount[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    /*
      We should only allow updating the whitelisted fields for store credit accounts.
      Changing the customer or currency code will lead to unexpected results where balances are not tracked correctly.
    */
    const whitelistedFields = ["id", "metadata"];
    const normalizedData = Array.isArray(data) ? data : [data];

    normalizedData.forEach((account) => {
      Object.keys(account).forEach((key) => {
        if (whitelistedFields.includes(key)) {
          throw new Error(`Field ${key} is not allowed to be updated`);
        }
      });
    });

    return await super.updateStoreCreditAccounts(normalizedData, sharedContext);
  }

  @InjectTransactionManager()
  // @ts-expect-error
  async deleteStoreCreditAccounts(
    ids: string | string[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    /*
      TODO: Before deleting the accounts, we should check if the accounts have any transactions.
      If they do, we should throw an error.

      We should only allow deleting accounts that have no transactions.

      We should not allow deleting accounts that have any transactions.
      We should instead "close" an account only after balance is zero.
    */

    return await super.deleteStoreCreditAccounts(ids, sharedContext);
  }

  @InjectTransactionManager()
  // @ts-expect-error
  async softDeleteStoreCreditAccounts<
    TReturnableLinkableKeys extends string = string
  >(
    ids: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    /*
      TODO: Before soft deleting the accounts, we should check if the accounts have any transactions.
      If they do, we should throw an error.

      We should only allow soft deleting accounts that have no transactions.

      We should not allow soft deleting accounts that have any transactions.
      We should instead "close" an account only after balance is zero.
    */

    return await super.softDeleteStoreCreditAccounts(
      ids,
      config,
      sharedContext
    );
  }

  /* Entity: AccountTransaction */

  @InjectManager()
  async retrieveAccountStats(
    data: ModuleRetrieveAccountStats,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ModuleAccountStats> {
    const manager =
      (sharedContext.transactionManager as SqlEntityManager) ??
      (sharedContext.manager as SqlEntityManager);
    const knex = manager.getTransactionContext() ?? manager.getKnex();
    const { account_id } = data;

    const account = await super.retrieveStoreCreditAccount(
      account_id,
      {},
      sharedContext
    );

    // TODO: For higher accuracy and precision, we should run the transaction amounts through big number
    // in memory and then use that value for the balance.
    // We need to figure out clever ways to do this without running too many calculations in memory
    const accountBalanceQuery = knex("store_credit_account as account")
      .select({
        id: "account.id",
        credits: knex.raw(
          `SUM(CASE WHEN at.type = 'credit' THEN at.amount ELSE 0 END)`
        ),
        debits: knex.raw(
          `SUM(CASE WHEN at.type = 'debit' THEN at.amount ELSE 0 END)`
        ),
        balance: knex.raw(
          `SUM(CASE WHEN at.type = 'credit' THEN at.amount::numeric ELSE -at.amount::numeric END)`
        ),
      })
      .leftJoin(
        "store_credit_account_transaction as at",
        "at.account_id",
        "account.id"
      )
      .where("account.id", account.id)
      .groupBy("account.id");

    const accountBalances: {
      id: string;
      balance: string;
      debits: string;
      credits: string;
    }[] = await accountBalanceQuery;

    const accountBalance = accountBalances[0];
    const response = {
      id: account.id,
      balance: MathBN.convert(accountBalance.balance).toNumber(),
      debits: MathBN.convert(accountBalance.debits).toNumber(),
      credits: MathBN.convert(accountBalance.credits).toNumber(),
    };

    return await this.baseRepository_.serialize(response);
  }

  @InjectTransactionManager()
  async creditAccounts_(
    creditAccountsData: ModuleCreditAccount[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const transactions: ModuleAccountTransaction[] = [];

    for (const data of creditAccountsData) {
      const { account_id, amount, reference, reference_id, note } = data;

      if (!account_id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Account ID is required"
        );
      }

      if (!isDefined(amount)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Amount is required"
        );
      }

      const storeCreditAccount = await super.retrieveStoreCreditAccount(
        account_id,
        {},
        sharedContext
      );

      const createdTransactions = await this.accountTransactionService_.create(
        [
          {
            account_id: storeCreditAccount.id,
            amount,
            type: TransactionType.CREDIT,
            reference,
            reference_id,
            note,
          },
        ],
        sharedContext
      );

      transactions.push(...createdTransactions);
    }

    return transactions;
  }

  @InjectManager()
  async creditAccounts(
    data: ModuleCreditAccount[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const transactions = await this.creditAccounts_(data, sharedContext);

    return await this.baseRepository_.serialize<ModuleAccountTransaction[]>(
      transactions
    );
  }

  @InjectManager()
  async debitAccounts(
    debitAccountsData: ModuleDebitAccount[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const transactions = await this.debitAccounts_(
      debitAccountsData,
      sharedContext
    );

    return await this.baseRepository_.serialize<ModuleAccountTransaction[]>(
      transactions
    );
  }

  @InjectTransactionManager()
  async debitAccounts_(
    debitAccountsData: ModuleDebitAccount[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const manager = sharedContext.transactionManager as SqlEntityManager;
    const transactions: ModuleAccountTransaction[] = [];

    for (const data of debitAccountsData) {
      const { account_id, amount, reference, reference_id, note } = data;

      const amountBN = MathBN.convert(amount);

      if (!account_id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Account ID is required"
        );
      }

      if (!isDefined(amount)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Amount is required"
        );
      }

      if (amountBN.lte(0)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Amount must be greater than 0"
        );
      }

      const accountStats = await this.retrieveAccountStats(
        { account_id },
        sharedContext
      );

      if (MathBN.convert(accountStats.balance).lt(amountBN)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Insufficient balance"
        );
      }

      const createdTransaction = await this.accountTransactionService_.create(
        {
          account_id: accountStats.id,
          amount: amountBN,
          type: TransactionType.DEBIT,
          reference,
          reference_id,
          note,
        },
        sharedContext
      );

      transactions.push(createdTransaction);

      await manager.flush();
    }

    return transactions;
  }
}

export default StoreCreditService;
