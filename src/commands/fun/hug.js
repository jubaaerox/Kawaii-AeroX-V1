const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../../../config');

module.exports = {
  name: 'hug',
  async execute(message, args) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('Please mention someone to hug!');
    
    try {
      const response = await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${config.GIPHY_API_KEY}&tag=anime+hug&rating=g`);
      const gifUrl = response.data.data.images.original.url;

      const embed = new EmbedBuilder()
        .setColor('#ff69b4')
        .setDescription(`🤗 **${message.author.username}** gave **${target.username}** a big hug!`)
        .setImage(gifUrl);
      
      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Giphy API Error:', error);
      message.reply('Could not fetch a hug GIF right now, but here is a big hug anyway! 🤗');
    }
  }
};