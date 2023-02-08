const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const format = require('../formatStats');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getuserstats')
		.setDescription('See the stats for a specific user (only visible to you)')
        .addUserOption(option =>
			option
				.setName('username')
				.setDescription('The user to get the stats for')
				.setRequired(true)),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
        const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
        const user = interaction.options.getUser('username');
        const userid = user.id;
        if(data[userid]) {
            await interaction.reply({ 
                content: format.formatStats(data, userid, true), 
                ephemeral: true 
            })
        } else {
            let statString = "";
            statString += "__Stats for " + user.username + ":__\n";
            statString += "Score: **0**" + "\n";
            statString += "| Upvotes Received: **0**\n";
            statString += "| Upvotes Given: **0**\n";
            statString += "| Downvotes Received: **0**\n";
            statString += "| Downvotes Given: **0**\n";
            statString += "| Chuds Received: **0**\n";
            statString += "| Chuds Given: **0**\n"
            await interaction.reply({content:statString, ephemeral:true});
        }
	},
};