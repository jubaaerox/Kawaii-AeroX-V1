const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { updateGuildSettings } = require('../../utils/database');
const config = require('../../../config');

module.exports = {
  name: 'setupwelcome',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('You need Administrator permissions to use this command.');
    }

    const subCommand = args[0]?.toLowerCase();

    if (subCommand === 'message') {
      const welcomeMessage = args.slice(1).join(' ');
      if (!welcomeMessage) {
        return message.reply(`Please provide a message. Example: \`${config.PREFIX}setupwelcome message Welcome to the server, {user}!\``);
      }

      try {
        updateGuildSettings(message.guild.id, {
          welcome_message: welcomeMessage
        });
        return message.reply('✅ Welcome message updated successfully!');
      } catch (err) {
        console.error(err);
        return message.reply('There was an error updating the welcome message.');
      }
    }

    const channel = message.mentions.channels.first() || message.channel;
    
    try {
      updateGuildSettings(message.guild.id, {
        welcome_enabled: 1,
        welcome_channel_id: channel.id,
        welcome_image_url: 'https://i.imgur.com/eG9Vz5Y.png' // Default welcome banner from screenshot
      });

      message.reply(`✅ Welcome system enabled in ${channel}. I will now greet new members with a beautiful card!\n\n**Tip:** Use \`${config.PREFIX}setupwelcome message <text>\` to customize the description. Use \`{user}\` to mention the member and \`{guild}\` for the server name.`);
    } catch (err) {
      console.error(err);
      message.reply('There was an error updating settings.');
    }
  },
};