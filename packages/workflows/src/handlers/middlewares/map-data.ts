export function mapData<S>(fn: Function) {
  return function async<T = any>(data: T) {
    return fn(data) as S
  }
}
