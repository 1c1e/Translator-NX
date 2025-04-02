require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();

function loadFiles(dir, callback) {
  const filesPath = path.join(__dirname, dir);
  const files = fs.readdirSync(filesPath).filter((file) => file.endsWith('.js'));
  for (const file of files) {
    const filePath = path.join(filesPath, file);
    const item = require(filePath);
    callback(item, filePath);
  }
}

loadFiles('commands', (command) => {
  if (command.data && command.execute) client.commands.set(command.data.name, command);
});

loadFiles('events', (event) => {
  const handler = (...args) => event.execute(...args);
  event.once ? client.once(event.name, handler) : client.on(event.name, handler);
});

process.on('unhandledRejection', (error) => console.error('Unhandled promise rejection:', error));
process.on('uncaughtException', (error) => console.error('Uncaught exception:', error));

client.login(process.env.DISCORD_TOKEN);
