# Kawaii

## Overview

Kawaii is a comprehensive Discord logging bot that monitors and records all guild activities. It features real-time event tracking for messages, members, roles, channels, invites, voice states, and more. The bot includes a web dashboard for configuration, an economy system with hunting/gambling features, and moderation commands.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Runtime**: Node.js with Discord.js v14 for bot functionality
- **Web Framework**: Express.js for the dashboard API
- **Database**: SQLite via better-sqlite3 for local data storage
- **Entry Point**: `src/index.js` initializes the Discord client and loads event handlers

### Event-Driven Design
- Events are loaded dynamically from `src/events/` directory
- Each event file exports a name, optional `once` flag, and `execute` function
- Supported events include: message CRUD, member join/leave/update, role CRUD, channel CRUD, voice state changes, bans, invites, and user profile updates

### Command System
- Prefix-based commands (default: `l!`) loaded from `src/commands/`
- Three command categories:
  - **Moderator**: ban, kick, timeout, unban, voicemove, voicemute
  - **Utility**: help, ping, setupwelcome
  - **Economy**: cash, coinflip, daily, hunt, profile, send, slots, teamadd, zoo

### Dashboard Architecture
- Express server running on port 5000 (configurable)
- Discord OAuth2 authentication with session management via in-memory Map
- Static files served from `src/dashboard/public/`
- REST API endpoints for guild settings and configuration
- Pages: landing, login, server selection, and settings dashboard

### Database Schema
Located in `src/utils/database.js`, uses SQLite with tables for:
- `guild_settings`: Per-guild logging channel configurations and feature toggles
- `economy_users`: User balances, bank, daily streaks
- `user_zoo`: Collected animals from hunting
- `hunt_teams`: Team member relationships for cooperative hunting

### Discord Components V2
Log messages use Discord's modern component system with:
- `ContainerBuilder` for styled message containers
- `SectionBuilder` with thumbnails for user avatars
- `TextDisplayBuilder` for formatted content
- Custom accent colors per event type

## External Dependencies

### Core Services
- **Discord API**: Bot token, OAuth2 client ID/secret for authentication
- **Discord.js v14**: Primary library for Discord interaction

### NPM Packages
- `discord.js`: Discord API wrapper
- `better-sqlite3`: SQLite database driver (native module)
- `express`: Web server framework
- `cors`: Cross-origin resource sharing middleware
- `axios`: HTTP client for Discord API calls

### Configuration
Environment variables required:
- `DISCORD_TOKEN`: Bot authentication token
- `DISCORD_CLIENT_ID`: OAuth2 application ID
- `DISCORD_CLIENT_SECRET`: OAuth2 secret for dashboard login

Configuration file `config.js` also includes:
- `REDIRECT_URI`: OAuth callback URL for dashboard
- `DASHBOARD_PORT`: Web server port (default 5000)
- `PREFIX`: Command prefix (default `l!`)
- `DATABASE_PATH`: SQLite storage location