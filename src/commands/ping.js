const { SlashCommandBuilder, bold } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Ping the bot'),
  async execute(interaction) {
    await interaction.deferReply();

    const initial = await interaction.fetchReply();
    const roundtripLatency = initial.createdTimestamp - interaction.createdTimestamp;
    const websocketHeartbeat = interaction.client.ws.ping;

    await interaction.editReply(
      `${bold('WebSocket Latency')} ${websocketHeartbeat}ms\n${bold('Roundtrip Latency')} ${roundtripLatency}ms`,
    );
  },
};
