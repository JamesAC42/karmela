// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { token, serverId, channelId } = require('./config.json');
const userPrototype = require("./userprototype");
const cron = require('cron');
const statSummary = require("./statSummary");
const resetStat = require("./resetStat");

// Create a new client instance
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

	// Weekly stats refresh
	let weekly = new cron.CronJob('0 0 * * 0', () => {
		const guild = client.guilds.cache.get(serverId);
		const channel = guild.channels.cache.get(channelId);
		let stats = statSummary.statSummary("thisWeek");
		resetStat.resetStat("thisWeek");
		channel.send(stats);
	});

	// Monthly stats refresh
	let monthly = new cron.CronJob('0 0 1 * *', () => {
		const guild = client.guilds.cache.get(serverId);
		const channel = guild.channels.cache.get(channelId);
		let stats = statSummary.statSummary("thisMonth");
		resetStat.resetStat("thisMonth");
		channel.send(stats);
	});
	
	// Yearly stats refresh
	let yearly = new cron.CronJob('0 0 1 * *', () => {
		let date = new Date();
		if(date.getMonth() === 0) {
			const guild = client.guilds.cache.get(serverId);
			const channel = guild.channels.cache.get(channelId);
			let stats = statSummary.statSummary("thisYear");
			resetStat.resetStat("thisYear");
			channel.send(stats);
		}
	});

	weekly.start();
	monthly.start();
	yearly.start();
});

client.login(token);

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {

	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

async function updateVoteCount(reaction, user, count) { 
	
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

	let emoji = reaction.emoji.name;
	if(emoji !== "up" && emoji !== "down" && emoji !== "chud") {
		return;
	}
	
	const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
	const userReacted = user.id;
	const messageAuthor = reaction.message.author.id;
	if(messageAuthor === "1065842890426814576") {
		return;
	}

	let logMessage = "";
	let actionName;
	if(emoji === "up") {
		actionName = "upvoted";
	} else if(emoji === "down") {
		actionName = "downvoted";
	} else {
		actionName = "gave a chud to";
	}
	logMessage += new Date().toLocaleString();
	logMessage += ": " + "User '" + user.username + "' " + actionName + " a message from '" + reaction.message.author.username + "'";
	console.log(logMessage); 

	if(data[userReacted] === undefined) {
		data[userReacted] = userPrototype.createUser();
		data[userReacted].username = user.username;
	}

	if(data[messageAuthor] === undefined) {
		data[messageAuthor] = userPrototype.createUser();
		data[messageAuthor].username = reaction.message.author.username;
	}

	if(emoji === "up") {
		
		data[userReacted].totalUpvotesGiven += count;
		data[userReacted].thisWeek.upvotesGiven += count;
		data[userReacted].thisMonth.upvotesGiven += count;
		data[userReacted].thisYear.upvotesGiven += count;
		
		data[messageAuthor].totalUpvotesReceived += count;
		data[messageAuthor].thisWeek.upvotesReceived += count;
		data[messageAuthor].thisMonth.upvotesReceived += count;
		data[messageAuthor].thisYear.upvotesReceived += count;
		
	} else if(emoji === "down") {
		
		data[userReacted].totalDownvotesGiven += count;
		data[userReacted].thisWeek.downvotesGiven += count;
		data[userReacted].thisMonth.downvotesGiven += count;
		data[userReacted].thisYear.downvotesGiven += count;
		
		data[messageAuthor].totalDownvotesReceived += count;
		data[messageAuthor].thisWeek.downvotesReceived += count;
		data[messageAuthor].thisMonth.downvotesReceived += count;
		data[messageAuthor].thisYear.downvotesReceived += count;
	
	} else if(emoji === "chud") {

		data[userReacted].totalChudsGiven += count;
		data[userReacted].thisWeek.chudsGiven += count;
		data[userReacted].thisMonth.chudsGiven += count;
		data[userReacted].thisYear.chudsGiven += count;
		
		data[messageAuthor].totalChudsReceived += count;
		data[messageAuthor].thisWeek.chudsReceived += count;
		data[messageAuthor].thisMonth.chudsReceived += count;
		data[messageAuthor].thisYear.chudsReceived += count;

	}

	fs.writeFileSync("./data.json", JSON.stringify(data, null, '    '));

}

client.on(Events.MessageReactionAdd, async (reaction, user) => {
	updateVoteCount(reaction, user, 1);
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
	updateVoteCount(reaction, user, -1);
});