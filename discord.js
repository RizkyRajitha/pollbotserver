const { Client, Intents } = require("discord.js");
const supabase = require("./supabase");

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

  // console.log(interaction);
  console.log(interaction.values);
  console.log(interaction.customId);
  console.log(interaction.user.id);
  console.log(interaction.user.username);

  let [pollId, userId] = String(interaction.customId).split("_");

  console.log(userId);
  console.log(pollId);

  let { data: pollData, error: pollerror } = await supabase
    .from("polls")
    .select("active,description")
    .eq("id", pollId)
    .single();

  if (pollerror) {
    console.log(pollerror);
    return;
  }

  console.log(pollData);

  if (!pollData.active) {
    interaction.reply({
      content: "This poll has been ended ",
      ephemeral: true,
    });
    return;
  }

  let { error } = await supabase.from("results").upsert({
    pollId: pollId,
    selections: interaction.values,
    discordUsername: `${interaction.user.username}#${interaction.user.discriminator}`,
    discordUserId: interaction.user.id,
    userId: userId,
  });

  if (error) {
    console.log(error);
    return;
  }

  let selectedval =
    interaction.values.length > 1
      ? interaction.values.map((ele) => ele.split("_").join(","))
      : interaction.values[0].split("_")[0];

  console.log(selectedval);

  interaction.reply({
    content: `You selected value : ${selectedval} for poll : ${pollData.description.substring(
      0,
      20
    )}...`,
    ephemeral: true,
  });
});

client.login(process.env.DISCORD_TOKEN);

module.exports = client;
