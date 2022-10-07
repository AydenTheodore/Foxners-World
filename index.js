/// // / * AydenTFox - 06/10/2022 * /

/* This is where all the systems & files below can interact     *
 * & create the actual BOT. The file itself is rather simple... */

// / Loads modules & Client
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
client.commands  = new Collection();
client.cooldowns = new Collection();


// / Event Loader & Handler /
const eventFiles = fs.readdirSync("./system/events/").filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./system/events/${file}`);
	
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


// / Commands Handler /
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.login(process.env.TOKEN);