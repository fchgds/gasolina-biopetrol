import { scrapeRequest } from './scraper';
import {D1Database} from "@cloudflare/workers-types";

export async function tableGenerator(request: Request,env:{ DB: D1Database }): Promise<Response> {
// Generate HTML table
	try {
		const results:{ estacion: string, litros: string, timestamp: string, address: string }[] = await scrapeRequest(request,env).then(res => res.json());

		let table = '<table><tr><th>Estacion</th><th>Litros</th><th>Timestamp</th><th>Address</th></tr>';
		results.forEach(result => {
			table += `<tr><td>${result.estacion}</td><td>${result.litros}</td><td>${result.timestamp}</td><td>${result.address}</td></tr>`;
		});
		table += '</table>';
		return new Response(table, { status: 200, headers: { 'Content-Type': 'text/html' } });
	} catch (error) {
		console.error('Error fetching the URL:', error);
		return new Response('Error executing scraper', { status: 500 });
	}
}
