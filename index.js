const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.TOKEN_BOT) {
	console.error('Erro: TOKEN_BOT não definido no arquivo .env.');
	process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,   // Permite receber mensagens em canais
    GatewayIntentBits.MessageContent   // Permite ler o conteúdo das mensagens (necessário para anexos e texto)
  ]
});
client.commands = new Collection();

function loadCommands() {
	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(foldersPath);
	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			try {
				const command = require(filePath);
				if ('data' in command && 'execute' in command) {
					client.commands.set(command.data.name, command);
					console.log(`Comando carregado: ${command.data.name}`);
				} else {
					console.warn(`[AVISO] O comando em ${filePath} está sem a propriedade "data" ou "execute".`);
				}
			} catch (error) {
				console.error(`Erro ao carregar o comando em ${filePath}:`, error);
			}
		}
	}
}

function loadEvents() {
	const eventsPath = path.join(__dirname, 'events');
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		try {
			const event = require(filePath);
			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args));
			} else {
				client.on(event.name, (...args) => event.execute(...args));
			}
			console.log(`Evento carregado: ${event.name}`);
		} catch (error) {
			console.error(`Erro ao carregar o evento em ${filePath}:`, error);
		}
	}
}

loadCommands();
loadEvents();

client.login(process.env.TOKEN_BOT);