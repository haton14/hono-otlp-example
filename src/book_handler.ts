import type { Context } from "hono";
import type { HonoEnvironment } from "./env";

export const getBookHandler = [
	async (c: Context<HonoEnvironment, "/api/book/:id">) => {
		const book_id = c.req.param("id");
		const pool = c.get("pool");
		const conn = await pool.getConnection();
		console.log(`book_id: ${book_id}`);
		try {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const [rows]: [any[], any] = await conn.execute(
				"SELECT * FROM book WHERE id = ?",
				[book_id],
			);
			return c.json(rows);
		} catch (error) {
			return c.text(`Internal Server Error\n${error}`, 500);
		} finally {
			conn.release();
		}
	},
];
