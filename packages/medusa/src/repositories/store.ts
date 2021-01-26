import { EntityRepository, Repository } from "typeorm"
import { Store } from "../models/store"

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {}
