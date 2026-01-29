const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'love',
  async execute(message, args) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('Please mention someone to calculate love!');
    
    const lovePercent = Math.floor(Math.random() * 101);
    let message_text = '';
    if (lovePercent > 80) message_text = 'Perfect match! ❤️';
    else if (lovePercent > 50) message_text = 'Looking good! 💖';
    else message_text = 'Could be better... 💔';

    const embed = new EmbedBuilder()
      .setColor('#ff1493')
      .setTitle('❤️ Love Calculator')
      .setDescription(`**${message.author.username}** ❤️ **${target.username}**\n**Love Percentage:** ${lovePercent}%\n\n${message_text}`);
    
    message.reply({ embeds: [embed] });
  }
};