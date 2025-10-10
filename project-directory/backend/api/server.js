const fastify = require("fastify")();
const fastifyPostgres = require("@fastify/postgres");
const multipart = require('@fastify/multipart');
const cookiePlugin = require("@fastify/cookie");
const path = require("path");
const fastifyStatic = require("@fastify/static");
const authMiddleware = require("./middleware/auth-middleware.js");
const { router } = require("./routes/routes.js");

require("dotenv").config();

fastify.register(cookiePlugin, {
  secret: process.env.COOKIE_SECRET, // Секретный ключ для подписи cookie
  parseOptions: {}, // Дополнительные параметры для парсинга cookie
});

fastify.register(multipart, {
  // attachFieldsToBody: true,
});

fastify.register(require("@fastify/cors"), {
  // Настройки CORS
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["content-type", "Authorization"],
  credentials: true,
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, './uploads'), // Хранилище фото пользователей
  prefix: "/uploads/",
})

const connectServer = async () => {
  try {
    await fastify.register(fastifyPostgres, {
      connectionString: "postgresql://postgres:admin@localhost:5433/postgres",
    });
    console.log("PostgreSQL плагин успешно подключён");
  } catch (error) {
    console.error("Ошибка при подключении PostgreSQL:", error);
    process.exit(1);
  }
};

connectServer();

// Не защищённые маршруты
fastify.register(
  (instance, opts, done) => {
    instance.route(router().registration);
    instance.route(router().authorization);
    instance.route(router().refresh);
    instance.route(router().activate);
    instance.route(router().searchAds);
    instance.route(router().getAd);
    instance.route(router().analyticsRoutes);
    done();
  },
  { prefix: "/" }
);

// Защищённые маршруты
fastify.register(
  (instance, opts, done) => {
    instance.addHook("preHandler", authMiddleware);
    instance.route(router().userLoadAd);
    instance.route(router().logout);
    instance.route(router().userMe);
    instance.route(router().profile);
    instance.route(router().profileEdit);
    instance.route(router().deleteAd);
    instance.route(router().postResponse);
    instance.route(router().listResponses);
    instance.route(router().userResponses);
    instance.route(router().submitRole);
    instance.route(router().listRoles);
    instance.route(router().updateRoles);
    instance.route(router().myResponses);
    instance.route(router().acceptResponse);
    instance.route(router().rejectResponse);
    done();
  },
  { prefix: "/" }
);

fastify.addHook("onRequest", async (req, reply) => {
  try {
    const { method, url, headers } = req.raw;
    if (
      method === "GET" &&
      (url.startsWith("/ads/search") || /^\/ads\/\d+/.test(url))
    ) {
      const token = headers.authorization?.split(" ")[1];
      if (token) {
        const payload = verifyJwt(token);
        if (payload?.id) {
          await Visit.create({ userId: payload.id });
        }
      }
    }
  } catch (err) {
    req.log.warn("Ошибка логирования визита: " + err.message);
  }
});

fastify.listen({ port: 4000, host: "0.0.0.0" }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Сервер начал работу на 4000 порту");
  }
});
