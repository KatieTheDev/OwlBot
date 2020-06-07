module.exports = {
	name: 'embedtest',
	description: '',
	aliases: [],
	execute(message) {
        const Discord = require('discord.js');
        
        const exampleEmbed = {
            color: 0x0099ff,
            title: 'Embed Test',
            url: '',
            author: {
                name: 'OwlBot',
                icon_url: message.author.avatarURL,
                url: '',
            },
            description: 'Some description here',
            thumbnail: {
                url: message.author.avatarURL,
            },
            fields: [
                {
                    name: 'Regular field title',
                    value: 'Some value here',
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
            ],
            image: {
                url: message.author.avatarURL,
            },
            timestamp: new Date(),
            footer: {
                text: 'Some footer text here',
                icon_url: message.author.avatarURL,
            },
        };
        
        message.channel.send({ embed: exampleEmbed });
        
	},
};