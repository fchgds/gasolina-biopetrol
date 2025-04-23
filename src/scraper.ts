import axios from 'axios';
import * as cheerio from 'cheerio';
import { saveResultsToDatabase } from './saveInDatabase';
import { D1Database } from '@cloudflare/workers-types';

const url = 'http://ec2-3-22-240-207.us-east-2.compute.amazonaws.com/guiasaldos/main/donde/134';

export async function scrapeRequest(request: Request,env: { DB: D1Database }): Promise<Response> {
	try {
		const response = await axios.get(url);
		const html = response.data;
		const $ = cheerio.load(html);

		const results: { estacion: string, litros: string, timestamp: string, address: string }[] = [];


		$('.rounded-top').each((index, element) => {
			const estacion = $(element).text().trim();

			// Extract the text content of the next 5 .text-dark divs
			const textDarkDivs = $(element).nextAll('.text-dark').slice(0, 5);
			const litros = textDarkDivs.eq(1).text().trim();
			const timestamp = textDarkDivs.eq(3).text().trim();
			const address = textDarkDivs.eq(4).text().trim();

			results.push({ estacion, litros, timestamp, address });
		});

		await saveResultsToDatabase(results,env);

		return new Response(JSON.stringify(results), { status: 200 });
	} catch (error) {
		console.error('Error fetching the URL:', error);
		return new Response('Error executing scraper', { status: 500 });
	}
}
