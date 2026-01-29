const { EmbedBuilder } = require('discord.js');
const { getEconomyUser, addToBalance, removeFromBalance } = require('../../utils/database');

const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '🔔'];
const multipliers = {
  '7️⃣': 10,
  '💎': 7,
  '🔔': 5,
  '🍇': 4,
  '🍊': 3,
  '🍋': 2,
  '🍒': 1.5
};

module.exports = {
  name: 'slots',
  aliases: ['slot', 'spin'],
  async execute(message, args) {
    const amount = parseInt(args[0]);
    
    if (!amount || amount < 10) {
      return message.reply('Usage: `l!slots <amount>` (Minimum: $10)');
    }
    
    const user = getEconomyUser(message.author.id);
    
    if (user.balance < amount) {
      return message.reply(`You don't have enough money! Your balance: **$${user.balance.toLocaleString()}**`);
    }
    
    const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot3 = symbols[Math.floor(Math.random() * symbols.length)];
    
    let winAmount = 0;
    let resultText = '';
    
    if (slot1 === slot2 && slot2 === slot3) {
      const multiplier = multipliers[slot1];
      winAmount = Math.floor(amount * multiplier);
      resultText = `🎉 JACKPOT! You won **$${winAmount.toLocaleString()}**!`;
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      winAmount = Math.floor(amount * 0.5);
      resultText = `✨ Two of a kind! You won **$${winAmount.toLocaleString()}**!`;
    } else {
      resultText = `😢 You lost **$${amount.toLocaleString()}**...`;
    }
    
    if (winAmount > 0) {
      addToBalance(message.author.id, winAmount - amount);
    } else {
      removeFromBalance(message.author.id, amount);
    }
    
    const embed = new EmbedBuilder()
      .setColor(winAmount > 0 ? '#4ecdc4' : '#ff6b6b')
      .setTitle('🎰 Slot Machine')
      .setDescription(`\n▶️ | ${slot1} | ${slot2} | ${slot3} | ◀️\n\n${resultText}`)
      .setFooter({ text: `Bet: $${amount.toLocaleString()}` })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  }
};
