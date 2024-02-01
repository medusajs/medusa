type ConnectionStringOptions = {
  user?: string
  password?: string
  host?: string
  db: string
}

export function encodeDbValue(value: string): string {
  return encodeURIComponent(value)
}

export default ({ user, password, host, db }: ConnectionStringOptions) => {
  let connection = `postgres://`
  if (user) {
    connection += encodeDbValue(user)
  }

  if (password) {
    connection += `:${encodeDbValue(password)}`
  }

  if (user || password) {
    connection += "@"
  }

  connection += `${host}/${db}`

  return connection
}
