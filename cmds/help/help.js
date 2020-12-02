const discord = require('discord.js')
const { MessageEmbed } = discord
module.exports = {
        name: "help",
        run: async (client, message, args) => { 
                const help = new MessageEmbed()
                .setTitle('**HELP**')
                .setDescription(`
[prefix]play
[prefix]p (same as play)
[prefix]skip
[prefix]queue
[prefix]vol
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

}