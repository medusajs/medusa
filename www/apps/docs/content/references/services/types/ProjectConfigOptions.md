# ProjectConfigOptions

 **ProjectConfigOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `admin_cors?` | `string` |
| `cookie_secret?` | `string` |
| `database_database?` | `string` |
| `database_extra?` | Record<`string`, `unknown`\> & { `ssl`: { `rejectUnauthorized`: ``false``  }  } |
| `database_logging` | [`LoggerOptions`](LoggerOptions.md) |
| `database_schema?` | `string` |
| `database_type?` | `string` |
| `database_url?` | `string` |
| `http_compression?` | [`HttpCompressionOptions`](HttpCompressionOptions.md) |
| `jwt_secret?` | `string` |
| `redis_options?` | [`RedisOptions`](RedisOptions.md) |
| `redis_prefix?` | `string` |
| `redis_url?` | `string` |
| `session_options?` | [`SessionOptions`](SessionOptions.md) |
| `store_cors?` | `string` |

#### Defined in

packages/types/dist/common/config-module.d.ts:18
