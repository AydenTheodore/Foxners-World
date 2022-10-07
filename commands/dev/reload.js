const fs = require('fs');

module.exports = {
	name: 'reload',
	description: 'Recarrega um comando para atualizar suas mudanças no código.',
	args: true,
	usage: "<command>",
	type: 'owner',
	perms: 5,
	async execute(message, args) {
		let commands = args.length && args[0].toLowerCase() === 'all' ? message.client.commands : args;
		if (args.length && args[0].toLowerCase() === 'all') {
			commands = [...commands];

			for (const item in commands) {
				commands[item] = commands[item][0];
			}
		}
		
		console.log(commands);
		
		for (const i in commands) {
			const command = message.client.commands.get(commands[i].toLowerCase())
				|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commands[i]));
	
			if (!command) {
				return message.channel.send(`There is no command with name or alias \`${commands[i]}\`, ${message.author}!`);
			}
				
			message.reply(`Reloading \`${commands[i]}\`...`).then(async msg => {
				const commandFolders = fs.readdirSync('./commands');
				const folderName = commandFolders.find(folder => fs.readdirSync(`./commands`).includes(`${command.name}.js`));
		
				delete require.cache[require.resolve(`./${command.name}.js`)];
		
				try {
					const newCommand = require(`./${command.name}.js`);
					
					await message.client.commands.set(newCommand.name, newCommand);
					await msg.edit(`Command \`${newCommand.name}\` was reloaded!`);
				} catch (error) {
					console.error(error);
					message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
				}	
			});
		}
	},
};