let selectedGuildId = null;
let channelCount = 0;

function getAuthToken() {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth') return value;
  }
  return null;
}

const authToken = getAuthToken();

const form = document.getElementById('settingsForm');
const statusDiv = document.getElementById('status');
const guildSelector = document.getElementById('guildSelector');
const enabledEventsSpan = document.getElementById('enabledEvents');
const channelCountSpan = document.getElementById('channelCount');
const serverIconEl = document.getElementById('serverIcon');
const serverNameEl = document.getElementById('serverName');

const checkIcon = '<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
const errorIcon = '<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

document.addEventListener('DOMContentLoaded', init);
form.addEventListener('submit', saveSettings);
form.addEventListener('change', updateStats);

async function init() {
  if (!authToken) {
    window.location.href = '/login';
    return;
  }
  
  showStatus('loading', 'Loading...');
  
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const guildIdFromUrl = urlParams.get('guildId');
    
    if (!guildIdFromUrl) {
      window.location.href = '/servers';
      return;
    }
    
    selectedGuildId = guildIdFromUrl;
    
    const guildInfoResponse = await fetch(`/api/guild/${selectedGuildId}/info`, { credentials: 'include' });
    
    if (guildInfoResponse.status === 401) {
      window.location.href = '/login';
      return;
    }
    
    if (guildInfoResponse.status === 403) {
      showStatus('error', 'You do not have permission to configure this server');
      setTimeout(() => window.location.href = '/servers', 2000);
      return;
    }
    
    if (guildInfoResponse.status === 404) {
      showStatus('error', 'Bot is not in this server');
      setTimeout(() => window.location.href = '/servers', 2000);
      return;
    }
    
    const guildInfo = await guildInfoResponse.json();
    
    if (guildInfo.iconUrl) {
      serverIconEl.innerHTML = `<img src="${guildInfo.iconUrl}" alt="${guildInfo.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">`;
    } else {
      serverIconEl.textContent = guildInfo.name.charAt(0).toUpperCase();
    }
    serverNameEl.textContent = guildInfo.name;
    
    await loadChannelsAndSettings();
    
  } catch (error) {
    console.error('Error initializing:', error);
    showStatus('error', error.message);
  }
}

async function loadChannelsAndSettings() {
  if (!selectedGuildId) return;
  
  showStatus('loading', 'Loading channels...');
  
  try {
    const response = await fetch(`/api/guild/${selectedGuildId}/channels`, { credentials: 'include' });
    
    if (response.status === 401) {
      window.location.href = '/login';
      return;
    }
    
    if (response.status === 403) {
      const data = await response.json();
      showStatus('error', data.error || 'You do not have permission to configure this server');
      return;
    }
    
    const channels = await response.json();
    
    if (!response.ok) {
      throw new Error(channels.error || 'Failed to load channels');
    }
    
    channelCount = channels.length;
    channelCountSpan.textContent = channelCount;
    
    const selectElements = document.querySelectorAll('.channel-select');
    selectElements.forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '<option value="">Disabled</option>';
      channels.forEach(ch => {
        const option = document.createElement('option');
        option.value = ch.id;
        option.textContent = '# ' + ch.name;
        select.appendChild(option);
      });
      select.value = currentValue;
    });
    
    await loadSettings();
    hideStatus();
    
  } catch (error) {
    console.error('Error loading channels:', error);
    showStatus('error', error.message);
  }
}

async function loadSettings() {
  try {
    const response = await fetch(`/api/guild/${selectedGuildId}/settings`, { credentials: 'include' });
    
    if (response.status === 401) {
      window.location.href = '/login';
      return;
    }
    
    if (response.status === 403) {
      return;
    }
    
    const settings = await response.json();
    
    Object.keys(settings).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (element.tagName === 'INPUT') {
          element.value = settings[key] || '';
        } else if (element.tagName === 'SELECT') {
          element.value = settings[key] !== null ? settings[key] : (element.id === 'welcome_enabled' ? '0' : '');
        }
      }
    });
    
    updateStats();
    
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

async function saveSettings(e) {
  e.preventDefault();
  
  if (!selectedGuildId) {
    showStatus('error', 'No server selected');
    return;
  }
  
  const settings = {};
  
  // Get all select elements
  document.querySelectorAll('select.channel-select, select.moderation-toggle').forEach(select => {
    settings[select.id] = select.value || (select.classList.contains('moderation-toggle') ? '0' : null);
  });

  // Get all text inputs (like image URL)
  document.querySelectorAll('input.channel-select, textarea.channel-select').forEach(input => {
    settings[input.id] = input.value || null;
  });
  
  showStatus('loading', 'Saving...');
  
  try {
    const response = await fetch(`/api/guild/${selectedGuildId}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
      credentials: 'include'
    });
    
    if (response.status === 401) {
      window.location.href = '/login';
      return;
    }
    
    if (response.status === 403) {
      const data = await response.json();
      showStatus('error', data.error || 'You do not have permission to configure this server');
      return;
    }
    
    if (!response.ok) {
      throw new Error('Failed to save settings');
    }
    
    showStatus('success', 'Settings saved successfully!');
    setTimeout(hideStatus, 3000);
    
  } catch (error) {
    console.error('Error saving:', error);
    showStatus('error', error.message);
  }
}

function updateStats() {
  const selectElements = document.querySelectorAll('.channel-select');
  let enabled = 0;
  
  selectElements.forEach(select => {
    if (select.value) {
      enabled++;
    }
  });
  
  enabledEventsSpan.textContent = enabled;
}

function showStatus(type, message) {
  statusDiv.className = 'status-bar show ' + type;
  
  if (type === 'loading') {
    statusDiv.innerHTML = '<span class="loader"></span> ' + message;
  } else if (type === 'success') {
    statusDiv.innerHTML = checkIcon + ' ' + message;
  } else {
    statusDiv.innerHTML = errorIcon + ' ' + message;
  }
}

function hideStatus() {
  statusDiv.className = 'status-bar';
}

document.querySelectorAll('.nav-item[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

async function handleLogout() {
  await fetch('/api/logout', { credentials: 'include' });
  document.cookie = 'auth=; path=/; max-age=0';
  window.location.href = '/login';
}

/*
: ! Aegis !
    + Discord: itsfizys
    + Portfolio: https://itsfiizys.com
    + Community: https://discord.gg/8wfT8SfB5Z  (Kawaii Development )
    + for any queries reach out Community or DM me.
*/
