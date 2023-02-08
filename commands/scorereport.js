const { SlashCommandBuilder } = require('discord.js');
const statSummary = require('../statSummary');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scorereport')
		.setDescription('See the score report for a specific time frame (only visible to you)')
        .addStringOption(option =>
			option.setName('time')
				.setDescription('The time period to get the score report for')
				.setRequired(true)
				.addChoices(
					{ name: 'Week', value: 'thisWeek' },
					{ name: 'Month', value: 'thisMonth' },
					{ name: 'Year', value: 'thisYear' },
					{ name: 'All Time', value: 'allTime' }
				)),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		const timePeriod = interaction.options.getString('time');
        const statReport = statSummary.statSummary(timePeriod);
        await interaction.reply({content:statReport, ephemeral:true});
    }
}