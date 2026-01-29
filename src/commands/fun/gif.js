const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../../../config');

module.exports = {
  name: 'gif',
  async execute(message, args) {
    const query = args.join(' ') || 'random';
    try {
      const response = await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${config.GIPHY_API_KEY}&tag=${encodeURIComponent(query)}&rating=g`);
      const gifUrl = response.data.data.images.original.url;

      const embed = new EmbedBuilder()
        .setColor('#00bfff')
        .setTitle(`Random GIF: ${query}`)
        .setImage(gifUrl);
      
      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Giphy API Error:', error);
      message.reply('Could not fetch a GIF right now. Please try again later!');
    }
  }
};