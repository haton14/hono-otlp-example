import {
	NodeTracerProvider,
	SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { Resource } from "@opentelemetry/resources";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { MySQL2Instrumentation } from "@opentelemetry/instrumentation-mysql2";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

// OpenTelemetryの設定
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

// インストルメンテーションの登録（MySQL2Instrumentationの登録を先に行う）
registerInstrumentations({
	instrumentations: [new MySQL2Instrumentation()],
});

// Tracer Providerの登録
tracerProvider.register();
