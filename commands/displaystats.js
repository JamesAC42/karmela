const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const format = require('../formatStats');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('displaystats')
		.setDescription('Publish all user stats (only visible to you)'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
        const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
        let response = "";
        let users = Object.keys(data);
        for(let user of users) {
            response += format.formatStats(data, user, false) + "\n";
        }
        await interaction.reply({content:response, ephemeral:true});
    },
};