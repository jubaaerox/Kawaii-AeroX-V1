const { ActivityType } = require('discord.js');
const config = require('../../config');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✓ Bot logged in as ${client.user.tag}`);
    console.log(`✓ Monitoring ${client.guilds.cache.size} guild(s)`);
    console.log(`✓ Dashboard running on http://localhost:${config.DASHBOARD_PORT}`);
    
    if (config.PRESENCE.ENABLED) {
      const updatePresence = () => {
        const servers = client.guilds.cache.size;
        const members = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        
        const message = config.PRESENCE.MESSAGE
          .replace('{servers}', servers)
          .replace('{members}', members);
        
        const activityTypes = {
          'PLAYING': ActivityType.Playing,
          'LISTENING': ActivityType.Listening,
          'WATCHING': ActivityType.Watching,
          'COMPETING': ActivityType.Competing
        };
        
        client.user.setPresence({
          activities: [{
            name: message,
            type: activityTypes[config.PRESENCE.TYPE] || ActivityType.Playing
          }],
          status: config.PRESENCE.STATUS
        });
      };
      
      updatePresence();
      setInterval(updatePresence, 60000);
      console.log(`✓ Presence enabled: ${config.PRESENCE.TYPE} "${config.PRESENCE.MESSAGE}"`);
    }
  }
};

/*
: ! Aegis !
    + Discord: itsfizys
    + Portfolio: https://itsfiizys.com
    + Community: https://discord.gg/8wfT8SfB5Z  (Kawaii Development )
    + for any queries reach out Community or DM me.
*/
