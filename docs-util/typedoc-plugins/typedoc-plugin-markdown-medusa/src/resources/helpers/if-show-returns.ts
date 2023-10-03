import * as Handlebars from 'handlebars';
import { ReflectionKind, SignatureReflection } from 'typedoc';

export default function () {
  Handlebars.registerHelper(
    'ifShowReturns',
    function (this: SignatureReflection, options: Handlebars.HelperOptions) {
      return this.type && !this.parent?.kindOf(ReflectionKind.Constructor)
        ? options.fn(this)
        : options.inverse(this);
    },
  );
}
