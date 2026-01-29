const { EmbedBuilder } = require('discord.js');
const { getEconomyUser, getLevelUser, db } = require('../../utils/database');

module.exports = {
  name: 'profile',
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const econUser = getEconomyUser(target.id);
    const levelUser = getLevelUser(target.id);
    
    // Get leaderboard position
    const allUsers = db.prepare('SELECT user_id FROM user_levels ORDER BY level DESC, xp DESC').all();
    const position = allUsers.findIndex(u => u.user_id === target.id) + 1;
    
    // Calculate progress percentage
    const xpNeeded = levelUser.level * 1000;
    const progress = Math.min((levelUser.xp / xpNeeded) * 100, 100);
    const filledBlocks = Math.floor(progress / 10);
    const progressBar = '⬜'.repeat(filledBlocks) + '⬛'.repeat(10 - filledBlocks);

    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setAuthor({ name: target.username, iconURL: target.displayAvatarURL({ dynamic: true }) })
      .setDescription(`An Kawaii User\n\n**Level** \`${levelUser.level}\`  **Rank:** \`#${position}\`  **XP:** \`${levelUser.xp.toLocaleString()}/${xpNeeded.toLocaleString()}\`\n${progressBar}\n\n**Cookies**\n\`+1\`\n\n**About me**\nI'm just a plain human.`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 256 }))
      .setImage('https://cdn.discordapp.com/attachments/1206188212154929202/1466103361769046037/chinese-new-year-theme-anime-background-bright-colors-349614360.jpg?ex=697b86a8&is=697a3528&hm=e76a771169c39f218ae2e8d7f66736b29db755217b0b971df90cd912e07473a9&')
      .addFields(
        { 
          name: '💰 Economy', 
          value: `**Cash:** \`$${(econUser.balance || 0).toLocaleString()}\`\n**Bank:** \`$${(econUser.bank || 0).toLocaleString()}\``, 
          inline: true 
        }
      )
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  }
};