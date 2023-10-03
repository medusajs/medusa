import * as Handlebars from 'handlebars';
import { Comment } from 'typedoc';

export default function () {
  Handlebars.registerHelper('returns', function (comment: Comment) {
    const md: string[] = [];

    if (comment.blockTags?.length) {
      const tags = comment.blockTags
        .filter((tag) => tag.tag === '@returns')
        .map((tag) => Handlebars.helpers.comment(tag.content));
      md.push(tags.join('\n\n'));
    }

    return md.join('');
  });
}
