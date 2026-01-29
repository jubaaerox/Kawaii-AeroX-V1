const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const dashboard = require('./dashboard');
const {
  printKawaiiHeader,
  printBotReady,
  printLoading,
  printSuccess,
  printError,
  printSystemReady,
} = require('./utils/startup');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping
  ]
});

module.exports = { client };

printKawaiiHeader();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

printLoading(`${eventFiles.length} event handlers`);

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
  printSuccess(`Loaded event: ${event.name}`);
}

client.once('ready', () => {
  printBotReady(client.user.tag, client.guilds.cache.size);
  printSystemReady();
});

dashboard(client);

client.login(config.TOKEN);

/*
: ! juba !
    + Discord: x.juba
    + Community: https://discord.gg/8wfT8SfB5Z  (Kawaii Development )
    + for any queries reach out Community or DM me.
*/
