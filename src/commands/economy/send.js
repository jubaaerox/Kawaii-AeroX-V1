const { EmbedBuilder } = require('discord.js');
const { getEconomyUser, addToBalance, removeFromBalance } = require('../../utils/database');

module.exports = {
  name: 'send',
  aliases: ['pay', 'give', 'transfer'],
  async execute(message, args) {
    const target = message.mentions.users.first();
    
    if (!target) {
      return message.reply('Please mention someone to send money to. Usage: `l!send @user amount`');
    }
    
    if (target.id === message.author.id) {
      return message.reply('You cannot send money to yourself!');
    }
    
    if (target.bot) {
      return message.reply('You cannot send money to bots!');
    }
    
    const amount = parseInt(args[1]);
    
    if (!amount || amount < 1) {
      return message.reply('Please specify a valid amount. Usage: `l!send @user amount`');
    }
    
    const sender = getEconomyUser(message.author.id);
    
    if (sender.balance < amount) {
      return message.reply(`You don't have enough money! Your balance: **$${sender.balance.toLocaleString()}**`);
    }
    
    removeFromBalance(message.author.id, amount);
    addToBalance(target.id, amount);
    
    const embed = new EmbedBuilder()
      .setColor('#4ecdc4')
      .setTitle('💸 Money Sent!')
      .setDescription(`**${message.author.username}** sent **$${amount.toLocaleString()}** to **${target.username}**`)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  }
};
