import { MarkdownTheme } from '../../theme';
import * as Handlebars from 'handlebars';

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper('getFormattingOption', function (optionName: string): any {
    const options = theme.getFormattingOptionsForLocation()

    return optionName in options ? options[optionName as keyof typeof options] : null
  })
}