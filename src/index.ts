import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { todo } from "@/services";

const app = new Hono();

app.use(logger());
app.use("/api/*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/v1/todos", todo);

app.use;

app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404);
});

app.onError((err, c) => {
  return c.json({ message: err.message }, 500);
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
