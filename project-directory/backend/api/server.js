const fastify = require("fastify")();
const fastifyPostgres = require("@fastify/postgres");
const { router } = require("./routes/routes.js");
const cookiePlugin = require("fastify-cookie");
const authMiddleware = require("./middleware/auth-middleware.js");
require("dotenv").config();

fastify.listen({ port: 4000, host: "0.0.0.0" }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Сервер начал работу на 4000 порту");
  }
});
