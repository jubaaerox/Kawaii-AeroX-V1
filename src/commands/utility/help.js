const { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');
const config = require('../../../config');

module.exports = {
  name: 'help',
  async execute(message, args) {
    const helpEmbed = new EmbedBuilder()
      .setColor('#ff4500')
      .setAuthor({ name: 'Help Menu', iconURL: 'https://i.imgur.com/vHqY7Gv.png' }) // Placeholder for the orange A logo
      .setDescription(`
**╭── ℹ️ Statistics**
**┝ Prefix Commands: 29**
**┝ Slash Commands: 0**
**╰ Categories: 5**

**Main Modules:**
**📜 » [Moderation](https://discord.gg/aerox)**
**🛠️ » [Utility](https://discord.gg/aerox)**
**💰 » [Economy](https://discord.gg/aerox)**
**⭐ » [Leveling](https://discord.gg/aerox)**
**🎮 » [Fun](https://discord.gg/aerox)**
`)
      .setTimestamp();

    const select = new StringSelectMenuBuilder()
      .setCustomId('help_category')
      .setPlaceholder('Select a category')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Moderation')
          .setDescription('View moderation commands')
          .setEmoji('⚙️')
          .setValue('moderation'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Utility')
          .setDescription('View utility commands')
          .setEmoji('🛠️')
          .setValue('utility'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Economy')
          .setDescription('View economy commands')
          .setEmoji('💰')
          .setValue('economy'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Leveling')
          .setDescription('View leveling commands')
          .setEmoji('⭐')
          .setValue('leveling'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Fun')
          .setDescription('View fun commands')
          .setEmoji('🎮')
          .setValue('fun')
      );

    const row = new ActionRowBuilder().addComponents(select);

    const response = await message.reply({
      embeds: [helpEmbed],
      components: [row]
    });

    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 60000
    });

    collector.on('collect', async i => {
      if (i.user.id !== message.author.id) {
        return i.reply({ content: 'This menu is not for you!', ephemeral: true });
      }

      let categoryEmbed = new EmbedBuilder().setColor('#ff4500');

      if (i.values[0] === 'moderation') {
        categoryEmbed
          .setTitle('⚙️ Moderation Commands')
          .setDescription('`ban`, `unban`, `kick`, `timeout`, `voicemute`, `voiceunmute`, `voicemove`');
      } else if (i.values[0] === 'utility') {
        categoryEmbed
          .setTitle('🛠️ Utility Commands')
          .setDescription('`ping`, `help`, `setupwelcome`');
      } else if (i.values[0] === 'economy') {
        categoryEmbed
          .setTitle('💰 Economy Commands')
          .setDescription('`cash`, `daily`, `profile`, `slots`, `zoo`, `coinflip`, `hunt`, `send`, `teamadd`, `rank`');
      } else if (i.values[0] === 'leveling') {
        categoryEmbed
          .setTitle('⭐ Leveling Commands')
          .setDescription('`rank`, `leaderboard`, `addxp`, `setlevel`');
      } else if (i.values[0] === 'fun') {
        categoryEmbed
          .setTitle('🎮 Fun Commands')
          .setDescription('`hug`, `kiss`, `slap`, `gif`, `photo`, `love`, `anime`, `boy`, `woman`');
      }

      await i.update({ embeds: [categoryEmbed], components: [row] });
    });
  },
};