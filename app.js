require("dotenv").config();

const fastify = require("fastify")({
  logger: true,
});

const PORT = process.env.PORT || 8000;

fastify.register(require("fastify-cors"), {
  origin: "*",
  methods: ["*"], // put your options here
});

const pollRoutes = require("./routes/poll");

fastify.register(pollRoutes, { prefix: "/v1" });

fastify.get("/", function (request, reply) {
  reply.send({ message: "poll bot" });
});

fastify.listen(PORT, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
