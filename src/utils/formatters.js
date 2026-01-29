const { 
  ContainerBuilder, 
  TextDisplayBuilder, 
  SeparatorBuilder, 
  SeparatorSpacingSize, 
  MediaGalleryBuilder, 
  MediaGalleryItemBuilder,
  SectionBuilder,
  ThumbnailBuilder
} = require('discord.js');

const formatUser = (user) => {
  return `[${user.username}](https://discord.com/users/${user.id})`;
};

const formatRole = (role) => {
  return `**${role.name}**`;
};

const formatChannel = (channel) => {
  return `<#${channel.id}>`;
};

const createLoggingContainer = (title, content, options = {}) => {
  const container = new ContainerBuilder()
    .setAccentColor(options.accentColor || 0xFFFFFF);

  if (options.thumbnailUrl) {
    const section = new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(title),
        new TextDisplayBuilder().setContent(content)
      )
      .setThumbnailAccessory(
        new ThumbnailBuilder()
          .setURL(options.thumbnailUrl)
          .setDescription(options.thumbnailDescription || 'Avatar')
      );
    
    container.addSectionComponents(section);
  } else {
    container
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(title)
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(content)
      );
  }

  return container;
};

const createLoggingContainerWithGallery = (title, content, imageUrl, imageDescription = 'Image') => {
  const container = new ContainerBuilder()
    .setAccentColor(0xFFFFFF)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(title)
    )
    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small)
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(content)
    );

  if (imageUrl) {
    const gallery = new MediaGalleryBuilder()
      .addItems(
        new MediaGalleryItemBuilder()
          .setURL(imageUrl)
          .setDescription(imageDescription)
      );
    
    container.addMediaGalleryComponents(gallery);
  }

  return container;
};

const createAvatarGallery = (user) => {
  const avatarUrl = user.displayAvatarURL({ extension: 'png', size: 1024 });
  
  const item = new MediaGalleryItemBuilder()
    .setURL(avatarUrl)
    .setDescription(`${user.username}'s Avatar`);
  
  return new MediaGalleryBuilder().addItems(item);
};

module.exports = {
  formatUser,
  formatRole,
  formatChannel,
  createLoggingContainer,
  createLoggingContainerWithGallery,
  createAvatarGallery
};

/*
: ! Aegis !
    + Discord: itsfizys
    + Portfolio: https://itsfiizys.com
    + Community: https://discord.gg/8wfT8SfB5Z  (Kawaii Development )
    + for any queries reach out Community or DM me.
*/
