/**
 * We precompile the handlebar templates during the build process,
 * however in the source code we want to reference these templates
 * by importing the hbs files directly. Of course this is not allowed
 * by Typescript, so we need to provide some declaration for these
 * types.
 * @see: build.js for more information
 */
declare module "*.hbs" {
  const template: {
    compiler: [number, string]
    useData: true
    main: () => void
  }
  export default template
}
