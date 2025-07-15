const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
dotenv.config();

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		try {
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				commands.push(command.data.toJSON());
				console.log(`Comando carregado para deploy: ${command.data.name}`);
			} else {
				console.warn(`[AVISO] O comando em ${filePath} está sem a propriedade "data" ou "execute".`);
			}
		} catch (error) {
			console.error(`Erro ao carregar o comando em ${filePath}:`, error);
		}
	}
}

// Validação das variáveis de ambiente
if (!process.env.TOKEN_BOT || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
	console.error('Erro: Certifique-se de que TOKEN_BOT, CLIENT_ID e GUILD_ID estão definidos no arquivo .env.');
	process.exit(1);
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN_BOT);

// and deploy your commands!
(async () => {
	try {
		console.log(`Iniciando atualização de ${commands.length} comandos de aplicação (/) ...`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Comandos de aplicação (/) atualizados com sucesso: ${data.length} comandos.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error('Erro ao atualizar comandos de aplicação:', error);
	}
})();