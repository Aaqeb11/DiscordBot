import { Client, GatewayIntentBits, SlashCommandBuilder } from "discord.js";
import { REST, Routes } from "discord.js";
import fetchInfo from "./fetch.js";
import dotenv from 'dotenv';
dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("stock_price")
    .setDescription("Provides the stock price of the provided stock")
    .addStringOption((option) =>
      option.setName("symbol").setDescription("stock symbol").setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(
  process.env.CLIENT_LOGIN
);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands("1262370473359048776"), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }
  if (message.content.toLowerCase().startsWith("hello")) {
    message.reply("Hi from bot!");
  }
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  if (commandName === "ping") {
    interaction.reply("pong!");
  } else if (commandName === "stock_price") {
    const symbol = interaction.options.getString("symbol").toUpperCase();
    console.log(symbol);
    const stockPrice = await fetchInfo(symbol);
    interaction.reply(stockPrice);
  }
});

client.login(
  process.env.CLIENT_LOGIN
);
