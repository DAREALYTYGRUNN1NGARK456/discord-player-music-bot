const discord = require('discord.js')
const client = new discord.Client()
const keeponline = require('./keeponline.js')
const fs = require('fs')
const chalk = require('chalk')

const dotenv = require('./other packages.js')
const { MessageEmbed } = discord
settings = {
        prefix: "!",
        token: process.env.BOT_TOKEN
}
client.settings = settings
const { Player } = require('discord-player')

const player = new Player(client);
client.player = player
client.db = require("quick.db")
client.commands = new discord.Collection()
client.aliases = new discord.Collection()
/* client.player.on("trackStart", (message, track)  => {
message.channel.send(`NOW PLAYING ${track.title}...`)
})
*/
//discord-player events
// Then add some messages that will be sent when the events will be triggered
client.player
 
// Send a message when a track starts
.on('trackStart', (message, track) => message.channel.send(`Now playing ${track.title}...`))
 
// Send a message when something is added to the queue
.on('trackAdd', (message, track) => message.channel.send(`${track.title} has been added to the queue!`))
.on('playlistAdd', (message, playlist) => message.channel.send(`${playlist.title} has been added to the queue (${playlist.items.length} songs)!`))
 
// Send messages to format search results
.on('searchResults', (message, query, tracks) => {
 
    const embed = new discord.MessageEmbed()
    .setAuthor(`Here are your search results for ${query}!`)
    .setDescription(tracks.map((t, i) => `${i}. ${t.title}`))
    .setFooter('Send the number of the song you want to play!')
    message.channel.send(embed);
 
})
.on('searchInvalidResponse', (message, query, tracks, content, collector) => message.channel.send(`You must send a valid number between 1 and ${tracks.length}!`))
.on('searchCancel', (message, query, tracks) => message.channel.send('You did not provide a valid response... Please send the command again!'))
.on('noResults', (message, query) => message.channel.send(`No results found on YouTube for ${query}!`))
 
// Send a message when the music is stopped
.on('queueEnd', (message, queue) =>  message.channel.send('Music stopped as there is no more music in the queue!')

)
.on('channelEmpty',  (message, queue) => message.channel.send('Music stopped as there is no more member in the voice channel!') 
)
.on('botDisconnect',  (message, queue) =>  message.channel.send('Music stopped as I have been disconnected from the channel!')
)
 
// Error handling
.on('error', (error, message) => {
    switch(error){
        case 'NotPlaying':
            message.channel.send('There is no music being played on this server!')
            break;
        case 'NotConnected':
            message.channel.send('You are not connected in any voice channel!')
            break;
        case 'UnableToJoin':
            message.channel.send('I am not able to join your voice channel, please check my permissions!')
            break;
        default:
            message.channel.send(`Something went wrong... Error: ${error}`)
    }
})





client.on('ready', () => {
client.user.setStatus("STREAMING")
client.user.setActivity(`Servers : ${client.guilds.cache.size} | Users : ${client.users.cache.size}`, {
        type: "STREAMING",
        url: "https://minercord.xyz"
})
console.log(`
${chalk.greenBright(`BOT IS ONLINE AND READY`)}
${chalk.blueBright(`BOT PREFIX:${settings.prefix}`)}
`)
})
client.on('message', async message => {
        const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase()
        let musicMessage = new MessageEmbed()
        .setColor('RANDOM')
        .setTimestamp()

         if (cmd === "play") {
                if (!args[0]) return message.channel.send(`PLEASE DO \`\`${settings.prefix}play <song name or url>\`\``)
                client.player.play(message, args[0], message.author)
        } else if (cmd === "p") {
            if (!args[0]) return message.channel.send(`PLEASE DO \`\`${settings.prefix}p <song name or url>\`\``)
                client.player.play(message, args[0], message.author)     
        } 
        if (cmd === "pause") {
                client.player.pause(message)

        }
        if (cmd === "skip") {
                client.player.skip(message)
        }
        if (cmd === "resume") {
                client.player.resume(message)
        }
        if (cmd === "stop") {
                client.player.stop(message)
        

        }
        if (cmd === "die") {
                client.player.stop(message)
        }
        if (cmd === "fuckoff") {
                client.player.stop(message)
        }
        if (cmd === "loop") {
                if (!args[0]) return message.channel.send(`PLEASE DO \`\`${settings.prefix}loop <enable | diable>\`\``)
                client.player.setRepeatMode(message, args[0]) 
        } else if (cmd === "repeat") {
                if (!args[0]) return message.channel.send(`PLEASE DO \`\`${settings.prefix}repeat <enable | diable>\`\``)
                client.player.setRepeatMode(message, args[0]) 
        }
        if (cmd === "vol") {
                let currentvol = await client.db.fetch(`Vol_${message.guild.id}`)
                if (!args[0]) return message.channel.send(`CURRENT VOL IS:\`\`${currentvol}\`\` TO CHANGE IT PLEASE DO \`\`${settings.prefix}vol <0 - 400>\`\``)
                if (args[0] > 400) return message.channel.send(`SORRY YOU CAN ONLY DO 0 - 400`)
                client.player.setVolume(message, args[0])
                client.db.set(`Vol_${message.guild.id}`, args[0])

        }
        if (cmd === "queue") {
                client.player.getQueue(message)

        }
        if (cmd === "np") {
                client.player.nowPlaying(message)
        } else if (cmd === "nowplaying") {
                client.player.nowPlaying(message)
        }
        if (cmd === "remove") {
                 if (!args[0]) return message.channel.send(`PLEASE DO \`\`${settings.prefix}remove <track number>\`\``)
                client.player.remove(message, args[0])

        }
        if (cmd === "clearqueue") {
                client.player.clearQueue(message)

        }
        if (cmd === "cq") {
                client.player.clearQueue(message)

        }
        if (cmd === "help") {
                
                const help = new MessageEmbed()
                .setTitle('**HELP**')
                .setDescription(`
[prefix]play
[prefix]p (same as play)
[prefix]skip
[prefix]queue
[prefix]vol (when show the volume level it will be the same as the last use of the command)
[prefix]stop
[prefix]die (same as stop)
[prefix]fuckoff (same as stop)
[prefix]repeat (WARNING IT WILL REPEAT ONLY ONE TRACK)
[prefix]clearqueue
[prefix]cq (same as clearqueue)
[prefix]remove 
[prefix]nowplaying 
[prefix]np (same as nowplaying)
[prefix]pause
[prefix]resume
[prefix]loop (same as repeat)
                `)
                .setFooter(`REQUESTED BY ${message.author.username}`)
                .setTimestamp()
                .setColor('RANDOM')
                message.channel.send(help)
        }
       // const helpcmd = require('./cmds/help/help.js')
       // if (cmd === helpcmd.name) {
                
         //       message.channel.send(helpcmd.message)

        //}
        let modules = ['help', "music"]
modules.forEach(function(module) {
        fs.readdir(`./cmds/${module}`, function(err, files) {
    if (err)
      return new Error(
        "Missing Folder Of Commands! Example : cmds/<Folder>/Command.js"
      );
    files.forEach(function(file) {
      if (!file.endsWith(".js")) return;
      let command = require(`./cmds/${module}/${file}`);
      console.log(`${command.name} Command Has Been Loaded - ✅`);
      if (command.name) client.commands.set(command.name, command);
      if (!command.aliases) return client.aliases.set(null, command.name)
       else if (command.aliases) {
        command.aliases.forEach(alias =>
          client.aliases.set(alias, command.name)
        );
      } 
    
    });
  });
});
})
client.on("message", async message => {
 if (message.channel.type === "dm") return;
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  if (!message.content.startsWith(client.settings.preifx)) return;
 const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase()
  if (cmd.length === 0) return;

  let command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  if (!command) return;

  if (command) {
    if (!message.guild.me.hasPermission(["VIEW_CHANNEL", "SEND_MESSAGES"]))
      return message.author.send(
        "I Don't Have Enough Permission To Use This Or Any Of My Commands | Require : view channels and send messages"
      );
    command.run(client, message, args);
  }
  console.log(
    `User : ${message.author.tag} (${message.author.id}) Server : ${message.guild.name} (${message.guild.id}) Command : ${command.name}`
  );
});

/*
*base command in the main file
if (cmd === "") {
                
        }
*base music command using discord-player
 if (cmd === "") {
                client.player

        }

 */
client.login(settings.token)