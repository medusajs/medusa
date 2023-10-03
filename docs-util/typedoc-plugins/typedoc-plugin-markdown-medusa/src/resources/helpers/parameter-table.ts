import * as Handlebars from 'handlebars';
import { ParameterReflection, ReflectionKind, ReflectionType } from 'typedoc';
import { stripLineBreaks } from '../../utils';
import { getReflectionType } from './type';

export default function () {
  Handlebars.registerHelper(
    'parameterTable',

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

      return table(
        this.reduce((acc: any, current: any) => parseParams(current, acc), []),
      );
    },
  );
}

function table(parameters: any) {
  const showDefaults = hasDefaultValues(parameters);

  const comments = parameters.map(
    (param: any) => !!param.comment?.hasVisibleComponent(),
  );
  const hasComments = !comments.every((value: any) => !value);

  const headers = ['Name', 'Type'];

  if (showDefaults) {
    headers.push('Default value');
  }

  if (hasComments) {
    headers.push('Description');
  }

  const rows = parameters.map((parameter: any) => {
    const row: string[] = [];

    const nbsp = ' '; // ? <== Unicode no-break space character
    const rest = parameter.flags.isRest ? '...' : '';
    const optional = parameter.flags.isOptional ? '?' : '';

    const isDestructuredParam = parameter.name == '__namedParameters';
    const isDestructuredParamProp =
      parameter.name.startsWith('__namedParameters.');

    if (isDestructuredParam) {
      row.push(`\`${rest}«destructured»\``);
    } else if (isDestructuredParamProp) {
      row.push(`›${nbsp}\`${rest}${parameter.name.slice(18)}${optional}\``);
    } else {
      row.push(`\`${rest}${parameter.name}${optional}\``);
    }

    row.push(
      parameter.type
        ? Handlebars.helpers.type.call(parameter.type, 'object')
        : getReflectionType(parameter, 'object'),
    );

    if (showDefaults) {
      row.push(getDefaultValue(parameter));
    }
    if (hasComments) {
      const comments = getComments(parameter);
      if (comments) {
        row.push(
          stripLineBreaks(Handlebars.helpers.comments(comments)).replace(
            /\|/g,
            '\\|',
          ),
        );
      } else {
        row.push('-');
      }
    }
    return `| ${row.join(' | ')} |\n`;
  });

  const output = `\n| ${headers.join(' | ')} |\n| ${headers
    .map(() => ':------')
    .join(' | ')} |\n${rows.join('')}`;
  return output;
}

function getDefaultValue(parameter: ParameterReflection) {
  return parameter.defaultValue && parameter.defaultValue !== '...'
    ? `\`${parameter.defaultValue}\``
    : '`undefined`';
}

function hasDefaultValues(parameters: ParameterReflection[]) {
  const defaultValues = (parameters as ParameterReflection[]).map(
    (param) =>
      param.defaultValue !== '{}' &&
      param.defaultValue !== '...' &&
      !!param.defaultValue,
  );

  return !defaultValues.every((value) => !value);
}

function getComments(parameter: any) {
  if (parameter.type instanceof ReflectionType) {
    if (
      parameter.type?.declaration?.signatures &&
      parameter.type?.declaration?.signatures[0]?.comment
    ) {
      return parameter.type?.declaration?.signatures[0]?.comment;
    }
  }
  return parameter.comment;
}
