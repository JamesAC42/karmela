const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scores')
		.setDescription('See the ranking of everyone based on their score and chud score')
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
        const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
        let response = "";
        let users = Object.keys(data);
        const timePeriod = interaction.options.getString('time');
        let scores = [];
        let chudScores = [];
        for(let user of users) {
            
            // skip karmela
            if(user === "1065842890426814576") {
                continue;
            }
            if(timePeriod === "allTime") {
                scores.push({
                    username:data[user].username,
                    score: data[user].totalUpvotesReceived - data[user].totalDownvotesReceived    
                }) 
                chudScores.push({
                    username:data[user].username,
                    score: data[user].totalChudsReceived
                })
            } else {
                scores.push({
                    username:data[user].username,
                    score: data[user][timePeriod].upvotesReceived - data[user][timePeriod].downvotesReceived    
                }) 
                chudScores.push({
                    username:data[user].username,
                    score: data[user][timePeriod].chudsReceived
                })
            }
        }
        scores.sort((a, b) => {
            return b.score - a.score;
        });
        chudScores.sort((a, b) => {
            return b.score - a.score;
        });
        response += "__Scores:__\n";
        for(let score in scores) {
            response += "\t" + (parseInt(score) + 1) + ". \t" + scores[score].username + ": **" + scores[score].score + "**\n"; 
        }
        response += "\n__Chud scores:__\n";
        for(let score in chudScores) {
            response += "\t" + (parseInt(score) + 1) + ". \t" + chudScores[score].username + ": **" + chudScores[score].score + "**\n";
        }
        await interaction.reply(response);
    },
};