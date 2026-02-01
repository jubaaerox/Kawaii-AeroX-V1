const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const settings = getGuildSettings(member.guild.id);
    
    // Original logging logic
    if (settings.join_channel_id) {
      const logChannel = member.guild.channels.cache.get(settings.join_channel_id);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setAuthor({ name: 'Member Joined', iconURL: member.user.displayAvatarURL() })
          .setDescription(`${member} (${member.user.tag}) joined the server.`)
          .setFooter({ text: `ID: ${member.id}` })
          .setTimestamp();
        logChannel.send({ embeds: [logEmbed] }).catch(() => {});
      }
    }

    // New Welcome Message logic (based on screenshot)
    if (settings.welcome_enabled && settings.welcome_channel_id) {
      const welcomeChannel = member.guild.channels.cache.get(settings.welcome_channel_id);
      if (welcomeChannel) {
        let description = settings.welcome_message || `
> [**Anc**](https://discord.gg/g7u4ZHTyB9)
> [**Free Codez**](https://discord.gg/g7u4ZHTyB9)
> [**Chat**](https://discord.gg/g7u4ZHTyB9)

**Now we have ${member.guild.memberCount} members**
`;

        // Simple placeholders
        description = description
          .replace(/{user}/g, `<@${member.id}>`)
          .replace(/{guild}/g, member.guild.name)
          .replace(/{count}/g, member.guild.memberCount);

        const embed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
          .setDescription(description)
          .setImage(settings.welcome_image_url || 'https://i.imgur.com/eG9Vz5Y.png');

        welcomeChannel.send({
          content: `<@${member.id}>`,
          embeds: [embed]
        }).catch(err => console.error('Error sending welcome message:', err));
      }
    }
  }
};
