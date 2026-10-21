import * as cheerio from 'cheerio';
import { D1Database } from '@cloudflare/workers-types';
import { saveResultsToDatabase } from './saveInDatabase';
import { FuelReading } from './types';

const url = 'https://app9.biocloud.info/saldos/main/donde/134';

/** Fetches the upstream source. This is called only by the scheduled job. */
export async function refreshFuelReadings(env: { DB: D1Database }): Promise<number> {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Upstream request failed with ${response.status}`);
	const $ = cheerio.load(await response.text());
	const match = $('h5:contains("Última medición")').text().match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/);
	const timestamp = match ? `${match[1]} ${match[2]}` : '';
	const results: FuelReading[] = [];

	$('.rounded-top').each((_index, element) => {
		const estacion = $(element).text().trim();
		const fields = $(element).nextAll('.text-dark').slice(0, 9);
		if (!estacion || !timestamp) return;
		results.push({ estacion, litros: fields.eq(1).text().trim(), timestamp, address: fields.eq(6).text().trim() });
	});

	await saveResultsToDatabase(results, env);
	return results.length;
}
