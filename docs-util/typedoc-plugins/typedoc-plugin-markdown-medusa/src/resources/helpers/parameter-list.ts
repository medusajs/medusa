import * as Handlebars from 'handlebars';
import { Comment, DeclarationReference, DeclarationReflection, ParameterReflection, ReflectionKind, ReflectionType } from 'typedoc';
import { stripLineBreaks } from '../../utils';
import { getReflectionType } from './type';
import reflectionFomatter from '../../utils/reflection-formatter';

export default function () {
  Handlebars.registerHelper(
    'parameterList',

    function (this: ParameterReflection[]) {
      const flattenParams = (current: any) => {
        return current.type?.declaration?.children?.reduce(
          (acc: any, child: any) => {
            const childObj = {
              ...child,
              name: `${current.name}.${child.name}`,
            };
            return parseParams(childObj, acc);
          },
          [],
        );
      };

      const parseParams = (current: any, acc: any) => {
        const shouldFlatten =
          current.type?.declaration?.kind === ReflectionKind.TypeLiteral &&
          current.type?.declaration?.children;
        return shouldFlatten
          ? [...acc, current, ...flattenParams(current)]
          : [...acc, current];
      };

      return list(
        this.reduce((acc: any, current: any) => parseParams(current, acc), []),
      );
    },
  );
}

function list(parameters: ParameterReflection[]) {
  const items = parameters.map((parameter) => {
    return reflectionFomatter(parameter)
  });

  return items.join("\n")
}