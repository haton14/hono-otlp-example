import { createPool } from "mysql2/promise";
import type { MiddlewareHandler } from "hono";

const pool = createPool({
	user: "mysql",
	password: "mypass",
	database: "honodb",
	host: "127.0.0.1",
	port: 13306,
	connectionLimit: 10,
});

export const dbPoolMiddleware = (): MiddlewareHandler => async (c, next) => {
	c.set("pool", pool);
	await next();
};
