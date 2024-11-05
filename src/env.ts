import type { Env } from "hono";
import type { Pool } from "mysql2/promise";

export interface HonoEnvironment extends Env {
	Variables: {
		pool: Pool;
	};
}
