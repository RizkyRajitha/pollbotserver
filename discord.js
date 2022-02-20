const { Client, Intents } = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log("Ready!");

  client.guilds.cache.forEach((guild) => {
    console.log(`${guild.name} | ${guild.id}`);
  });
});

client.on("interactionCreate", async (interaction) => {
  console.log("interactionCreate");

  if (!interaction.isSelectMenu()) return;
  // if (!interaction.isButton() && !interaction.isSelectMenu()) return;
  // if () return;

  interaction.reply({
    content: "You selected " + interaction.values.join(" "),
    ephemeral: true,
  });

  console.log(interaction);
  console.log(interaction.values);
  console.log(interaction.customId);
  console.log(interaction.user.id);
  console.log(interaction.user.username);
});

client.login(process.env.TOKEN);

module.exports = client;
