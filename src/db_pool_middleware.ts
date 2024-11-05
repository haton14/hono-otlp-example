import type { MiddlewareHandler } from "hono";
import type { HonoEnvironment } from "./env";
import { createPool } from "mysql2/promise";

export const dbPoolMiddleware =
	(): MiddlewareHandler<HonoEnvironment> => async (c, next) => {
		const pool = createPool({
			user: "mysql",
			password: "mypass",
			database: "honodb",
			host: "127.0.0.1",
			port: 13306,
			connectionLimit: 10,
		});
		c.set("pool", pool);
		await next();
	};
