module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✓ Bot logged in as ${client.user.tag}`);
    console.log(`✓ Monitoring ${client.guilds.cache.size} guild(s)`);
    console.log(`✓ Dashboard running on http://localhost:${require('../../config').DASHBOARD_PORT}`);
  }
};

/*
: ! Aegis !
    + Discord: itsfizys
    + Portfolio: https://itsfiizys.com
    + Community: https://discord.gg/8wfT8SfB5Z  (Kawaii Development )
    + for any queries reach out Community or DM me.
*/
