const loader = ({}) => {
  throw new Error("loader")
}

export const service = class TestService {}
export const migrations = []
export const loaders = [loader]
