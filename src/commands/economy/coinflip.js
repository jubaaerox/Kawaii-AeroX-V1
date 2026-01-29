const { EmbedBuilder } = require('discord.js');
const { getEconomyUser, addToBalance, removeFromBalance } = require('../../utils/database');

module.exports = {
  name: 'coinflip',
  aliases: ['cf', 'flip'],
  async execute(message, args) {
    const choice = args[0]?.toLowerCase();
    const amount = parseInt(args[1]);
    
    if (!choice || !['heads', 'tails', 'h', 't'].includes(choice)) {
      return message.reply('Usage: `l!coinflip <heads/tails> <amount>`');
    }
    
    if (!amount || amount < 10) {
      return message.reply('Minimum bet is **$10**!');
    }
    
    const user = getEconomyUser(message.author.id);
    
    if (user.balance < amount) {
      return message.reply(`You don't have enough money! Your balance: **$${user.balance.toLocaleString()}**`);
    }
    
    const userChoice = choice === 'h' ? 'heads' : choice === 't' ? 'tails' : choice;
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = userChoice === result;
    
    if (won) {
      addToBalance(message.author.id, amount);
    } else {
      removeFromBalance(message.author.id, amount);
    }
    
    const embed = new EmbedBuilder()
      .setColor(won ? '#4ecdc4' : '#ff6b6b')
      .setTitle(`🪙 Coinflip - ${result.toUpperCase()}!`)
      .setDescription(
        won 
          ? `🎉 You won **$${amount.toLocaleString()}**!` 
          : `😢 You lost **$${amount.toLocaleString()}**...`
      )
      .addFields(
        { name: 'Your Choice', value: userChoice, inline: true },
        { name: 'Result', value: result, inline: true }
      )
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  }
};
