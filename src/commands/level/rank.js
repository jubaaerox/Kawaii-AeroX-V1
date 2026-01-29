const { EmbedBuilder } = require('discord.js');
const { getLevelUser, db } = require('../../utils/database');

module.exports = {
  name: 'level',
  description: 'Check your or someone else\'s level rank',
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = getLevelUser(target.id);
    
    // Calculate progress percentage
    const xpNeeded = user.level * 1000;
    const progress = Math.min((user.xp / xpNeeded) * 100, 100);
    const progressBar = '🟩'.repeat(Math.floor(progress / 10)) + '⬜'.repeat(10 - Math.floor(progress / 10));

    // Get leaderboard position
    const allUsers = db.prepare('SELECT user_id FROM user_levels ORDER BY level DESC, xp DESC').all();
    const position = allUsers.findIndex(u => u.user_id === target.id) + 1;

    const embed = new EmbedBuilder()
      .setColor('#3498db')
      .setTitle(`⭐ ${target.username}'s Rank`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '📊 Level', value: `${user.level}`, inline: true },
        { name: '✨ Experience', value: `${user.xp.toLocaleString()} / ${xpNeeded.toLocaleString()} XP`, inline: true },
        { name: '🏆 Global Position', value: `#${position}`, inline: true },
        { name: '📈 Progress', value: `${progressBar} ${progress.toFixed(1)}%`, inline: false }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};