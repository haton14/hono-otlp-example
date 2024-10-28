import { Hono } from "hono";
import { serve } from "@hono/node-server";
// setup
import { otlpSetup } from "./otlp_setup";
import { dbPoolMiddleware } from "./db_pool_middleware";
// middleware
import { logger } from "hono/logger";
import { opentelemetryMiddleware } from "./otlp_middleware";

type Env = {};
const app = new Hono<Env>();

// setup
otlpSetup();

// middleware
app.use("*", logger());
app.use("*", opentelemetryMiddleware());
app.use("*", dbPoolMiddleware());

app.get("/hello", (c) => {
	return c.text("Hello Hono!\n");
});

serve({
	fetch: app.fetch,
	port: 3000,
});
