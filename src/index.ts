import { serve } from "@hono/node-server";
import { Resource } from "@opentelemetry/resources";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { opentelemetryMiddleware } from "./otlp_middleware";

const exporter = new OTLPTraceExporter({
	url: "http://tomato.ghost-algieba.ts.net:4318/v1/traces",
});
const processor = new SimpleSpanProcessor(exporter);
const tracerProvider = new NodeTracerProvider({
	resource: new Resource({
		[ATTR_SERVICE_NAME]: "hono-otlp-example",
	}),
});
tracerProvider.addSpanProcessor(processor);

tracerProvider.register();

const app = new Hono();

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
