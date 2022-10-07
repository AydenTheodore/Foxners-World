//* AydenTFox - 06/10/2022 */
/* Small script to setup your BOT on startup. *
 * May contain silly but (maybe) fun stuff..! */


const { ActivityType } = require('discord.js');

module.exports = {
	
	name: 'ready',
	once: true,
	execute(client) {

		console.log(`Logged in as ${client.user.tag}! [Loaded ${cmdNum} CMDs]`);

		client.user.setPresence({
			
			activities: [{ name: 'Raposo robótico de volta à ativa!', type: ActivityType.Playing }],
			status: 'idle',
			
		});
		
	},
	
};