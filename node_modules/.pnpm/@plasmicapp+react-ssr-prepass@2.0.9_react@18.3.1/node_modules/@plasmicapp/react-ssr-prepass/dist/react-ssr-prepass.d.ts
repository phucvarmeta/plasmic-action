declare module '@plasmicapp/react-ssr-prepass' {
  type Visitor = (
    element: React.ElementType<any>,
    instance?: React.Component<any, any>
  ) => void | Promise<any>

  export type ClientReferenceVisitor = (
    element: React.ReactElement
  ) => void | React.ReactNode

  function ssrPrepass(
    node: React.ReactNode,
    visitor?: Visitor,
    clientRefVisitor?: ClientReferenceVisitor
  ): Promise<void>

  export = ssrPrepass
}
