Discord Soundbot
================

A bot for Discord to play your favorite sounds or music. You can also add / rename / remove sounds, ignore certain users, and more!

This is a *self-hosted* bot which means that you have to install and start the bot yourself. This is due to the bot being heavily involved with voice functionality. But don't sweat it! You can find a thorough installation and configuration guide in this README!

If you still need any help after reading the guide, feel free to [join my Discord server](https://discord.gg/7SAXvkq) and shoot me a message.

Have fun!



## Installation

### General

To use this bot you first have to create your own [Discord Application](https://discordapp.com/developers/applications/me). Click on `New App`, enter a name for your app and press the `Create App` button on the bottom right. Now press on the button `Create a Bot User` for your bot token.

Now create a default.json file inside of the config folder according to the example. Enter the `Client ID` and the `Token` into the config. You can find both inside your Discord application under `APP DETAILS` and `APP BOT USER` respectively.

### Building

The bot can be installed via Docker or manually.

#### Building via Docker

+ Simply clone the repo and run `docker build -t soundbot .` inside the folder.
+ Afterwards start the bot via `docker run soundbot`.
+ To run the container in the background use `docker run -d soundbot`.

#### Building manually

+ As per [discord.js](https://github.com/discordjs/discord.js/tree/11.3.2#installation), **Node.js v6.0.0** or newer is required.
+ Due to using voice functionality **FFmpeg** is required. Install it manually, or with `npm install ffmpeg-binaries`.
+ Install the bot's dependencies with `npm install` as usual.
+ Finally, run the bot with `npm start`.

### Adding the bot to your server

In both cases the bot will print a message to your console which should look a little bit like this

```
Use the following URL to let the bot join your server!
https://discordapp.com/oauth2/authorize?client_id={YOUR_CLIENT_ID}&scope=bot
```

Follow the link and allow your bot to join one of your Discord servers.


## Commands

Type `!commands` to print the following list of available commands.

```
!commands             Show this message
!sounds               Show available sounds
!search <tag>         Search for specific sound
!add                  Add the attached sound
!<sound>              Play the specified sound
!random               Play random sounds
!rename <old> <new>   Rename specified sound
!remove <sound>       Remove specified sound
!stop                 Stop playing and clear queue
!leave                Leave the channel
!mostplayed           Show 15 most used sounds
!lastadded            Show 5 last added sounds
!ignore <user>        Ignore specified user
!unignore <user>      Unignore specified user
```

### Adding sounds

You can add sounds to the bot by typing `!add` and attaching a file. Accepted file formats and a limit to the size are configurable. The name of the sound can only contain alphanumeric characters.

### Playing sounds

Type `!sounds` to get a list of all sounds that are available to your bot. Play any sound by prefixing it with `!`, e.g. `!rickroll`. Play a random sound with `!random`.

All sounds will be added to a queue and played in succession. To halt the playback and empty the queue type `!stop`.

### Searching sounds

When your library of sounds gets too big and you forget what kinds of sounds you added, you can search for specific sounds with `!search <tag>`.

### Renaming sounds

Sounds can be renamed by using `!rename <old> <new>`. The bot will respond with a status update.

### Removing sounds

You can delete sounds by typing `!remove <sound>`. The bot will respond with the status of the deletion in the channel of the message.

### Ignoring users

Users can be ignore from using **any** command by the `!ignore <user>` command while specifying their respective ID. The user will be mentioned by the bot in the channel of the message.

### Restricted commands

The commands `!rename`, `!remove`, `!ignore` and `!unignore` are restricted and can only be accessed by Administrators.


## Configuration

Check `config/config.example.json` for an example configuration and create a new file `config.json` with your desired configuration inside the `config` folder.
+ The bots prefix can be configured via `prefix`.
+ You can configure the accepted file formats (via the `acceptedExtensions` array) as well as the size of the accepted files (via the `maxiumumFileSize` given in bytes).
+ The bot can also automatically delete `!<sound>` messages for you to reduce channel spam. For this, set `deleteMessages` to `true`.
+ To let the bot stay in the channel after playing sounds to reduce noise, you can set the `stayInChannel` configuration option. You can order the bot to leave the channel with `!leave`.
+ You can set the bot's activity via the `game` options.

To add an avatar to your bot, add a file called `avatar.png` to the `config/` folder and restart the bot. To remove the avatar, delete `avatar.png` and restart the bot.


## Contributing

This bot is a dear passion project of mine. If you have any suggestions for new features or improvements, feel free to open an issue. I'll be glad to look into it!
