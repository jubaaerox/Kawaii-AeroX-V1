!["Main Image"](https://github.com/jubaaerox/Kawaii-AeroX-V1/blob/e06adb4ae5a365a247907f047240dff42e83f200/Img/mainimg.webp "AdminLTE Presentation")


# Kawaii

A comprehensive Discord logging bot that monitors and records all guild activities with a beautiful dashboard interface.

## Features

- **Real-time Logging**: Tracks all Discord server events
- **Event Monitoring**: Monitors messages, members, roles, channels, invites, and more
- **Web Dashboard**: Beautiful interface to view and manage logs
- **Guild-Specific**: Per-guild configuration and logging
- **SQLite Database**: Reliable local data storage
- **Component V2**: Modern Discord.js components

## Supported Events

- Message Create/Update/Delete
- Member Join/Remove/Update
- Role Create/Update/Delete
- Channel Create/Update/Delete
- Guild Updates
- Ban Add/Remove
- Invite Create/Delete
- Voice State Updates
- User Updates

### dashboard preview 
!["Main Image"](https://github.com/jubaaerox/Kawaii-AeroX-V1/blob/e06adb4ae5a365a247907f047240dff42e83f200/Img/dashboardmain.jpg "AdminLTE Presentation")
!["Main Image"](https://github.com/jubaaerox/Kawaii-AeroX-V1/blob/e06adb4ae5a365a247907f047240dff42e83f200/Img/dashboardlogin.jpg "AdminLTE Presentation")
!["Main Image"](https://github.com/jubaaerox/Kawaii-AeroX-V1/blob/e06adb4ae5a365a247907f047240dff42e83f200/Img/dashboardserver.jpg "AdminLTE Presentation")
!["Main Image"](https://github.com/jubaaerox/Kawaii-AeroX-V1/blob/e06adb4ae5a365a247907f047240dff42e83f200/Img/dashboardcustome.jpg "AdminLTE Presentation")
## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Discord Bot Token from [Discord Developer Portal](https://discord.com/developers/applications)
- Basic understanding of Discord OAuth2

### Installation

1. **Clone or Extract the Project**
   ```bash
   cd Kawaii-Logger
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure the Bot**
   - Open `config.js`
   - Add your Discord Bot Token:
     ```javascript
     REDIRECT_URI: "http://your_domain:port/auth/callback",
     TOKEN: "bottoken",
     CLIENT_ID: "botid",
     CLIENT_SECRET: "botsecret",
     DASHBOARD_PORT: "localhost:port"
     PREFIX: "bot prefix"
     
     ```

4. **Start the Bot**
   ```bash
   npm start
   ```

5. **Access the Dashboard**
   - Open `http://localhost:3000` in your browser
   - The dashboard will display all server logs and statistics

### Configuration Details

**Discord Developer Portal Setup:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select existing one
3. Go to Bot section and copy your Token
4. Go to OAuth2 section and copy Client ID and Secret
5. Add your redirect URI in OAuth2 Redirect URLs (e.g., `http://your_domain:3000/auth/callback`)

**Required Permissions:**
- View Channels
- Read Message History
- View Audit Log
- Manage Roles
- Manage Channels
- Manage Guild
- Ban Members
- Kick Members

## Project Structure

```
Kawaii-Logger/
├── src/
│   ├── index.js           # Main bot entry point
│   ├── dashboard/         # Web dashboard
│   │   ├── index.js       # Express server
│   │   └── public/        # Frontend files
│   ├── events/            # Discord event handlers
│   └── utils/             # Utility functions
├── database/              # SQLite database
├── config.js              # Configuration file
└── package.json           # Dependencies
```

## API Endpoints

The dashboard provides RESTful API endpoints for accessing logs:

- `GET /auth/callback` - OAuth callback

## Troubleshooting

**Bot not connecting?**
- Verify your TOKEN in `.env`
- Ensure the bot has proper permissions
- Check that your token is valid

**Dashboard not loading?**
- Verify DASHBOARD_PORT is not in use
- Check REDIRECT_URI matches your setup
- Ensure NODE_ENV is set properly

**Database errors?**
- Delete `database/logging.db` and restart the bot
- Ensure the `database/` folder exists and is writable

## Support

Join our community Discord server for support and updates:
- **Support Server**: [discord.gg/aerox](https://discord.gg/aerox)

## Credits

**Developer**: x.jubax
- Discord: x.jubax

## License

This project is licensed under the **MIT License** - see below for details:

```
MIT License

Copyright (c) 2025 x.jubax

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

---

**Made with ❤️ by x.juba**
