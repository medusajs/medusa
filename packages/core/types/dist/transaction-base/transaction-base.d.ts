import { EntityManager } from "typeorm";
export interface ITransactionBaseService {
    withTransaction(transactionManager?: EntityManager): this;
}
//# sourceMappingURL=transaction-base.d.ts.map