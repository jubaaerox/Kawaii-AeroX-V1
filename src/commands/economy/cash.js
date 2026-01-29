const { EmbedBuilder } = require('discord.js');
const { getEconomyUser } = require('../../utils/database');

module.exports = {
  name: 'cash',
  aliases: ['balance', 'bal', 'money'],
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = getEconomyUser(target.id);
    
    const embed = new EmbedBuilder()
      .setColor('#ffd93d')
      .setTitle(`💵 ${target.username}'s Balance`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '👛 Wallet', value: `$${(user.balance || 0).toLocaleString()}`, inline: true },
        { name: '🏦 Bank', value: `$${(user.bank || 0).toLocaleString()}`, inline: true },
        { name: '💰 Total', value: `$${((user.balance || 0) + (user.bank || 0)).toLocaleString()}`, inline: true }
      )
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  }
};
