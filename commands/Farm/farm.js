const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("farm")
    .setDescription("Descrição do comando de farm"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
        .setTitle("Depósito de Farm")
        .setDescription("Para depositar corretamente siga as instruções abaixo")
        .addFields([
            { name: 'Clique no botão abaixo para se registrar', value: '', inline: true },
        ])
        .setFooter(
            {text: "Instruções a seguir"}
        )

        const button = new ButtonBuilder()
        .setCustomId("button-farm")
        .setLabel("Depositar")
        .setStyle(ButtonStyle.Success)

        const row = new ActionRowBuilder()
        .addComponents(button)

        await interaction.reply({embeds: [embed], components: [row]})
    }
}