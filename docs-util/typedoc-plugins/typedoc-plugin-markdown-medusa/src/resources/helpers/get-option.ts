import { MarkdownTheme } from '../../theme';
import * as Handlebars from 'handlebars';

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper('getOption', function (optionName: string): any {
    return theme.getOption(optionName)
  })
}