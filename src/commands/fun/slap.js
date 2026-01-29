const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../../../config');

module.exports = {
  name: 'slap',
  async execute(message, args) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('Please mention someone to slap!');
    
    try {
      const response = await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${config.GIPHY_API_KEY}&tag=anime+slap&rating=g`);
      const gifUrl = response.data.data.images.original.url;

      const embed = new EmbedBuilder()
        .setColor('#ff4500')
        .setDescription(`🖐️ **${message.author.username}** slapped **${target.username}**!`)
        .setImage(gifUrl);
      
      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Giphy API Error:', error);
      message.reply('Could not fetch a slap GIF right now, but Consider yourself slapped! 🖐️');
    }
  }
};