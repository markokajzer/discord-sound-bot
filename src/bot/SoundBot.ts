import Discord from 'discord.js';

import Config from '@config/Config';
import LocaleService from '@util/i18n/LocaleService';
import CommandCollection from './CommandCollection';
import MessageHandler from './MessageHandler';

export default class SoundBot extends Discord.Client {
  private readonly config: Config;
  private readonly localeService: LocaleService;
  private readonly commands: CommandCollection;
  private readonly messageHandler: MessageHandler;

  constructor(config: Config, localeService: LocaleService,
              commands: CommandCollection, messageHandler: MessageHandler) {
    super();
    this.config = config;
    this.localeService = localeService;
    this.commands = commands;
    this.messageHandler = messageHandler;
    this.addEventListeners();
  }

  public start() {
    this.login(this.config.token);
  }

  private addEventListeners() {
    this.on('ready', this.readyListener);
    this.on('message', this.messageListener);
    this.on('guildCreate', this.joinServerListener);
  }

  private readyListener() {
    this.setActivity();
    this.broadcastClientUser(this.user);
  }

  private setActivity() {
    this.user.setActivity(this.config.game);
  }

  private broadcastClientUser(user: Discord.ClientUser) {
    this.commands.registerUserCommands(user);
  }

  private messageListener(message: Discord.Message) {
    this.messageHandler.handle(message);
  }

  private joinServerListener(guild: Discord.Guild) {
    if (!guild.available) return;

    const channel = this.findFirstWritableChannel(guild);
    if (!channel) return;

    channel.send(this.localeService.t('welcome', { prefix: this.config.prefix }));
  }

  private findFirstWritableChannel(guild: Discord.Guild): Discord.TextChannel | null {
    const channels = guild.channels.filter(channel =>
      channel.type === 'text' && channel.permissionsFor(guild.me)!.has('SEND_MESSAGES'));

    if (!channels.size) return null;
    return (channels.first() as Discord.TextChannel);
  }
}
