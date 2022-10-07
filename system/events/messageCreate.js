//* AydenTFox */ /
/* Main file for receiving & processing messages.
 * All message-commands-related stuff goes here! */


const prefix = process.env.CMD_PREFIX;

module.exports = {
	
	name: 'messageCreate',
	once: false,
	execute(client, message) {

		if (message.author.bot || !message.startsWith(prefix)) return;

		// Get command & set Arguments variable (args)
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		
		if (!client.commands.has(commandName)) return;
		
		const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

		
		// / Command Checkers \ \\

		// Guild-Only Commands (e.g. -kick)
		if (command.guildOnly && message.channel.type === 'dm')
			return message.reply('Perdão, mas eu não posso executar isso dentro de DMs!\n(*Tente novamente dentro de algum servidor!*)');

		// Argument-based Commands (e.g. -kick)
		if (command.args && (!args.length || (typeof command.args === 'number' && args.length < command.args))) {

			let reply = `Você não deu ${(typeof command.args === 'number' ? 'argumentos suficientes' : 'nenhum argumento')} com seu comando!`;

			if (command.usage)
				reply += `\n> A forma correta seria: \`${prefix}${command.name} ${command.usage}\``;
		
			return message.reply(reply);
			
		}

		// Cooldown Blocker (e.g. -kick?)
		const { cooldowns } = client;
		
		if (!cooldowns.has(command.name))
			cooldowns.set(command.name, new Discord.Collection());
		
		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;
		
		if (timestamps.has(message.author.id)) {
			
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`Por favor aguarde mais ${timeLeft.toFixed(1)}s para reusar o comando \`${command.name}\`.`);
				
			}
			
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		// * IF none of the above triggered, you're allowed to run the command! * \\
		try {
			
			command.execute(message, args);

			console.log(`[${message.author.id}]: ${message.content}`);
			
		} catch (error) {
			
			console.error(error);

			message.reply("Oops, parece que este comando parou de funcionar! Lamento... 😔");
			
		}
		
	},
	
};