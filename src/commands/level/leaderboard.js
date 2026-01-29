const { EmbedBuilder } = require('discord.js');
const { db } = require('../../utils/database');

module.exports = {
  name: 'leaderboard',
  aliases: ['lvllb', 'top'],
  description: 'View the level leaderboard',
  async execute(message, args) {
    const topUsers = db.prepare('SELECT user_id, level, xp FROM user_levels ORDER BY level DESC, xp DESC LIMIT 10').all();
    
    if (topUsers.length === 0) {
      return message.reply('The leaderboard is currently empty!');
    }

    let description = '';
    for (let i = 0; i < topUsers.length; i++) {
      const user = topUsers[i];
      try {
        const discordUser = await message.client.users.fetch(user.user_id);
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        description += `${medal} **${discordUser.username}** — Lvl ${user.level} (${user.xp.toLocaleString()} XP)\n`;
      } catch {
        description += `${i + 1}. **Unknown User** — Lvl ${user.level} (${user.xp.toLocaleString()} XP)\n`;
      }
    }

    const embed = new EmbedBuilder()
      .setColor('#f1c40f')
      .setTitle('🏆 Level Leaderboard')
      .setDescription(description)
      .setTimestamp()
      .setFooter({ text: 'Top 10 highest level players' });

    message.reply({ embeds: [embed] });
  }
};