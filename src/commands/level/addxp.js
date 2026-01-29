const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getLevelUser, updateLevelUser } = require('../../utils/database');

module.exports = {
  name: 'addxp',
  description: 'Add XP to a user (Admin only)',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('❌ You don\'t have permission to use this command!');
    }

    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target || isNaN(amount)) {
      return message.reply('❌ Usage: `!addxp @user <amount>`');
    }

    const user = getLevelUser(target.id);
    const newXp = user.xp + amount;
    
    // Simple level calculation (can be improved)
    let newLevel = user.level;
    while (newXp >= newLevel * 1000) {
      newLevel++;
    }

    updateLevelUser(target.id, { xp: newXp, level: newLevel });

    const embed = new EmbedBuilder()
      .setColor('#2ecc71')
      .setTitle('✨ XP Added')
      .setDescription(`Added **${amount.toLocaleString()} XP** to ${target.username}.`)
      .addFields(
        { name: 'New Total', value: `${newXp.toLocaleString()} XP`, inline: true },
        { name: 'Current Level', value: `${newLevel}`, inline: true }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};