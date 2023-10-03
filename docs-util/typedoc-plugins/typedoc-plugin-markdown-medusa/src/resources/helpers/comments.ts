import * as Handlebars from 'handlebars';
import { Comment } from 'typedoc';
import { camelToTitleCase } from '../../utils';

export default function () {
  Handlebars.registerHelper(
    'comments',
    function (comment: Comment, showSummary = true, showTags = true) {
      const md: string[] = [];

      if (showSummary && comment.summary) {
        md.push(Handlebars.helpers.comment(comment.summary));
      }

      const filteredTags = comment.blockTags.filter(
        (tag) => tag.tag !== '@returns',
      );

      if (showTags && comment.blockTags?.length) {
        const tags = filteredTags.map(
          (tag) =>
            `**\`${camelToTitleCase(
              tag.tag.substring(1),
            )}\`**\n\n${Handlebars.helpers.comment(tag.content)}`,
        );
        md.push(tags.join('\n\n'));
      }

      return md.join('\n\n');
    },
  );
}
