const { EmbedBuilder } = require('discord.js');
const { getUserZoo } = require('../../utils/database');

const rarityColors = {
  common: '⚪',
  uncommon: '🟢',
  rare: '🔵',
  epic: '🟣',
  legendary: '🟡'
};

module.exports = {
  name: 'zoo',
  aliases: ['animals', 'collection'],
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const zoo = getUserZoo(target.id);
    
    if (zoo.length === 0) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle(`🦁 ${target.username}'s Zoo`)
        .setDescription('No animals collected yet! Use `l!hunt` to catch some.')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const animalCounts = {};
    zoo.forEach(animal => {
      const key = `${animal.animal_emoji} ${animal.animal_name}`;
      if (!animalCounts[key]) {
        animalCounts[key] = { count: 0, rarity: animal.rarity, power: animal.power };
      }
      animalCounts[key].count++;
    });
    
    const sortedAnimals = Object.entries(animalCounts)
      .sort((a, b) => {
        const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
        return rarityOrder[b[1].rarity] - rarityOrder[a[1].rarity];
      });
    
    const page = parseInt(args[0]) || 1;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(sortedAnimals.length / itemsPerPage);
    const startIdx = (page - 1) * itemsPerPage;
    const pageAnimals = sortedAnimals.slice(startIdx, startIdx + itemsPerPage);
    
    const totalPower = zoo.reduce((sum, a) => sum + a.power, 0);
    
    let description = '';
    pageAnimals.forEach(([name, data]) => {
      description += `${rarityColors[data.rarity]} ${name} x${data.count} (⚔️ ${data.power * data.count})\n`;
    });
    
    const embed = new EmbedBuilder()
      .setColor('#4ecdc4')
      .setTitle(`🦁 ${target.username}'s Zoo`)
      .setDescription(description || 'No animals on this page.')
      .addFields(
        { name: '📊 Total Animals', value: `${zoo.length}`, inline: true },
        { name: '⚔️ Total Power', value: `${totalPower}`, inline: true }
      )
      .setFooter({ text: `Page ${page}/${totalPages} | Use l!zoo <page> to navigate` })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  }
};
