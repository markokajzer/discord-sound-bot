import '../discord/Message';

import { Message } from 'discord.js';

import userHasElevatedRole from '~/commands/util/userHasElevatedRole';
import { config } from '~/util/Container';
import * as ignoreList from '~/util/db/IgnoreList';
import localize from '~/util/i18n/localize';

import CommandCollection from './CommandCollection';

export default class MessageHandler {
  private readonly commands: CommandCollection;

  constructor(commands: CommandCollection) {
    this.commands = commands;
  }

  public handle(message: Message, deleteMessages?: boolean) {
    if (!this.isValidMessage(message)) return;

    const messageToHandle = message;
    messageToHandle.content = message.content.substring(config.prefix.length);

    this.execute(messageToHandle, deleteMessages);
  }

  private isValidMessage(message: Message) {
    return (
      !message.author.bot &&
      !message.isDirectMessage() &&
      message.hasPrefix(config.prefix) &&
      !ignoreList.exists(message.author.id)
    );
  }

  private execute(message: Message, deleteMessages?: boolean) {
    const [command, ...params] = message.content.split(' ');
    const commandToRun = this.commands.get(command);

    if (commandToRun.elevated && !userHasElevatedRole(message.member)) {
      message.channel.send(localize.t('errors.unauthorized'));
      return;
    }

    commandToRun.run(message, params);

    if (deleteMessages && !message.deleted && !this.wasMessageAlreadyDeleted(message)) {
      message.delete();
    }
  }

  private wasMessageAlreadyDeleted(message: Message) {
    if (!message) return false;

    return message.channel.messages.cache.find(msg => msg.id === message.id) === null;
  }
}
