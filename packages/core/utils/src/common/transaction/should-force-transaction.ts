export function shouldForceTransaction(target: any): boolean {
  return target.moduleDeclaration?.resources === "isolated"
}
