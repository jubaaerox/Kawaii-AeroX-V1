const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../../../config');

module.exports = {
  name: 'anime',
  async execute(message, args) {
    try {
      const response = await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${config.GIPHY_API_KEY}&tag=anime&rating=g`);
      const gifUrl = response.data.data.images.original.url;

      const embed = new EmbedBuilder()
        .setColor('#ff69b4')
        .setTitle('Random Anime GIF')
        .setImage(gifUrl);
      
      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Giphy API Error:', error);
      
    }
  }
};