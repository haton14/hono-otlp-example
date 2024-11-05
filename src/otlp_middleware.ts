import type { MiddlewareHandler } from "hono";
import { type Span, trace } from "@opentelemetry/api";
import type { HonoEnvironment } from "./env";

export const opentelemetryMiddleware =
	(): MiddlewareHandler<HonoEnvironment> => async (c, next) => {
		const tracer = trace.getTracer("hono-handler");
		await tracer.startActiveSpan(
			`${c.req.method}:${c.req.path}`,
			async (span: Span) => {
				await next();
				span.end();
			},
		);
	};
