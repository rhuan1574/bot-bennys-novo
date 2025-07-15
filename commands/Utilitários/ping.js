const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde com Pong! para testar se o bot está online."),

    async execute(interaction) {
        try {
            await interaction.reply("Pong!!")
        } catch (error) {
            console.error('Erro ao executar o comando ping:', error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Ocorreu um erro ao executar este comando.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Ocorreu um erro ao executar este comando.', ephemeral: true });
            }
        }
    }
}