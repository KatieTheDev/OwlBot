module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
    aliases: ['icon', 'pfp', 'av'],
    cooldown: '5',
	execute(message) {
        const Discord = require('discord.js');

        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

		let user = message.mentions.users.first();
        if(!user) user = message.author;
        if (color == '#000000') color = message.member.hoistRole.hexColor;
        const embed = new Discord.MessageEmbed()
            .setTitle('Avatar of ' + user.tag)
            .setImage(user.displayAvatarURL({ dynamic: true }))
            .setColor(color)
            .setFooter('OwlBot | Requested by: ' + message.author.tag + '| Hex color: ' + color);

        message.channel.send({ embed: embed });
	},
};