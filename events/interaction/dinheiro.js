const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = async function handleButtonDinheiro(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('Escolha como sua meta será depositada.')
    .setDescription('Para depositar com dinheiro real, clique no botão abaixo. Para depositar com farm, clique no botão abaixo.')
    .setColor('#00ff00');

  const button = new ButtonBuilder()
    .setCustomId('dinheiro')
    .setLabel('💰 Dinheiro')
    .setStyle(ButtonStyle.Success);

  const button2 = new ButtonBuilder()
    .setCustomId('farm')
    .setLabel('Farm📦')
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder().addComponents(button, button2);

  await interaction.reply({ embeds: [embed], components: [row] });
} 