import type { MiddlewareHandler } from "hono";
import { type Span, trace } from "@opentelemetry/api";

export const opentelemetryMiddleware =
	(): MiddlewareHandler => async (c, next) => {
		const tracer = trace.getTracer("hono-handler");
		tracer.startActiveSpan(
			`${c.req.method}:${c.req.path}`,
			async (span: Span) => {
				await next();
				span.end();
			},
		);
	};
