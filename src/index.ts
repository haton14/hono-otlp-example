import { serve } from "@hono/node-server";
import { type Span, trace } from "@opentelemetry/api";
import { Resource } from "@opentelemetry/resources";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import {
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { Hono } from "hono";

const exporter = new OTLPTraceExporter({
	url: "http://tomato.ghost-algieba.ts.net:4318/v1/traces",
})
const processor = new SimpleSpanProcessor(exporter);
const tracerProvider = new NodeTracerProvider({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: "hono-otlp-example",
  }),
});
tracerProvider.addSpanProcessor(processor);

tracerProvider.register();

const tracer = trace.getTracer("hono-handler");

const app = new Hono();

app.get("/hello", (c) => {
  return tracer.startActiveSpan(`${c.req.method}:${c.req.path}`, async (span: Span) => {
    span.end();
    return c.text("Hello Hono!\n");
  });
});

serve({
  fetch: app.fetch,
  port: 3000,
});
