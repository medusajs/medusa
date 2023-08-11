const loader = ({}) => {
  throw new Error("loader")
}

const service = class TestService {}
const migrations = []
const loaders = [loader]

export default {
  service,
  migrations,
  loaders,
}
