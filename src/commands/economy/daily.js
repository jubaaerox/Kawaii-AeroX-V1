const { EmbedBuilder } = require('discord.js');
const { getEconomyUser, updateEconomyUser, addToBalance } = require('../../utils/database');

module.exports = {
  name: 'daily',
  async execute(message) {
    const userId = message.author.id;
    const user = getEconomyUser(userId);
    
    const now = new Date();
    const lastDaily = user.last_daily ? new Date(user.last_daily) : null;
    
    if (lastDaily) {
      const timeDiff = now - lastDaily;
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        const remaining = 24 - hoursDiff;
        const hours = Math.floor(remaining);
        const minutes = Math.floor((remaining - hours) * 60);
        
        const embed = new EmbedBuilder()
          .setColor('#ff6b6b')
          .setTitle('⏰ Daily Reward')
          .setDescription(`You already claimed your daily reward!\nCome back in **${hours}h ${minutes}m**`)
          .setTimestamp();
        
        return message.reply({ embeds: [embed] });
      }
    }
    
    let streak = user.daily_streak || 0;
    if (lastDaily) {
      const daysDiff = (now - lastDaily) / (1000 * 60 * 60 * 24);
      if (daysDiff < 48) {
        streak += 1;
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }
    
    const baseReward = 500;
    const streakBonus = Math.min(streak * 50, 500);
    const totalReward = baseReward + streakBonus;
    
    addToBalance(userId, totalReward);
    updateEconomyUser(userId, { 
      last_daily: now.toISOString(),
      daily_streak: streak
    });
    
    const embed = new EmbedBuilder()
      .setColor('#4ecdc4')
      .setTitle('💰 Daily Reward Claimed!')
      .setDescription(`You received **$${totalReward.toLocaleString()}**!`)
      .addFields(
        { name: '🔥 Streak', value: `${streak} day${streak > 1 ? 's' : ''}`, inline: true },
        { name: '💵 Streak Bonus', value: `+$${streakBonus}`, inline: true }
      )
      .setFooter({ text: 'Come back tomorrow for more rewards!' })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  }
};
