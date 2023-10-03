import { MarkdownTheme } from '../../theme';
import * as Handlebars from 'handlebars';

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper('memberTitleLevel', function (originalLevel = 3): string {
    const { expandMembers } = theme

    const level = expandMembers ? originalLevel - 1 : originalLevel

    return Array(level).fill("#").join("")
  })
}