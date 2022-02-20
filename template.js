var express = require("express");
var logger = require("morgan");

// Require the necessary discord.js classes
const {
  Client,
  Intents,
  MessageSelectMenu,
  MessageEmbed
} = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");

  client.guilds.cache.forEach((guild) => {
    console.log(`${guild.name} | ${guild.id}`);
  });
});

client.on("interactionCreate", async (interaction) => {
  console.log("cc");

  if (!interaction.isSelectMenu()) return;
  // if (!interaction.isButton() && !interaction.isSelectMenu()) return;
  // if () return;

  interaction.reply({
    content: "You selected " + interaction.values.join(" "),
    ephemeral: true
  });

  console.log(interaction);
  console.log(interaction.customId);
  console.log(interaction.user.id);
  console.log(interaction.user.username);
  // console.log(interaction.message.components[0].components);
  // await interaction.update({
  //   components: [
  //     new MessageActionRow().addComponents(
  //       new MessageButton()
  //         .setCustomId("primary")
  //         .setLabel("ebuwa")
  //         .setStyle("SUCCESS")
  //         .setDisabled(true)
  //     )
  //   ]
  // });

  // if (!interaction.isCommand()) return;

  // if (interaction.commandName === "ping") {
  //   const row = new MessageActionRow().addComponents(
  //     new MessageButton()
  //       .setCustomId("primary")
  //       .setLabel("Primary")
  //       .setStyle("PRIMARY")
  //   );

  //   await interaction.reply({ content: "Pong!", components: [row] });
  // }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);

// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json("wo");
});

app.get("/addsingle", async (req, res) => {
  let chan = client.channels.cache.get("942050910710923267");
  console.log(chan);

  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("select")
      .setPlaceholder("Nothing selected")
      .addOptions([
        {
          label: "yes",
          description: "yes",
          value: "first_option"
        },
        {
          label: "yes",
          description: "no",
          value: "second_option"
        }
      ])
  );

  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Amo amo very formal poll")
    .setURL("https://heshds.me/")
    .setDescription("very popesinal Description");

  // await interaction.reply({ content: "Pong!", components: [row] });

  await chan.send({
    content: "who is the pro",
    components: [row],
    embeds: [embed]
  });

  res.json("wo");
});

app.get("/addmulti", async (req, res) => {
  let chan = client.channels.cache.get("942050910710923267");
  console.log(chan);

  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("select")
      .setPlaceholder("Nothing selected")
      .setMinValues(1)
      .setMaxValues(2)
      .addOptions([
        {
          label: "Select me",
          description: "This is a description",
          value: "first_option"
        },
        {
          label: "You can select me too",
          description: "This is also a description",
          value: "second_option"
        },
        {
          label: "I am also an option",
          description: "This is a description as well",
          value: "third_option"
        }
      ])
  );

  // await interaction.reply({ content: "Pong!", components: [row] });

  await chan.send({
    content: "multi select from bellow max 2",
    components: [row]
  });

  res.json("wo");
});

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
