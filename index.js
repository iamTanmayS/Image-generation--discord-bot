require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const Replicate = require('replicate');

const app = express();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });

// Health check endpoint
app.get('/', (req, res) => res.status(200).send('Bot Online'));
app.listen(3000, () => console.log('Express server running'));

// Discord bot setup
client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));

// Import commands
const generateCommand = require('./commands/generate');
client.commands = new Map();
client.commands.set(generateCommand.data.name, generateCommand);

// Handle interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, replicate);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Error generating image!', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);