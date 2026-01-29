const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { updateLevelUser } = require('../../utils/database');

module.exports = {
  name: 'setlevel',
  description: 'Set a user\'s level (Admin only)',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('❌ You don\'t have permission to use this command!');
    }

    const target = message.mentions.users.first();
    const level = parseInt(args[1]);

    if (!target || isNaN(level)) {
      return message.reply('❌ Usage: `!setlevel @user <level>`');
    }

    const xp = (level - 1) * 1000;
    updateLevelUser(target.id, { xp: xp, level: level });

    const embed = new EmbedBuilder()
      .setColor('#e67e22')
      .setTitle('📊 Level Updated')
      .setDescription(`Set ${target.username}'s level to **${level}**.`)
      .addFields(
        { name: 'New XP', value: `${xp.toLocaleString()}`, inline: true }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};