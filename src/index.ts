import { Hono } from "hono";
import { serve } from "@hono/node-server";
// middleware
import { logger } from "hono/logger";
import { dbPoolMiddleware } from "./db_pool_middleware";
import { opentelemetryMiddleware } from "./otlp_middleware";
// env
import type { HonoEnvironment } from "./env";
// handlers
import { getBookHandler } from "./book_handler";

const app = new Hono<HonoEnvironment>();

// middleware
app.use("*", logger());
app.use("*", opentelemetryMiddleware());
app.use("*", dbPoolMiddleware());

app.get("/hello", (c) => {
	return c.text("Hello Hono!\n");
});
app.get("/api/book/:id", ...getBookHandler);

serve({
	fetch: app.fetch,
	port: 3000,
});
