import config from '../config/config.json';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ counts: [], ignoreList: [] }).write();

import SoundQueue from './queue/SoundQueue';
import MessageHandler from './MessageHandler';
import SoundBot from './SoundBot';

const queue = new SoundQueue();
const messageHandler = new MessageHandler(queue, config.prefix);
const bot = new SoundBot(messageHandler);
bot.start();

const message = [
  'Use the following URL to let the bot join your server!',
  `https://discordapp.com/oauth2/authorize?client_id=${config.clientID}&scope=bot`
].join('\n');
console.log(message);  // tslint:disable-line no-console
