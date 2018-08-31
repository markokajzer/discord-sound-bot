import LocaleService from '../../i18n/LocaleService';

export default class MessageChunker {
  private readonly MAX_MESSAGE_LENGTH = 2000;
  private readonly CODE_MARKER_LENGTH = '```'.length * 2;

  private readonly localeService: LocaleService;

  constructor(localeService: LocaleService) {
    this.localeService = localeService;
  }

  public chunkedMessages(toChunk: Array<string>, params: Array<string>): Array<string> {
    const chunks = this.chunkArray(toChunk);
    const indexInput = parseInt(params[0]);
    const realIndex = indexInput - 1;

    if (indexInput && realIndex >= 0 && realIndex < chunks.length) {
      return [
        this.localeService.t('helpers.messageChunker.page', { current: indexInput, amount: chunks.length }),
        ['```', ...chunks[realIndex], '```'].join('\n')
      ];
    }

    return chunks.map(chunk => ['```', ...chunk, '```'].join('\n'));
  }

  private chunkArray(input: Array<string>): Array<Array<string>> {
    const chunkedInput: Array<Array<string>> = [];

    let LOCALE_PAGE_MASSAGE_LENGTH = this.localeService.translate('helpers.messageChunker.page', { current: 999, amount: 999 }).length; // Generate Locale page message length

    let total = 0;
    let temp: Array<string> = [];
    for (const element of input) {
      if (total + element.length > this.MAX_MESSAGE_LENGTH - (this.CODE_MARKER_LENGTH + LOCALE_PAGE_MASSAGE_LENGTH)) {
        chunkedInput.push(temp);
        temp = [element];
        total = 0;
        continue;
      }
      
      total += element.length + 1;
      temp.push(element);
    }

    chunkedInput.push(temp);
    return chunkedInput;
  }
}
