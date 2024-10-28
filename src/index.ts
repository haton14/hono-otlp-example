
import { Hono } from "hono";
import { serve } from "@hono/node-server";
// setup
import { otlpSetup } from "./otlp_setup";
// middleware
import { logger } from "hono/logger";
import { opentelemetryMiddleware } from "./otlp_middleware";

const app = new Hono();

// setup
otlpSetup();

// middleware
app.use("*", logger());
app.use("*", opentelemetryMiddleware());

app.get("/hello", (c) => {
	return c.text("Hello Hono!\n");
});

serve({
	fetch: app.fetch,
	port: 3000,
});
