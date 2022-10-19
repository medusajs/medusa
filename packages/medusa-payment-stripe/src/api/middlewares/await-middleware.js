export default (fn) =>
  (...args) =>
    fn(...args).catch(args[2])
