import { ApiKeyType } from "../../../api-key"
import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminGetApiKeysParams
  extends FindParams,
    BaseFilterable<AdminGetApiKeysParams> {
  /**
   * Query or keywords to search the API key's searchable fields.
   */
  q?: string
  /**
   * Filter by API key ID(s).
   */
  id?: string | string[]
  /**
   * Filter by title(s).
   */
  title?: string | string[]
  /**
   * Filter by token(s).
   */
  token?: string | string[]
  /**
   * Filter by type.
   */
  type?: ApiKeyType
  /**
   * Apply filters on the API key's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the API key's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the API key's deletion date.
   */
  deleted_at?: OperatorMap<string>
  /**
   * Apply filters on the API key's revocation date.
   */
  revoked_at?: OperatorMap<string>
}
