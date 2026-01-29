const { EmbedBuilder } = require('discord.js');
const { getTeamMembers, addTeamMember, removeTeamMember } = require('../../utils/database');

module.exports = {
  name: 'teamadd',
  aliases: ['team', 'huntteam'],
  async execute(message, args) {
    const subCommand = args[0]?.toLowerCase();
    const target = message.mentions.users.first();
    const userId = message.author.id;
    
    if (subCommand === 'list' || !subCommand) {
      const team = getTeamMembers(userId);
      
      if (team.length === 0) {
        const embed = new EmbedBuilder()
          .setColor('#ff6b6b')
          .setTitle('👥 Your Hunt Team')
          .setDescription('You have no team members!\nUse `l!teamadd @user` to add someone.')
          .setTimestamp();
        
        return message.reply({ embeds: [embed] });
      }
      
      let memberList = '';
      for (const member of team) {
        try {
          const user = await message.client.users.fetch(member.member_id);
          memberList += `• ${user.username}\n`;
        } catch {
          memberList += `• Unknown User (${member.member_id})\n`;
        }
      }
      
      const embed = new EmbedBuilder()
        .setColor('#4ecdc4')
        .setTitle('👥 Your Hunt Team')
        .setDescription(memberList)
        .addFields({ name: 'Bonus', value: `+${team.length * 10}% legendary chance`, inline: true })
        .setFooter({ text: 'Team members get 10% of your hunt earnings!' })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    if (subCommand === 'remove') {
      if (!target) {
        return message.reply('Please mention a user to remove. Usage: `l!teamadd remove @user`');
      }
      
      removeTeamMember(userId, target.id);
      
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('👥 Team Member Removed')
        .setDescription(`**${target.username}** has been removed from your hunt team.`)
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    if (!target) {
      return message.reply('Usage:\n`l!teamadd @user` - Add to team\n`l!teamadd remove @user` - Remove from team\n`l!teamadd list` - View team');
    }
    
    if (target.id === userId) {
      return message.reply('You cannot add yourself to your team!');
    }
    
    if (target.bot) {
      return message.reply('You cannot add bots to your team!');
    }
    
    const team = getTeamMembers(userId);
    if (team.length >= 5) {
      return message.reply('Your team is full! (Max: 5 members)');
    }
    
    const success = addTeamMember(userId, target.id);
    
    if (!success) {
      return message.reply(`**${target.username}** is already on your team!`);
    }
    
    const embed = new EmbedBuilder()
      .setColor('#4ecdc4')
      .setTitle('👥 Team Member Added!')
      .setDescription(`**${target.username}** has joined your hunt team!`)
      .addFields(
        { name: 'Team Size', value: `${team.length + 1}/5`, inline: true },
        { name: 'Bonus', value: `+${(team.length + 1) * 10}% legendary chance`, inline: true }
      )
      .setFooter({ text: 'Team members get 10% of your hunt earnings!' })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  }
};
