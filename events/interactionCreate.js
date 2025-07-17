const {
  Events,
  MessageFlags,
  ModalBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

const ParceriasManager = require("../utils/parceriasManager");
const handleRegistro = require('./interaction/registro');
const handleAusencias = require('./interaction/ausencias');
const handleParcerias = require('./interaction/parcerias');
const handleButtonDinheiro = require('./interaction/dinheiro');
const handleButtonFarm = require('./interaction/farm');

const VALOR_DINHEIRO = 10000;

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `Nenhum comando correspondente a ${interaction.commandName} foi encontrado.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(
          `Erro ao executar o comando ${interaction.commandName}:`,
          error
        );
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "Ocorreu um erro ao executar este comando!",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: "Ocorreu um erro ao executar este comando!",
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    } else if (interaction.isButton()) {
      const { customId } = interaction;
      try {
        switch (customId) {
          case "registro":
            // Verificar se o usuário já tem o cargo de Membro Benny's
            const cargoMembro = interaction.guild.roles.cache.find(
              (role) => role.name === "🧰 | Membro Benny's"
            );

            if (!cargoMembro) {
              await interaction.reply({
                content:
                  "❌ Erro: Cargo '🧰 | Membro Benny's' não encontrado no servidor!",
                flags: MessageFlags.Ephemeral,
              });
              return;
            }

            const usuarioTemCargo = interaction.member.roles.cache.has(
              cargoMembro.id
            );

            if (usuarioTemCargo) {
              await interaction.reply({
                content:
                  "❌ Você já possui o cargo de 🧰 | Membro Benny's e não pode se registrar novamente!",
                flags: MessageFlags.Ephemeral,
              });
              return;
            }

            const modal = new ModalBuilder()
              .setCustomId("registro")
              .setTitle("Registro");

            const input = new TextInputBuilder()
              .setCustomId("nome-game")
              .setLabel("Nome in game")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const input2 = new TextInputBuilder()
              .setCustomId("id")
              .setLabel("ID in Game")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const input3 = new TextInputBuilder()
              .setCustomId("nome-real")
              .setLabel("Nome Real")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const input4 = new TextInputBuilder()
              .setCustomId("telefone")
              .setLabel("Telefone(Adicionar o traço. Ex: 123-123)")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const input5 = new TextInputBuilder()
              .setCustomId("recrutador")
              .setLabel("Quem te recrutou?")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            // Criar múltiplas ActionRow para distribuir os inputs
            const row1 = new ActionRowBuilder().addComponents(input);
            const row2 = new ActionRowBuilder().addComponents(input2);
            const row3 = new ActionRowBuilder().addComponents(input3);
            const row4 = new ActionRowBuilder().addComponents(input4);
            const row5 = new ActionRowBuilder().addComponents(input5);

            modal.addComponents(row1, row2, row3, row4, row5);
            await interaction.showModal(modal);
            break;
          case "button-ausencias":
            const modalAusencias = new ModalBuilder()
              .setCustomId("modal-ausências")
              .setTitle("Painel de ausências");

            const inputAusencias1 = new TextInputBuilder()
              .setCustomId("nome-game")
              .setLabel("Nome in game")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const inputAusencias2 = new TextInputBuilder()
              .setCustomId("id")
              .setLabel("ID in game")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const inputAusencias3 = new TextInputBuilder()
              .setCustomId("motivo")
              .setLabel("Motivo da ausência")
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
              .setPlaceholder("Descreva o motivo da sua ausência...");

            const inputAusencias4 = new TextInputBuilder()
              .setCustomId("duracao")
              .setLabel("Duração estimada")
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
              .setPlaceholder("Ex: 2 dias, 1 semana, etc.");

            const rowAusencias1 = new ActionRowBuilder().addComponents(
              inputAusencias1
            );
            const rowAusencias2 = new ActionRowBuilder().addComponents(
              inputAusencias2
            );
            const rowAusencias3 = new ActionRowBuilder().addComponents(
              inputAusencias3
            );
            const rowAusencias4 = new ActionRowBuilder().addComponents(
              inputAusencias4
            );

            modalAusencias.addComponents(
              rowAusencias1,
              rowAusencias2,
              rowAusencias3,
              rowAusencias4
            );

            await interaction.showModal(modalAusencias);
            break;
          case "parcerias":
            // Verificar se o usuário tem o cargo de Líder
            const cargoLiderParcerias = interaction.guild.roles.cache.find(
              (role) => role.name === "🧰 | Lider"
            );

            if (!cargoLiderParcerias) {
              await interaction.reply({
                content:
                  "❌ Erro: Cargo '🧰 | Lider' não encontrado no servidor!",
                flags: MessageFlags.Ephemeral,
              });
              return;
            }

            const usuarioTemCargoLiderParcerias =
              interaction.member.roles.cache.has(cargoLiderParcerias.id);

            if (!usuarioTemCargoLiderParcerias) {
              await interaction.reply({
                content:
                  "❌ **Acesso Negado!**\n\nVocê precisa ter o cargo **🧰 | Lider** para registrar parcerias.",
                flags: MessageFlags.Ephemeral,
              });
              return;
            }

            const modalParcerias = new ModalBuilder()
              .setCustomId("modal-parcerias")
              .setTitle("Parcerias da Benny's");

            const inputParcerias1 = new TextInputBuilder()
              .setCustomId("nome-organizacao")
              .setLabel("🤝Nome da Organização/FAC")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const inputParcerias2 = new TextInputBuilder()
              .setCustomId("nome-dono")
              .setLabel("🤝Dono da Organização/FAC")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const inputParcerias3 = new TextInputBuilder()
              .setCustomId("localizacao")
              .setLabel("📍Localização da Organização/FAC")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const inputParcerias4 = new TextInputBuilder()
              .setCustomId("produto")
              .setLabel("📦 Produto/Serviço")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const inputParcerias5 = new TextInputBuilder()
              .setCustomId("contato")
              .setLabel("👤Contato Principal")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const rowParcerias1 = new ActionRowBuilder().addComponents(
              inputParcerias1
            );
            const rowParcerias2 = new ActionRowBuilder().addComponents(
              inputParcerias2
            );
            const rowParcerias3 = new ActionRowBuilder().addComponents(
              inputParcerias3
            );
            const rowParcerias4 = new ActionRowBuilder().addComponents(
              inputParcerias4
            );
            const rowParcerias5 = new ActionRowBuilder().addComponents(
              inputParcerias5
            );

            modalParcerias.addComponents(
              rowParcerias1,
              rowParcerias2,
              rowParcerias3,
              rowParcerias4,
              rowParcerias5
            );

            await interaction.showModal(modalParcerias);
            break;
          case "remove-parceria":
            try {
              // Verificar se o usuário tem o cargo de Líder
              const cargoLider = interaction.guild.roles.cache.find(
                (role) => role.name === "🧰 | Lider"
              );

              if (!cargoLider) {
                await interaction.reply({
                  content:
                    "❌ Erro: Cargo '🧰 | Lider' não encontrado no servidor!",
                  flags: MessageFlags.Ephemeral,
                });
                return;
              }

              const usuarioTemCargoLider = interaction.member.roles.cache.has(
                cargoLider.id
              );

              if (!usuarioTemCargoLider) {
                await interaction.reply({
                  content:
                    "❌ **Acesso Negado!**\n\nVocê precisa ter o cargo **🧰 | Lider** para remover parcerias.",
                  flags: MessageFlags.Ephemeral,
                });
                return;
              }

              const parceriasManager = new ParceriasManager();
              const parceria = await parceriasManager.getParceria(
                interaction.message.id
              );

              if (!parceria) {
                await interaction.reply({
                  content: "❌ Parceria não encontrada no banco de dados.",
                  flags: MessageFlags.Ephemeral,
                });
                return;
              }

              // Remover parceria do banco de dados
              await parceriasManager.removeParceria(interaction.message.id);

              // Deletar a mensagem
              await interaction.message.delete();

              // Buscar o canal de logs de parcerias
              const canalLogsParcerias = interaction.guild.channels.cache.find(
                (channel) => channel.name === "🔓・logs-parcerias"
              );

              // Enviar log de remoção
              if (canalLogsParcerias) {
                const embedRemocao = new EmbedBuilder()
                  .setTitle("🗑️ Parceria Removida")
                  .setColor("#ff0000")
                  .setThumbnail(interaction.user.displayAvatarURL())
                  .addFields(
                    {
                      name: "👤 Removido por",
                      value: `${interaction.user} (${interaction.user.tag})`,
                      inline: true,
                    },
                    { name: "🏆 Cargo", value: "🧰 | Lider", inline: true },
                    {
                      name: "🤝 Organização/FAC",
                      value: parceria.nomeOrganizacao,
                      inline: true,
                    },
                    {
                      name: "🤝 Dono da Organização/FAC",
                      value: parceria.nomeDono,
                      inline: true,
                    },
                    {
                      name: "📍 Localização",
                      value: parceria.localizacao,
                      inline: true,
                    },
                    {
                      name: "📦 Produto/Serviço",
                      value: parceria.produto,
                      inline: true,
                    },
                    {
                      name: "👤 Contato Principal",
                      value: parceria.contato,
                      inline: true,
                    },
                    {
                      name: "📅 Data de Registro",
                      value: new Date(parceria.dataRegistro).toLocaleString(
                        "pt-BR"
                      ),
                      inline: true,
                    },
                    {
                      name: "⏰ Data de Remoção",
                      value: new Date().toLocaleString("pt-BR"),
                      inline: false,
                    }
                  )
                  .setFooter({ text: "Sistema de Logs Benny's" })
                  .setTimestamp();

                await canalLogsParcerias.send({ embeds: [embedRemocao] });
              }

              await interaction.reply({
                content: `✅ **Parceria removida com sucesso!**\n\n🗑️ A parceria com **${parceria.nomeOrganizacao}** foi removida do sistema.\n\n**Removido por:** ${interaction.user} (🧰 | Lider)`,
                flags: MessageFlags.Ephemeral,
              });
            } catch (error) {
              console.error("Erro ao remover parceria:", error);
              await interaction.reply({
                content: "❌ Erro ao remover a parceria. Tente novamente.",
                flags: MessageFlags.Ephemeral,
              });
            }
            break;
          case "button-farm":
            await handleButtonDinheiro(interaction);
            break;
          case "farm":
            await handleButtonFarm(interaction);
            break;
          case "dinheiro":
            const modalDinheiro = new ModalBuilder()
            .setCustomId("modal-dinheiro")
            .setTitle("Depósito de Dinheiro")
            
            const inputDinheiro = new TextInputBuilder()
            .setCustomId("dinheiro")
            .setLabel("Quantidade de dinheiro(Valor mínimo de 10000)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("(Valor mínimo de 10000)")

            const rowDinheiro = new ActionRowBuilder().addComponents(inputDinheiro)
            
            modalDinheiro.addComponents(rowDinheiro)

            await interaction.showModal(modalDinheiro);
            break;
          default:
            await interaction.reply({
              content: "Comando não encontrado.",
              flags: MessageFlags.Ephemeral,
            });
            break;
        }
      } catch (error) {
        console.error(`Erro ao processar o botão ${customId}:`, error);
      }
    } else if (interaction.isModalSubmit()) {
      const { customId } = interaction;
      try {
        switch (customId) {
          case "registro":
            await handleRegistro(interaction);
            break;
          case "modal-ausências":
            await handleAusencias(interaction);
            break;
          case "modal-parcerias":
            await handleParcerias(interaction);
            break;
          case "modal-dinheiro":
            const embed = new EmbedBuilder()
            .setTitle("Seu depósito foi realizado com sucesso!")
            .setDescription("Obrigado por depositar com a Benny's! 💰")
            .setColor("#00ff00")

            const dinheiro = parseInt(interaction.fields.getTextInputValue("dinheiro"));

            if (isNaN(dinheiro)) {
              await interaction.reply({
                content: `❌ **Valor inválido!**\n\n💰 Por favor, insira um número válido.`,
                flags: MessageFlags.Ephemeral,
              });
              return;
            }

            if (dinheiro < VALOR_DINHEIRO) {
              await interaction.reply({
                content: `❌ **Quantidade de dinheiro insuficiente!**\n\n💰 **Valor mínimo de depósito:** ${VALOR_DINHEIRO}`,
                flags: MessageFlags.Ephemeral,
              });
              return;
            }

            await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral});

            // Log de depuração
            console.log(`[DEPÓSITO] Coletor de comprovante iniciado para usuário: ${interaction.user.tag} (${interaction.user.id}) no canal: ${interaction.channel?.id}`);

            // Verificar permissões do bot
            if (!interaction.channel || !interaction.channel.permissionsFor || !interaction.channel.permissionsFor(interaction.client.user).has(['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages'])) {
              await interaction.followUp({
                content: '❌ O bot não tem permissão suficiente para coletar o comprovante neste canal. Avise a administração.',
                flags: MessageFlags.Ephemeral
              });
              console.error('[DEPÓSITO] Permissão insuficiente para coletar comprovante.');
              return;
            }

            // Enviar mensagem pedindo comprovante
            const embedComprovante = new EmbedBuilder()
              .setTitle("📎 Comprovante de Pagamento")
              .setDescription("Agora é só anexar seu comprovante de pagamento **neste canal**. Você tem **2 minutos**.\n\n**Formatos aceitos:** JPG, PNG, GIF, WEBP")
              .setColor("Aqua")
              .setFooter({ text: "Sistema de Depósito Benny's" })
              .setTimestamp();

            const mensagemComprovante = await interaction.followUp({
              embeds: [embedComprovante],
              flags: MessageFlags.Ephemeral
            });

            // Configurar coletor de mensagens para capturar anexos
            const filter = m => m.author.id === interaction.user.id && m.attachments.size > 0;
            let collector;
            try {
              collector = interaction.channel.createMessageCollector({ 
                filter, 
                time: 120000, // 2 minutos
                max: 1 
              });
            } catch (err) {
              console.error('[DEPÓSITO] Erro ao criar o coletor:', err);
              await interaction.followUp({
                content: '❌ Ocorreu um erro ao iniciar a coleta do comprovante. Avise a administração.',
                flags: MessageFlags.Ephemeral
              });
              return;
            }

            // Log para toda mensagem recebida no canal durante o coletor
            collector.on('collect', async (message) => {
              // Este log só aparece se passar no filtro, então vamos adicionar um listener para todas as mensagens
            });
            collector.on('ignore', (message) => {}); // placeholder
            collector.on('end', (collected) => {}); // placeholder

            // Adicionar listener para todas as mensagens do canal durante o coletor
            const listener = async (message) => {
              if (message.channel.id !== interaction.channel.id) return;
              console.log(`[DEPÓSITO][DEBUG] Mensagem recebida: autor=${message.author.tag} (${message.author.id}), anexos=${message.attachments.size}`);
              if (message.author.id !== interaction.user.id) {
                console.log('[DEPÓSITO][DEBUG] Ignorado: autor diferente.');
                return;
              }
              if (message.attachments.size === 0) {
                console.log('[DEPÓSITO][DEBUG] Ignorado: sem anexo.');
                return;
              }
              console.log('[DEPÓSITO][DEBUG] Esta mensagem passaria no filtro!');
            };
            interaction.client.on('messageCreate', listener);
            collector.on('end', () => {
              interaction.client.removeListener('messageCreate', listener);
            });

            collector.on('collect', async (message) => {
              console.log(`[DEPÓSITO] Mensagem coletada de ${message.author.tag} (${message.author.id})`);
              const attachment = message.attachments.first();
              
              // Verificar se é uma imagem
              const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
              const fileExtension = attachment.name.split('.').pop().toLowerCase();
              
              if (!imageExtensions.includes(fileExtension)) {
                const embedErro = new EmbedBuilder()
                  .setTitle("❌ Formato Inválido")
                  .setDescription("Por favor, envie apenas imagens (JPG, PNG, GIF, WEBP).")
                  .setColor("#ff0000")
                  .setTimestamp();

                await interaction.followUp({
                  embeds: [embedErro],
                  flags: MessageFlags.Ephemeral
                });
                console.warn(`[DEPÓSITO] Formato de arquivo inválido recebido: ${attachment.name}`);
                return;
              }
              
              // Enviar para canal de logs com o comprovante
              const canalDeposito = interaction.guild.channels.cache.find(
                (channel) => channel.name === "🔓・logs-farm"
              );
              
              if (canalDeposito) {
                try {
                  const embedDeposito = new EmbedBuilder()
                    .setTitle("💰 Depósito de Dinheiro")
                    .setColor("#00ff00")
                    .addFields(
                      {
                        name: "👤 Usuário",
                        value: `${interaction.user} (${interaction.user.tag})`,
                        inline: true,
                      },
                      {
                        name: "💰 Quantidade de dinheiro",
                        value: dinheiro.toLocaleString('pt-BR'),
                        inline: true,
                      },
                      {
                        name: "📎 Comprovante",
                        value: "✅ Anexado",
                        inline: true,
                      },
                      {
                        name: "⏰ Data/Hora",
                        value: new Date().toLocaleString("pt-BR"), 
                        inline: false,
                      }
                    )
                    .setFooter({ text: "Sistema de Depósito Benny's" })
                    .setTimestamp()
                    .setImage(attachment.url); // Exibe a imagem dentro do embed

                  await canalDeposito.send({ 
                    embeds: [embedDeposito]
                  });
                  console.log(`[DEPÓSITO] Comprovante enviado para o canal de logs.`);
                } catch (error) {
                  console.error("[DEPÓSITO] Erro ao enviar para canal de depósito:", error);
                }
              } else {
                console.error('[DEPÓSITO] Canal de logs-farm não encontrado!');
              }

              // Agora sim, deletar a mensagem do usuário para manter o canal limpo
              try {
                await message.delete();
                console.log(`[DEPÓSITO] Mensagem do comprovante deletada.`);
              } catch (error) {
                console.error("[DEPÓSITO] Erro ao deletar mensagem:", error);
              }

              // Confirmar recebimento do comprovante
              const embedConfirmacao = new EmbedBuilder()
                .setTitle("✅ Comprovante Recebido!")
                .setDescription("Seu comprovante foi recebido com sucesso!")
                .setColor("#00ff00")
                .setTimestamp();

              await interaction.followUp({
                embeds: [embedConfirmacao],
                flags: MessageFlags.Ephemeral
              });
            });

            collector.on('end', (collected) => {
              if (collected.size === 0) {
                console.warn('[DEPÓSITO] Tempo expirado: nenhum comprovante recebido.');
                // Nenhum anexo foi enviado
                const embedTimeout = new EmbedBuilder()
                  .setTitle("⏰ Tempo Expirado")
                  .setDescription("O tempo para enviar o comprovante expirou. Entre em contato com a administração.")
                  .setColor("#ff0000")
                  .setTimestamp();

                interaction.followUp({
                  embeds: [embedTimeout],
                  flags: MessageFlags.Ephemeral
                });

                // Enviar log sem comprovante
                const canalDeposito = interaction.guild.channels.cache.find(
                  (channel) => channel.name === "🔓・logs-farm"
                );
                
                if (canalDeposito) {
                  try {
                    const embedDeposito = new EmbedBuilder()
                      .setTitle("💰 Depósito de Dinheiro")
                      .setColor("#ffff00")
                      .addFields(
                        {
                          name: "👤 Usuário",
                          value: `${interaction.user} (${interaction.user.tag})`,
                          inline: true,
                        },
                        {
                          name: "💰 Quantidade de dinheiro",
                          value: dinheiro.toLocaleString('pt-BR'),
                          inline: true,
                        },
                        {
                          name: "📎 Comprovante",
                          value: "❌ Não anexado",
                          inline: true,
                        },
                        {
                          name: "⏰ Data/Hora",
                          value: new Date().toLocaleString("pt-BR"),
                          inline: false,
                        }
                      )
                      .setFooter({ text: "Sistema de Depósito Benny's" })
                      .setTimestamp();

                    canalDeposito.send({ embeds: [embedDeposito] });
                    console.log('[DEPÓSITO] Log enviado para canal de logs-farm sem comprovante.');
                  } catch (error) {
                    console.error("[DEPÓSITO] Erro ao enviar para canal de depósito:", error);
                  }
                } else {
                  console.error('[DEPÓSITO] Canal de logs-farm não encontrado!');
                }
              }
            });

            break;
            case 'farm':

             break; 
          default:
            await interaction.reply({
              content: "Modal não reconhecido.",
              flags: MessageFlags.Ephemeral,
            });
        }
      } catch (error) {
        console.error(`Erro ao processar o modal ${customId}:`, error);
        await interaction.reply({
          content: "Ocorreu um erro ao processar o formulário.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
