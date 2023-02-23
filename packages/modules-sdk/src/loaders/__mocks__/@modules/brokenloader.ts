const loader = ({}) => {
  throw new Error("loader")
}

const services = [class TestService {}]
const migrations = []
const loaders = [loader]

export default {
  services,
  migrations,
  loaders,
}
