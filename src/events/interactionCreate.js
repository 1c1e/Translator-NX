const { Events, MessageFlags } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand() || !interaction.client.commands.get(interaction.commandName)) return;

    const command = interaction.client.commands.get(interaction.commandName);

    await command.execute(interaction).catch(async () => {
      const errorMessage = 'There was an error while executing this command!';
      const replyMethod = interaction.replied || interaction.deferred ? 'followUp' : 'reply';

      await interaction[replyMethod]({ content: errorMessage, flags: MessageFlags.Ephemeral });
    });
  },
};
