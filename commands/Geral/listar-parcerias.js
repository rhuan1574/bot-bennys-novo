const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ParceriasManager = require("../../utils/parceriasManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listar-parcerias")
    .setDescription("Lista todas as parcerias ativas (Apenas para Líderes)"),

  async execute(interaction) {
    try {
      // Verificar se o usuário tem o cargo de Líder
      const cargoLider = interaction.guild.roles.cache.find(role => 
        role.name === "🧰 | Lider"
      );
      
      if (!cargoLider) {
        await interaction.reply({
          content: "❌ Erro: Cargo '🧰 | Lider' não encontrado no servidor!",
          flags: 64 // Ephemeral
        });
        return;
      }

      const usuarioTemCargoLider = interaction.member.roles.cache.has(cargoLider.id);
      
      if (!usuarioTemCargoLider) {
        await interaction.reply({
          content: "❌ **Acesso Negado!**\n\nVocê precisa ter o cargo **🧰 | Lider** para listar parcerias.",
          flags: 64 // Ephemeral
        });
        return;
      }

      const parceriasManager = new ParceriasManager();
      const parcerias = await parceriasManager.getAllParcerias();

      if (parcerias.length === 0) {
        await interaction.reply({
          content: "📋 **Nenhuma parceria encontrada!**\n\nNão há parcerias registradas no sistema.",
          flags: 64 // Ephemeral
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("🤝 Parcerias Ativas da Benny's")
        .setColor("#00ff00")
        .setDescription(`**Total de parcerias:** ${parcerias.length}\n**Solicitado por:** ${interaction.user} (🧰 | Lider)`)
        .setFooter({ text: "Sistema de Parcerias Benny's" })
        .setTimestamp();

      // Adicionar cada parceria como um campo
      parcerias.forEach((parceria, index) => {
        embed.addFields({
          name: `${index + 1}. ${parceria.nomeOrganizacao}`,
          value: `**Dono:** ${parceria.nomeDono}\n**Localização:** ${parceria.localizacao}\n**Produto/Serviço:** ${parceria.produto}\n**Contato:** ${parceria.contato}\n**Registrado por:** ${parceria.registradoPor}\n**Data:** ${new Date(parceria.dataRegistro).toLocaleString('pt-BR')}`,
          inline: false
        });
      });

      await interaction.reply({
        embeds: [embed],
        flags: 64 // Ephemeral
      });

    } catch (error) {
      console.error("Erro ao listar parcerias:", error);
      await interaction.reply({
        content: "❌ Erro ao listar as parcerias. Tente novamente.",
        flags: 64 // Ephemeral
      });
    }
  },
}; 