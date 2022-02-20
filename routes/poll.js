const supabase = require("../supabase");
const client = require("../discord");
const uuid = require("uuid").v4;
const { MessageSelectMenu, MessageActionRow } = require("discord.js");

async function routes(fastify, options) {
  fastify.post("/addguild", async function (request, reply) {
    let body = JSON.parse(request.body);
    console.log(body);

    let guilds = client.guilds.cache.map((guild) => {
      console.log(`${guild.name} | ${guild.id}`);
      return guild.id;
    });
    console.log(guilds);
    if (guilds.includes(body.guildid)) {
      let { data, error } = await supabase.from("guilds").insert({
        userId: "aaa",
        guildId: body.guildid,
        channelId: body.channelid,
      });
      console.log(data);
      if (error) {
        console.log(error);
        reply.status(500).send({
          statusCode: 500,
          success: false,
          message: "bot is not found in server",
        });
      }
      reply.send({
        success: true,
      });
    } else {
      reply.status(500).send({
        statusCode: 500,
        success: false,
        message: "bot is not found in server",
      });
    }
  }),
    fastify.post("/createpoll", async function (request, reply) {
      let body = JSON.parse(request.body);
      //   console.log(body);
      //   console.log(body.option);

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
        reply.status(500).send({ error: error });
      }

      const row = new MessageActionRow().addComponents(pollmenu);
      let chan = client.channels.cache.get("944543166965624877");

      try {
        await chan.send({
          content: body.description,
          components: [row],
        });
      } catch (error) {
        console.log(error);
      }

      reply.send({ success: true });
    });
}

module.exports = routes;
