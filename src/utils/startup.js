const colors = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
  UNDERLINE: '\x1b[4m',
  
  BLACK: '\x1b[30m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
  GRAY: '\x1b[90m',
  
  // Kawaii colors
  AEROX_PINK: '\x1b[38;5;219m',
  AEROX_PURPLE: '\x1b[38;5;141m',
  AEROX_BLUE: '\x1b[38;5;111m',
};

function printKawaiiHeader() {
  console.log(`\n${colors.AEROX_PINK}╭─────────────────────────────────────────────────────────────╮${colors.RESET}`);
  console.log(`${colors.AEROX_PINK}│${colors.RESET}                    ${colors.BOLD}${colors.AEROX_PURPLE}✦ AEROX LOGGER ✦${colors.RESET}                 ${colors.AEROX_PINK}│${colors.RESET}`);
  console.log(`${colors.AEROX_PINK}│${colors.RESET}            ${colors.DIM}${colors.WHITE}Multi-Guild • Secure • Powerful${colors.RESET}            ${colors.AEROX_PINK}│${colors.RESET}`);
  console.log(`${colors.AEROX_PINK}╰─────────────────────────────────────────────────────────────╯${colors.RESET}\n`);
}

function printBotReady(botName, guildCount) {
  console.log(`\n${colors.AEROX_BLUE}◆${colors.RESET} ${colors.BOLD}${colors.GREEN}Authentication successful${colors.RESET} ${colors.DIM}→${colors.RESET} ${colors.AEROX_PURPLE}${botName}${colors.RESET}`);
  console.log(`${colors.AEROX_BLUE}◆${colors.RESET} ${colors.BOLD}${colors.GREEN}Monitoring${colors.RESET} ${colors.CYAN}${guildCount}${colors.RESET} guild(s)`);
}

function printLoading(message) {
  console.log(`${colors.AEROX_BLUE}◆${colors.RESET} ${colors.DIM}Loading${colors.RESET} ${colors.WHITE}${message}${colors.RESET}${colors.DIM}...${colors.RESET}`);
}

function printSuccess(message) {
  console.log(`${colors.GREEN}✓${colors.RESET} ${colors.WHITE}${message}${colors.RESET}`);
}

function printError(message) {
  console.log(`${colors.RED}✗${colors.RESET} ${colors.BOLD}Error:${colors.RESET} ${message}`);
}

function printInfo(message) {
  console.log(`${colors.AEROX_PURPLE}ⓘ${colors.RESET} ${colors.WHITE}${message}${colors.RESET}`);
}

function printWarning(message) {
  console.log(`${colors.YELLOW}⚠${colors.RESET} ${colors.WHITE}${message}${colors.RESET}`);
}

function printElegantSeparator() {
  const separator = `${colors.AEROX_PINK}─${colors.AEROX_PURPLE}─${colors.AEROX_BLUE}─${colors.RESET}`;
  console.log(`   ${separator.repeat(20)}`);
}

function printSystemReady() {
  printElegantSeparator();
  console.log(`\n   ${colors.BOLD}${colors.AEROX_PURPLE}✦ System Operational ✦${colors.RESET}`);
  console.log(`   ${colors.DIM}${colors.WHITE}Developed with ${colors.AEROX_PINK}♡${colors.WHITE} by Kawaii Development${colors.RESET}`);
  console.log(`   ${colors.DIM}${colors.GRAY}Ready to serve with elegance and precision${colors.RESET}\n`);
  printElegantSeparator();
  console.log();
}

module.exports = {
  printKawaiiHeader,
  printBotReady,
  printLoading,
  printSuccess,
  printError,
  printInfo,
  printWarning,
  printElegantSeparator,
  printSystemReady,
};
