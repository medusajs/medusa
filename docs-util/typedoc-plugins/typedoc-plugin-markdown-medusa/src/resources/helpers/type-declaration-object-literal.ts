import * as Handlebars from 'handlebars';
import { DeclarationReflection, ReflectionType } from 'typedoc';
import { MarkdownTheme } from '../../theme';
import { escapeChars, stripLineBreaks } from '../../utils';

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    'typeDeclarationMembers',
    function (this: DeclarationReflection[]) {
      const comments = this.map(
        (param) => !!param.comment?.hasVisibleComponent(),
      );
      const hasComments = !comments.every((value) => !value);

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
        const shouldFlatten = current.type?.declaration?.children;

        return shouldFlatten
          ? [...acc, current, ...flattenParams(current)]
          : [...acc, current];
      };

      const properties = this.reduce(
        (acc: any, current: any) => parseParams(current, acc),
        [],
      );

      let result = '';
      switch (theme.objectLiteralTypeDeclarationStyle) {
        case 'list': {
          result = getListMarkdownContent(properties);
          break;
        }
        case 'table': {
          result = getTableMarkdownContent(properties, hasComments);
          break;
        }
      }
      return result;
    },
  );
}

function getListMarkdownContent(properties: DeclarationReflection[]) {
  const propertyTable = getTableMarkdownContentWithoutComment(properties);
  const propertyDescriptions = properties.map((property) => {
    const name =
      property.name.match(/[\\`\\|]/g) !== null
        ? escapeChars(getName(property))
        : `${getName(property)}`;

    const propertyType = getPropertyType(property);
    const propertyTypeStr = Handlebars.helpers.type.call(propertyType);

    const comments = getComments(property);
    const commentsStr = comments
      ? Handlebars.helpers.comments(comments)
      : '\\-';

    const md = `**${name}**: ${propertyTypeStr}

${commentsStr}

-----


`;

    return md;
  });

  const propertyComments = propertyDescriptions.join('\n\n');

  const result = `
${propertyTable}

${propertyComments}

`;

  return result;
}

function getTableMarkdownContent(
  properties: DeclarationReflection[],
  hasComments: boolean,
) {
  const headers = ['Name', 'Type'];

  if (hasComments) {
    headers.push('Description');
  }
  const rows = properties.map((property) => {
    const propertyType = getPropertyType(property);
    const row: string[] = [];
    const nameCol: string[] = [];
    const name =
      property.name.match(/[\\`\\|]/g) !== null
        ? escapeChars(getName(property))
        : `\`${getName(property)}\``;
    nameCol.push(name);
    row.push(nameCol.join(' '));
    row.push(
      Handlebars.helpers.type.call(propertyType).replace(/(?<!\\)\|/g, '\\|'),
    );

    if (hasComments) {
      const comments = getComments(property);
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

function getTableMarkdownContentWithoutComment(
  properties: DeclarationReflection[],
) {
  const result = getTableMarkdownContent(properties, false);
  return result;
}

function getPropertyType(property: any) {
  if (property.getSignature) {
    return property.getSignature.type;
  }
  if (property.setSignature) {
    return property.setSignature.type;
  }
  return property.type ? property.type : property;
}

function getName(property: DeclarationReflection) {
  const md: string[] = [];
  if (property.flags.isRest) {
    md.push('...');
  }
  if (property.getSignature) {
    md.push(`get ${property.getSignature.name}()`);
  } else if (property.setSignature) {
    md.push(
      `set ${
        property.setSignature.name
      }(${property.setSignature.parameters?.map((parameter) => {
        return `${parameter.name}:${Handlebars.helpers.type.call(
          parameter.type,
          'all',
          false,
        )}`;
      })})`,
    );
  } else {
    md.push(property.name);
  }
  if (property.flags.isOptional) {
    md.push('?');
  }
  return md.join('');
}

function getComments(property: DeclarationReflection) {
  if (property.type instanceof ReflectionType) {
    if (property.type?.declaration?.signatures) {
      return property.type?.declaration.signatures[0].comment;
    }
  }
  if (property.signatures?.length) {
    return property.signatures[0].comment;
  }
  return property.comment;
}
