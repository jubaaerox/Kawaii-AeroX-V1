const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

const dbPath = config.DATABASE_PATH;
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

const db = new Database(path.join(dbPath, 'logging.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS economy_users (
    user_id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 0,
    bank INTEGER DEFAULT 0,
    daily_streak INTEGER DEFAULT 0,
    last_daily TEXT,
    last_hunt TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS user_zoo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    animal_name TEXT NOT NULL,
    animal_emoji TEXT NOT NULL,
    rarity TEXT NOT NULL,
    power INTEGER DEFAULT 1,
    caught_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS hunt_teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id TEXT NOT NULL,
    member_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(owner_id, member_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS user_levels (
    user_id TEXT PRIMARY KEY,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    last_msg_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS guild_settings (
    guild_id TEXT PRIMARY KEY,
    ban_channel_id TEXT,
    kick_channel_id TEXT,
    join_channel_id TEXT,
    leave_channel_id TEXT,
    role_update_channel_id TEXT,
    role_create_channel_id TEXT,
    role_delete_channel_id TEXT,
    channel_delete_channel_id TEXT,
    channel_create_channel_id TEXT,
    channel_update_channel_id TEXT,
    perms_update_channel_id TEXT,
    nickname_change_channel_id TEXT,
    voice_change_channel_id TEXT,
    message_delete_channel_id TEXT,
    message_edit_channel_id TEXT,
    member_update_channel_id TEXT,
    server_update_channel_id TEXT,
    invite_create_channel_id TEXT,
    invite_delete_channel_id TEXT,
    user_update_channel_id TEXT,
    welcome_enabled INTEGER DEFAULT 0,
    welcome_channel_id TEXT,
    welcome_image_url TEXT,
    welcome_message TEXT,
    ban_enabled INTEGER DEFAULT 1,
    unban_enabled INTEGER DEFAULT 1,
    kick_enabled INTEGER DEFAULT 1,
    timeout_enabled INTEGER DEFAULT 1,
    voicemute_enabled INTEGER DEFAULT 1,
    voiceunmute_enabled INTEGER DEFAULT 1,
    voicemove_enabled INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const columnsToAdd = [
  { name: 'welcome_enabled', type: 'INTEGER DEFAULT 0' },
  { name: 'welcome_channel_id', type: 'TEXT' },
  { name: 'welcome_image_url', type: 'TEXT' },
  { name: 'welcome_message', type: 'TEXT' },
  { name: 'ban_enabled', type: 'INTEGER DEFAULT 1' },
  { name: 'unban_enabled', type: 'INTEGER DEFAULT 1' },
  { name: 'kick_enabled', type: 'INTEGER DEFAULT 1' },
  { name: 'timeout_enabled', type: 'INTEGER DEFAULT 1' },
  { name: 'voicemute_enabled', type: 'INTEGER DEFAULT 1' },
  { name: 'voiceunmute_enabled', type: 'INTEGER DEFAULT 1' },
  { name: 'voicemove_enabled', type: 'INTEGER DEFAULT 1' },
  { name: 'updated_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
];

const tableInfo = db.prepare("PRAGMA table_info(guild_settings)").all();
const existingColumns = tableInfo.map(col => col.name);

columnsToAdd.forEach(col => {
  if (!existingColumns.includes(col.name)) {
    try {
      db.exec(`ALTER TABLE guild_settings ADD COLUMN ${col.name} ${col.type}`);
      console.log(`[DB] Added missing column: ${col.name}`);
    } catch (err) {
      console.log(`[DB] Column ${col.name} already exists or error: ${err.message}`);
    }
  }
});

const getGuildSettings = (guildId) => {
  const stmt = db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?');
  const result = stmt.get(guildId);
  console.log(`[DB] Query guild ${guildId}:`, result ? 'Found' : 'Not found');
  return result || {};
};

const updateGuildSettings = (guildId, settings) => {
  const columns = Object.keys(settings);
  
  if (columns.length === 0) {
    return;
  }
  
  const existingSettings = getGuildSettings(guildId);
  
  if (Object.keys(existingSettings).length === 0) {
    const placeholders = columns.map(() => '?').join(', ');
    const stmt = db.prepare(`
      INSERT INTO guild_settings (guild_id, ${columns.join(', ')})
      VALUES (?, ${placeholders})
    `);
    return stmt.run(guildId, ...Object.values(settings));
  } else {
    const setClause = columns.map(col => `${col} = ?`).join(', ');
    const stmt = db.prepare(`
      UPDATE guild_settings SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE guild_id = ?
    `);
    return stmt.run(...Object.values(settings), guildId);
  }
};

const getEconomyUser = (userId) => {
  let user = db.prepare('SELECT * FROM economy_users WHERE user_id = ?').get(userId);
  if (!user) {
    db.prepare('INSERT INTO economy_users (user_id, balance) VALUES (?, 0)').run(userId);
    user = { user_id: userId, balance: 0, bank: 0, daily_streak: 0, last_daily: null, last_hunt: null };
  }
  return user;
};

const updateEconomyUser = (userId, data) => {
  const columns = Object.keys(data);
  const setClause = columns.map(col => `${col} = ?`).join(', ');
  db.prepare(`UPDATE economy_users SET ${setClause} WHERE user_id = ?`).run(...Object.values(data), userId);
};

const addToBalance = (userId, amount) => {
  getEconomyUser(userId);
  db.prepare('UPDATE economy_users SET balance = balance + ? WHERE user_id = ?').run(amount, userId);
};

const removeFromBalance = (userId, amount) => {
  db.prepare('UPDATE economy_users SET balance = balance - ? WHERE user_id = ?').run(amount, userId);
};

const addAnimalToZoo = (userId, animal) => {
  db.prepare('INSERT INTO user_zoo (user_id, animal_name, animal_emoji, rarity, power) VALUES (?, ?, ?, ?, ?)').run(userId, animal.name, animal.emoji, animal.rarity, animal.power);
};

const getUserZoo = (userId) => {
  return db.prepare('SELECT * FROM user_zoo WHERE user_id = ? ORDER BY power DESC').all(userId);
};

const getTeamMembers = (ownerId) => {
  return db.prepare('SELECT member_id FROM hunt_teams WHERE owner_id = ?').all(ownerId);
};

const addTeamMember = (ownerId, memberId) => {
  try {
    db.prepare('INSERT INTO hunt_teams (owner_id, member_id) VALUES (?, ?)').run(ownerId, memberId);
    return true;
  } catch (e) {
    return false;
  }
};

const removeTeamMember = (ownerId, memberId) => {
  db.prepare('DELETE FROM hunt_teams WHERE owner_id = ? AND member_id = ?').run(ownerId, memberId);
};

const getLevelUser = (userId) => {
  let user = db.prepare('SELECT * FROM user_levels WHERE user_id = ?').get(userId);
  if (!user) {
    db.prepare('INSERT INTO user_levels (user_id, xp, level) VALUES (?, 0, 1)').run(userId);
    user = { user_id: userId, xp: 0, level: 1, last_msg_at: new Date().toISOString() };
  }
  return user;
};

const updateLevelUser = (userId, data) => {
  const columns = Object.keys(data);
  const setClause = columns.map(col => `${col} = ?`).join(', ');
  db.prepare(`UPDATE user_levels SET ${setClause} WHERE user_id = ?`).run(...Object.values(data), userId);
};

module.exports = {
  db,
  getGuildSettings,
  updateGuildSettings,
  getEconomyUser,
  updateEconomyUser,
  addToBalance,
  removeFromBalance,
  addAnimalToZoo,
  getUserZoo,
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  getLevelUser,
  updateLevelUser
};

/*
: ! Aegis !
    + Discord: itsfizys
    + Portfolio: https://itsfiizys.com
    + Community: https://discord.gg/8wfT8SfB5Z  (Kawaii Development )
    + for any queries reach out Community or DM me.
*/
