import { D1Database } from '@cloudflare/workers-types';

export async function saveResultsToDatabase(results: { estacion: string, litros: string, timestamp: string, address: string }[], env: { DB: D1Database }) {
	for (const result of results) {
		const lastTimestamp = await env.DB.prepare('SELECT MAX(timestamp) as timestamp FROM biopetrol WHERE estacion LIKE "' + result.estacion + '"').first('timestamp');
		if(lastTimestamp !== result.timestamp){
			await env.DB.prepare(
				`INSERT INTO biopetrol (estacion, litros, timestamp) VALUES (?, ?, ?)`
			).bind(result.estacion, result.litros, result.timestamp).run();
		}
	}
}
