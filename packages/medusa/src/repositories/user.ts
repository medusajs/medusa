import { EntityRepository, Repository } from "typeorm"
import { User } from "../models/user"

@EntityRepository(User)
export class UserRepository<TEntity extends User = User> extends Repository<TEntity> {}
