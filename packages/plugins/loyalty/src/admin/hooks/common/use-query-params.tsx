import { useSearchParams } from "react-router-dom";

type QueryParams<T extends string> = {
  [key in T]: string | undefined;
};

export function useQueryParams<T extends string>(
  keys: T[],
  prefix?: string
): QueryParams<T> {
  const [params] = useSearchParams();

  // Use a type assertion to initialize the result
  const result = {} as QueryParams<T>;

  keys.forEach((key) => {
    const prefixedKey = prefix ? `${prefix}_${key}` : key;
    const value = params.get(prefixedKey) || undefined;

    result[key] = value;
  });

  return result;
}
