import { scrapeRequest } from './scraper';
import { D1Database } from "@cloudflare/workers-types";

export async function tableGenerator(request: Request, env: { DB: D1Database }): Promise<string> {
  try {
    const results: { estacion: string, litros: string, timestamp: string, address: string }[] = 
      await scrapeRequest(request, env).then(res => res.json());

    let table = '<table><tr><th>Estacion</th><th>Litros</th><th>Timestamp</th><th>Address</th></tr>';
    results.forEach(result => {
      table += `<tr><td>${result.estacion}</td><td>${result.litros}</td><td>${result.timestamp}</td><td>${result.address}</td></tr>`;
    });
    table += '</table>';
    
    // Return the HTML string
    return table;
  } catch (error) {
    console.error('Error fetching the URL:', error);
    // Return an error message as an HTML string
    return '<p>Error executing scraper</p>';
  }
}