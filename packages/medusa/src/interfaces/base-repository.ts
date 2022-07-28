import { Repository } from "typeorm"

export abstract class BaseRepository<TEntity> extends Repository<TEntity> {}
