const { EmbedBuilder } = require('discord.js');
const { getEconomyUser, updateEconomyUser, addToBalance, addAnimalToZoo, getUserZoo, getTeamMembers } = require('../../utils/database');

const animals = [
  { name: 'Rabbit', emoji: '🐰', rarity: 'common', power: 1, value: 50 },
  { name: 'Deer', emoji: '🦌', rarity: 'common', power: 2, value: 75 },
  { name: 'Fox', emoji: '🦊', rarity: 'common', power: 2, value: 80 },
  { name: 'Boar', emoji: '🐗', rarity: 'uncommon', power: 3, value: 150 },
  { name: 'Wolf', emoji: '🐺', rarity: 'uncommon', power: 4, value: 200 },
  { name: 'Bear', emoji: '🐻', rarity: 'rare', power: 6, value: 400 },
  { name: 'Tiger', emoji: '🐅', rarity: 'rare', power: 8, value: 600 },
  { name: 'Lion', emoji: '🦁', rarity: 'epic', power: 10, value: 1000 },
  { name: 'Elephant', emoji: '🐘', rarity: 'epic', power: 12, value: 1500 },
  { name: 'Dragon', emoji: '🐉', rarity: 'legendary', power: 25, value: 5000 },
  { name: 'Unicorn', emoji: '🦄', rarity: 'legendary', power: 20, value: 4000 },
  { name: 'Phoenix', emoji: '🔥', rarity: 'legendary', power: 30, value: 7500 }
];

const rarityChances = {
  common: 0.50,
  uncommon: 0.30,
  rare: 0.15,
  epic: 0.04,
  legendary: 0.01
};

const rarityColors = {
  common: '#9e9e9e',
  uncommon: '#4caf50',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#ffd700'
};

module.exports = {
  name: 'hunt',
  async execute(message) {
    const userId = message.author.id;
    const user = getEconomyUser(userId);
    
    const now = new Date();
    const lastHunt = user.last_hunt ? new Date(user.last_hunt) : null;
    
    if (lastHunt) {
      const timeDiff = now - lastHunt;
      const minutesDiff = timeDiff / (1000 * 60);
      
      if (minutesDiff < 5) {
        const remaining = 5 - minutesDiff;
        const minutes = Math.floor(remaining);
        const seconds = Math.floor((remaining - minutes) * 60);
        
        const embed = new EmbedBuilder()
          .setColor('#ff6b6b')
          .setTitle('🏹 Hunt Cooldown')
          .setDescription(`You're tired from hunting!\nWait **${minutes}m ${seconds}s** before hunting again.`)
          .setTimestamp();
        
        return message.reply({ embeds: [embed] });
      }
    }
    
    const zoo = getUserZoo(userId);
    const team = getTeamMembers(userId);
    const huntPower = zoo.reduce((sum, a) => sum + a.power, 0) + 1;
    const teamBonus = team.length * 0.1;
    
    const roll = Math.random();
    let selectedRarity;
    let cumulative = 0;
    
    const adjustedChances = { ...rarityChances };
    adjustedChances.rare += Math.min(huntPower * 0.005, 0.10);
    adjustedChances.epic += Math.min(huntPower * 0.002, 0.05);
    adjustedChances.legendary += Math.min(huntPower * 0.001 + teamBonus * 0.01, 0.03);
    
    for (const [rarity, chance] of Object.entries(adjustedChances)) {
      cumulative += chance;
      if (roll <= cumulative) {
        selectedRarity = rarity;
        break;
      }
    }
    
    if (!selectedRarity) selectedRarity = 'common';
    
    const rarityAnimals = animals.filter(a => a.rarity === selectedRarity);
    const caughtAnimal = rarityAnimals[Math.floor(Math.random() * rarityAnimals.length)];
    
    addAnimalToZoo(userId, caughtAnimal);
    addToBalance(userId, caughtAnimal.value);
    updateEconomyUser(userId, { last_hunt: now.toISOString() });
    
    if (team.length > 0) {
      const teamShare = Math.floor(caughtAnimal.value * 0.1);
      team.forEach(t => addToBalance(t.member_id, teamShare));
    }
    
    const embed = new EmbedBuilder()
      .setColor(rarityColors[caughtAnimal.rarity])
      .setTitle('🏹 Hunt Successful!')
      .setDescription(`You caught a **${caughtAnimal.emoji} ${caughtAnimal.name}**!`)
      .addFields(
        { name: 'Rarity', value: caughtAnimal.rarity.toUpperCase(), inline: true },
        { name: 'Power', value: `+${caughtAnimal.power}`, inline: true },
        { name: 'Value', value: `$${caughtAnimal.value.toLocaleString()}`, inline: true }
      )
      .setFooter({ text: `Hunt Power: ${huntPower} | Team: ${team.length} members` })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  }
};
