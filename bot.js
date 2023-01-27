import 
import dotenv from "dotenv";
dotenv.config();

import Discord, { Collection } from "discord.js";

//const fs = require('fs');
import fs from "fs";
//const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const commandPrefix = process.env.COMMAND_PREFIX;

client.commands = new Collection(); //?
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

//client.on('messageCreate', (msg.startsWith(commandPrefix)) ? commandHandler(msg.replace(/(^commandPrefix)/gi, "")) : null);

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand())
        return;

	const command = client.commands.get(interaction.commandName);

	if (!command)
        return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.BOT_TOKEN);