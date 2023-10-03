import * as Handlebars from 'handlebars';
import {
  DeclarationReflection,
  LiteralType,
  ParameterReflection,
  ReflectionKind,
  ReflectionType,
} from 'typedoc';
import { MarkdownTheme } from '../../theme';
import {
  escapeChars,
  memberSymbol,
  stripComments,
  stripLineBreaks,
} from '../../utils';

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    'declarationTitle',
    function (this: ParameterReflection | DeclarationReflection) {
      const md = theme.hideMembersSymbol ? [] : [memberSymbol(this)];

      function getType(
        reflection: ParameterReflection | DeclarationReflection,
      ) {
        const reflectionType = reflection.type as ReflectionType;
        if (reflectionType && reflectionType.declaration?.children) {
          return ': `Object`';
        }
        return (
          (reflection.parent?.kindOf(ReflectionKind.Enum) ? ' = ' : ': ') +
          Handlebars.helpers.type.call(
            reflectionType ? reflectionType : reflection,
            'object',
          )
        );
      }

      if (this.flags && this.flags.length > 0 && !this.flags.isRest) {
        md.push(' ' + this.flags.map((flag) => `\`${flag}\``).join(' '));
      }
      md.push(
        `${this.flags.isRest ? '... ' : ''} **${escapeChars(this.name)}**`,
      );
      if (this instanceof DeclarationReflection && this.typeParameters) {
        md.push(
          `<${this.typeParameters
            .map((typeParameter) => `\`${typeParameter.name}\``)
            .join(', ')}\\>`,
        );
      }

      md.push(getType(this));

      if (
        !(this.type instanceof LiteralType) &&
        this.defaultValue &&
        this.defaultValue !== '...'
      ) {
        md.push(` = \`${stripLineBreaks(stripComments(this.defaultValue))}\``);
      }
      return md.join('');
    },
  );
}
