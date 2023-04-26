export interface IBaseExtension {
  /**
   * The name of the extension, used to identify it in the admin panel and improve debugging.
   */
  name: string
  /**
   * The component to render in the admin panel.
   */
  Component: React.ComponentType<any>
}

export interface IBaseLoadedExtension extends IBaseExtension {
  origin: string
}
