require("dotenv").config();

const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("fastify-cors"), {
  origin: "*",
  methods: ["*"], // put your options here
});

// import { createClient } from "@supabase/supabase-js";
const supa = require("@supabase/supabase-js");

const supabaseUrl = "https://tzrerendzrvbitzauvra.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supa.createClient(supabaseUrl, supabaseKey);

// const {
//   Client,
//   Intents,
//   MessageSelectMenu,
//   MessageEmbed,
// } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const uuid = require("uuid").v4;

const pollRoutes = require("./routes/poll");

// const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// console.log(process.env.TOKEN)



fastify.register(pollRoutes, { prefix: "/v1" });

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

fastify.post("/adduser", async function (request, reply) {
  const { data, error } = await supabase
    .from("Guilds")
    .insert([{ userId: "someVasdasdalue", guildId: "otherValue" }]);
  if (error) {
    console.log(error);
  }
  console.log(data);
  reply.send({ success: true });
});

fastify.post("/addpoll", async function (request, reply) {
  let body = JSON.parse(request.body);
  console.log(body);
  console.log(body.option);

  let optionlist = [];

  body.option.forEach((element) => {
    optionlist.push({
      label: element.option,
      description: element.optiondescription,
      value: `${String(element.option)
        .replace(" ", "_")
        .toLowerCase()}_${Math.floor(100000 + Math.random() * 900000)}`,
    });
  });

  console.log(optionlist);

  let pollid = uuid();

  let pollmenu = new MessageSelectMenu()
    .setCustomId(pollid)
    .setPlaceholder("Nothing selected")
    .addOptions(optionlist);

  if (body.multichoice) {
    pollmenu.setMinValues(1).setMaxValues(optionlist.length);
  }

  try {
    const { data, error } = await supabase.from("polls").insert([
      {
        id: pollid,
        description: body.description,
        multichoice: body.multichoice,
        options: JSON.stringify(optionlist),
        channelId: "944543166965624877",
        userId: "text",
      },
    ]);

    if (error) {
      console.log(error);
      reply.send({ hello: "world", error: error });
    }
  } catch (error) {
    console.log(error);
  }

  const row = new MessageActionRow().addComponents(pollmenu);
  let chan = client.channels.cache.get("944543166965624877");

  try {
    await chan.send({
      content: body.description,
      components: [row],
      // embeds: [embed],
    });
  } catch (error) {
    console.log(error);
  }

  reply.send({ hello: "world" });

  return;

  //   let { data: Guilds, error } = await supabase.from("Guilds").select("*");
  //   if (error) {
  //     console.log(error)
  //   }
  //   console.log(Guilds);

  // let chan = client.channels.cache.get("944543166965624877");
  // console.log(chan);
  // console.log(request.body);

  // const row = new MessageActionRow().addComponents(
  //   new MessageSelectMenu()
  //     .setCustomId("select")
  //     .setPlaceholder("Nothing selected")
  //     .addOptions([
  //       {
  //         label: "Caladan",
  //         description: "Caladan",
  //         value: "first_option",
  //       },
  //       {
  //         label: "Arakis",
  //         description: "Arakis",
  //         value: "second_option",
  //       },
  //       {
  //         label: "Geidei Prime",
  //         description: "Geidei Prime",
  //         value: "third_option",
  //       },
  //     ])
  // );

  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Poll")
    .setDescription("What is the best planet");
  // await interaction.reply({ content: "Pong!", components: [row] });

  await chan.send({
    content: "What is the best planet",
    components: [row],
    // embeds: [embed],
  });

  // reply.send({ hello: "world" });
});

// client.login(process.env.TOKEN);

fastify.listen(8000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
