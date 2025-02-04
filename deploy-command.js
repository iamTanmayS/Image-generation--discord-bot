require('dotenv').config();
const { REST, Routes } = require('discord.js');
const generateCommand = require('./commands/generate'); // Fixed import

const commands = [
  generateCommand.data.toJSON() // Now correctly references the command
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Deploying commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Commands deployed!');
  } catch (error) {
    console.error('Deployment failed:', error);
  }
})();