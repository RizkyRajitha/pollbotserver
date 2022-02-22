const supabase = require("../supabase");
const client = require("../discord");
const uuid = require("uuid").v4;
const { MessageSelectMenu, MessageActionRow } = require("discord.js");
const jwtMiddlware = require("../util/jwtmiddleware");

async function routes(fastify, options) {
  fastify.addHook("onRequest", (request, reply, done) => {
    jwtMiddlware(request, reply, done);
  });
  fastify.post("/addguild", async function (request, reply) {
    console.log(request.locals);
    let body = JSON.parse(request.body);
    console.log(body);

    let { data: guildsData, error } = await supabase
      .from("guilds")
      .select("*")
      .eq("userId", request.locals.sub);

    if (guildsData?.length) {
      reply.status(400).send({
        statusCode: 400,
        success: false,
        message: "User already has a guild registered",
      });
    }

    let guilds = client.guilds.cache.map((guild) => {
      console.log(`${guild.name} | ${guild.id}`);
      return guild.id;
    });

    console.log(guilds);

    if (guilds.includes(body.guildid)) {
      let { data, error } = await supabase.from("guilds").insert({
        userId: request.locals.sub,
        guildId: body.guildid,
        channelId: body.channelid,
      });

      console.log(data);

      if (error) {
        console.log(error);
        reply.status(500).send({
          statusCode: 500,
          success: false,
          message: error.message,
        });
      } else {
        reply.send({
          success: true,
        });
      }
    } else {
      reply.status(500).send({
        statusCode: 500,
        success: false,
        message: "bot is not found in server",
      });
    }
  }),
    fastify.post("/createpoll", async function (request, reply) {
      let body = request.body;
      console.log(body);

      let optionlist = [];

      body.option.forEach((element) => {
        optionlist.push({
          label: element.option,
          description: element.optiondescription,
          value: `${String(element.option).replace(" ", "_")}_${Math.floor(
            100000 + Math.random() * 900000
          )}`,
        });
      });

      console.log(optionlist);

      let pollid = uuid();

      let customId = `${pollid}_${request.locals.sub}`;

      let pollmenu = new MessageSelectMenu()
        .setCustomId(customId)
        .setPlaceholder("Nothing selected")
        .addOptions(optionlist);

      if (body.multichoice) {
        pollmenu.setMinValues(1).setMaxValues(optionlist.length);
      }

      const { error } = await supabase.from("polls").insert([
        {
          id: pollid,
          description: body.description,
          multichoice: body.multichoice,
          options: JSON.stringify(optionlist),
          channelId: body.channelId,
          userId: body.userId,
        },
      ]);

      if (error) {
        console.log(error);
        reply.status(500).send({ success: false, message: error.message });
      }

      const row = new MessageActionRow().addComponents(pollmenu);
      let chan = client.channels.cache.get(body.channelId);

      try {
        await chan.send({
          content: body.description,
          components: [row],
        });
      } catch (error) {
        console.log(error);
        reply.status(500).send({ success: false, message: error.message });
      }

      reply.send({ success: true });
    });
}

module.exports = routes;
