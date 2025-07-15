const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Pronto! Logado como ${client.user.tag}`);
		console.log("Conectado aos seguintes servidores:");
		client.guilds.cache.forEach(guild => {
			console.log(`- ${guild.name} (id: ${guild.id})`);
		});
	},
};