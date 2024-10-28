import { Resource } from "@opentelemetry/resources";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const exporter = new OTLPTraceExporter({
	url: "http://tomato.ghost-algieba.ts.net:4318/v1/traces",
});
const processor = new SimpleSpanProcessor(exporter);
const tracerProvider = new NodeTracerProvider({
	resource: new Resource({
		[ATTR_SERVICE_NAME]: "hono-otlp-example",
	}),
});

export const otlpSetup = () => {
	tracerProvider.addSpanProcessor(processor);
	tracerProvider.register();
};
