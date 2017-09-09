const config = require('config');
const Discord = require('discord.js');
const Util = require('./Util.js');

class SoundBot extends Discord.Client {
  constructor() {
    super();

    this.queue = [];
    this._addEventListeners();
  }

  _addEventListeners() {
    this.on('ready', this._readyListener);
    this.on('message', this._messageListener);
  }

  _readyListener() {
    const avatar = Util.avatarExists() ? './config/avatar.png' : null;
    this.user.setAvatar(avatar);
  }

  _messageListener(message) {
    if (message.channel instanceof Discord.DMChannel) return; // Abort when DM
    if (!message.content.startsWith('!')) return; // Abort when not prefix
    this.handle(message);
  }

  start() {
    this.login(config.get('token'));
  }

  handle(message) {
    const [command, ...input] = message.content.split(' ');
    switch (command) {
      case '!commands':
        message.author.send(Util.getListOfCommands());
        break;
      case '!mostplayed':
        message.channel.send(Util.getMostPlayedSounds());
        break;
      case '!add':
        if (message.attachments) Util.addSounds(message.attachments, message.channel);
        break;
      case '!rename':
        Util.renameSound(input, message.channel);
        break;
      case '!remove':
        Util.removeSound(input, message.channel);
        break;
      case '!sounds':
        message.author.send(Util.getSounds().map(sound => sound));
        break;
      default:
        this.handleSoundCommands(message);
        break;
    }
  }

  handleSoundCommands(message) {
    const sounds = Util.getSounds();
    const voiceChannel = message.member.voiceChannel;

    if (voiceChannel === undefined) {
      message.reply('Join a voice channel first!');
      return;
    }

    switch (message.content) {
      case '!stop':
        voiceChannel.leave();
        this.queue = [];
        break;
      case '!random':
        const random = sounds[Math.floor(Math.random() * sounds.length)];
        this.addToQueue(voiceChannel.id, random, message);
        break;
      default:
        const sound = message.content.substring(1);
        if (sounds.includes(sound)) {
          this.addToQueue(voiceChannel.id, sound, message);
          if (!this._currentlyPlaying()) this.playSoundQueue();
        }
        break;
    }
  }

  addToQueue(voiceChannel, sound, message) {
    this.queue.push({ name: sound, channel: voiceChannel, message });
  }

  _currentlyPlaying() {
    return this.voiceConnections.array().length > 0;
  }

  playSoundQueue() {
    const nextSound = this.queue.shift();
    const file = Util.getPathForSound(nextSound.name);
    const voiceChannel = this.channels.get(nextSound.channel);

    voiceChannel.join().then((connection) => {
      const dispatcher = connection.playFile(file);
      dispatcher.on('end', () => {
        Util.updateCount(nextSound.name);
        if (config.get('deleteMessages') === true) nextSound.message.delete();

        if (this.queue.length === 0) {
          connection.disconnect();
          return;
        }

        this.playSoundQueue();
      });
    }).catch((error) => {
      console.log('Error occured!');
      console.log(error);
    });
  }
}

module.exports = SoundBot;
