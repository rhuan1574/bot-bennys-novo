const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    category: 'Geral',
    data: new SlashCommandBuilder()
    .setName('tunagem')
    .setDescription('Comando utilizado para disparar uma embed de tunagem.'),
    async execute(interaction) {
        const attachment = new AttachmentBuilder('./images/bennys.png');

        const embed = new EmbedBuilder()
        .setTitle('Tunagem')
        .setDescription('Bem vindo ao sistema de tunagem da Bennys Tunning, para se tunar corretamente, clique no botão abaixo e siga os pasos a seguir.')
        .setColor('Aqua')
        .setImage('attachment://bennys.png')
        


        const button = new ButtonBuilder()
        .setCustomId('tunagem')
        .setLabel('Tunagem')
        .setStyle(ButtonStyle.Success)

        const row = new ActionRowBuilder()
        .addComponents(button)

        interaction.reply({embeds: [embed], components: [row], files: [attachment]})
    }
}