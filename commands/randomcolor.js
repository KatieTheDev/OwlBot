module.exports = {
	name: 'randomcolor',
	description: '',
    aliases: [],
    cooldown: '5',
	execute(message) {
        const Discord = require('discord.js');

        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        const embed = new Discord.MessageEmbed()
            .setTitle('Random Hex Color: ' + color)
            .setColor(color)
            .setFooter('OwlBot | Requested by: ' + message.author.tag);

        message.channel.send({ embed: embed });
	},
};