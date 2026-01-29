const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'photo',
  async execute(message, args) {
    const photos = [
      `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
      `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
      `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`
    ];
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];

    const embed = new EmbedBuilder()
      .setColor('#32cd32')
      .setTitle('Random Photo')
      .setImage(randomPhoto);
    
    message.reply({ embeds: [embed] });
  }
};