const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    category: 'Geral',
    data: new SlashCommandBuilder()
    .setName('registro')
    .setDescription('Comando utilizado para disparar uma embed de registro.'),
    async execute(interaction) {
        const attachment = new AttachmentBuilder('./images/bennys.png');

        const embed = new EmbedBuilder()
        .setTitle('Registro Automático')
        .setDescription('Bem vindo ao sistema de registro automático da Bennys Tunning, para se registrar corretamente, clique no botão abaixo e siga os pasos a seguir.')
        .setColor('Aqua')
        .setImage('attachment://bennys.png')
        

        const button = new ButtonBuilder()
        .setCustomId('registro')
        .setLabel('Registrar')
        .setStyle(ButtonStyle.Success)

        const row = new ActionRowBuilder()
        .addComponents(button)

        interaction.reply({embeds: [embed], components: [row], files: [attachment]})
    }
}